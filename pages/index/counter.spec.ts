import { mount } from "@vue/test-utils"
import Counter from "./counter.vue"

describe("Component: Counter", () => {
	it("can increase", async () => {
		const component = mount(Counter, {});
		const button = component.find("[type=button]")

		await button.trigger("click")

		expect(component.html()).toContain("1")
	})
})
