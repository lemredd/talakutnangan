import { deserialise } from "kitsu-core"
import type { Serializable } from "$/types/general"
import convertDates from "$/object/convert_dates"
import stringifyIDs from "$/object/stringify_ids"

export default function(serializedInfo: Serializable|null): Serializable|null {
	const deserializedDocument = deserialise(serializedInfo) || null
	const castDeserializedDocument = deserializedDocument === null
		? null
		: stringifyIDs(convertDates(deserializedDocument))
	return castDeserializedDocument
}
