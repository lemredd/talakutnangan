import type { Pipe } from "$/types/database"
import type { Serializable } from "$/types/general"
import type { WeeklySummedTimeDocument } from "$/types/documents/consolidated_time"
import type { DeserializedUserListWithTimeConsumedDocument } from "$/types/documents/user"
import type { ConsultationQueryParameters, TimeSumQueryParameters } from "$/types/query"
import type {
	ConsultationResource,
	ConsultationAttributes,
	DeserializedConsultationListDocument
} from "$/types/documents/consultation"
import type {
	ModelCtor,
	FindOptions,
	IncludeOptions,
	Model as BaseModel,
	CreationAttributes,
	FindAndCountOptions
} from "%/types/dependent"

import User from "%/models/user"
import Role from "%/models/role"
import Log from "$!/singletons/log"
import Model from "%/models/consultation"
import BaseManager from "%/managers/base"
import Condition from "%/helpers/condition"
import deserialize from "$/object/deserialize"
import ChatMessage from "%/models/chat_message"
import AttachedRole from "%/models/attached_role"
import Transformer from "%/transformers/consultation"
import resetToMidnight from "$/time/reset_to_midnight"
import ChatMessageActivity from "%/models/chat_message_activity"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import calculateMillisecondDifference from "$/time/calculate_millisecond_difference"
import adjustBeforeMidnightOfNextDay from "$/time/adjust_before_midnight_of_next_day"

import sort from "%/queries/base/sort"
import siftByUser from "%/queries/consultation/sift_by_user"
import siftByRange from "%/queries/consultation/sift_by_range"
import includeDefaults from "%/queries/consultation/include_defaults"

export default class extends BaseManager<
	Model,
	ConsultationAttributes<"deserialized">,
	ConsultationQueryParameters<number>
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get singleReadPipeline()
	: Pipe<FindAndCountOptions<Model>, ConsultationQueryParameters<number>>[] {
		return [
			includeDefaults,
			...super.singleReadPipeline
		]
	}

	get listPipeline(): Pipe<FindAndCountOptions<Model>, ConsultationQueryParameters<number>>[] {
		return [
			siftByUser,
			siftByRange,
			includeDefaults,
			...super.listPipeline
		]
	}

	get exposableColumns(): string[] {
		const excludedColumns = [ "attachedRoleID" ]
		return super.exposableColumns.filter(columnName => {
			const isIncluded = !excludedColumns.includes(columnName)
			return isIncluded
		})
	}

	get modelChainToUser(): readonly ModelCtor<BaseModel>[] {
		return [
			ChatMessageActivity,
			User
		]
	}

	async createUsingResource(
		details: ConsultationResource<"create">,
		requesterID: number,
		transformerOptions: void = {} as unknown as void
	): Promise<Serializable> {
		try {
			const { attributes, relationships } = details

			const {
				"consultant": {
					"data": {
						"id": consultantID
					}
				},
				"consultantRole": {
					"data": {
						"id": consultantRoleID
					}
				},
				"participants": {
					"data": rawParticipants
				}
			} = relationships

			const attachedRole = await AttachedRole.findOne({
				"include": [
					{
						"model": User,
						"required": true
					},
					{
						"model": Role,
						"required": true
					}
				],
				"where": new Condition().and(
					new Condition().equal("userID", consultantID),
					new Condition().equal("roleID", consultantRoleID)
				).build(),
				...this.transaction.transactionObject
			}) as AttachedRole

			const { scheduledStartAt, ...otherAttributes } = attributes
			const model = await this.model.create(
				{
					...otherAttributes,
					"attachedRoleID": attachedRole.id,
					"scheduledStartAt": new Date(scheduledStartAt)
				},
				this.transaction.transactionObject
			)

			model.consultantInfo = attachedRole

			const rawChatMessageActivities = rawParticipants.map(participant => {
				const userID = Number(participant.id)
				const rawChatMessageActivityAttributes: CreationAttributes<ChatMessageActivity> = {
					"consultationID": Number(model.id),
					"receivedMessageAt": null,
					"seenMessageAt": null,
					userID
				}

				return rawChatMessageActivityAttributes
			})

			const chatMessageActivities = await ChatMessageActivity.bulkCreate(
				rawChatMessageActivities,
				this.transaction.transactionObject
			)

			model.chatMessageActivities = chatMessageActivities

			const chatMessageActivityOfRequester = chatMessageActivities.find(
				activity => Number(activity.userID) === Number(requesterID)
			) as ChatMessageActivity

			const initialChatMessage = await ChatMessage.create({
				"chatMessageActivityID": chatMessageActivityOfRequester.id,
				"data": {
					"value": "has prepared the consultation."
				},
				"kind": "status"
			}, this.transaction.transactionObject)

			chatMessageActivityOfRequester.chatMessages = [
				initialChatMessage
			]

			Log.success("manager", "done creating a model")

			return await this.serialize(model, transformerOptions, new Transformer({
				"included": [
					"consultant",
					"consultantRole",
					"chatMessageActivities",
					"chatMessages"
				]
			}))
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async canStart(consultationID: number): Promise<boolean> {
		try {
			const model = await this.model.findByPk(consultationID, {
				"include": [
					{
						"include": [
							{
								"model": User,
								"required": true
							}
						],
						"model": AttachedRole,
						"required": true
					}
				],
				...this.transaction.transactionObject
			})

			const activeConsultations = await this.model.findAll({
				"include": [
					{
						"include": [
							{
								"model": User,
								"required": true,
								"where": new Condition().equal("id", model?.consultant?.id).build()
							}
						],
						"model": AttachedRole,
						"required": true
					}
				],
				"where": new Condition().and(
					new Condition().not("startedAt", null),
					new Condition().is("finishedAt", null)
				).build()
			})

			let canStart = activeConsultations.length === 0

			if (!canStart) {
				canStart = activeConsultations.length === 1
					&& activeConsultations[0].id === consultationID
			}

			return canStart
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async sumTimePerStudents(query: TimeSumQueryParameters<number>)
	: Promise<DeserializedUserListWithTimeConsumedDocument> {
		try {
			const models = await ChatMessageActivity.findAll({
				"include": [
					sort({
						"model": User,
						"required": true
					} as FindOptions<any>, query) as IncludeOptions,
					{
						"include": [
							{
								"model": AttachedRole,
								"paranoid": false,
								"required": true,
								"where": new Condition().equal("userID", query.filter.user).build()
							}
						],
						"model": Model,
						"paranoid": false,
						"required": true,
						"where": new Condition().and(
							new Condition().not("startedAt", null),
							new Condition().not("finishedAt", null),
							new Condition().greaterThanOrEqual(
								"startedAt",
								query.filter.dateTimeRange.begin
							),
							new Condition().lessThanOrEqual(
								"finishedAt",
								query.filter.dateTimeRange.end
							)
						).build()
					}
				],
				"paranoid": false,
				"where": new Condition().notEqual("userID", query.filter.user).build(),
				...this.transaction.transactionObject
			})

			return {
				"data": await models.map(model => {
					const user = model.user as User
					const consultation = model.consultation as Model

					const millisecond = calculateMillisecondDifference(
						consultation.finishedAt as Date,
						consultation.startedAt as Date
					)

					return {
						"id": String(user.id),
						"meta": {
							"consultations": [
								consultation
							],
							"totalMillisecondsConsumed": millisecond
						},
						"type": "user"
					}
				}).reduce(async(previousSums, currentSum: any) => {
					const waitedPreviousSums = await previousSums
					const previousSum = waitedPreviousSums.find(sum => sum.id === currentSum.id)
					currentSum.meta.consultations = deserialize(
						await this.serialize(currentSum.meta.consultations)
					)

					if (previousSum) {
						previousSum.meta.totalMillisecondsConsumed += currentSum
						.meta
						.totalMillisecondsConsumed

						const consultations = previousSum.meta.consultations.data
						consultations.push(currentSum.meta.consultations.data[0])

						return waitedPreviousSums
					}

					return [
						...waitedPreviousSums,
						currentSum
					]
				}, Promise.resolve([]) as Promise<DeserializedUserListWithTimeConsumedDocument["data"]>)
			}
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async sumTimePerWeek(query: TimeSumQueryParameters<number>)
	: Promise<WeeklySummedTimeDocument> {
		try {
			const adjustedBeginDate = resetToMidnight(
				adjustUntilChosenDay(query.filter.dateTimeRange.begin, 0, -1)
			)
			const adjustedEndDate = adjustBeforeMidnightOfNextDay(
				adjustUntilChosenDay(query.filter.dateTimeRange.end, 6, 1)
			)
			const models = await ChatMessageActivity.findAll({
				"include": [
					{
						"model": User,
						"required": true,
						"where": new Condition().equal("id", query.filter.user).build()
					},
					sort({
						"model": Model,
						"paranoid": false,
						"required": true,
						"where": new Condition().and(
							new Condition().not("startedAt", null),
							new Condition().not("finishedAt", null),
							new Condition().greaterThanOrEqual(
								"startedAt",
								query.filter.dateTimeRange.begin
							),
							new Condition().lessThanOrEqual(
								"finishedAt",
								query.filter.dateTimeRange.end
							)
						).build()
					} as FindOptions<any>, query) as IncludeOptions
				],
				"paranoid": false,
				...this.transaction.transactionObject
			})

			const sums: WeeklySummedTimeDocument = {
				"meta": {
					"weeklyTimeSums": []
				}
			}

			let i = adjustedBeginDate
			do {
				const rangeEnd = adjustUntilChosenDay(i, 6, 6)
				const rangeLastEnd = adjustBeforeMidnightOfNextDay(rangeEnd)

				sums.meta.weeklyTimeSums.push({
					"beginDateTime": resetToMidnight(i),
					"consultations": { "data": [] },
					"endDateTime": rangeLastEnd,
					"totalMillisecondsConsumed": 0
				})

				i = adjustUntilChosenDay(rangeEnd, 0, 1)
			} while (i < adjustedEndDate)

			const operations: Promise<any>[] = []
			for (const weeklyTimeSum of sums.meta.weeklyTimeSums) {
				operations.push(new Promise<void>(resolve => {
					let totalMillisecondsConsumed = 0
					const deserializedConsultations: DeserializedConsultationListDocument
					= { "data": [] }
					const deserializedOperations: Promise<any>[] = []
					for (const model of models) {
						const consultation = model.consultation as Model
						const startedAt = consultation.startedAt as Date
						const finishedAt = consultation.finishedAt as Date

						if (
							weeklyTimeSum.beginDateTime <= startedAt
						&& finishedAt <= weeklyTimeSum.endDateTime
						) {
							deserializedOperations.push(
								this.serialize([ consultation ])
								.then(deserialize)
								.then(deserializedConsultation => deserializedConsultations.data.push(
									...deserializedConsultation?.data as any[]
								))
							)

							const difference = calculateMillisecondDifference(finishedAt, startedAt)

							totalMillisecondsConsumed += difference
						}
					}

					Promise.all(deserializedOperations).then(() => {
						weeklyTimeSum.totalMillisecondsConsumed = totalMillisecondsConsumed
						weeklyTimeSum.consultations = deserializedConsultations
						resolve()
					})
				}))
			}
			await Promise.all(operations)

			return sums
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
