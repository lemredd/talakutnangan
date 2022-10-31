<template>
	<div class="call">
		<SelfParticipant/>
	</div>
</template>

<style>
</style>

<script setup lang="ts">
import { inject } from "vue"

import { PageContext } from "$/types/renderer"

import SelfParticipant from "@/consultation/call/self_participant.vue"

type AdditionalPageProps = "mustUsePeerServer"|"chatMessageActivities"|"consultation"
const pageContext = inject("pageContext") as PageContext<"deserialized", AdditionalPageProps>

const callParticipants = []


</script>
