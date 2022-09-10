import isPlainObject from "lodash.isplainobject"
import { GeneralObject } from "$/types/general"

export default function(value: any): value is GeneralObject {
	return isPlainObject(value)
}
