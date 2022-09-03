import Stub from "$/helpers/singletons/stub"

export default function(path: string): void {
	Stub.runConditionally(
		() => {
			location.assign(path)
		},
		() => [
			0 as unknown as void,
			{
				"arguments": [ path ],
				"functionName": "assignPath"
			}
		]
	)
}
