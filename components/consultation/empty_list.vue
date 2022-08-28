<template>
	<div class="consultations-list">
		<div class="mx-auto max-w-[max-content] no-consultations">
			<img class="mx-auto" :src="SadIcon"/>
			<h2>There are no consultations yet...</h2>
		</div>
	</div>
</template>

<script setup lang="ts">
import SadIcon from "@assets/sadicon.png"

</script>
