<template>
	<div class="consultations-list left">
		<!-- TODO(others): use grid if applicable -->
		<div class="consultations-list-header">
			<h2>
				Consultations
			</h2>
			<button
				v-if="isUserAStudent"
				class="add-btn btn btn-primary"
				@click="toggleAddingSchedule">
				<span class="material-icons">
					create
				</span>
			</button>

			<MinorDropdown v-if="isUserAReachableEmployee" v-model="isDropdownShown">
				<template #dropdown-contents>
					<a class="link-to-reports" :href="CONSULTATION_REPORT_PER_STUDENT">
						View summary per student
					</a>
					<a class="link-to-reports" :href="CONSULTATION_WEEKLY_REPORT">
						View summary per week
					</a>
					<a class="link-to-reports" :href="CONSOLIDATED_CONSULTATION_REPORT">
						View overall summary
					</a>
				</template>
			</MinorDropdown>
		</div>

		<ConsultationForm :is-shown="isAddingSchedule" @close="toggleAddingSchedule"/>

		<Item
			v-for="consultation in consultations.data"
			:key="consultation.id"
			:consultation="consultation"
			:chat-message-activities="chatMessageActivities"
			:preview-messages="previewMessages"/>
	</div>
</template>

<style scoped lang="scss">
	@import "@styles/mixins.scss";
	@import "@styles/btn.scss";


	.left {
		@apply dark:bg-dark-700 bg-white;
		position: fixed;
		overflow-y: scroll;
		left: 0; right: 0;
		z-index: 500;

		// TODO: find a way to make mixin `useContentBaseHeight` work
		height: calc(100vh - 56px);

		@screen md {
			position: relative;
			width: 40vw;
			max-width: 360px;
			@apply flex flex-col;
		}

		.consultations-list-header {
			@apply p-3 flex flex-row justify-center items-center;

			h2 { @apply flex-1 uppercase; }

			.link-to-reports {
				@apply flex-1 max-h-[4rem] p-4;
			}

			.is-searching {
				@apply flex flex-1;

				.list-search-bar { @apply flex flex-1; }
			}
		}

		.add-btn {
			@apply p-2;
			@apply flex items-center;
		}
	}
</style>

<script setup lang="ts">
import { computed, inject, Ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"
import type {
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"
import type {
	ConsultationRelationshipNames,
	DeserializedConsultationListDocument
} from "$/types/documents/consultation"

import { BODY_CLASSES } from "$@/constants/provided_keys"
import {
	CONSULTATION_REPORT_PER_STUDENT,
	CONSULTATION_WEEKLY_REPORT,
	CONSOLIDATED_CONSULTATION_REPORT
} from "$/constants/template_page_paths"

import makeSwitch from "$@/helpers/make_switch"
import BodyCSSClasses from "$@/external/body_css_classes"

import Item from "@/consultation/list/item.vue"
import ConsultationForm from "@/consultation/form.vue"
import MinorDropdown from "@/helpers/minor_dropdown.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">

const {
	"state": isDropdownShown
} = makeSwitch(false)

const {
	"toggle": toggleAddingScheduleState,
	"state": isAddingSchedule
} = makeSwitch(false)
const rawBodyClasses = inject(BODY_CLASSES) as Ref<BodyCSSClasses>
function toggleAddingSchedule() {
	rawBodyClasses.value.scroll(isAddingSchedule.value)
	toggleAddingScheduleState()
}

const { "pageProps": { userProfile } } = pageContext
const isUserAStudent = computed(() => userProfile.data.kind === "student")
const isUserAReachableEmployee = computed(() => userProfile.data.kind === "reachable_employee")

defineProps<{
	chatMessageActivities: DeserializedChatMessageActivityListDocument<"user"|"consultation">,
	consultations: DeserializedConsultationListDocument<ConsultationRelationshipNames>,
	previewMessages: DeserializedChatMessageListDocument<"user"|"consultation">
}>()
</script>
