import { Pipe } from "$/types/database"
import type { EmployeeScheduleQueryParameters } from "$/types/query"
import type { EmployeeScheduleAttributes } from "$/types/documents/employee_schedule"
import type { ModelCtor, FindAndCountOptions, DestroyOptions } from "%/types/dependent"

import Log from "$!/singletons/log"
import BaseManager from "%/managers/base"
import Model from "%/models/employee_schedule"
import DatabaseError from "$!/errors/database"
import Consultation from "%/models/consultation"
import Condition from "%/managers/helpers/condition"
import siftByDay from "%/queries/employee_schedule/sift_by_day"
import siftByUser from "%/queries/employee_schedule/sift_by_user"
import siftByRange from "%/queries/employee_schedule/sift_by_range"
import EmployeeScheduleTransformer from "%/transformers/employee_schedule"
import convertMinutesToTimeObject from "%/managers/helpers/convert_minutes_to_time_object"

interface RawEmployeeScheduleAttributes extends EmployeeScheduleAttributes<"serialized"> {
	userID: number
}

export default class extends BaseManager<
	Model,
	RawEmployeeScheduleAttributes,
	EmployeeScheduleQueryParameters<number>
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): EmployeeScheduleTransformer { return new EmployeeScheduleTransformer() }

	get exposableColumns(): string[] {
		const excludedColumns = [ "userID" ]
		return super.exposableColumns.filter(columnName => {
			const isIncluded = !excludedColumns.includes(columnName)
			return isIncluded
		})
	}

	get listPipeline(): Pipe<
		FindAndCountOptions<Model>,
		EmployeeScheduleQueryParameters<number>
	>[] {
		return [
			siftByDay,
			siftByUser,
			siftByRange,
			...super.listPipeline
		]
	}

	async archiveBatch(IDs: number[]): Promise<number> {
		try {
			const foundModels = await this.model.findAll({
				"where": { "id": IDs },
				...this.transaction.transactionObject
			})
			const destroyCount = await this.model.destroy(<DestroyOptions<Model>>{
				"where": { "id": IDs },
				...this.transaction.transactionObject
			})
			const currentTime = new Date()
			const conditions = new Condition().or(
				...foundModels.map(model => {
					const individualCondition = new Condition()

					const targetStartTime = convertMinutesToTimeObject(model.scheduleStart)
					const targetEndTime = convertMinutesToTimeObject(model.scheduleEnd)

					individualCondition.and(
						new Condition().greaterThanOrEqual("scheduledStartAt", currentTime),
						new Condition().isOnDay(
							"scheduledStartAt", model.dayName),
						new Condition().onOrAfterTime("scheduledStartAt", targetStartTime),
						new Condition().onOrBeforeTime("scheduledStartAt", targetEndTime)
					)

					return individualCondition
				})
			).build()

			if (!Consultation.sequelize) {
				throw new DatabaseError("Developer may have forgot to register the models.")
			}

			await Consultation.destroy(<DestroyOptions<Model>>{
				"where": conditions,
				...this.transaction.transactionObject
			})

			Log.success("manager", "done archiving models")

			return destroyCount
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
