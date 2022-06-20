<template>
	<form @submit.prevent="importData">
		<input type="file" accept="text/csv" name="csv_file"/>
	</form>
</template>

<script setup lang="ts">
function importData(event: Event) {
	const form = event.target as HTMLFormElement
	const formData = new FormData(form)

	fetch("/api/user/import", {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data"
		},
		body: formData
	}).then(response => {
		console.log(response)
	})
}

</script>
