import { Op } from "sequelize"

import Condition from "./condition"

describe("Database: Condition Builder", () => {
	it("can make 'not' operation", () => {
		const condition = new Condition()

		const builtCondition = condition.not("sample", null).build()

		expect(builtCondition).toStrictEqual({
			sample: { [Op.not]: null }
		})
	})

	it("can make 'is' operation", () => {
		const condition = new Condition()

		const builtCondition = condition.is("sample", null).build()

		expect(builtCondition).toStrictEqual({
			sample: { [Op.is]: null }
		})
	})

	it("can make 'equal' operation", () => {
		const condition = new Condition()

		const builtCondition = condition.equal("sample", 1).build()

		expect(builtCondition).toStrictEqual({
			sample: { [Op.eq]: 1 }
		})
	})

	it("can make 'search' operation", () => {
		const condition = new Condition()

		const builtCondition = condition.search("name", "abcd").build()

		expect(builtCondition).toStrictEqual({
			name: { [Op.like]: "%abcd%" }
		})
	})

	it("can make 'or' operation", () => {
		const condition = new Condition()
		const subconditionA = (new Condition()).is("columnA", null)
		const subconditionB = (new Condition()).not("columnB", null)

		const builtCondition = condition.or(
			subconditionA,
			subconditionB
		).build()

		expect(builtCondition).toStrictEqual({
			[Op.or]: {
				columnA: { [Op.is]: null },
				columnB: { [Op.not]: null }
			}
		})
	})
})
