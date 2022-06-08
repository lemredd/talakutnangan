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

onMounted(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        videoElement.value.srcObject = stream
        videoElement.value.addEventListener("loadedmetadata", () => videoElement.value.play())
    })
})
</script>
