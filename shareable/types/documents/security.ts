import type { MetaDocument } from "$/types/documents/base"

/**
 * Some documents requires password of the logged in user to update.
 */
export type RequirePassword = MetaDocument<{ password: string }>
