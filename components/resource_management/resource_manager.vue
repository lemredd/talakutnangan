<template>
	<div class="resource-manager">
		<slot name="header"></slot>
		<div class="controls-bar">
			<SearchFilter
				v-if="hasSlug"
				v-model="slugText"
				class="search-bar"/>
			<SelectableOptionsField
				v-if="hasRoleNames"
				v-model="role"
				label="Role"
				:options="roleNames"/>
			<SelectableOptionsField
				v-if="hasDepartmentNames"
				v-model="department"
				label="Department"
				:options="departmentNames"/>
			<SelectableExistence
				v-if="hasExistence"
				v-model="existence"
				title="Existence"
				:options="existenceOptions"/>
		</div>
		<Suspensible :is-loaded="isLoaded">
			<slot name="resources">
			</slot>
		</Suspensible>
	</div>
</template>

<style lang="scss">
	.controls-bar {
		@apply dark:bg-dark-100 bg-light-600 gap-y-4 flex flex-row flex-wrap justify-between;

		.search-bar {
			@apply dark:bg-dark-300 bg-gray-300 basis-full p-[.25em];

			~ * {
				@apply flex-1;
			}
		}
	}
</style>

<script setup lang="ts">
import { computed } from "vue"

import type { OptionInfo } from "$@/types/component"

import isUndefined from "$/type_guards/is_undefined"

import Suspensible from "@/suspensible.vue"
import SearchFilter from "@/helpers/search_bar.vue"
import SelectableExistence from "@/fields/selectable_radio.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"

const props = defineProps<{
	isLoaded: boolean
	chosenRole?: string,
	chosenDepartment?: string,
	existence?: string,
	slug?: string,

	roleNames: OptionInfo[],
	departmentNames: OptionInfo[]
}>()

interface CustomEvents {
	(e: "update:chosenDepartment", id: string): void
	(e: "update:existence", existence: string): void
	(e: "update:chosenRole", id: string): void
	(e: "update:slug", slug: string): void
}
const emit = defineEmits<CustomEvents>()

const hasRoleNames = computed<boolean>(() => props.roleNames.length > 0)
const role = computed<string>({
	get(): string { return props.chosenRole as string },
	set(newValue: string): void {
		emit("update:chosenRole", newValue)
	}
})
const hasDepartmentNames = computed<boolean>(() => props.departmentNames.length > 0)
const department = computed<string>({
	get(): string { return props.chosenDepartment as string },
	set(newValue: string): void {
		emit("update:chosenDepartment", newValue)
	}
})
const hasSlug = computed<boolean>(() => !isUndefined(props.slug))
const slugText = computed<string>({
	get(): string { return props.slug as string },
	set(newValue: string): void {
		emit("update:slug", newValue)
	}
})

const hasExistence = computed(() => !isUndefined(props.existence))
const existence = computed<string>({
	get(): string { return props.existence as string },
	set(newValue: string): void {
		emit("update:existence", newValue)
	}
})

const existenceOptions = [
	{
		"value": "exists"
	},
	{
		"value": "archived"
	},
	{
		"label": "all",
		"value": "*"
	}
] as OptionInfo[]
</script>
