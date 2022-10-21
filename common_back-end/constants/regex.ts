/* eslint-disable max-len */
/*
 * Base from Latin-1 supplement.
 * See https://jrgraphix.net/r/Unicode/?range=00A0-00FF
 * See https://kb.iu.edu/d/aepu
 */
export const personName = /^([A-Z\u{C0}-\u{D6}\u{D8}-\u{DE}][a-zA-Z\-'\u{C0}-\u{D6}\u{D8}-\u{F6}\u{F8}-\u{FF}]+ )+[A-Z\u{C0}-\u{D6}\u{D8}-\u{DE}][a-zA-Z\-'\u{C0}-\u{D6}\u{D8}-\u{F6}\u{F8}-\u{FF}]+$/u
export const personNameDescription
= "be properly-cased name with Latin characters, dash, or apostrophe"

export const chatMessageKind = /^[a-z_]+$/u
export const chatMessageKindDescription
= "have one or more, lowercase characters or underscore only"

export const departmentFullName = /([A-Z][a-zA-Z]+ )+[A-Z][a-zA-Z]+$/u
export const departmentFullNameDescription
= "be a properly-cased alphabetic name with one or more spaces"

export const departmentAcronym = /([A-Z][a-z]*)+/u
export const departmentAcronymDescription = "be an uppercased alphetic name with one or more spaces"
