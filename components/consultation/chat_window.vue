<template>
	<section ref="chatWindow" class="chat-window right">
		<button
			class="toggle-list-btn material-icons"
			title="Toggle consultation list"
			@click="toggleConsultationList">
			{{ `chevron_${isConsultationListShown ? "left" : "right"}` }}
		</button>

		<ConsultationHeader
			v-model="actionTaken"
			:consultation="consultation"
			:chat-messages="chatMessages"
			:remaining-time="remainingTime"
			:received-errors="receivedErrors"
			@finish-consultation="finishConsultation"/>
		<div class="selected-consultation-chats">
			<div class="selected-consultation-new">
				<p class="consultation-details">
					<strong>This is a new consultation.</strong>
					here are some additional details
				</p>
				<ul class="selected-consultation-additional-details">
					<li>Ticket: {{ consultationID }}</li>
					<li>Status: {{ consultationStatus }}</li>

					<li>
						<a
							class="underline"
							href="#"
							@click.prevent="saveAsPDF">
							View printable form (PDF)
						</a>
					</li>
				</ul>
			</div>

			<button
				class="load-previous-messages-btn btn btn-secondary"
				@click="loadPreviousMessages">
				Load Previous messages
			</button>
			<div
				v-for="(message, i) in sortedMessagesByTime"
				:key="message.id"
				class="chat-entry">
				<ChatMessageItem :chat-message="message" :next-message="sortedMessagesByTime[i+1]"/>
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
			z-index: 500;
		}

		.links{
			@apply flex flex-col;
		}

		.selected-consultation-chats {
			@apply px-3 py-5 flex-1 overflow-y-scroll;

			.selected-consultation-new{
				@apply flex flex-col items-center justify-center;
			}

			.consultation-details{
				@apply text-center;
			}

			ul.selected-consultation-additional-details {
				@apply bg-true-gray-600 border border-true-gray-600 rounded-md p-5;
				@apply dark:bg-transparent;
				@apply my-5 w-max mx-auto;
			}
		}
	}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"

import type { FullTime } from "$@/types/independent"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"
import type {
	ConsultationAttributes,
	DeserializedConsultationResource
} from "$/types/documents/consultation"

import { CONSULTATION_FORM_PRINT } from "$/constants/template_page_paths"

import assignPath from "$@/external/assign_path"
import specializePath from "$/helpers/specialize_path"
import ConsultationFetcher from "$@/fetchers/consultation"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import watchConsultation from "@/consultation/listeners/watch_consultation"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"
import convertMStoTimeObject from "$@/helpers/convert_milliseconds_to_full_time_object"

import UserController from "@/consultation/chat_window/user_controller.vue"
import ChatMessageItem from "@/consultation/chat_window/chat_message_item.vue"
import ConsultationHeader from "@/consultation/chat_window/consultation_header.vue"

const fetcher = new ConsultationFetcher()

interface CustomEvents {
	(eventName: "updatedConsultationAttributes", data: ConsultationAttributes<"deserialized">): void
	(eventName: "toggleConsultationList"): void
	(eventName: "loadPreviousMessages"): void
}

const emit = defineEmits<CustomEvents>()
const props = defineProps<{
	consultation: DeserializedConsultationResource<"consultant"|"consultantRole">
	chatMessages: DeserializedChatMessageListDocument<"user">
	isConsultationListShown: boolean
}>()

const sortedMessagesByTime = computed(() => {
	const { "chatMessages": { "data": rawData } } = props
	return [ ...rawData ].sort((left, right) => {
		const leftSeconds = left.createdAt.valueOf()
		const rightSeconds = right.createdAt.valueOf()

		return Math.sign(leftSeconds - rightSeconds)
	})
})
function loadPreviousMessages() {
	emit("loadPreviousMessages")
}

const chatWindow = ref<HTMLElement|null>(null)
function toggleConsultationList() {
	emit("toggleConsultationList")
}

const consultation = computed<DeserializedConsultationResource<"consultant"|"consultantRole">>(
	() => props.consultation
)
const consultationID = computed<string>(() => consultation.value.id)
const consultationStatus = computed<string>(() => consultation.value.status)

const remainingMilliseconds = ref<number>(0)
const remainingTime = computed<FullTime>(() => convertMStoTimeObject(remainingMilliseconds.value))

function restartRemainingTime(): void {
	remainingMilliseconds.value = ConsultationTimerManager.MAX_EXPIRATION_TIME
}

function changeTime(
	unusedResource: DeserializedConsultationResource,
	remainingMillisecondduration: number
): void {
	remainingMilliseconds.value = remainingMillisecondduration
}

const receivedErrors = ref<string[]>([])

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

		fetcher.update(
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
		.catch(response => extractAllErrorDetails(response, receivedErrors))
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

	fetcher.update(
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

watchConsultation(consultation, registerListeners)

function saveAsPDF(): void {
	assignPath(specializePath(CONSULTATION_FORM_PRINT, {
		"id": consultationID.value
	}))
}

onMounted(() => {
	if (props.consultation.startedAt instanceof Date && props.consultation.finishedAt === null) {
		registerListeners(props.consultation)
		ConsultationTimerManager.restartTimerFor(props.consultation)
	}
})
</script>
