/* eslint-disable max-len */
import { Sequelize, Op, literal } from "sequelize"
import { DayValues, Day } from "$/types/database"

import type { Time } from "%/types/independent"
import type { WhereOptions } from "%/types/dependent"

import Database from "%/data_source/database"
import DatabaseError from "$!/errors/database"
import isUndefined from "$/type_guards/is_undefined"
import cleanQuery from "%/managers/helpers/clean_query"

type Literal = ReturnType<typeof literal>
type Where = ReturnType<typeof Sequelize["where"]>

export default class Condition<T = any> {
	private currentCondition: { [key: string|symbol]: any }
	private currentWhereCondition: Where|null
	private currentRawCondition: Literal|null

	constructor(currentCondition: { [key: string|symbol]: any }|Literal|Where = {}) {
		this.currentCondition = {}
		this.currentWhereCondition = null
		this.currentRawCondition = null

		if (this.isLiteral(currentCondition)) {
			this.currentRawCondition = currentCondition
		} else if (this.isWhere(currentCondition)) {
			this.currentWhereCondition = currentCondition
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

	isIncludedIn(column: string, value: any[]|Literal): Condition {
		this.currentCondition[column] = { [Op.in]: value }
		return this
	}

	isOnDay(column: string, value: Day): Condition {
		let query: any = ""
		const escapedColumn = Sequelize.col(column)

		if (Database.isOnSQLite) {
			query = Database.cast(
				Database.fn("STRFTIME", Sequelize.literal("'%w'"), escapedColumn),
				"integer"
			)
		} else if (Database.isOnPostgreSQL) {
			query = Sequelize.literal(cleanQuery(`
				EXTRACT (
					WEEK FROM ${escapedColumn.col}
				)
			`))
		} else {
			throw new DatabaseError("The current database cannot be supported right now.")
		}

		this.currentWhereCondition = Database.where(
			query,
			Op.eq,
			DayValues.indexOf(value)
		)

		return this
	}

	onOrAfterTime(column: string, time: Time): Condition {
		let hourQuery: any = ""
		let minuteQuery: any = ""
		const escapedColumn = Sequelize.col(column)

		if (Database.isOnSQLite) {
			hourQuery = Database.cast(
				Database.fn("STRFTIME", Sequelize.literal("'%H'"), escapedColumn),
				"integer"
			)
			minuteQuery = Database.cast(
				Database.fn("STRFTIME", Sequelize.literal("'%M'"), escapedColumn),
				"integer"
			)
		} else if (Database.isOnPostgreSQL) {
			hourQuery = Sequelize.literal(cleanQuery(`
				EXTRACT (
					HOUR FROM ${escapedColumn.col}
				)
			`))
			minuteQuery = Sequelize.literal(cleanQuery(`
				EXTRACT (
					MINUTE FROM ${escapedColumn.col}
				)
			`))
		} else {
			throw new DatabaseError("The current database cannot be supported right now.")
		}

		return this.and(
			new Condition(Database.where(
				hourQuery,
				Op.gte,
				time.hours
			)),
			new Condition(Database.where(
				minuteQuery,
				Op.gte,
				time.minutes
			))
		)
	}

	onOrBeforeTime(column: string, time: Time): Condition {
		let hourQuery: any = ""
		let minuteQuery: any = ""
		const escapedColumn = Sequelize.col(column)

		if (Database.isOnSQLite) {
			hourQuery = Database.cast(
				Database.fn("STRFTIME", Sequelize.literal("'%H'"), escapedColumn),
				"integer"
			)
			minuteQuery = Database.cast(
				Database.fn("STRFTIME", Sequelize.literal("'%M'"), escapedColumn),
				"integer"
			)
		} else if (Database.isOnPostgreSQL) {
			hourQuery = Sequelize.literal(cleanQuery(`
				EXTRACT (
					HOUR FROM ${escapedColumn.col}
				)
			`))
			minuteQuery = Sequelize.literal(cleanQuery(`
				EXTRACT (
					MINUTE FROM ${escapedColumn.col}
				)
			`))
		} else {
			throw new DatabaseError("The current database cannot be supported right now.")
		}

		return this.and(
			new Condition(Database.where(
				hourQuery,
				Op.lte,
				time.hours
			)),
			new Condition(Database.where(
				minuteQuery,
				Op.lte,
				time.minutes
			))
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
			this.currentCondition[Op.or] = conditions.map(condition => condition.build())
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
			this.currentCondition[Op.and] = conditions.map(condition => condition.build())
		}

		return this
	}

	build(): WhereOptions<T>|Literal|Where {
		if (this.currentRawCondition !== null) {
			return this.currentRawCondition
		}

		if (this.currentWhereCondition !== null) {
			return this.currentWhereCondition
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
			} else if (this.currentRawCondition !== null) {
				hasFoundMatch = true
			} else if (this.currentWhereCondition !== null) {
				hasFoundMatch = true
			}
		}

		if (!hasFoundMatch) {
			return Sequelize.literal("")
		}

		return this.build() as Literal
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

	private isWhere(value: any): value is Where {
		const castValue = value as Where
		return !isUndefined(castValue.attribute)
			&& !isUndefined(castValue.comparator)
			&& !isUndefined(castValue.logic)
	}
}
