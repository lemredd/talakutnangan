<template>
	<div class="resource-list">
		<p v-if="hasSelected">
			Selected {{ friendlyItemQuantity }}
		</p>
		<ResourceTable v-if="list.length">
			<template #table-headers>
				<th v-for="header in headers" :key="header">
					{{ header }}
				</th>
			</template>

			<template #table-body>
				<tr
					v-for="resource in list"
					:key="resource.id"
					class="resource-row"
					:class="{ 'active': canDeselect(resource.id) }">
					<td v-for="(data, i) in resource.data" :key="i">
						{{ data }}
					</td>
					<td v-if="mayManage">
						<a
							v-if="mayEdit"
							:href="makePath(resource.id)"
							class="read-resource-btn btn"
							type="button">
							edit
						</a>
						<span
							v-if="mayArchive"
							class="archive-resource-btn btn"
							@click="archive(resource.id)">
							archive
						</span>
						<span
							v-if="mayRestore"
							class="restore-resource-btn btn"
							@click="restore(resource.id)">
							restore
						</span>
						<span
							v-if="canDeselect(resource.id)"
							class="deselect-resource-btn btn"
							@click="deselect(resource.id)">
							deselect
						</span>
						<span
							v-if="canSelect(resource.id)"
							class="select-resource-btn btn"
							@click="select(resource.id)">
							select
						</span>
					</td>
				</tr>
			</template>
		</ResourceTable>

		<div v-else class="no-results">
			<p>No results found!</p>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "@/variables.scss";
	@import "@styles/btn.scss";
	.resource-list {
		margin-top: 1em;

		.resource-row {
			@apply dark:text-light-100;
			margin: .5rem;
			border-bottom-width: 1px;
			padding-bottom: .5rem;

			.btn1 {
				@apply dark:bg-dark-300 bg-light-600 rounded-md w-20 text-base h-7;
			}

			&.active {
				background-color: $color-primary;
				color: white;
			}
		}

		.no-results {
			text-align: center;
		}
		.btn {
			border: none;
			border-radius: 5px;
			padding: 8px;
			text-align: center;
			text-decoration: none;
			display: inline-block;
			font-size: 12px;
		}
	}
</style>

<script setup lang="ts">
import { computed } from "vue"
import type { TableData } from "$@/types/component"

import pluralize from "$/string/pluralize"
import specializePath from "$/helpers/specialize_path"

import ResourceTable from "@/helpers/overflowing_table.vue"

const props = defineProps<{
	templatePath?: string
	mayEdit: boolean
	mayArchive: boolean
	mayRestore: boolean
	list: TableData[]
	selectedIDs: string[]
	headers: string[]
}>()

interface CustomEvents {
	(event: "archive", id: string): void,
	(event: "restore", id: string): void,
	(event: "update:selectedIDs", newSelection: string[]): void
}
const emit = defineEmits<CustomEvents>()

const maySelect = computed<boolean>(() => {
	const { mayArchive, mayRestore } = props
	return mayArchive || mayRestore
})
const mayManage = computed<boolean>(() => {
	const shouldSelect = maySelect.value
	const { mayEdit } = props

	return shouldSelect || mayEdit
})

const itemQuantity = computed<number>(() => props.selectedIDs.length)
const hasSelected = computed<boolean>(() => itemQuantity.value > 0)
const friendlyItemQuantity = computed<string>(() => pluralize("item", itemQuantity.value))

function makePath(id: string): string {
	if (props.templatePath) {
		return specializePath(props.templatePath, {
			id
		})
	}

	throw new Error("Intended to make path but does not have template path")
}

function archive(id: string) {
	emit("archive", id)
}

function restore(id: string) {
	emit("restore", id)
}

function canSelect(id: string) {
	return maySelect.value && props.selectedIDs.indexOf(id) === -1
}

function canDeselect(id: string) {
	return maySelect.value && props.selectedIDs.indexOf(id) > -1
}

function select(id: string) {
	emit("update:selectedIDs", [
		...props.selectedIDs,
		id
	])
}

function deselect(id: string) {
	emit("update:selectedIDs", props.selectedIDs.filter(selectedID => selectedID !== id))
}
</script>
