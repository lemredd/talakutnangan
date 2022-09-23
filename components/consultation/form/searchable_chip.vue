<template>
	<div class="field p-5">
		<h2>{{ header }}</h2>
		<div
			v-for="consultant in selectedParticipants"
			:key="consultant.id"
			class="chip">
			{{ consultant.name }}
			<span class="closebtn" @click="removeParticipant">
				&times;
			</span>
		</div>
		<NonSensitiveTextField
			v-if="mayAddOtherParticipants"
			v-model="slug"
			label="Type the employee to add"
			type="text"/>
	</div>
</template>

<style lang="scss">
.chip {
  display: inline-block;
  padding: 0 15px;
  margin:5px;
  height: 30px;
  font-size: 18px;
  color: black;
  line-height: 30px;
  border-radius: 25px;
  background-color:#f1f1f1;
}

.closebtn {
  padding-left: 10px;
  color: #888;
  font-weight: bold;
  float: right;
  font-size: 20px;
  cursor: pointer;
}

.closebtn:hover {
  color: #000;
}
</style>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"

import type { UserKind } from "$/types/database"
import type { DeserializedUserResource } from "$/types/documents/user"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"
import Fetcher from "$@/fetchers/user"
import debounce from "$@/helpers/debounce"

const props = defineProps<{
	header: string,
	modelValue: DeserializedUserResource[],
	maximumParticipants: number,
	kind: UserKind
}>()

interface CustomEvents {
	(eventName: "update:modelValue", resource: DeserializedUserResource[]): void
}
const emit = defineEmits<CustomEvents>()

const otherParticipants = ref<DeserializedUserResource[]>([])
const slug = ref<string>("")
const selectedParticipants = computed<DeserializedUserResource[]>({
	get(): DeserializedUserResource[] {
		return props.modelValue
	},
	set(newValue: DeserializedUserResource[]): void {
		emit("update:modelValue", newValue)
	}
})
const mayAddOtherParticipants = computed<boolean>(
	() => props.modelValue.length < props.maximumParticipants
)

let rawFetcher: Fetcher|null = null

function fetcher(): Fetcher {
	if (rawFetcher === null) throw new Error("User cannot be processed yet")

	return rawFetcher
}

function findMatchedUsers() {
	fetcher().list({
		"filter": {
			"department": "*",
			"existence": "exists",
			"kind": props.kind,
			"role": "*",
			"slug": slug.value
		},
		"page": {
			"limit": 10,
			"offset": 0
		},
		"sort": [ "name" ]
	})
}

watch(slug, debounce(findMatchedUsers, DEBOUNCED_WAIT_DURATION))

function removeParticipant(event: Event): void {
	const { target } = event
	const castTarget = target as HTMLButtonElement
	const text = castTarget.innerHTML

	selectedParticipants.value = selectedParticipants.value.filter(user => {
		const foundNameIndex = text.indexOf(user.data.name)
		return foundNameIndex === -1
	})
}

onMounted(() => {
	rawFetcher = new Fetcher()
})
</script>
