import runThroughPipeline from "./run_through_pipeline"

describe("Helper: Run through pipeline", () => {
	it("can handle single pipe", () => {
		const mainData = 4
		const baseConstraints = { "pipeA": 3 }
		const pipeA = (
			data: number,
			constraints: typeof baseConstraints
		) => data + constraints.pipeA

		const result = runThroughPipeline(mainData, baseConstraints, [ pipeA ])

		expect(result).toBe(7)
	})

	it("can handle multiple pipes", () => {
		const mainData = 2
		const baseConstraints = {
			"pipeB": 3,
			"pipeC": 2
		}
		const pipeB = (
			data: number,
			constraints: typeof baseConstraints
		) => data ** constraints.pipeB
		const pipeC = (
			data: number,
			constraints: typeof baseConstraints
		) => data * constraints.pipeC

		const result = runThroughPipeline(mainData, baseConstraints, [ pipeB, pipeC ])

		expect(result).toBe(16)
	})
})
