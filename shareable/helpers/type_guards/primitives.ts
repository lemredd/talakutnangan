function isNumber(value: any): value is number {
	return typeof value === "number"
}

function isString(value: any): value is string {
	return typeof value === "string"
}

function isBoolean(value: any): value is boolean {
	return typeof value === "boolean"
}

function isObject(value: any): value is object {
	return typeof value === "object"
}

export {
	isNumber,
	isString,
	isBoolean,
	isObject
}
