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
const peer = new Peer()
const clientWebSocket = inject("clientWebSocket") as Socket

const addVideoStream = inject("addVideoStream") as (video: HTMLVideoElement, stream: MediaStream) => void
onMounted(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        peer.on("call", (call: Call) => {
            // const document = new Document()
            // call.answer(stream)
            // const remoteVideo = document.createElement("video")
            // call.on("stream", function(userVideoStream: MediaStream) {
            //     addVideoStream(remoteVideo, userVideoStream)
            // })
        })

        addVideoStream(videoElement.value, stream)
    })
})


</script>
