<template>
	<div class="search-bar">
			<!-- TODO: separate component from textual_field -->
			<TextualField
				type="email"
				v-model="searchFilter"
				input-classes="!py-0 pl-1 !border-none" />
			<button class="material-icons">search</button>
		</div>
</template>

<script setup lang = ts>
import TextualField from "@/fields/textual.vue"
import { inject, Ref } from "vue";

// TODO: forward injection to textualfield
const searchFilter=inject("searchFilterText") as Ref<string>
</script>
