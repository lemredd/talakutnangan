<template>
	<div class="call">
		<CallControls
			@toggle-video="toggleVideo"
			@toggle-mic="toggleMic"/>
	</div>
</template>

<style>
</style>

<script setup lang="ts">
import { inject } from "vue"

import { PageContext } from "$/types/renderer"

import CallControls from "@/consultation/call/call_controls.vue"
import SelfParticipant from "@/consultation/call/self_participant.vue"

type AdditionalPageProps = "mustUsePeerServer"|"chatMessageActivities"|"consultation"
const pageContext = inject("pageContext") as PageContext<"deserialized", AdditionalPageProps>

const callParticipants = []


</script>
