<template>
	<section class="empty-chat-window right">
		<h1 v-if="isUserAStudent" class="student">
			Need help?
		</h1>
		<h1 v-else class="reachable_employee">
			Waiting for consultation
		</h1>
		<p v-if="isUserAStudent" class="student">
			Please create a consultation.
		</p>
		<p v-else class="reachable_employee">
			There are no students asking for help yet.
		</p>
	</section>
</template>

<style scoped lang="scss">
.empty-chat-window{
	display: none;

	@screen sm{
		@apply flex flex-col;
	}
}
</style>

<script setup lang="ts">
import { computed } from "vue"

import type { DeserializedUserProfile } from "$/types/documents/user"

const { userProfile } = defineProps<{
	userProfile: DeserializedUserProfile
}>()
const isUserAStudent = computed<boolean>(() => userProfile.data.kind === "student")
</script>
