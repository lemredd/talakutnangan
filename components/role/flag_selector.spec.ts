import { mount } from "@vue/test-utils"
import FlagSelector from "./flag_selector.vue"

import { post } from "$/permissions/permission_list"

// Developer defined internals
import BasePermissionGroup from "$/permissions/base"
import camelToSentence from "$@/helpers/camel_to_sentence"
import Checkbox from "@/fields/checkbox.vue"

describe("Component: Role/Flag Selector", () => {
	it(("should check flag depependency/ies"), async () => {
		const wrapper = mount(FlagSelector, {

			props: {
				header: "Post",
				basePermissionGroup: post,
				flags: 0
			}
		})

		console.log(wrapper.html())
	})
})
