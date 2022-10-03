<template>
	<form @submit.prevent="submitPostDetails">
		<div class="row">
			<div class="col-25">
				<label for="content">Content</label>
			</div>
			<div class="col-75">
				<textarea
					id="content"
					name="data[attributes][content]"
					placeholder="Write something.."
					style="height:200px">
				</textarea>
			</div>
		</div>
		<div class="row">
			<input type="submit" value="Submit"/>
		</div>
	</form>
</template>
<style lang="scss">
@import "../index";
</style>
<script setup lang="ts">
interface CustomEvents {
	(event: "submitPost", data: FormData): void
}
const emit = defineEmits<CustomEvents>()
function submitPostDetails(event: Event) {
	const form = event.target as HTMLFormElement
	const formData = new FormData(form)

	emit("submitPost", formData)
}
</script>
