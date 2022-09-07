/* eslint-disable max-len */
import { Sequelize, Op, literal } from "sequelize"
import { DayValues, Day } from "$/types/database"

import type { Time } from "%/types/independent"
import type { WhereOptions } from "%/types/dependent"

import Database from "%/data_source/database"
import DatabaseError from "$!/errors/database"
import isUndefined from "$/helpers/type_guards/is_undefined"
import cleanQuery from "%/managers/helpers/clean_query"

type Literal = ReturnType<typeof literal>

export default class Condition<T = any> {
	private currentCondition: { [key: string|symbol]: any }
	private currentRawCondition: Literal

	constructor(currentCondition: { [key: string|symbol]: any }|Literal = {}) {
		this.currentCondition = {}
		this.currentRawCondition = Sequelize.literal("")

		if (this.isLiteral(currentCondition)) {
			this.currentRawCondition = currentCondition as Literal
		} else {
			this.currentCondition = currentCondition as object
		}
	}

	not(column: string, value: any): Condition {
		this.currentCondition[column] = { [Op.not]: value }
		return this
	}

	is(column: string, value: any): Condition {
		this.currentCondition[column] = { [Op.is]: value }
		return this
	}

	equal(column: string, value: any): Condition {
		this.currentCondition[column] = { [Op.eq]: value }
		return this
	}

	greaterThanOrEqual(column: string, value: any): Condition {
		this.currentCondition[column] = { [Op.gte]: value }
		return this
	}

	lessThanOrEqual(column: string, value: any): Condition {
		this.currentCondition[column] = { [Op.lte]: value }
		return this
	}

	search(column: string, value: string): Condition {
		/*
		 * `findAndCountAll` uses `findAll`. See
		 * https://github.com/sequelize/sequelize/blob/0c5ca3fc398a99eddb412fe3b2aba99f157bf59d/src/model.js#L2070
		 * `findAll` uses `select`. See
		 * https://github.com/sequelize/sequelize/blob/0c5ca3fc398a99eddb412fe3b2aba99f157bf59d/src/model.js#L1713
		 * `select` uses query generator which handles replacements. See
		 * https://github.com/sequelize/sequelize/blob/0c5ca3fc398a99eddb412fe3b2aba99f157bf59d/src/dialects/abstract/query-interface.js#L1062
		 * Replacements are escaped. See
		 * https://sequelize.org/docs/v6/core-concepts/raw-queries/#bind-parameter
		 */
		this.currentCondition[column] = { [Op.like]: `%${value}%` }
		return this
	}

	isIncludedIn(column: string, value: any[]): Condition {
		this.currentCondition[column] = { [Op.in]: value }
		return this
	}

	isOnDay(column: string, value: Day): Condition {
		let query = ""
		const escapedColumn = Sequelize.col(column).col

		if (Database.isOnSQLite) {
			query = `cast(strftime('%w', ${escapedColumn}) as integer)`
		} else if (Database.isOnPostgreSQL) {
			query = `
				EXTRACT (
					WEEK FROM ${escapedColumn}
				)
			`
		} else {
			throw new DatabaseError("The current database cannot be supported right now.")
		}

		this.currentRawCondition = Sequelize.literal(cleanQuery(
			`${query} = ${DayValues.indexOf(value)}`
		))

		return this
	}

	onOrAfterTime(column: string, time: Time): Condition {
		let hourQuery = ""
		let minuteQuery = ""
		const escapedColumn = Sequelize.col(column).col

		if (Database.isOnSQLite) {
			hourQuery = `cast(strftime('%H', ${escapedColumn}) as integer)`
			minuteQuery = `cast(strftime('%M', ${escapedColumn}) as integer)`
		} else if (Database.isOnPostgreSQL) {
			hourQuery = `
				EXTRACT (
					HOUR FROM ${escapedColumn}
				)
			`
			minuteQuery = `
				EXTRACT (
					MINUTE FROM ${escapedColumn}
				)
			`
		} else {
			throw new DatabaseError("The current database cannot be supported right now.")
		}

		return this.and(
			new Condition(Sequelize.literal(cleanQuery(
				`${hourQuery} >= ${time.hours}`
			))),
			new Condition(Sequelize.literal(cleanQuery(
				`${minuteQuery} >= ${time.minutes}`
			)))
		)
	}

	onOrBeforeTime(column: string, time: Time): Condition {
		let hourQuery = ""
		let minuteQuery = ""
		const escapedColumn = Sequelize.col(column).col

		if (Database.isOnSQLite) {
			hourQuery = `cast(strftime('%H', ${escapedColumn}) as integer)`
			minuteQuery = `cast(strftime('%M', ${escapedColumn}) as integer)`
		} else if (Database.isOnPostgreSQL) {
			hourQuery = `
				EXTRACT (
					HOUR FROM ${escapedColumn}
				)
			`
			minuteQuery = `
				EXTRACT (
					MINUTE FROM ${escapedColumn}
				)
			`
		} else {
			throw new DatabaseError("The current database cannot be supported right now.")
		}

		return this.and(
			new Condition(Sequelize.literal(cleanQuery(
				`${hourQuery} <= ${time.hours}`
			))),
			new Condition(Sequelize.literal(cleanQuery(
				`${minuteQuery} <= ${time.minutes}`
			)))
		)
	}

	or(...conditions: Condition[]): Condition {
		const simplifiedConditions = this.simplifyConditions(conditions)

		if (simplifiedConditions.length === 1) {
			const [ condition ] = simplifiedConditions

			if (this.isLiteral(condition)) {
				this.currentRawCondition = condition as Literal
			} else {
				this.currentCondition = condition as object
			}
		} else if (simplifiedConditions.length > 1) {
			this.setLiteralOrObject(
				Op.or,
				"OR",
				conditions.map(condition => condition.build())
			)
		}

		return this
	}

	and(...conditions: Condition[]): Condition {
		const simplifiedConditions = this.simplifyConditions(conditions)

		if (simplifiedConditions.length === 1) {
			const [ condition ] = simplifiedConditions

			if (this.isLiteral(condition)) {
				this.currentRawCondition = condition as Literal
			} else {
				this.currentCondition = condition as object
			}
		} else if (simplifiedConditions.length > 1) {
			this.setLiteralOrObject(
				Op.and,
				"AND",
				conditions.map(condition => condition.build())
			)
		}

		return this
	}

	build(mustReturnRaw = false): WhereOptions<T>|Literal {
		if (mustReturnRaw || this.currentRawCondition.val as string) {
			return this.currentRawCondition
		}

		return { ...this.currentCondition }
	}

	buildAsLiteral(): Literal {
		let hasFoundMatch = false
		if (!isUndefined(this.currentCondition[Op.and])) {
			hasFoundMatch = true
			this.setLiteralOrObject(
				Op.and,
				"AND",
				this.currentCondition[Op.and] as ({ [key: string|symbol]: any }|Literal)[]
			)
		}

		if (!isUndefined(this.currentCondition[Op.or])) {
			hasFoundMatch = true
			this.setLiteralOrObject(
				Op.or,
				"OR",
				this.currentCondition[Op.or] as ({ [key: string|symbol]: any }|Literal)[]
			)
		}

		if (!hasFoundMatch) {
			const propertyNames = Object.getOwnPropertyNames(this.currentCondition)

			if (propertyNames.length === 1) {
				const [ propertyName ] = propertyNames
				const condition = this.currentCondition[propertyName]

				const operations = Object.getOwnPropertySymbols(condition)

				if (operations.length === 1) {
					const [ operation ] = operations
					const value = condition[operation]

					const operator = this.getAppropriateOperator(operation)
					this.currentRawCondition = Sequelize.literal(
						`${propertyName} ${operator} ${value}`
					)
					hasFoundMatch = true
				}
			} else if (this.currentRawCondition.val !== "") {
				hasFoundMatch = true
			}
		}

		if (!hasFoundMatch) {
			return Sequelize.literal("")
		}

		return this.build(true) as Literal
	}

	private getAppropriateOperator(operator: symbol): string {
		switch (operator) {
			case Op.gte: return ">="
			case Op.lte: return "<="
			case Op.eq: return "="
			default:
				throw new DatabaseError("Database operator not supported.")
		}
	}

	private setLiteralOrObject(
		operator: symbol,
		rawOperator: string,
		conditions: ({ [key: string|symbol]: any }|Literal)[]
	) {
		const literalIndex = conditions.findIndex(condition => this.isLiteral(condition))

		// Combine all conditions to literal
		if (literalIndex > -1) {
			this.currentRawCondition = Sequelize.literal(conditions.map(condition => {
				if (this.isLiteral(condition)) {
					return condition
				}

				return new Condition(condition).buildAsLiteral()
			})
			.map(condition => `(${condition.val as string})`)
			.join(` ${rawOperator} `))
		} else {
			this.currentCondition[operator] = conditions
		}
	}

	private simplifyConditions(conditions: Condition[]): ({ [key: string|symbol]: any }|Literal)[] {
		return conditions.map(condition => condition.build()).filter(value => {
			if (this.isLiteral(value)) {
				return value.val as string !== ""
			}

			const object = value as WhereOptions<T>
			const hasProperties = Object.getOwnPropertyNames(object).length > 0
					|| Object.getOwnPropertySymbols(object).length > 0

			return hasProperties
		})
	}

	private isLiteral(value: any): value is Literal {
		const castValue = value as Literal
		return !isUndefined(castValue.val)
	}
}
