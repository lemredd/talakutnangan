<template>
	<Overlay :is-shown="isShown">
		<template #header>
			<h1>Enter the consultation details</h1>
		</template>
		<template #default>
			<div class="employee p-5">
				<h2>Employee</h2>
				<div class="chip-employee">
					Employee Full Name
					<span class="closebtn" onclick="this.parentElement.style.display='none'">
						&times;
					</span>
				</div>
			</div>
			<div class="members p-5">
				<h2>Members</h2>
				<div class="chip-members">
					Student Name1
					<span class="closebtn" onclick="this.parentElement.style.display='none'">
						&times;
					</span>
				</div>
				<div class="chip-members">
					Student Name2
					<span class="closebtn" onclick="this.parentElement.style.display='none'">
						&times;
					</span>
				</div>
				<div class="chip-members">
					Student Name3
					<span class="closebtn" onclick="this.parentElement.style.display='none'">
						&times;
					</span>
				</div>
				<div class="chip-members">
					Student Name4
					<span class="closebtn" onclick="this.parentElement.style.display='none'">
						&times;
					</span>
				</div>
				<div class="chip-members">
					Student Name5
					<span class="closebtn" onclick="this.parentElement.style.display='none'">
						&times;
					</span>
				</div>
			</div>
			<form>
				<SelectableOptionsField
					v-model="chosenReason"
					label="Kind of Reason: "
					placeholder="Choose your reason"
					:options="reasonOptions"/>
				<NonSensitiveTextField
					v-if="hasChosenOtherReason"
					v-model="otherReason"
					label="What are the other reasons(s)?"
					type="text"/>
			</form>
		</template>
		<template #footer>
			<button
				class="btn btn-back"
				type="button"
				@click="emitClose">
				Back
			</button>
			<button class="btn btn-primary" type="button">
				Submit
			</button>
		</template>
	</Overlay>
</template>

<style lang="scss">
@import "@styles/btn.scss";

.chip-employee, .chip-members {
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

.btn{
  border: none;
  border-radius: 5px;
  color: white;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

</style>

<script setup lang="ts">
import { ref, computed } from "vue"
import Overlay from "@/helpers/overlay.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"


const { isShown } = defineProps<{ isShown: boolean }>()

const reasons = [ "Grade-related", "Task-related", "Exam-related", "Others" ] as const
const reasonOptions = reasons.map(reason => ({ "value": reason }))
const chosenReason = ref<typeof reasons[number]>("Grade-related")
const hasChosenOtherReason = computed<boolean>(() => chosenReason.value === "Others")
const emit = defineEmits([ "close" ])
function emitClose() {
	emit("close")
}
const otherReason = ref<string>("")
// TODO: Use the value below to create the consultation
const unusedReason = computed<string>(() => {
	if (hasChosenOtherReason.value) return otherReason.value
	return chosenReason.value
})
</script>
