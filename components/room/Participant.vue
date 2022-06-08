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

class Peer {
    on(event: string, anonymousFunction: (arg?: any) => void) {
        anonymousFunction()
    }
}

class Call {
    on(event: string, anonymousFunction: (arg?: any) => void) {
        anonymousFunction()
    }
    answer(stream?: MediaStream, options?: any): void {}
}

const videoElement: Ref<HTMLVideoElement | null> = ref(null)
const peer = new Peer()

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
