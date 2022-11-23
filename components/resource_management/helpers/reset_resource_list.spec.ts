import { Ref, ref } from "vue"
import helper from "./reset_resource_list"

describe("Helper: resource management/resource list resetter", () => {
	it("can clear resource list data and meta count", () => {
		const resourceListData = [ 1, 2, 3 ]
		const sampleResourceList = ref({
			"data": resourceListData,
			"meta": {
				"count": resourceListData.length
			}
		})
		const sampleErrors = ref<string[]>([])
		const sampleIDs = ref<string[]>([])
		// eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
		async function sampleFetchMethod(): Promise<void> {}

		helper(
			sampleResourceList as Ref<any>,
			sampleErrors,
			sampleIDs,
			sampleFetchMethod
		)

		expect(sampleResourceList.value.data).toHaveLength(0)
		expect(sampleResourceList.value.meta).toHaveProperty("count", 0)
	})
})
