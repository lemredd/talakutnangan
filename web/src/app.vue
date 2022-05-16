<template>
	<span>{{ message }}</span>
</template>

<style lang="scss">
@import "./index";
</style>

<script setup lang="ts">
import { ref } from "vue";

const message = ref("Hello World!fdd");

</script>
