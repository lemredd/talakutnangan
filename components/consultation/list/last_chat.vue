<template>
	<div>
		<small class="last-chat span">
			<!-- TODO(others): must limit length -->
			<!-- TODO(others): must change acording to kind of message -->
			{{ JSON.stringify(lastChat.data) }}
		</small>

		<div class="last-chat-time-sent">
			{{ lastChat.createdAt.toString() }}
		</div>
	</div>
</template>

<script setup lang="ts">
import type { DeserializedChatMessageResource } from "$/types/documents/chat_message"

const {
	lastChat
} = defineProps<{
	lastChat: DeserializedChatMessageResource<"user">
}>()
</script>
