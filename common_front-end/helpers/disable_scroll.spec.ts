import { ref } from "vue"
import disableScroll from "./disable_scroll"

describe("Helper: Disable Scroll", () => {
	it("Should add class", () => {
		const classes = ref([])

		const classesToAdd = [ "unscrollable", "abc", "def", "fgh" ]
		disableScroll(classes, classesToAdd)

		expect(classes.value).toContain(classesToAdd[0])
		expect(classes.value).toContain(classesToAdd[1])
		expect(classes.value).toContain(classesToAdd[2])
		expect(classes.value).toContain(classesToAdd[3])
	})
})
