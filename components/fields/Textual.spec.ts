import { mount } from "@vue/test-utils"
import { faker } from "@faker-js/faker"
import TextualField from "@/fields/Textual.vue"

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
		const field = wrapper.find("input")
		const exampleEmail = faker.internet.exampleEmail()

		await field.setValue(exampleEmail)

		const updates = wrapper.emitted("update:modelValue")
		expect(updates).toHaveLength(1)
		expect(updates![0]).toEqual([ exampleEmail ])
	})

	it("should be edit protected", async () => {
		const wrapper = mount(TextualField, {
			props: {
				label: "E-mail",
				type: "email",
				modelValue: "",
				editable: true,
				required: true
			}
		})

		const editButton = wrapper.find("button")
		const field = wrapper.find("input")

		await editButton.trigger("click")

		expect(field.attributes("disabled")).not.toBeTruthy()
	})

	it("should verify user password", async () => {
		const wrapper = mount(TextualField, {
			shallow: true,
			props: {
				label: "E-mail",
				type: "email",
				modelValue: "",
				editable: true,
				verify: true,
				required: true
			}
		})
		const editButton = wrapper.find("button")
		await editButton.trigger("click")
		const overlay = wrapper.find("overlay-stub")
		expect(overlay.html()).toBeTruthy()
	})
})
