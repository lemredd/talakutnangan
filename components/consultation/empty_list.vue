<template>
	<div class="consultations-list left">
		<ConsultationForm :is-shown="isAddingSchedule" @close="toggleAddingSchedule"/>

		<div class="no-consultations">
			<img class="sad-icon" :src="SadIcon"/>
			<h2>There are no consultations yet...</h2>
			<button
				v-if="isUserAStudent"
				class="add-btn btn btn-primary"
				@click="toggleAddingSchedule">
				create a new consultation
			</button>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";

	.consultations-list {
		@apply flex flex-col items-center justify-center;
	}

	.left {
		@apply dark:bg-dark-700 bg-white;
		position: fixed;
		overflow-y: scroll;
		left: 0; right: 0;

		// TODO: find a way to make mixin `useContentBaseHeight` work
		height: calc(100vh - 56px);

		@screen md {
			position: relative;
			width: 40vw;
			max-width: 360px;
			@apply flex flex-col;
		}

		.consultations-list-header {
			@apply p-3;

			.no-search-bar {
				@apply flex flex-1;

				h2 { @apply flex-1 uppercase; }
			}

			.is-searching {
				@apply flex flex-1;

				.list-search-bar { @apply flex flex-1; }
			}
		}

		.no-consultations {
			@apply mx-auto max-w-max;
		}

		.sad-icon{
			@apply mx-auto;
		}

		.add-btn {
			@apply mt-4;
		}
	}
</style>

<script setup lang="ts">
import { inject, ref, Ref, computed } from "vue"

import type { PageContext } from "$/types/renderer"

import { BODY_CLASSES } from "$@/constants/provided_keys"

import BodyCSSClasses from "$@/external/body_css_classes"

import ConsultationForm from "@/consultation/form.vue"

import SadIcon from "@assets/sadicon.png"

const pageContext = inject("pageContext") as PageContext<"deserialized">

const isAddingSchedule = ref<boolean>(false)
const rawBodyClasses = inject(BODY_CLASSES) as Ref<BodyCSSClasses>
function toggleAddingSchedule() {
	rawBodyClasses.value.scroll(isAddingSchedule.value)
	isAddingSchedule.value = !isAddingSchedule.value
}

const { "pageProps": { userProfile } } = pageContext
const isUserAStudent = computed(() => userProfile?.data?.kind === "student")
</script>
