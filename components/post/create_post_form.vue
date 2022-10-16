<template>
	<Overlay :is-shown="isShown" @close="close">
		<template #header>
			<h1>Enter the post details</h1>
		</template>
		<template #default>
			<DraftForm
				:id="CREATE_POST_FORM_ID"
				v-model="content"
				@submit-post="createPost">
				<div v-if="hasMultipleRoles" class="row">
					<SelectableOptionsField
						v-model="roleID"
						label="Post as: "
						placeholder="Choose the role"
						:options="roleNames"/>
				</div>
				<div v-if="maySelectOtherDepartments" class="row">
					<SelectableOptionsField
						v-model="departmentID"
						label="Department to post: "
						placeholder="Choose the department"
						:options="departmentNames"/>
				</div>
			</DraftForm>
			<input type="file" @change="uploadPostAttachment"/>
		</template>
		<template #footer>
			<button
				class="btn btn-back"
				type="button"
				@click="close">
				Back
			</button>
			<button
				class="btn submit-btn btn-primary"
				:form="CREATE_POST_FORM_ID"
				type="button">
				Create post
			</button>
		</template>
	</Overlay>
</template>

<style lang="scss">
@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { ref, computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedRoleResource } from "$/types/documents/role"
import type { DeserializedPostAttachmentResource } from "$/types/documents/post_attachment"

import Fetcher from "$@/fetchers/post"
import PostAttachmentFetcher from "$@/fetchers/post_attachment"
import { post as permissionGroup } from "$/permissions/permission_list"
import { CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT } from "$/permissions/post_combinations"

import Overlay from "@/helpers/overlay.vue"
import DraftForm from "@/post/draft_form.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"

type RequiredExtraProps = "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile, departments } = pageProps

const CREATE_POST_FORM_ID = "create-post"
const fetcher = new Fetcher()
const postAttachmentFetcher = new PostAttachmentFetcher()

const { isShown } = defineProps<{ isShown: boolean }>()

const hasMultipleRoles = userProfile.data.roles.data.length > 1
const roleNames = computed<OptionInfo[]>(() => userProfile.data.roles.data.map(data => ({
	"label": data.name,
	"value": data.id
})))
const roleID = ref<string>(userProfile.data.roles.data[0].id)

const maySelectOtherDepartments = computed(() => {
	const targetRoleID = roleID.value
	const chosenRole = userProfile.data.roles.data.find(
		data => data.id === targetRoleID
	) as DeserializedRoleResource

	return permissionGroup.mayAllow(chosenRole, ...CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT)
})
const departmentNames = computed<OptionInfo[]>(() => {
	const departmentNameOptions = maySelectOtherDepartments.value
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
	return departmentNameOptions
})
const departmentID = ref<string>(userProfile.data.department.data.id)

const content = ref<string>("")
const attachmentResources = ref<DeserializedPostAttachmentResource[]>([])

interface CustomEvents {
	(event: "close"): void
}
const emit = defineEmits<CustomEvents>()

function close() {
	emit("close")
}

function uploadPostAttachment(event: Event): void {
	const target = event.target as HTMLInputElement
	const files = target.files as FileList
	const fileCount = files.length
	const latestSelectedFile = files.item(fileCount - 1) as File
	const formData = new FormData()
	formData.set("data[attributes][fileContent]", latestSelectedFile)
	formData.set("data[attributes][fileType]", latestSelectedFile.type)
	formData.set("data[type]", "post_attachment")

	postAttachmentFetcher.createWithFile(formData).then(({ body }) => {
		const { data } = body
		attachmentResources.value.push(data)
	})
}

function createPost(): void {
	fetcher.create({
		"content": content.value,
		"deletedAt": null
	}, {
		"extraCreateDocumentProps": {
			"relationships": {
				"department": {
					"data": {
						"id": departmentID.value,
						"type": "department"
					}
				},
				"postAttachments": {
					"data": attachmentResources.value.map(resource => ({
						"id": resource.id,
						"type": "post_attachment"
					}))
				},
				"poster": {
					"data": {
						"id": userProfile.data.id,
						"type": "user"
					}
				},
				"posterRole": {
					"data": {
						"id": roleID.value,
						"type": "role"
					}
				}
			}
		}
	}).then(() => {
		close()
	}).catch(console.log)
}
</script>
