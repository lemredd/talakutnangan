import { deserialise } from "kitsu-core"
import type { Serializable } from "$/types/database"

export default function(serializedInfo: Serializable): Serializable {
	return deserialise(serializedInfo)
}
