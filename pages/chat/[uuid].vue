<template>
	<div>
		<form @submit.prevent="joinRoom" v-if="!hasEmail">
			<label>
				E-mail: <input type="email" ref="emailField"/>
			</label>
		</form>
		<form @submit.prevent="sendMessage" v-if="hasEmail">
			<label>
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
@import "../index";
</style>

<script setup lang="ts">
const { $webSocketClient } = useNuxtApp()
const route = useRoute()

const emailField = ref(null)
const email = ref("")
const hasEmail = computed(() => email.value !== "")

const chatBox = ref(null)
const messages = ref([])

const wsConnection = $webSocketClient()

wsConnection.on("receive_message", message => {
	messages.value.push(message)
})

function joinRoom() {
	const input = emailField.value as HTMLInputElement
	const rawEmail = input.value

	wsConnection.emit("join_room", route.params.uuid, rawEmail)
	email.value = rawEmail
}

function sendMessage(event) {
	const input = chatBox.value as HTMLInputElement
	const message = input.value

	wsConnection.emit("send_message", {
		time: (new Date()).toLocaleTimeString(),
		email: email.value,
		content: message
	})

	input.value = ""
}

</script>
