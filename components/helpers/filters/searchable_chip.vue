<template>
	<div class="field">
		<h2 class="text-lg uppercase">
			{{ header }}
		</h2>
		<div
			v-for="chip in selectedChips"
			:key="chip.id"
			class="chip selected">
			<span>
				{{ chip.data }}
			</span>
			<span
				v-if="chip.mayRemove"
				class="close-btn material-icons"
				@click="removeChip(chip.id)">
				close
			</span>
		</div>
		<NonSensitiveTextField
			v-if="maySelectMore"
			v-model="slug"
			:label="textFieldLabel"
			type="text"/>
		<Suspensible :is-loaded="isLoaded">
			<div
				v-for="chip in unselectedChips"
				:key="chip.id"
				class="chip unselected"
				@click="addChip(chip.id)">
				{{ chip.data }}
			</div>
		</Suspensible>
	</div>
</template>

<style lang="scss">
	@import "@styles/btn.scss";

	.field {
		@apply pb-5;
	}

	.chip {
		@apply inline-flex items-center text-sm;

		margin: 5px;
		border-radius: 25px;
		padding: 0 15px;

		height: 30px;

		color: black;
		background-color: #f1f1f1;

		&.unselected {
			@apply cursor-pointer hover:bg-gray-300;
		}
	}

	.close-btn {
		padding-left: 10px;
		color: #888;
		font-weight: bold;
		float: right;
		font-size: 20px;
		cursor: pointer;

		&:hover {
			color: #000;
		}
	}

</style>

<script setup lang="ts">
import { computed } from "vue"

import type { ChipData } from "$@/types/component"

import Suspensible from "@/helpers/suspensible.vue"
import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"

const props = defineProps<{
	header: string,
	modelValue: string,
	isLoaded: boolean,
	unselectedChips: ChipData[],
	selectedChips: ChipData[],
	maximumChips: number,
	textFieldLabel: string
}>()

interface CustomEvents {
	(eventName: "update:modelValue", newSlug: string): void
	(eventName: "addChip", id: string): void
	(eventName: "removeChip", id: string): void
}
const emit = defineEmits<CustomEvents>()

const slug = computed<string>({
	get(): string {
		return props.modelValue
	},
	set(newValue: string): void {
		emit("update:modelValue", newValue)
	}
})
const maySelectMore = computed<boolean>(
	() => props.selectedChips.length < props.maximumChips
)

function addChip(id: string): void {
	emit("addChip", id)
}

function removeChip(id: string): void {
	emit("removeChip", id)
}
</script>
