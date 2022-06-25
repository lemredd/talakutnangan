import { mount } from "@vue/test-utils"
import Person from "./Person.vue"

describe("Component: Opening/Person", () => {
	it("should have a chat icon", () => {
        const wrapper = mount (Person, {
            props: {
                variant: "talking",
                accessory: "chat"
            }
        })

        const accessory = wrapper.find(".accessory")
        // console.log(c)

        expect(accessory.html()).toContain("chat")
	})
	it("should have a campaign icon", () => {
        const wrapper = mount (Person, {
            props: {
                variant: "announce",
                accessory: "campaign"
            }
        })

        const accessory = wrapper.find(".accessory")
        // console.log(c)

        expect(accessory.html()).toContain("campaign")
	})
})
