/*
 * `usePageContext` allows us to access `pageContext` in any Vue component.
 * See https://vite-plugin-ssr.com/pageContext-anywhere
 */

import { inject, App, InjectionKey } from "vue"

import type { PageContext } from "$/types/renderer"

// eslint-disable-next-line symbol-description
const key: InjectionKey<PageContext> = Symbol()

function usePageContext() {
	const pageContext = inject(key)
	if (!pageContext) throw new Error("setPageContext() not called in parent")
	return pageContext
}

function setPageContext(app: App, pageContext: PageContext) {
	app.provide(key, pageContext)
}

export { usePageContext, setPageContext }
