<!--
	General tasks for other members:
	TODO(others): Refactor all WindiCSS inline classes using @apply directive
	TODO(others): Refactor HTML to Vue Components if applicable
	TODO(others): Make use of mixins if applicable
-->
<template>
	<div class="consultations-container">
		<section class="consultations-picker left relative">
			<ConsultationForm :is-shown="isAddingSchedule" @close="toggleAddingSchedule"/>

			<slot name="list"></slot>

			<button
				v-if="isUserAStudent"
				class="material-icons add absolute bottom-5 right-5 text-lg rounded-full border border-gray-600 p-3"
				@click="toggleAddingSchedule">
				add
			</button>
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
		hover:bg-gray-300;
}

.selected-consultation-header {
	@apply
		border-b
		p-3
		grid grid-rows-2 grid-cols-[repeat(2,minmax(0,max-content))]
		justify-between;
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
		max-width: calc(1920px / 5);
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

import disableScroll from "$@/helpers/push_element_classes"
import type { DeserializedUserProfile } from "$/types/documents/user"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const rawBodyClasses = inject("bodyClasses") as Ref<string[]>

const { pageProps } = pageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile

const isUserAStudent = computed(() => userProfile.data.kind === "student")

const isAddingSchedule = ref<boolean>(false)

function toggleAddingSchedule() {
	disableScroll(rawBodyClasses, [ "unscrollable" ])
	isAddingSchedule.value = !isAddingSchedule.value
}

</script>
