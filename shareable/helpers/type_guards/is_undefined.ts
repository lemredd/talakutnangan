interface Undefined { type: "undefined" }

function isUndefined(object: any): object is Undefined {
	return "type" in object && object.type === "undefined"
}

export default function(value: any): boolean {
	return isUndefined(value)
}
