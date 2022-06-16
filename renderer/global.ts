let globalWindow: typeof globalThis | typeof window | typeof global | null

if (typeof globalThis === "object") globalWindow = globalThis
else if (typeof window === "object") globalWindow = window
else if (typeof global === "object") globalWindow = global
else globalWindow = null

export function useGlobalWindow() {
	return globalWindow!
}
