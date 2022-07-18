import { deserialise } from "kitsu-core"
import type { Serializable } from "$/types/database"

export default function(serializedInfo: Serializable|null): Serializable|null {
	return deserialise(serializedInfo) || null
}
