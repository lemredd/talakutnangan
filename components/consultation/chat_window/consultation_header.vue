<template>
	<div class="selected-consultation-header">
		<div class="text">
			<div class="selected-consultation-title">
				{{ consultation.reason }}
			</div>
			<div class="selected-consultation-remaining-time">
				Time remaining:
				<span>{{ remainingTime.minutes }}m</span>
				<span v-if="remainingTime.seconds > 0">{{ twoDigits(remainingTime.seconds) }}s</span>
			</div>
		</div>
		<div class="controls">
			<!-- TODO(lead/button): Apply functionality -->
			<a
				:href="`../call/${consultation.id}`"
				target="_blank"
				class="material-icons">
				video_camera_back
			</a>
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
				:consultation-id="consultation.id"
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
import { ref, computed, inject, onMounted, Ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { FullTime } from "$@/types/independent"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type { ResourceCount } from "$/types/documents/base"
import type {
	DeserializedChatMessageListDocument,
	DeserializedChatMessageResource
} from "$/types/documents/chat_message"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import twoDigits from "$/time/two_digits"
import makeSwitch from "$@/helpers/make_switch"
import makeUniqueBy from "$/helpers/make_unique_by"
import ChatMessageFetcher from "$@/fetchers/chat_message"

import Overlay from "@/helpers/overlay.vue"
import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"
import FileOverlay from "@/consultation/chat_window/file_overlay.vue"
import ExtraControls from "@/consultation/chat_window/extra_controls.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"

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
	(eventName: "showActionTakenOverlay"): void
	(eventName: "hideActionTakenOverlay"): void
}

const emit = defineEmits<CustomEvents>()
const props = defineProps<{
	consultation: DeserializedConsultationResource<"consultant"|"consultantRole">
	chatMessages: DeserializedChatMessageListDocument<"user">
	modelValue: string,
	isActionTakenOverlayShown: boolean,
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
async function loadRemainingFiles(
	files: Ref<DeserializedChatMessageResource[]>,
	fetcher: ChatMessageFetcher
) {
	await chatMessageFetcher.list({
		"filter": {
			"chatMessageKinds": [ "file" ],
			"consultationIDs": [ props.consultation.id ],
			"existence": "exists",
			"previewMessageOnly": false
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": files.value.length
		},
		"sort": [ "-createdAt" ]
	})
	.then(({ body }) => {
		const { data, meta } = body
		if (data.length === 0) return Promise.resolve()

		files.value = [ ...files.value, ...data ]
		const castedMeta = meta as ResourceCount
		if (independentFileChatMessages.value.length < castedMeta.count) {
			return loadRemainingFiles(files, fetcher)
		}

		return Promise.resolve()
	})
}

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

function showActionTakenOverlay(): void {
	emit("showActionTakenOverlay")
}
function hideActionTakenOverlay(): void {
	emit("hideActionTakenOverlay")
}
function finishConsultation(): void {
	emit("finishConsultation")
}

onMounted(async() => {
	await loadRemainingFiles(independentFileChatMessages, chatMessageFetcher)
})
</script>
