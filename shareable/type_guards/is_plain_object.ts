import isPlainObject from "lodash.isplainobject"

export default function(value: any): value is object {
	return isPlainObject(value)
}
