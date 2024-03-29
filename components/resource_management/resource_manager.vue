<template>
	<div class="resource-manager">
		<slot name="header"></slot>
		<div class="controls-bar">
			<SearchFilter
				v-if="hasSlug"
				v-model="slugText"
				class="search-bar"/>
			<SelectableOptionsField
				v-if="hasSortNames"
				v-model="sort"
				label="Sort"
				:options="sortNames!"/>
			<SelectableOptionsField
				v-if="hasRoleNames"
				v-model="role"
				label="Role"
				:options="roleNames!"/>
			<SelectableOptionsField
				v-if="hasDepartmentNames"
				v-model="department"
				label="Department"
				:options="departmentNames!"/>
			<SelectableExistence
				v-if="hasExistence"
				v-model="existence"/>
		</div>
		<Suspensible :is-loaded="isLoaded">
			<slot name="resources">
			</slot>
		</Suspensible>
	</div>
</template>

<style lang="scss">
	.controls-bar {
		@apply dark:bg-dark-100 bg-light-600 gap-y-4;
		@apply flex flex-row flex-wrap justify-between;

		> * {
			@apply flex-1 mr-2;
		}

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

import Suspensible from "@/helpers/suspensible.vue"
import SearchFilter from "@/helpers/filters/search_bar.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import SelectableExistence from "@/fields/selectable_radio/existence.vue"

const props = defineProps<{
	isLoaded: boolean
	chosenSort?: string,
	chosenRole?: string,
	chosenDepartment?: string,
	existence?: string,
	slug?: string,

	sortNames?: OptionInfo[],
	roleNames?: OptionInfo[],
	departmentNames?: OptionInfo[]
}>()

interface CustomEvents {
	(e: "update:chosenDepartment", id: string): void
	(e: "update:existence", existence: string): void
	(e: "update:chosenRole", id: string): void
	(e: "update:chosenSort", id: string): void
	(e: "update:slug", slug: string): void
}
const emit = defineEmits<CustomEvents>()

const hasSortNames = computed(() => Boolean(props.sortNames))
const sort = computed<string>({
	get(): string { return props.chosenSort as string },
	set(newValue: string): void {
		emit("update:chosenSort", newValue)
	}
})

const hasRoleNames = computed(() => Boolean(props.roleNames))
const role = computed<string>({
	get(): string { return props.chosenRole as string },
	set(newValue: string): void {
		emit("update:chosenRole", newValue)
	}
})
const hasDepartmentNames = computed(() => Boolean(props.departmentNames))
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
</script>
