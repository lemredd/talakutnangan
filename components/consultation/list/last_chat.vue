<template>
	<div>
		<small  v-if="isMessageKindText(lastChat)" class="last-chat">
			<!-- TODO(others): must limit length -->
			<!-- TODO(others): must change acording to kind of message -->
			{{ lastChat.user.data.name }}: {{ lastChat.data.value }}
		</small>
		<small v-if="isMessageKindFile(lastChat)" class="last-chat">
			<!-- TODO(others): must limit length -->
			<!-- TODO(others): must change acording to kind of message -->
			{{ (lastChat.user.data.name) }} sent an attachment
		</small>

		<div class="last-chat-time-sent">
			{{ time }} {{ midDay }} - {{ lastChat.createdAt.toDateString() }}
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

import type { TextMessage, StatusMessage } from "$/types/message"
import type { DeserializedChatMessageResource } from "$/types/documents/chat_message"
import { computed } from "vue";

const {
	lastChat
} = defineProps<{
	lastChat: DeserializedChatMessageResource<"user">
}>()

function isMessageKindStatus(value: DeserializedChatMessageResource<"user">)
: value is DeserializedChatMessageResource<"user"> & StatusMessage {
	return value.kind === "status"
}

function isMessageKindText(value: DeserializedChatMessageResource<"user">)
: value is DeserializedChatMessageResource<"user"> & TextMessage {
	return value.kind === "text"
}
function isMessageKindFile(value: DeserializedChatMessageResource<"user">)
: value is DeserializedChatMessageResource<"user"> & TextMessage {
	return value.kind === "file"
}

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

</script>
