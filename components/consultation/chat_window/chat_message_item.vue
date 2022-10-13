<template>
	<div class="message-container">
		<div
			class="message-item"
			:class="messageItem">
			<ProfilePicture
				v-if="isOtherMessage"
				class="other"
				:user="chatMessage.user"
				:title="chatMessage.user.data.name"/>
			<div>
				<p
					v-if="isMessageKindText(chatMessage)"
					class="message-item-content"
					:class="messageItemContent">
					{{ chatMessage.data.value }}
				</p>
				<p
					v-if="isMessageKindFile(chatMessage)"
					class="message-item-content"
					:class="messageItemContent">
					<!-- TODO(lead): use appropriate elements for other file types  -->
					<img :src="fileURL"/>
				</p>
				<p
					v-if="isMessageKindStatus(chatMessage)"
					class="message-item-content"
					:class="messageItemContent">
					{{ determineStatusMessage }}
				</p>
			</div>
			<ProfilePicture
				v-if="isSelfMessage"
				class="self"
				:user="chatMessage.user"
				:title="chatMessage.user.data.name"/>
		</div>
		<div v-if="!isMessageKindStatus(chatMessage)" class="seen-list">
			<ProfilePicture
				v-for="activity in chatMessageActivities.data"
				:key="activity.id"
				:user="activity.user"
				:title="activity.user.data.name"
				class="seen-user"/>
		</div>
	</div>
</template>

<style scoped lang="scss">

.seen-list{
	@apply flex justify-end;
	.seen-user{
		max-width: 20px;
	}

}
	.message-item {
		@apply flex items-end w-max mb-5;

		&.own-message {
			margin-left: auto;

			.message-item-content {
				@apply mr-2 ml-0;
			}
		}
		&.status-message {
			@apply opacity-50 text-sm;
			margin: 0 auto;
		}

		.message-item-content {
			max-width: 45vw;
			overflow-wrap: break-word;

			&.text-message-content {
				@apply ml-2 py-1 px-2;
				@apply border rounded-lg border-true-gray-600 border-opacity-50;
				@apply dark:border-opacity-100;
			}
		}

		.other, .self {
			@apply rounded-full border border-true-gray-600 border-opacity-50;
			width: 40px;
			height: 40px;
		}
	}
</style>

<script setup lang="ts">
import { computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"

import type { DeserializedChatMessageResource } from "$/types/documents/chat_message"
import type {
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"

import {
	isMessageKindFile,
	isMessageKindStatus,
	isMessageKindText
} from "@/consultation/helpers/chat_message_kinds"

import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext
const chatMessageActivities = pageProps
.chatMessageActivities as DeserializedChatMessageActivityListDocument<"user"|"consultation">

const { userProfile } = pageProps

const { chatMessage } = defineProps<{
	chatMessage: DeserializedChatMessageResource<"user">
}>()

const isSelfMessage = computed<boolean>(() => {
	const isMessageCameFromSelf = !isMessageKindStatus(chatMessage)
		&& userProfile.data.id === chatMessage.user.data.id

	return isMessageCameFromSelf
})

const isOtherMessage = computed<boolean>(() => {
	const isMessageCameFromOther = !isMessageKindStatus(chatMessage)
		&& userProfile.data.id !== chatMessage.user.data.id

	return isMessageCameFromOther
})

const determineStatusMessage = computed(() => {
	let value = ""
	const chatMessageValue = chatMessage.data.value as string

	if (chatMessageValue.includes("finished")) value = chatMessageValue
	else value = `${chatMessage.user.data.name} ${chatMessageValue}`

	return value
})

const messageItem = {
	"own-message": isSelfMessage.value,
	"status-message": isMessageKindStatus(chatMessage)
}
const messageItemContent = {
	"file-message-content": isMessageKindFile(chatMessage),
	"status-message-content": isMessageKindStatus(chatMessage),
	"text-message-content": isMessageKindText(chatMessage)
}

const fileURL = computed(() => chatMessage.attachedChatFile?.data.fileContents)
</script>
