/* eslint-disable max-len */
/*
 * Base from Latin-1 supplement.
 * See https://jrgraphix.net/r/Unicode/?range=00A0-00FF
 * See https://kb.iu.edu/d/aepu
 */
export const personName = /^([A-Z\u{C0}-\u{D6}\u{D8}-\u{DE}][a-zA-Z\-'\u{C0}-\u{D6}\u{D8}-\u{F6}\u{F8}-\u{FF}]+ )+[A-Z\u{C0}-\u{D6}\u{D8}-\u{DE}][a-zA-Z\-'\u{C0}-\u{D6}\u{D8}-\u{F6}\u{F8}-\u{FF}]+$/u

export const chatMessageKind = /^[a-z_]+$/u

export const departmentFullName = /([A-Z][a-zA-Z]+ )+[A-Z][a-zA-Z]+$/u

export const departmentAcronym = /([A-Z][a-z]*)+/u
