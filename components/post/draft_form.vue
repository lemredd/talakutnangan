<template>
	<form @submit.prevent="submitPostDetails">
		<div class="row" v-if="maySelectOtherDepartments">
			<SelectableOptionsField
				v-model="departmentID"
				label="Department to post: "
				placeholder="Choose the department"
				:options="departmentOptions"/>
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
import type { DeserializedPostDocument } from "$/types/documents/post"
import type { DeserializedDepartmentResource } from "$/types/documents/department"

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
const { userProfile } = pageProps

const maySelectOtherDepartments = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
	CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT
])
const departments = ref<DeserializedDepartmentResource[]>([])
const departmentID = ref<string>(userProfile.data.department.data.id)
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
