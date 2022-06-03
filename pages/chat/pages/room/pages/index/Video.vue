<template>
<video ref="videoElement"></video>
</template>

<style>

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
