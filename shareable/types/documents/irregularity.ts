import type { Format as BaseFormat } from "$/types/documents/base"

export type RawableFormat = BaseFormat|"raw"

export type FormatRegulator<T extends RawableFormat = "serialized">
= T extends "raw" ? "serialized": T
