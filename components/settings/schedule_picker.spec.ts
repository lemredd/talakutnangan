import { mount } from "@vue/test-utils"
import SchedulePicker from "@/settings/schedule_picker.vue"

describe("Component: Schedule Picker", () => {
	it("should identify 12-hour format value", () => {
		const wrapper = mount(SchedulePicker, {
			"props": {
				"day": "Monday",
				"endTime": "17:00",
				"startTime": "08:00"
			}
		})

		const endTimeSelector = wrapper.find("#end select").getRootNodes()[0] as HTMLSelectElement
		expect(endTimeSelector.value).toBe("05")
	})

	it("should emit 24-hour format value", async() => {
		const wrapper = mount(SchedulePicker, {
			"props": {
				"day": "Monday",
				"endTime": "17:00",
				"startTime": "08:00"
			}
		})
		const endTimeSelector = wrapper.find("#end select")

		await endTimeSelector.setValue("06")

		const passedNewTime = wrapper.emitted("passNewTime") as Array<Array<any>>
		expect(passedNewTime[0]).toEqual([ "18:00" ])
	})
})
