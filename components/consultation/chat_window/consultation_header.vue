<template>
	<div class="selected-consultation-header">
		<div class="text">
			<div class="selected-consultation-title">
				{{ consultation.reason }}
			</div>
			<div class="selected-consultation-remaining-time">
				Time remaining:
				<span>{{ remainingTime.minutes }}m</span>
				<span v-if="remainingTime.seconds > 0">{{ remainingTime.seconds }}s</span>
			</div>
			<div class="selected-consultation-user-status">
				<!-- TODO(lead): must base on user active status -->
				User is online
			</div>
		</div>
		<div class="controls">
			<!-- TODO(lead/button): Apply functionality -->
			<button class="material-icons">
				video_camera_back
			</button>
			<button class="material-icons toggle-controls-btn" @click="showFileRepoOverlay">
				storage
			</button>

			<FileOverlay
				:general-files="generalFileChatMessages"
				:image-files="imageFileChatMessages"
				:is-file-repo-overlay-shown="isFileRepoOverlayShown"
				:must-show-preview="mustShowPreview"
				@hide-file-repo-overlay="hideFileRepoOverlay"
				@switch-tab="switchTab"/>

			<ExtraControls
				:is-header-control-dropdown-shown="isHeaderControlDropdownShown"
				:is-current-user-consultant="isCurrentUserConsultant"
				@show-action-taken-overlay="showActionTakenOverlay"
				@toggle-header-control-dropdown-shown="toggleHeaderControlDropdownShown"/>

			<Overlay
				:is-shown="isActionTakenOverlayShown && isCurrentUserConsultant"
				class="action-taken"
				@close="hideActionTakenOverlay">
				<template #header>
					Mark this consultation as finished?
				</template>

				<template #default>
					<p>If so, please provide the action taken to solve the consulter/s concern.</p>
					<NonSensitiveTextField
						v-model="actionTaken"
						class="action-taken-field"
						type="text"/>
					<ReceivedErrors
						v-if="receivedErrors.length"
						:received-errors="receivedErrors"/>
				</template>

				<template #footer>
					<button
						class="finish-btn btn btn-primary"
						@click="finishConsultation">
						submit
					</button>
				</template>
			</Overlay>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.selected-consultation-header {
		@apply flex py-4 px-2 dark:bg-true-gray-800;
		.text {
			@apply flex-1;
			.selected-consultation-user-status { @apply row-start-2; }
		}
		.controls { @apply flex items-center; }
	}
</style>

<script setup lang="ts">
import { ref, computed, inject, onMounted } from "vue"

import type { PageContext } from "$/types/renderer"
import type { FullTime } from "$@/types/independent"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	DeserializedChatMessageListDocument,
	DeserializedChatMessageResource
} from "$/types/documents/chat_message"

import makeSwitch from "$@/helpers/make_switch"
import ChatMessageFetcher from "$@/fetchers/chat_message"

import Overlay from "@/helpers/overlay.vue"
import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"
import FileOverlay from "@/consultation/chat_window/file_overlay.vue"
import ExtraControls from "@/consultation/chat_window/extra_controls.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import makeUniqueBy from "$/helpers/make_unique_by"

const {
	"pageProps": {
		"userProfile": {
			"data": {
				kind
			}
		}
	}
} = inject("pageContext") as PageContext<"deserialized">
const isCurrentUserConsultant = computed(() => kind === "reachable_employee")

interface CustomEvents {
	(eventName: "update:modelValue", newValue: string): void
	(eventName: "finishConsultation"): void
}

const emit = defineEmits<CustomEvents>()
const props = defineProps<{
	consultation: DeserializedConsultationResource<"consultant"|"consultantRole">
	chatMessages: DeserializedChatMessageListDocument<"user">
	modelValue: string,
	receivedErrors: string[],
	remainingTime: FullTime
}>()

const {
	"toggle": toggleHeaderControlDropdownShown,
	"state": isHeaderControlDropdownShown
} = makeSwitch(false)

const chatMessageFetcher = new ChatMessageFetcher()
const dependentFileChatMessages = computed(
	() => props.chatMessages.data.filter(
		chatMessage => chatMessage.kind === "file"
	)
)
const independentFileChatMessages = ref<DeserializedChatMessageResource[]>([])
onMounted(() => {
	chatMessageFetcher.list({
		"filter": {
			"chatMessageKinds": [ "file" ],
			"consultationIDs": [ props.consultation.id ],
			"existence": "exists",
			"previewMessageOnly": false
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": independentFileChatMessages.value.length
		},
		"sort": [ "-createdAt" ]
	})
	.then(({ body }) => {
		independentFileChatMessages.value = [ ...independentFileChatMessages.value, ...body.data ]
	})
})
const generalFileChatMessages = computed(() => {
	const filteredDependentFileChatMessages = dependentFileChatMessages.value.filter(
		chatMessage => chatMessage.data.subkind === "file"
	)
	const filteredIndependentFileChatMessages = independentFileChatMessages.value.filter(
		chatMessage => chatMessage.data.subkind === "file"
	)
	const combinedList = [
		...filteredDependentFileChatMessages, ...filteredIndependentFileChatMessages
	]
	const uniqueList = makeUniqueBy(combinedList, "id")
	uniqueList.sort((left, right) => {
		const leftSeconds = left.createdAt.valueOf()
		const rightSeconds = right.createdAt.valueOf()

		return Math.sign(leftSeconds - rightSeconds)
	})

	return { "data": uniqueList }
})
const imageFileChatMessages = computed(() => {
	const filteredDependentFileChatMessages = dependentFileChatMessages.value.filter(
		chatMessage => chatMessage.data.subkind === "image"
	)
	const filteredIndependentFileChatMessages = independentFileChatMessages.value.filter(
		chatMessage => chatMessage.data.subkind === "image"
	)
	const combinedList = [
		...filteredDependentFileChatMessages, ...filteredIndependentFileChatMessages
	]
	const uniqueList = makeUniqueBy(combinedList, "id")
	uniqueList.sort((left, right) => {
		const leftSeconds = left.createdAt.valueOf()
		const rightSeconds = right.createdAt.valueOf()

		return Math.sign(rightSeconds - leftSeconds)
	})

	return { "data": uniqueList }
})

const {
	"on": showFileRepoOverlay,
	"off": hideFileRepoOverlay,
	"state": isFileRepoOverlayShown
} = makeSwitch(false)

const {
	"on": showActionTakenOverlay,
	"off": hideActionTakenOverlay,
	"state": isActionTakenOverlayShown
} = makeSwitch(false)

const fileRepoTab = ref("files")

const mustShowPreview = computed(() => fileRepoTab.value === "pictures")
function switchTab(event: Event) {
	const button = event.target as HTMLButtonElement
	const { innerText } = button

	fileRepoTab.value = innerText.toLocaleLowerCase()
}

const consultation = computed<DeserializedConsultationResource<"consultant"|"consultantRole">>(
	() => props.consultation
)

const actionTaken = computed<string>({
	get(): string {
		return props.modelValue
	},
	set(newValue: string): void {
		emit("update:modelValue", newValue)
	}
})

function finishConsultation(): void {
	emit("finishConsultation")
}
</script>
