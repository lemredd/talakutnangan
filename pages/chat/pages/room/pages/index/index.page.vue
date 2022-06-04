<template>
	<div>
		<form @submit.prevent="joinRoom" v-if="!hasEmail" class="flex flex-row flex-nowrap">
			<label class="flex-1 flex-grow flex-shrink-0">
				E-mail: <input type="email" ref="emailField" class="bg-gray-500"/>
			</label>
		</form>
		<form @submit.prevent="sendMessage" v-if="hasEmail">
			<label class="flex-1 flex-grow flex-shrink-0">
				Message:
				<input type="text" ref="chatBox"/>
			</label>
			<output>
				<p v-for="{ time, email, content } in messages">
					{{ time }} {{ email }}: {{ content }}
				</p>
			</output>
		</form>
	</div>
</template>

<style lang="scss">

</style>

<script setup lang="ts">
import { ref, computed } from "vue"
import makeClient from "socket.io-client"
import { usePageContext } from "#/usePageContext"

const clientWebSocket = makeClient()
const pageContext = usePageContext()
const emailField = ref(null)
const email = ref("")
const hasEmail = computed(() => email.value !== "")

const chatBox = ref(null)
const messages = ref([])

clientWebSocket.on("receive_message", message => {
	messages.value.push(message)
})

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
