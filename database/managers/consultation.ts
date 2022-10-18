import type { Pipe } from "$/types/database"
import type { Serializable } from "$/types/general"
import type { WeeklySummedTimeDocument } from "$/types/documents/consolidated_time"
import type { UserIdentifierListWithTimeConsumedDocument } from "$/types/documents/user"
import type { ConsultationQueryParameters, TimeSumQueryParameters } from "$/types/query"
import type { ConsultationResource, ConsultationAttributes } from "$/types/documents/consultation"
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
import ChatMessage from "%/models/chat_message"
import AttachedRole from "%/models/attached_role"
import Transformer from "%/transformers/consultation"
import ChatMessageActivity from "%/models/chat_message_activity"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import calculateMillisecondDifference from "$/time/calculate_millisecond_difference"

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

	async sumTimePerStudents(query: TimeSumQueryParameters)
	: Promise<UserIdentifierListWithTimeConsumedDocument> {
		try {
			const models = await ChatMessageActivity.findAll({
				"include": [
					sort({
						"model": User,
						"required": true
					} as FindOptions<any>, query) as IncludeOptions,
					{
						"model": Model,
						"paranoid": false,
						"required": true,
						"where": new Condition().and(
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
				...this.transaction.transactionObject
			})

			return {
				"data": models.filter(model => {
					const consultation = model.consultation as Model

					return consultation.finishedAt !== null && consultation.startedAt !== null
				}).map(model => {
					const user = model.user as User
					const consultation = model.consultation as Model

					const millisecond = calculateMillisecondDifference(
						consultation.finishedAt as Date,
						consultation.startedAt as Date
					)

					return {
						"id": String(user.id),
						"meta": {
							"totalMillisecondsConsumed": millisecond
						},
						"type": "user"
					}
				}).reduce((previousSums, currentSum: any) => {
					const previousSum = previousSums.find(sum => sum.id === currentSum.id)

					if (previousSum) {
						previousSum.meta.totalMillisecondsConsumed += currentSum
						.meta
						.totalMillisecondsConsumed

						return previousSums
					}

					return [
						...previousSums,
						currentSum
					]
				}, [] as UserIdentifierListWithTimeConsumedDocument["data"])
			}
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async sumTimePerWeek(query: TimeSumQueryParameters)
	: Promise<WeeklySummedTimeDocument> {
		try {
			const adjustedBeginDate = adjustUntilChosenDay(query.filter.dateTimeRange.begin, 0, -1)
			const adjustedEndDate = adjustUntilChosenDay(query.filter.dateTimeRange.end, 6, 1)
			const models = await Model.findAll(sort({
				"paranoid": false,
				"where": new Condition().and(
					new Condition().greaterThanOrEqual("startedAt", adjustedBeginDate),
					new Condition().lessThanOrEqual("finishedAt", adjustedEndDate)
				).build()
			} as FindOptions<any>, query) as IncludeOptions)

			const sums: WeeklySummedTimeDocument = {
				"meta": {
					"weeklyTimeSums": []
				}
			}

			for (
				let i = adjustedBeginDate;
				i < adjustedEndDate;
				i = adjustUntilChosenDay(i, 6, 7, { "force": true })
			) {
				const rangeEnd = adjustUntilChosenDay(adjustedBeginDate, 6, 7, { "force": true })
				// eslint-disable-next-line no-magic-numbers
				rangeEnd.setHours(11, 59, 59, 999)
				sums.meta.weeklyTimeSums.push({
					"beginDateTime": i,
					"endDateTime": rangeEnd,
					"totalMillisecondsConsumed": 0
				})
			}

			for (const weeklyTimeSum of sums.meta.weeklyTimeSums) {
				weeklyTimeSum.totalMillisecondsConsumed += models.reduce((
					totalMillisecondsConsumed,
					model
				) => {
					let newTotalMillisecondsconsumed = totalMillisecondsConsumed
					if (model) {
						const startedAt = model.startedAt as Date
						const finishedAt = model.finishedAt as Date
						if (
							weeklyTimeSum.beginDateTime < startedAt
							&& finishedAt < weeklyTimeSum.endDateTime
						) {
							const difference = calculateMillisecondDifference(finishedAt, startedAt)

							newTotalMillisecondsconsumed += difference
						}
					}

					return newTotalMillisecondsconsumed
				}, 0)
			}

			return sums
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
