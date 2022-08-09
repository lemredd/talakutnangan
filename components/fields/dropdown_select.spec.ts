import { mount } from "@vue/test-utils"
import Select from "@/fields/dropdown_select.vue"

describe("Component/Fields: Select", () => {
	it("should emit custom event", async () => {
		const wrapper = mount(Select, {
			props: {
				label: "Sample Select",
				options: [1,2,3]
			}
		})

		const select = wrapper.find("select")
		await select.setValue(2)

		const updates = wrapper.emitted()
		expect(updates).toHaveProperty("selectedOptionChanged")
	})

	it("Should identify initial value", () => {
		const options = [1,2,3]
		const wrapper = mount(Select, {
			props: {
				label: "Sample Select",
				options,
				initialValue: options[1]
			}
		})

		const select = wrapper.find("select")
		const identifiedInitialValue = (select.getRootNodes()[0] as HTMLSelectElement).value
		const givenInitialValue = wrapper.props().initialValue

		expect(+identifiedInitialValue).toEqual(+givenInitialValue)
	})
})
