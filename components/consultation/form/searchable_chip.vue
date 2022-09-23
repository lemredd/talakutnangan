<template>
	<div class="field p-5">
		<h2>{{ header }}</h2>
		<div
			v-for="consultant in selectedConsultants"
			:key="consultant.id"
			class="chip">
			{{ consultant.name }}
			<span class="closebtn" @click="removeConsultant">
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
import { computed } from "vue"
import type { DeserializedUserResource } from "$/types/documents/user"

const props = defineProps<{
	header: string,
	selectedPartipants: DeserializedUserResource[],
	otherPartipants: DeserializedUserResource[],
	maximumParticipants: number,
	modelValue: string
}>()

const mayAddOtherParticipants = computed<boolean>(
	() => props.selectedPartipants.length < props.maximumParticipants
)

interface CustomEvents {
	(eventName: "update:modelValue", string: string): void
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
</script>
