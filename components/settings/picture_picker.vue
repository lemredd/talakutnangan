<template>
	<div class="picture-picker">
		<slot></slot>

		<form>
			<input
				type="hidden"
				name="data[type]"
				:value="resourceType"/>
			<input
				id="input-file"
				type="file"
				name="data[attributes][fileContents]"
				accept="image/"
				class="input-pic"
				@change="submitImage"/>
		</form>
	</div>
</template>

<style scoped lang="scss">
.input-pic {
	display: none;
}
</style>

<script setup lang="ts">

defineProps<{
	resourceType: "profile_picture" | "signature"
}>()
// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
	(event: "submitFile", data: FormData): void
}>()

function submitImage(event: Event) {
	const target = event.target as HTMLInputElement
	const form = target.form as HTMLFormElement
	const formData = new FormData(form)

	emit("submitFile", formData)
}
</script>
