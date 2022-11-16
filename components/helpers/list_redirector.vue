<template>
	<div class="list-redirector">
		<a :href="`/${resourceType}/list`" class="back-to-list-page">
			<span class="material-icons">
				arrow_circle_left
			</span>
			{{ convertForSentence(resourceType) }} List
		</a>
	</div>
</template>

<style scoped lang="scss">
.back-to-list-page {
	@apply mb-8 flex items-center;

	.material-icons { @apply mr-2; }
}
</style>

<script setup lang="ts">
import convertForSentence from "$/string/convert_for_sentence"

defineProps<{
	resourceType:
		|"user"
		|"role"
		|"department"
		|"semester"
		|"tag"
}>()
</script>
