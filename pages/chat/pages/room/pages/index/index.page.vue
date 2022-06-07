<template>
	<div v-if="!hasEmail">
		<form @submit.prevent="joinRoom" class="flex flex-row flex-nowrap">
			<label class="flex-1 flex-grow flex-shrink-0">
				E-mail: <input type="email" ref="emailField" class="bg-gray-500"/>
			</label>
		</form>
	</div>

	<div v-else>
		<header>
			<h1>Chat Room</h1>
			<div class="btns">
				<button class="bg-gray-200 px-3 py-1" @click="initiateCall" :disabled="isCalling">
					call
				</button>
			</div>
		</header>
		<div class="chatbox grid grid-cols-[2fr,1fr]">
			<div class="videos" v-if="isCalling">
				<div class="participants">
				<Video :id="email"></Video>
				</div>
			</div>

			<form @submit.prevent="sendMessage">
				<label class="flex-1 flex-grow flex-shrink-0">
					Message:
					<input type="text" ref="chatBox" class="rounded border-1 border-gray-500 focus:outline-none"/>
				</label>
				<output>
					<p v-for="{ time, email, content } in messages">
						{{ time }} {{ email }}: {{ content }}
					</p>
				</output>
			</form>
		</div>
	</div>
</template>

<style scoped lang="scss">

</style>

<script setup lang="ts">
import { ref, computed } from "vue"
import makeClient from "socket.io-client"
import { usePageContext } from "#/usePageContext"
import Participant from "./Participant.vue";

const clientWebSocket = makeClient()
const pageContext = usePageContext()
const emailField = ref(null)
const email = ref("")
const isCalling = ref(false)
const hasEmail = computed(() => email.value !== "")

const chatBox = ref(null)
const messages = ref([])

clientWebSocket.on("receive_message", message => {
	messages.value.push(message)
})

function initiateCall() {
	isCalling.value = true
}

function joinRoom() {
	const input = emailField.value as HTMLInputElement
	const rawEmail = input.value

	clientWebSocket.emit("join_room", pageContext.routeParams.uuid, rawEmail)
	email.value = rawEmail
}

function sendMessage(event) {
	const input = chatBox.value as HTMLInputElement
	const message = input.value

	clientWebSocket.emit("send_message", {
		time: (new Date()).toLocaleTimeString(),
		email: email.value,
		content: message
	})

	input.value = ""
}

</script>
