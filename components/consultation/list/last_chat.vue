<template>
	<div>
		<small class="last-chat span">
			<!-- TODO(others): must limit length -->
			<!-- TODO(others): must change acording to kind of message -->
			{{ JSON.stringify(lastChat.data) }}
		</small>

		<div class="last-chat-time-sent">
			{{ lastChat.createdAt }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type {
	DeserializedChatMessageResource,
	DeserializedChatMessageListDocument
} from "$/types/documents/chat_message"

const {
	chats
} = defineProps<{
	chats: DeserializedChatMessageListDocument<"user">
}>()

const lastChat = computed<DeserializedChatMessageResource<"user">>(
	() => chats.data[chats.data.length - 1]
)
</script>
