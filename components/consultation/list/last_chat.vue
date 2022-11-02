<template>
	<div>
		<small v-if="isMessageKindText(lastChat)" class="last-chat">
			{{ lastChat.user.data.name }}: {{ lastChat.data.value }}
		</small>
		<small v-if="isMessageKindStatus(lastChat)" class="last-chat">
			{{ lastChat.user.data.name }} {{ lastChat.data.value }}
		</small>
		<small v-if="isMessageKindFile(lastChat)" class="last-chat">
			{{ (lastChat.user.data.name) }} sent an attachment
		</small>

		<div class="last-chat-time-sent">
			{{ lastChatTimeSent }}
		</div>
	</div>
</template>

<style scoped lang ="scss">
.last-chat{
	width: 100%;
	display: inline-block;
	white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}
</style>

<script setup lang="ts">
import { computed } from "vue"

import type { DeserializedChatMessageResource } from "$/types/documents/chat_message"

import {
	isMessageKindFile,
	isMessageKindStatus,
	isMessageKindText
} from "@/consultation/helpers/chat_message_kinds"

const {
	lastChat
} = defineProps<{
	lastChat: DeserializedChatMessageResource<"user">
}>()

const time = computed(
	() => `${lastChat.createdAt.getHours() % 12}:${lastChat.createdAt.getMinutes()}`
)
const midDay = computed(() => {
	const hour = lastChat.createdAt.getHours()
	let value = ""

	if (hour < 12) value = "AM"
	else value = "PM"

	return value
})
const lastChatTimeSent = `${time.value} ${midDay.value} - ${lastChat.createdAt.toDateString()}`
</script>
