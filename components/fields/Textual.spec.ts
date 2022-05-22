import { mount } from "@vue/test-utils"
import { faker } from "@faker-js/faker"
import TextualField from "@/fields/textual.vue"

describe("Component: fields/Textual", () => {
	it("can update", async () => {
		const wrapper = mount(TextualField, {
			props: {
				label: "E-mail",
				type: "email",
				modelValue: "",
				required: true
			}
		})
		const field = await wrapper.find("input")
		const exampleEmail = faker.internet.exampleEmail()

		await field.setValue(exampleEmail)

		const updates = wrapper.emitted("update:modelValue")
		expect(updates).toHaveLength(1)
		expect(updates[0]).toEqual([ exampleEmail ])
	})
})
