import { ref } from "vue"
import disableScroll from "./disable_scroll"

describe("Helper: Disable Scroll", () => {
	it("Should add class", () => {
		const classes = ref([])

		const expectedClass = "unscrollable"
		disableScroll(classes)

		expect(classes.value).toContain(expectedClass)
	})
})
