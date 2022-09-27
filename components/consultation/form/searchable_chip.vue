<template>
	<div class="field p-5">
		<h2>{{ header }}</h2>
		<div
			v-for="participant in selectedParticipants"
			:key="participant.id"
			class="chip">
			<span>
				{{ participant.name }}
			</span>
			<span class="material-icons closebtn" @click="removeParticipant">
				close
			</span>
		</div>
		<NonSensitiveTextField
			v-if="mayAddOtherParticipants"
			v-model="slug"
			:label="textFieldLabel"
			type="text"/>
		<div
			v-for="participant in otherParticipants"
			:key="participant.id"
			class="chip">
			<span>
				{{ participant.name }}
			</span>
			<span class="material-icons closebtn" @click="addParticipant">
				check
			</span>
		</div>
	</div>
</template>

<style lang="scss">
@import "@styles/btn.scss";

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

import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"

const props = defineProps<{
	header: string,
	modelValue: DeserializedUserResource[],
	maximumParticipants: number,
	textFieldLabel: string,
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
	}).then(({ body }) => {
		otherParticipants.value = body.data.filter(candidate => {
			const isNotSelected = selectedParticipants.value.findIndex(selectedParticipant => {
				const doesMatchSelectedParticipant = candidate.id === selectedParticipant.id
				return doesMatchSelectedParticipant
			}) === -1

			return isNotSelected
		})
	})
}

watch(slug, debounce(findMatchedUsers, DEBOUNCED_WAIT_DURATION))

function removeParticipant(event: Event): void {
	const { target } = event
	const castTarget = target as HTMLSpanElement
	const button = castTarget.previousElementSibling as HTMLButtonElement
	const text = button.innerHTML

	selectedParticipants.value = selectedParticipants.value.filter(user => {
		const foundNameIndex = text.indexOf(user.name)
		return foundNameIndex === -1
	})
}

function addParticipant(event: Event): void {
	const { target } = event
	const castTarget = target as HTMLSpanElement
	const button = castTarget.previousElementSibling as HTMLButtonElement
	const text = button.innerHTML

	const foundParticipant = otherParticipants.value.find(user => {
		const foundNameIndex = text.indexOf(user.name)
		console.log(user, text)
		return foundNameIndex > -1
	})

	if (foundParticipant) {
		selectedParticipants.value.push(foundParticipant)
	}

	otherParticipants.value = []
}
Fetcher.initialize("/api")
onMounted(() => {
	rawFetcher = new Fetcher()
})
</script>
