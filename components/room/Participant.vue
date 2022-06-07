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
import { onMounted, ref, Ref } from 'vue';

const videoElement: Ref<HTMLVideoElement | null> = ref(null)

onMounted(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        videoElement.value.srcObject = stream
        videoElement.value.addEventListener("loadedmetadata", () => videoElement.value.play())
    })
})
</script>
