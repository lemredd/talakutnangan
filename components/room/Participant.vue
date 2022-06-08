<template>
<div class="participant">
	<video ref="videoElement"></video>
</div>
</template>

<style scoped lang="scss">
video {
	width: 100%;
	height: 100%;
}
</style>

<script setup lang="ts">
import { inject, onMounted, ref, Ref } from 'vue';
import { Socket } from 'socket.io-client';

interface PeerAddition extends Window {
	Peer: any
}

const Peer = ((window as unknown) as PeerAddition).Peer
const videoElement: Ref<HTMLVideoElement | null> = ref(null)
const document = new Document()
const peer = new Peer()
const clientWebSocket = inject("clientWebSocket") as Socket
const participants = inject("participants") as Ref<HTMLElement>

onMounted(() => {
	peer.on("open", function(id) {
		clientWebSocket.emit("call_on_room", id)
	})

	navigator.mediaDevices.getUserMedia({ video: true })
	.then(stream => {
		peer.on("call", (call: any) => {
			const remoteVideo = document.createElement("video")
			call.answer(stream)
			call.on("stream", (userVideoStream: MediaStream) => {
				addVideoStream(remoteVideo, userVideoStream, true)
			})
		})

		clientWebSocket.on("user_connected", function(peerUserID) {
			connectToNewUser(peerUserID, stream)
		})

		addVideoStream(videoElement.value, stream, false)
	})
})

function connectToNewUser(peerUserID: string, stream: MediaStream) {
	const call = peer.call(peerUserID, stream)
	const video = document.createElement("video")

	call.on("stream", (userVideoStream: MediaStream) => {
		addVideoStream(video, userVideoStream, true)
	})
	call.on("close", () => {
		video.remove()
	})
}

function addVideoStream(video: HTMLVideoElement, stream: MediaStream, isRemote: boolean) {
	video.srcObject = stream
	video.autoplay = true
	video.addEventListener("loadedmetadata", () => video.play())
	clientWebSocket.emit("console", isRemote)

	participants.value.append(video)
}
</script>
