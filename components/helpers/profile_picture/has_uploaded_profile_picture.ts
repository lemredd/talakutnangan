import type { DeserializedProfilePictureDocument } from "$/types/documents/profile_picture"

import isPlainObject from "$/type_guards/is_plain_object"

export default function(value: any)
: value is DeserializedProfilePictureDocument {
	return isPlainObject(value)
}
