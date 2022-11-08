/* eslint-disable max-lines */
import type { Pipe } from "$/types/database"
import type { Serializable } from "$/types/general"
import type { ConsultationQueryParameters, TimeSumQueryParameters } from "$/types/query"
import type {
	WeeklySummedTimeDocument,
	ConsolidatedSummedTimeDocument
} from "$/types/documents/consolidated_time"
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

import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"

import User from "%/models/user"
import Role from "%/models/role"
import Log from "$!/singletons/log"
import Model from "%/models/consultation"
import BaseManager from "%/managers/base"
import Condition from "%/helpers/condition"
import makeUnique from "$/array/make_unique"
import deserialize from "$/object/deserialize"
import ChatMessage from "%/models/chat_message"
import AttachedRole from "%/models/attached_role"
import makeUniqueBy from "$/helpers/make_unique_by"
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
				).build(),
				...this.transaction.transactionObject
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
	: Promise<Serializable> {
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
			const userTransformer = new UserTransformer()

			return {
				"data": await models.map(async model => {
					const user = model.user as User
					const consultation = model.consultation as Model

					const millisecond = calculateMillisecondDifference(
						consultation.finishedAt as Date,
						consultation.startedAt as Date
					)

					const serializedUser = await Serializer.serialize(
						user,
						userTransformer
					) as Serializable
					const serializedUserData = serializedUser.data as Serializable
					serializedUserData.meta = {
						"consultations": [
							consultation
						],
						"totalMillisecondsConsumed": millisecond
					} as unknown as Serializable

					return serializedUserData
				}).reduce(async(previousSums, currentSum: Promise<any>) => {
					const waitedPreviousSums = await previousSums
					const waitedCurrentSums = await currentSum
					const previousSum = waitedPreviousSums.find(sum => sum.id === waitedCurrentSums.id)
					waitedCurrentSums.meta.consultations = deserialize(
						await this.serialize(waitedCurrentSums.meta.consultations)
					)

					if (previousSum) {
						previousSum.meta.totalMillisecondsConsumed += waitedCurrentSums
						.meta
						.totalMillisecondsConsumed

						const consultations = previousSum.meta.consultations.data
						consultations.push(waitedCurrentSums.meta.consultations.data[0])

						return waitedPreviousSums
					}

					return [
						...waitedPreviousSums,
						waitedCurrentSums
					]
				}, Promise.resolve([]) as Promise<any[]>)
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
							new Condition().greaterThanOrEqual("startedAt", adjustedBeginDate),
							new Condition().lessThanOrEqual("finishedAt", adjustedEndDate)
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
					"beginAt": resetToMidnight(i),
					"consultations": { "data": [] },
					"endAt": rangeLastEnd,
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
							weeklyTimeSum.beginAt <= startedAt
						&& finishedAt <= weeklyTimeSum.endAt
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

	async sumTimeForConsolidation(query: TimeSumQueryParameters<number>)
	: Promise<ConsolidatedSummedTimeDocument> {
		try {
			const adjustedBeginDate = resetToMidnight(query.filter.dateTimeRange.begin)
			const adjustedEndDate = adjustBeforeMidnightOfNextDay(query.filter.dateTimeRange.end)
			const chatMessageActivities = await ChatMessageActivity.findAll({
				"include": [
					sort({
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
							new Condition().greaterThanOrEqual("startedAt", adjustedBeginDate),
							new Condition().lessThanOrEqual("finishedAt", adjustedEndDate)
						).build()
					} as FindOptions<any>, query) as IncludeOptions
				],
				"paranoid": false,
				...this.transaction.transactionObject
			})
			const models = makeUniqueBy(
				chatMessageActivities.map(activity => activity.consultation),
				leftModel => leftModel.id
			)
			const availableDates = makeUnique(
				models.map(model => resetToMidnight(model.startedAt as Date).toJSON())
			).map(dateString => new Date(dateString))

			const sums: ConsolidatedSummedTimeDocument = {
				"meta": {
					"rawConsolidatedTimeSums": []
				}
			}

			for (const availableDate of availableDates) {
				const rangeStart = resetToMidnight(availableDate)
				const rangeLastEnd = adjustBeforeMidnightOfNextDay(availableDate)
				const filteredConsultations = models.filter(model => {
					const startedAt = model.startedAt as Date
					const finishedAt = model.finishedAt as Date
					const isWithinRange = startedAt.getDate() === rangeStart.getDate()
						&& finishedAt.getDate() === rangeLastEnd.getDate()

					return isWithinRange
				})

				sums.meta.rawConsolidatedTimeSums.push({
					"beginAt": rangeStart,
					"consultationIDs": makeUnique(filteredConsultations.map(model => String(model.id))),
					"endAt": rangeLastEnd,
					"totalMillisecondsConsumed": filteredConsultations.map(
						model => {
							const startedAt = model.startedAt as Date
							const finishedAt = model.finishedAt as Date
							return calculateMillisecondDifference(finishedAt, startedAt)
						}
					).reduce(
						(previousDuration, currentDuration) => previousDuration + currentDuration,
						0
					),
					"userIDs": makeUnique(chatMessageActivities.filter(chatMessageActivity => {
						const model = chatMessageActivity.consultation
						const startedAt = model.startedAt as Date
						const finishedAt = model.finishedAt as Date
						const isWithinRange = startedAt.getDate() === rangeStart.getDate()
							&& finishedAt.getDate() === rangeLastEnd.getDate()

						return isWithinRange
					}).map(activity => String(activity.userID)))
				})
			}

			return sums
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
