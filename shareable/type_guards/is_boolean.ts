import isBoolean from "lodash.isboolean"
export default function(value: any): value is boolean {
	return isBoolean(value)
}
