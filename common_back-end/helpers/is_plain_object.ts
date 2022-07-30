import isPlainObject from "lodash.isplainobject"

export default function(value: any): boolean {
	return isPlainObject(value)
}
