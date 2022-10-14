<template>
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
			<div
				v-if="isMessageKindFile(chatMessage)"
				class="message-item-content"
				:class="[messageItemContent, fileMessageContent]">
				<!-- TODO(lead): use appropriate elements for other file types  -->
				<img v-if="chatMessage.data.subkind === 'image'" :src="fileURL"/>
				<a
					v-else
					class="file-link"
					target="_blank"
					:href="fileURL">
					<span class="attachment-symbol material-icons">
						attachment
					</span>
					<span class="file-name">{{ chatMessage.data.name }}</span>
				</a>
			</div>
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
</template>

<style scoped lang="scss">
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

			&.status-message-content {
				text-align: center;
			}
			&.text-message-content, &.general-file {
				@apply ml-2 py-1 px-2;
				@apply border rounded-lg border-true-gray-600 border-opacity-50;
				@apply dark:border-opacity-100;

				.file-link {
					@apply flex items-center m-1;
					&.file-name {
						text-decoration: underline;
					}
				}
			}
		}

		.attachment-symbol {
			@apply bg-gray-300 text-black dark:bg-dark-100 dark:text-white rounded-full p-1 mr-2;
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

import {
	isMessageKindFile,
	isMessageKindStatus,
	isMessageKindText
} from "@/consultation/helpers/chat_message_kinds"

import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext

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
const fileMessageContent = {
	"general-file": isMessageKindFile(chatMessage)
	&& chatMessage.data.subkind.match(/file/u),
	"image": isMessageKindFile(chatMessage)
	&& chatMessage.data.subkind.match(/image/u)
}

const fileURL = computed(() => chatMessage.attachedChatFile?.data.fileContents)
</script>
