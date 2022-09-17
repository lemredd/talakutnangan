import { Op, Sequelize } from "sequelize"
import { DayValues } from "$/types/database"

import cleanQuery from "%/helpers/clean_query"
import Condition from "./condition"

describe("Database: Condition builder", () => {
	it("can retain built condition", () => {
		const builtCondition = { "sample": { [Op.eq]: 3 } }

		const condition = new Condition(builtCondition)

		expect(condition.build()).toStrictEqual(builtCondition)
	})

	it("can make 'not' operation", () => {
		const condition = new Condition()

		const builtCondition = condition.not("sample", null).build()

		expect(builtCondition).toStrictEqual({
			"sample": { [Op.not]: null }
		})
	})

	it("can make 'is' operation", () => {
		const condition = new Condition()

		const builtCondition = condition.is("sample", null).build()

		expect(builtCondition).toStrictEqual({
			"sample": { [Op.is]: null }
		})
	})

	it("can make 'equal' operation", () => {
		const condition = new Condition()

		const builtCondition = condition.equal("sample", 1).build()

		expect(builtCondition).toStrictEqual({
			"sample": { [Op.eq]: 1 }
		})
	})

	it("can make 'greater than or equal' operation", () => {
		const condition = new Condition()

		const builtCondition = condition.greaterThanOrEqual("sample", 1).build()

		expect(builtCondition).toStrictEqual({
			"sample": { [Op.gte]: 1 }
		})
	})

	it("can make 'less than or equal' operation", () => {
		const condition = new Condition()

		const builtCondition = condition.lessThanOrEqual("sample", 1).build()

		expect(builtCondition).toStrictEqual({
			"sample": { [Op.lte]: 1 }
		})
	})

	it("can make 'search' operation", () => {
		const condition = new Condition()

		const builtCondition = condition.search("name", "abcd").build()

		expect(builtCondition).toStrictEqual({
			"name": { [Op.like]: "%abcd%" }
		})
	})

	it("can make 'is included in' operation", () => {
		const condition = new Condition()
		const set = [ 0, 1, 2, 3, 4 ]

		const builtCondition = condition.isIncludedIn("name", set).build()

		expect(builtCondition).toStrictEqual({
			"name": { [Op.in]: set }
		})
	})

	it.skip("can make 'is on day' operation", () => {
		const condition = new Condition()
		const targetDay = "monday"

		const builtCondition = condition.isOnDay("startAt", targetDay).build()

		expect(builtCondition).toStrictEqual({
			[
				Sequelize.literal(cleanQuery(`
					CAST(STRFTIME('%w', ${Sequelize.col("startAt").col}) AS INTEGER)
				`)).val as string
			]: { [Op.eq]: DayValues.indexOf(targetDay) }
		})
	})

	it.skip("can make 'on or after time' operation", () => {
		const condition = new Condition()
		const TIME = {
			"hours": 6,
			"minutes": 0
		}

		const builtCondition = condition.onOrAfterTime("startAt", TIME).build()

		expect(builtCondition).toStrictEqual({
			[Op.and]: [
				{
					[
						Sequelize.literal(cleanQuery(`
							CAST(STRFTIME('%H', ${Sequelize.col("startAt").col}) AS INTEGER)
						`)).val as string
					]: { [Op.gte]: TIME.hours }
				},
				{
					[
						Sequelize.literal(cleanQuery(`
							CAST(STRFTIME('%M', ${Sequelize.col("startAt").col}) AS INTEGER)
						`)).val as string
					]: { [Op.gte]: TIME.minutes }
				}
			]
		})
	})

	it.skip("can make 'on or before time' operation", () => {
		const condition = new Condition()
		const TIME = {
			"hours": 6,
			"minutes": 0
		}

		const builtCondition = condition.onOrBeforeTime("startAt", TIME).build()

		expect(builtCondition).toStrictEqual({
			[Op.and]: [
				{
					[
						Sequelize.literal(cleanQuery(`
							CAST(STRFTIME('%H', ${Sequelize.col("startAt").col}) AS INTEGER)
						`)).val as string
					]: { [Op.lte]: TIME.hours }
				},
				{
					[
						Sequelize.literal(cleanQuery(`
							CAST(STRFTIME('%M', ${Sequelize.col("startAt").col}) AS INTEGER)
						`)).val as string
					]: { [Op.lte]: TIME.minutes }
				}
			]
		})
	})

	it("can make 'or' operation", () => {
		const condition = new Condition()
		const subconditionA = new Condition().is("columnA", null)
		const subconditionB = new Condition().not("columnB", null)

		const builtCondition = condition.or(
			subconditionA,
			subconditionB
		).build()

		expect(builtCondition).toStrictEqual({
			[Op.or]: [
				{ "columnA": { [Op.is]: null } },
				{ "columnB": { [Op.not]: null } }
			]
		})
	})

	it("can make simplified 'or' operation", () => {
		const condition = new Condition()
		const subconditionA = new Condition().is("columnA", null)
		const subconditionB = new Condition()

		const builtCondition = condition.or(
			subconditionA,
			subconditionB
		).build()

		expect(builtCondition).toStrictEqual({ "columnA": { [Op.is]: null } })
	})

	it("can make 'and' operation", () => {
		const condition = new Condition()
		const subconditionA = new Condition().is("columnA", null)
		const subconditionB = new Condition().equal("columnB", 1)

		const builtCondition = condition.and(
			subconditionA,
			subconditionB
		).build()

		expect(builtCondition).toStrictEqual({
			[Op.and]: [
				{ "columnA": { [Op.is]: null } },
				{ "columnB": { [Op.eq]: 1 } }
			]
		})
	})

	it("can make simplified 'and' operation", () => {
		const condition = new Condition()
		const subconditionA = new Condition().is("columnA", null)
		const subconditionB = new Condition()

		const builtCondition = condition.and(
			subconditionA,
			subconditionB
		).build()

		expect(builtCondition).toStrictEqual({ "columnA": { [Op.is]: null } })
	})

	it("can make simplified nested 'and' operation", () => {
		const condition = new Condition()
		const subconditionA = new Condition().is("columnA", null)
		const subconditionB = new Condition().not("columnB", null)
		const subconditionC = new Condition()

		const builtCondition = condition.and(
			new Condition(new Condition().and(
				subconditionA,
				subconditionB
			).build()),
			subconditionC
		).build()

		expect(builtCondition).toStrictEqual({
			[Op.and]: [
				{ "columnA": { [Op.is]: null } },
				{ "columnB": { [Op.not]: null } }
			]
		})
	})
})
