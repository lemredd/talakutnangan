import type { Serializable } from "$/types/general"
import type { Response } from "$@/types/independent"
import type { ConsultationQueryParameters, TimeSumQueryParameters } from "$/types/query"
import type { DeserializedUserListWithTimeConsumedDocument } from "$/types/documents/user"
import type {
	WeeklySummedTimeDocument,
	ConsolidatedSummedTimeDocument
} from "$/types/documents/consolidated_time"
import type {
	ConsultationResourceIdentifier,
	ConsultationAttributes,
	ConsultationResource,
	DeserializedConsultationResource,
	ConsultationDocument,
	ConsultationListDocument,
	DeserializedConsultationDocument,
	DeserializedConsultationListDocument,
	RTCTokenDocument
} from "$/types/documents/consultation"

import {
	CONSULTATION_LINK,
	READ_TIME_SUM_PER_STUDENT,
	READ_TIME_SUM_PER_WEEK,
	READ_TIME_SUM_FOR_CONSOLIDATION,
	READ_GENERATED_RTC_TOKEN
} from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"
import specializePath from "$/helpers/specialize_path"
import stringifyQuery from "$@/fetchers/stringify_query"

export default class ConsultationFetcher extends BaseFetcher<
	ConsultationResourceIdentifier<"read">,
	ConsultationAttributes<"serialized">,
	ConsultationAttributes<"deserialized">,
	ConsultationResource,
	DeserializedConsultationResource,
	ConsultationDocument,
	ConsultationListDocument,
	DeserializedConsultationDocument,
	DeserializedConsultationListDocument,
	{
		"otherDocuments": RTCTokenDocument|Serializable
		"queryParameters": ConsultationQueryParameters
	}
> {
	constructor() {
		super(CONSULTATION_LINK)
	}

	readTimeSumPerStudent(parameters: TimeSumQueryParameters): Promise<Response<
		ConsultationResourceIdentifier,
		ConsultationAttributes<"serialized">,
		ConsultationAttributes<"deserialized">,
		ConsultationResource,
		DeserializedConsultationResource,
		DeserializedUserListWithTimeConsumedDocument
	>> {
		const commaDelimitedSort = {
			...parameters,
			"sort": parameters.sort.join(",")
		}

		return this.handleResponse(
			this.getJSON(specializePath(READ_TIME_SUM_PER_STUDENT, {
				"query": stringifyQuery(commaDelimitedSort)
			})),
			true
		) as Promise<Response<
			ConsultationResourceIdentifier,
			ConsultationAttributes<"serialized">,
			ConsultationAttributes<"deserialized">,
			ConsultationResource,
			DeserializedConsultationResource,
			DeserializedUserListWithTimeConsumedDocument
		>>
	}

	readTimeSumPerWeek(parameters: TimeSumQueryParameters): Promise<Response<
		ConsultationResourceIdentifier,
		ConsultationAttributes<"serialized">,
		ConsultationAttributes<"deserialized">,
		ConsultationResource,
		DeserializedConsultationResource,
		WeeklySummedTimeDocument
	>> {
		const commaDelimitedSort = {
			...parameters,
			"sort": parameters.sort.join(",")
		}

		return this.handleResponse(
			this.getJSON(specializePath(READ_TIME_SUM_PER_WEEK, {
				"query": stringifyQuery(commaDelimitedSort)
			})),
			true
		) as Promise<Response<
			ConsultationResourceIdentifier,
			ConsultationAttributes<"serialized">,
			ConsultationAttributes<"deserialized">,
			ConsultationResource,
			DeserializedConsultationResource,
			WeeklySummedTimeDocument
		>>
	}

	readTimeSumForConsolidation(parameters: TimeSumQueryParameters): Promise<Response<
		ConsultationResourceIdentifier,
		ConsultationAttributes<"serialized">,
		ConsultationAttributes<"deserialized">,
		ConsultationResource,
		DeserializedConsultationResource,
		ConsolidatedSummedTimeDocument
	>> {
		const commaDelimitedSort = {
			...parameters,
			"sort": parameters.sort.join(",")
		}

		return this.handleResponse(
			this.getJSON(specializePath(READ_TIME_SUM_FOR_CONSOLIDATION, {
				"query": stringifyQuery(commaDelimitedSort)
			})),
			true
		) as Promise<Response<
			ConsultationResourceIdentifier,
			ConsultationAttributes<"serialized">,
			ConsultationAttributes<"deserialized">,
			ConsultationResource,
			DeserializedConsultationResource,
			ConsolidatedSummedTimeDocument
		>>
	}

	generateToken(id: string, channelName: string, chatMessageActivityID: string): Promise<Response<
		ConsultationResourceIdentifier,
		ConsultationAttributes<"serialized">,
		ConsultationAttributes<"deserialized">,
		ConsultationResource,
		DeserializedConsultationResource,
		RTCTokenDocument
	>> {
		const pathToGenerateToken = specializePath(READ_GENERATED_RTC_TOKEN, {
			channelName,
			id,
			"uid": chatMessageActivityID
		})

		return this.getFrom(pathToGenerateToken) as Promise<Response<
			ConsultationResourceIdentifier,
			ConsultationAttributes<"serialized">,
			ConsultationAttributes<"deserialized">,
			ConsultationResource,
			DeserializedConsultationResource,
			RTCTokenDocument
		>>
	}
}
