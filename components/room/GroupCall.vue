<template>
<div class="videos" v-if="isCalling">
	<div class="participants" ref="participants">
		<Participant :id="`user-id-${email}`"></Participant>
	</div>
</div>
</template>

<style>
</style>

<script setup lang="ts">
import { inject, provide, Ref } from "vue";
import Participant from "./Participant.vue";

const email = inject("email") as Ref<string>
const isCalling = inject("isCalling") as Ref<boolean>
const participants = ref(null)

provide("participants", participants)
</script>
