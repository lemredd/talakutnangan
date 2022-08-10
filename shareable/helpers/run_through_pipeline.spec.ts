import runThroughPipeline from "./run_through_pipeline"

describe("Database: Run through pipeline", () => {
	it("can handle single pipe", () => {
		const mainData = 4
		const baseConstraints = { "pipeA": 3 }
		const pipeA = (
			data: typeof mainData,
			constraints: typeof baseConstraints
		) => data + constraints.pipeA

		const result = runThroughPipeline(mainData, baseConstraints, [ pipeA ])

		expect(result).toBe(7)
	})

	it("can handle multiple pipes", () => {
		const mainData = 2
		const baseConstraints = { "pipeB": 3,
			"pipeC": 2 }
		const pipeB = (
			data: typeof mainData,
			constraints: typeof baseConstraints
		) => data ** constraints.pipeB
		const pipeC = (
			data: typeof mainData,
			constraints: typeof baseConstraints
		) => data * constraints.pipeC

		const result = runThroughPipeline(mainData, baseConstraints, [ pipeB, pipeC ])

		expect(result).toBe(16)
	})
})
