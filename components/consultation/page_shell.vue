<!--
	General tasks for other members:
	TODO(others): Refactor all WindiCSS inline classes using @apply directive
	TODO(others): Refactor HTML to Vue Components if applicable
	TODO(others): Make use of mixins if applicable
-->
<template>
	<div class="consultations-container">
		<section class="consultations-picker left relative">
			<div class="consultations-list-header p-3">
				<div v-if="!isSearching" class="no-search-bar flex flex-1">
					<h2 class="flex-1">
						Consultations
					</h2>

					<button
						class="material-icons search"
						@click="toggleSearch">
						search
					</button>
				</div>
				<div
					v-else
					class="is-searching flex flex-1">
					<!-- TODO(lead/button): search existing consultations -->

					<SearchBar v-model="slug" class="flex flex-1"/>
					<button class="material-icons text-xs" @click="toggleSearch">
						close
					</button>
				</div>
			</div>

			<ConsultationForm :is-shown="isAddingSchedule" @close="toggleAddingSchedule"/>

			<slot name="list"></slot>

			<button
				v-if="isUserAStudent"
				class="add"
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

.add {
	@apply material-icons absolute bottom-5 right-5 text-lg rounded-full border border-gray-600 p-3
}

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
		min-width: 20% !important;
	}
	.right {
		display: flex !important;
	}
}
</style>

<script setup lang="ts">
import { computed, inject, ref, Ref } from "vue"
import type { PageContext } from "$/types/renderer"
import type { DeserializedUserProfile } from "$/types/documents/user"

import { BODY_CLASSES } from "$@/constants/provided_keys"

import makeSwitch from "$@/helpers/make_switch"
import BodyCSSClasses from "$@/external/body_css_classes"

import SearchBar from "@/helpers/search_bar.vue"
import ConsultationForm from "@/consultation/form.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const bodyClasses = inject(BODY_CLASSES) as Ref<BodyCSSClasses>

const { pageProps } = pageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile

const isUserAStudent = computed(() => userProfile.data.kind === "student")

const isAddingSchedule = ref<boolean>(false)

const slug = ref("")

const {
	"state": isAddingSchedule,
	"toggle": toggleAddingScheduleState
} = makeSwitch(false)

function toggleAddingSchedule() {
	bodyClasses.value.scroll(isAddingSchedule.value)
	toggleAddingScheduleState()
}

</script>
