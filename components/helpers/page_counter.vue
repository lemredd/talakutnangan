<template>
	<div class="page-counter">
		<button
			class="movement-btn previous-btn"
			:class="movementBtnClasses"
			@click="goToPreviousPage">
			<span class="material-icons">chevron_left</span>
			<span class="text">Previous</span>
		</button>

		<div v-if="pageLength < CONDENSE_LIMIT" class="limited-page-btn">
			<button
				v-for="pageCount in CONDENSE_LIMIT"
				:key="pageCount"
				class="page-count-btn btn"
				:class="determineActiveness(pageCount)"
				@click="updateOffset(pageCount)">
				{{ pageCount }}
			</button>
		</div>
		<div v-else class="unlimited-page-btn">
			<button
				v-for="pageCount in condensedPageLength"
				:key="pageCount"
				class="page-count-btn btn"
				:class="determineActiveness(pageCount)"
				@click="updateOffset(pageCount)">
				{{ pageCount }}
			</button>
			...
			<button
				class="page-count-btn btn"
				:class="determineActiveness(pageLength)"
				@click="updateOffset(pageLength)">
				{{ pageLength }}
			</button>
		</div>

		<button
			class="movement-btn next-btn"
			:class="movementBtnClasses"
			@click="goToNextPage">
			<span class="text">Next</span>
			<span class="material-icons">chevron_right</span>
		</button>
	</div>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
	.page-counter {
		@apply flex;

		.movement-btn {
			@apply flex items-center;

			&.previous-btn {
				@apply mr-2;

				&.disabled-previous-btn {
					@apply text-gray-400;
					cursor: initial;
				}
			}
			&.next-btn {
				@apply ml-3;

				&.disabled-next-btn {
					@apply text-gray-400;
					cursor: initial;
				}
			}

		}

		.page-count-btn {
			@apply mx-1;
			&.btn-inactive {
				@apply bg-transparent;
			}
		}
	}
</style>

<script setup lang="ts">
import { computed, ref } from "vue"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

type CustomEvents = {
	(eventName: "update:modelValue", newValue: number): void
}
const emit = defineEmits<CustomEvents>()

type DefinedProps = {
	maxCount: number
	modelValue: number
}
const props = defineProps<DefinedProps>()

const currentPageCount = computed(() => props.modelValue / DEFAULT_LIST_LIMIT + 1)
const CONDENSE_LIMIT = 4
const pageLength = computed(
	() => Math.ceil(props.maxCount / DEFAULT_LIST_LIMIT)
)
const condensedPageLength = computed(() => [
	currentPageCount.value,
	currentPageCount.value + 1,
	currentPageCount.value + 2,
	currentPageCount.value + 3
])

const offset = computed({
	get() { return props.modelValue },
	set(newValue: number) { emit("update:modelValue", newValue) }
})
function updateOffset(selectedOffset: number) {
	offset.value = (selectedOffset - 1) * DEFAULT_LIST_LIMIT
}

function determineActiveness(pageCountOfButton: number) {
	const classes = []
	const isActive = pageCountOfButton === currentPageCount.value

	if (isActive) classes.push("btn-primary")
	else classes.push("btn-inactive")

	return classes.join(" ")
}

const isAtFirstPage = computed(() => props.modelValue === 0)
const isAtLastPage = computed(() => {
	const flooredMaxCount = Math.floor(props.maxCount / DEFAULT_LIST_LIMIT) * DEFAULT_LIST_LIMIT
	return flooredMaxCount === props.modelValue
})
const movementBtnClasses = {
	"disabled-next-btn": isAtLastPage.value,
	"disabled-previous-btn": isAtFirstPage.value
}
function goToPreviousPage() {
	if (!isAtFirstPage.value) emit("update:modelValue", props.modelValue - DEFAULT_LIST_LIMIT)
}
function goToNextPage() {
	if (!isAtLastPage.value) emit("update:modelValue", props.modelValue + DEFAULT_LIST_LIMIT)
}
</script>
