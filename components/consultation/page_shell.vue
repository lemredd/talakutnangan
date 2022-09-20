<!--
	General tasks for other members:
	TODO(others): Refactor all WindiCSS inline classes using @apply directive
	TODO(others): Refactor HTML to Vue Components if applicable
	TODO(others): Make use of mixins if applicable
-->
<template>
	<div class="consultations-container">
		<section class="consultations-picker left">
			<div class="consultations-list-header p-3">
				<h2 class="flex-1">
					Consultations
				</h2>
				<!-- TODO(lead/button): apply functionality -->
				<button class="material-icons expand-or-collapse">
					chevron_left
				</button>

				<!-- TODO(lead/button): Apply functionality -->
				<button class="material-icons search">
					search
				</button>
				<button
					v-if="isUserAStudent"
					class="material-icons add"
					@click="toggleAddingSchedule">
					add
				</button>
			</div>

			<ConsultationForm :is-shown="isAddingSchedule" @close="toggleAddingSchedule"/>

			<slot name="list"></slot>
		</section>

		<slot name="chat-window"></slot>
	</div>
</template>

<style scoped lang="scss">
@import "@styles/variables.scss";
@import "@styles/mixins.scss";

.consultations-container, .consultations-list-header {
	@apply flex;
}

.consultation {
	@apply
		p-2
		grid grid-rows-2 grid-cols-[repeat(2,minmax(0,max-content))]
		justify-between
		hover:bg-gray-300
}

.selected-consultation-header {
	@apply
		border-b
		p-3
		grid grid-rows-2 grid-cols-[repeat(2,minmax(0,max-content))]
		justify-between
}

.consultations-container {
	section {
		@include useContentBaseHeight;

		&.left {
			min-width: 100%;
			border-right: 1px solid hsla(0,0%,0%,0.1);
			.material-icons {
				&.expand-or-collapse {
					display: none;
				}
			}
		}
		&.right {
			flex: 1;
			display: none;
		}
	}
}

@media screen and (min-width: $mobileViewportMaximum) {
	.expand-or-collapse {
		display: inline !important;
	}
	.left {
		min-width: 40% !important;
	}
	.right {
		display: flex !important;
	}
}
</style>

<script setup lang="ts">
import { computed, inject, ref, Ref } from "vue"
import type { PageContext } from "$/types/renderer"

import ConsultationForm from "@/consultation/form.vue"

import disableScroll from "$@/helpers/disable_scroll"
import type { DeserializedUserProfile } from "$/types/documents/user"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const rawBodyClasses = inject("bodyClasses") as Ref<string[]>

const { pageProps } = pageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile

const isUserAStudent = computed(() => userProfile.data.kind === "student")

const isAddingSchedule = ref<boolean>(false)

function toggleAddingSchedule() {
	disableScroll(rawBodyClasses)
	isAddingSchedule.value = !isAddingSchedule.value
}

</script>
