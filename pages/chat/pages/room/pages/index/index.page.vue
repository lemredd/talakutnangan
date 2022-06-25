<template>
	<div v-if="!hasEmail">
		<form @submit.prevent="joinRoom" class="email-form">
			<label class="form-control">
				E-mail: <input type="email" ref="emailField" class="bg-gray-500"/>
			</label>
		</form>
	</div>

	<div v-else>
		<header>
			<h1>Chat Room</h1>
			<div class="btns">
				<button class="call-btn" @click="initiateCall" :disabled="isCalling">
					call
				</button>
			</div>
		</header>
		<div class="chatbox">
			<GroupCall></GroupCall>

			<form @submit.prevent="sendMessage" class="message-input">
				<label class="form-control">
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
	</div>
</template>

<style scoped lang="scss">
.email-form {
	@apply flex flex-row flex-nowrap;

	form-control {
		@apply flex-1 flex-grow flex-shrink-0;
	}
}

.btns {
	.call-btn {
		padding: .75em .25em;
		background-color: gray;
	}
}

.chatbox {
	@apply  grid grid-cols-[2fr,1fr];

	.message-input {
		@apply flex-1 flex-grow flex-shrink-0;
	}
}

.message-input {
	input {
		border-radius: .25em;
		border: 1px solid gray;

		&.focus {
			outline: none;
		}
	}
}
</style>

<script setup lang="ts">
import { ref, computed, provide } from "vue"
import makeClient from "socket.io-client"
import { usePageContext } from "#/usePageContext"
import GroupCall from "@/room/GroupCall.vue";

type message = {
	time: string,
	email: string,
	content: string
}

const clientWebSocket = makeClient()
const pageContext = usePageContext()
const emailField = ref<HTMLInputElement | null>(null)
const email = ref("")
const isCalling = ref(false)
const hasEmail = computed(() => email.value !== "")

const chatBox = ref(null)
const messages = ref<message[]>([])

clientWebSocket.on("receive_message", message => {
	messages.value.push(message)
})

function joinRoom() {
	const input = emailField.value as HTMLInputElement
	const rawEmail = input.value

	clientWebSocket.emit("join_room", pageContext.routeParams!.uuid, rawEmail)
	email.value = rawEmail
}

function initiateCall() {
	isCalling.value = true
}

function sendMessage(event: Event) {
	const input = chatBox.value! as HTMLInputElement
	const message = input.value

	clientWebSocket.emit("send_message", {
		time: (new Date()).toLocaleTimeString(),
		email: email.value,
		content: message
	})

	input.value = ""
}

provide("isCalling", isCalling)
provide("email", email)
provide("clientWebSocket", clientWebSocket)
</script>
