<template>
	<div class="call">
		<SelfParticipant
			v-model:must-show-video="mustShowVideo"
			v-model:must-transmit-audio="mustTransmitAudio"/>

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

import makeSwitch from "$@/helpers/make_switch"

import CallControls from "@/consultation/call/call_controls.vue"
import SelfParticipant from "@/consultation/call/self_participant.vue"

type AdditionalPageProps = "mustUsePeerServer"|"chatMessageActivities"|"consultation"
const pageContext = inject("pageContext") as PageContext<"deserialized", AdditionalPageProps>

const callParticipants = []

const {
	"toggle": toggleVideo,
	"state": mustShowVideo
} = makeSwitch(false)
const {
	"toggle": toggleMic,
	"state": mustTransmitAudio
} = makeSwitch(false)
</script>
