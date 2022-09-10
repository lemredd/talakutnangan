import { deserialise } from "kitsu-core"
import type { Serializable } from "$/types/general"
import convertDates from "$/object/convert_dates"

export default function(serializedInfo: Serializable|null): Serializable|null {
	const deserializedDocument = deserialise(serializedInfo) || null
	const castDeserializedDocument = deserializedDocument === null
		? null
		: convertDates(deserializedDocument)
	return castDeserializedDocument
}
