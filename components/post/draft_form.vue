<template>
	<form @submit.prevent="submitPostDetails">
		<div v-if="maySelectOtherDepartments" class="row">
			<SelectableOptionsField
				v-model="departmentID"
				label="Department to post: "
				placeholder="Choose the department"
				:options="departmentNames"/>
		</div>
		<div v-if="hasMultipleRoles" class="row">
			<SelectableOptionsField
				v-model="roleID"
				label="Post as: "
				placeholder="Choose the role"
				:options="roleNames"/>
		</div>
		<div class="row">
			<div class="col-25">
				<label for="content">Content</label>
			</div>
			<div class="col-75">
				<textarea
					id="content"
					v-model="content"
					name="data[attributes][content]"
					placeholder="Write something.."
					style="height:200px">
				</textarea>
			</div>
			<input
				type="hidden"
				name="data[type]"
				value="post"/>
			<input
				v-if="modelValue.data.id"
				type="hidden"
				name="data[id]"
				value="modelValue.data.id"/>
		</div>
	</form>
</template>

<style lang="scss">
@import "../index";
</style>

<script setup lang="ts">
import { computed, ref, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedPostDocument } from "$/types/documents/post"

import { post as permissionGroup } from "$/permissions/permission_list"
import { CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT } from "$/permissions/post_combinations"

const props = defineProps<{
	modelValue: DeserializedPostDocument<"create"|"update">
}>()

interface CustomEvents {
	(event: "update:modelValue", data: DeserializedPostDocument<"create"|"update">): void
	(event: "submitPost"): void
}
const emit = defineEmits<CustomEvents>()

type RequiredExtraProps = "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile, departments } = pageProps

const maySelectOtherDepartments = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
	CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT
])
const departmentNames: OptionInfo[] = maySelectOtherDepartments
	? []
	: [
		{
			"label": "All",
			"value": "*"
		},
		...departments.data.map(department => ({
			"label": department.fullName,
			"value": department.id
		}))
	]
const departmentID = ref<string>(userProfile.data.department.data.id)

const hasMultipleRoles = userProfile.data.roles.data.length > 1
const roleNames = computed<OptionInfo[]>(() => userProfile.data.roles.data.map(data => ({
	"label": data.name,
	"value": data.id
})))
const roleID = ref<string>(userProfile.data.roles.data[0].id)
const userID = userProfile.data.id

const content = computed<string>({
	get(): string { return props.modelValue.data.content },
	set(newValue: string): void {
		emit("update:modelValue", {
			...props.modelValue,
			"data": {
				...props.modelValue.data,
				"content": newValue
			}
		})
	}
})

function submitPostDetails() {
	emit("submitPost")
}
</script>
