<template>
	<div class="suspensible">
		<div class="loaded" v-if="asyncResource">
			<slot></slot>
		</div>

		<div class="loading" v-else>
			Loading...
		</div>
	</div>
</template>

<style>
</style>

<script setup lang="ts">
import type { PossibleResources } from "$@/types/independent"

const { asyncResource } = defineProps<{
	asyncResource: PossibleResources | PossibleResources[]
}>()
</script>
