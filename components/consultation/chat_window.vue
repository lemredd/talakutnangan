<template>
	<section ref="chatWindow" class="chat-window right">
		<button
			class="toggle-list-btn material-icons"
			title="Toggle consultation list"
			@click="toggleConsultationList">
			{{ `chevron_${isConsultationListShown ? "left" : "right"}` }}
		</button>
		<!-- TODO(others/mobile): should view once consultation is clicked in picker (by route) -->

		<div class="selected-consultation-header dark:bg-true-gray-800">
			<div class="text">
				<div class="selected-consultation-title">
					{{ consultation.reason }}
				</div>
				<div class="selected-consultation-remaining-time">
					Time remaining:
					<span>{{ remainingTime.minutes }}m</span>
					<span v-if="remainingTime.seconds > 0">{{ remainingTime.seconds }}s</span>
				</div>
				<div class="selected-consultation-user-status">
					<!-- TODO(lead): must base on user active status -->
					User is online
				</div>
			</div>
			<div class="controls">
				<!-- TODO(lead/button): Apply functionality -->
				<button class="material-icons">
					video_camera_back
				</button>
				<Dropdown
					:is-dropdown-shown="isHeaderControlDropdownShown"
					class="additional-controls"
					@toggle="toggleHeaderControlDropdownShown">
					<template #toggler>
						<button class="material-icons toggle-controls-btn">
							more_horiz
						</button>
					</template>

					<template #dropdown-contents>
						<!-- TODO: make absolute -->

						<div class="links">
							<a href="#">View consultation form</a>
							<a
								v-if="isCurrentUserConsultant"
								href="#"
								class="view-action-taken-overlay-btn"
								@click="showActionTakenOverlay">Finish consultation</a>
						</div>
					</template>
				</Dropdown>

				<Overlay
					:is-shown="isActionTakenOverlayShown && isCurrentUserConsultant"
					class="action-taken"
					@close="hideActionTakenOverlay">
					<template #header>
						Mark this consultation as finished?
					</template>

					<template #default>
						<p>If so, please provide the action taken to solve the consulter/s concern.</p>
						<NonSensitiveTextField
							v-model="actionTaken"
							class="action-taken-field"
							type="text"/>
					</template>

					<template #footer>
						<button
							class="finish-btn btn btn-primary"
							@click="finishConsultation">
							submit
						</button>
					</template>
				</Overlay>
			</div>
		</div>
		<div class="selected-consultation-chats">
			<div class="selected-consultation-new flex flex-col align-center justify-center">
				<p class="text-center">
					<strong>This is a new consultation.</strong>
					here are some additional details
				</p>
				<ul class="selected-consultation-additional-details my-5 w-[max-content] mx-auto">
					<li>Ticket: {{ consultationID }}</li>
					<li>Status: {{ consultationStatus }}</li>

					<!-- TODO(lead/button): Apply functionality -->
					<li><a class="underline" href="#">View printable form (PDF)</a></li>
				</ul>
			</div>

			<div
				v-for="message in props.chatMessages.data"
				:key="message.id"
				class="chat-entry">
				<ChatMessageItem :chat-message="message"/>
			</div>
		</div>
		<UserController
			:consultation="consultation"
			@start-consultation="startConsultation"
			@save-as-pdf="saveAsPDF"/>
	</section>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";
@import "@styles/mixins.scss";

	.right {
		@apply flex flex-col;
		@apply flex-1;
		border-right: 1px solid hsla(0,0%,0%,0.1);
		position: relative;

		// TODO: find a way to make mixin `useContentBaseHeight` work
		height: calc(100vh - 56px);

		.toggle-list-btn {
			@apply fixed opacity-15 hover:opacity-100;
			@apply bg-gray-500 text-light-300 dark:bg-light-300 dark:text-dark-300;
			z-index: 1001;
		}

		.selected-consultation-header {
			@apply flex py-4 px-2;
			.text {
				@apply flex-1;
				.selected-consultation-user-status { @apply row-start-2; }
			}
			.controls {
				@apply flex items-center;

				.additional-controls {
					display: inline;
					height: min-content;
				}
			}
		}

		.selected-consultation-chats {
			@apply px-3 py-5 flex-1 overflow-y-scroll;

			ul.selected-consultation-additional-details {
				@apply bg-true-gray-600 border border-true-gray-600 rounded-md p-5;
				@apply dark:bg-transparent;
			}
		}
	}
</style>

<script setup lang="ts">
import convertHTMLToPDF from "html2pdf.js"
import { ref, computed, watch, onMounted, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { FullTime } from "$@/types/independent"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"
import type {
	ConsultationAttributes,
	DeserializedConsultationResource
} from "$/types/documents/consultation"

import makeSwitch from "$@/helpers/make_switch"
import ConsultationFetcher from "$@/fetchers/consultation"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"
import convertMStoTimeObject from "$@/helpers/convert_milliseconds_to_full_time_object"

import Overlay from "@/helpers/overlay.vue"
import Dropdown from "@/page_shell/dropdown.vue"
import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"
import UserController from "@/consultation/chat_window/user_controller.vue"
import ChatMessageItem from "@/consultation/chat_window/chat_message_item.vue"

interface CustomEvents {
	(eventName: "updatedConsultationAttributes", data: ConsultationAttributes<"deserialized">): void
	(eventName: "toggleConsultationList"): void
}

const emit = defineEmits<CustomEvents>()
const props = defineProps<{
	consultation: DeserializedConsultationResource<"consultant"|"consultantRole">
	chatMessages: DeserializedChatMessageListDocument<"user">
	isConsultationListShown: boolean
}>()

const {
	"pageProps": {
		"userProfile": {
			"data": {
				kind
			}
		}
	}
} = inject("pageContext") as PageContext<"deserialized">
const isCurrentUserConsultant = computed(() => kind === "reachable_employee")

const chatWindow = ref<HTMLElement|null>(null)
function toggleConsultationList() {
	emit("toggleConsultationList")
}

const {
	"toggle": toggleHeaderControlDropdownShown,
	"state": isHeaderControlDropdownShown
} = makeSwitch(false)

const remainingMilliseconds = ref<number>(0)
const remainingTime = computed<FullTime>(
	() => convertMStoTimeObject(remainingMilliseconds.value)
)
const consultation = computed<DeserializedConsultationResource<"consultant"|"consultantRole">>(
	() => props.consultation
)
const consultationID = computed<string>(() => consultation.value.id)
const consultationStatus = computed<string>(() => consultation.value.status)

function restartRemainingTime(): void {
	remainingMilliseconds.value = ConsultationTimerManager.MAX_EXPIRATION_TIME
}

function changeTime(
	unusedResource: DeserializedConsultationResource,
	remainingMillisecondduration: number
): void {
	remainingMilliseconds.value = remainingMillisecondduration
}

const {
	"on": showActionTakenOverlay,
	"off": hideActionTakenOverlay,
	"state": isActionTakenOverlayShown
} = makeSwitch(false)
const actionTaken = ref("")

function finishConsultation(): void {
	const { startedAt } = consultation.value

	if (startedAt instanceof Date) {
		const finalActionTaken = actionTaken.value ? actionTaken.value : null
		const newConsultationData: ConsultationAttributes<"serialized"> = {
			"actionTaken": finalActionTaken,
			"deletedAt": consultation.value.deletedAt?.toISOString() ?? null,
			"finishedAt": new Date().toISOString(),
			"reason": consultation.value.reason,
			"scheduledStartAt": consultation.value.scheduledStartAt.toISOString(),
			"startedAt": startedAt.toISOString()
		}

		const deserializedConsultationData: ConsultationAttributes<"deserialized"> = {
			"actionTaken": finalActionTaken,
			"deletedAt": consultation.value.deletedAt ?? null,
			"finishedAt": new Date(newConsultationData.finishedAt as string),
			"reason": consultation.value.reason,
			"scheduledStartAt": consultation.value.scheduledStartAt,
			startedAt
		}

		const expectedDeserializedConsultationResource: DeserializedConsultationResource<
			"consultant"|"consultantRole"
		> = {
			...consultation.value,
			...deserializedConsultationData
		}

		ConsultationTimerManager.unlistenConsultationTimeEvent(
			expectedDeserializedConsultationResource,
			"finish",
			finishConsultation
		)

		new ConsultationFetcher().update(
			consultationID.value,
			newConsultationData,
			{
				"extraDataFields": {
					"relationships": {
						"consultant": {
							"data": {
								"id": consultation.value.consultant.data.id,
								"type": "user"
							}
						}
					}
				},
				"extraUpdateDocumentProps": {
					"meta": {
						"doesAllowConflicts": true
					}
				}
			}
		)
		.then(() => {
			remainingMilliseconds.value = 0
			emit("updatedConsultationAttributes", deserializedConsultationData)
		})
	}
}

function registerListeners(resource: DeserializedConsultationResource): void {
	ConsultationTimerManager.listenConsultationTimeEvent(resource, "finish", finishConsultation)
	ConsultationTimerManager.listenConsultationTimeEvent(
		resource,
		"restartTime",
		restartRemainingTime
	)
	ConsultationTimerManager.listenConsultationTimeEvent(resource, "consumedTime", changeTime)
}

function startConsultation() {
	const newConsultationData: ConsultationAttributes<"serialized"> = {
		"actionTaken": null,
		"deletedAt": consultation.value.deletedAt?.toISOString() ?? null,
		"finishedAt": null,
		"reason": consultation.value.reason,
		"scheduledStartAt": consultation.value.scheduledStartAt.toISOString(),
		"startedAt": new Date().toISOString()
	}

	new ConsultationFetcher().update(
		consultationID.value,
		newConsultationData,
		{
			"extraDataFields": {
				"relationships": {
					"consultant": {
						"data": {
							"id": consultation.value.consultant.data.id,
							"type": "user"
						}
					}
				}
			},
			"extraUpdateDocumentProps": {
				"meta": {
					"doesAllowConflicts": true
				}
			}
		}
	).then(() => {
		const deserializedConsultationData: ConsultationAttributes<"deserialized"> = {
			"actionTaken": consultation.value.actionTaken,
			"deletedAt": consultation.value.deletedAt ?? null,
			"finishedAt": consultation.value.finishedAt,
			"reason": consultation.value.reason,
			"scheduledStartAt": consultation.value.scheduledStartAt,
			"startedAt": new Date(newConsultationData.startedAt as string)
		}

		const expectedDeserializedConsultationResource: DeserializedConsultationResource<
			"consultant"|"consultantRole"
		> = {
			...consultation.value,
			...deserializedConsultationData
		}

		registerListeners(expectedDeserializedConsultationResource)

		remainingMilliseconds.value = ConsultationTimerManager.MAX_EXPIRATION_TIME
		emit("updatedConsultationAttributes", deserializedConsultationData)
	})
}

const startWatcher = watch(consultation, (newConsultation, oldConsultation) => {
	if (oldConsultation.startedAt === null && newConsultation.startedAt instanceof Date) {
		registerListeners(newConsultation)

		const finishWatcher = watch(consultation, (
			newFinishedConsultation,
			oldUnfinishedConsultation
		) => {
			if (
				oldUnfinishedConsultation.finishedAt === null
				&& newFinishedConsultation.finishedAt instanceof Date
			) {
				ConsultationTimerManager.forceFinish(newFinishedConsultation)
				ConsultationTimerManager.unlistenConsultationTimeEvent(
					newFinishedConsultation,
					"finish",
					finishConsultation
				)
				finishWatcher()
			}
		})

		startWatcher()
	}
}, { "deep": true })

function saveAsPDF(): void {
	const element = chatWindow.value


}

onMounted(() => {
	if (props.consultation.startedAt instanceof Date && props.consultation.finishedAt === null) {
		registerListeners(props.consultation)
		ConsultationTimerManager.restartTimerFor(props.consultation)
	}
})
</script>
