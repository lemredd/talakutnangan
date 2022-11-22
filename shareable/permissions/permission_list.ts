import TagPermissions from "$/permissions/tag"
import RolePermissions from "$/permissions/role"
import UserPermissions from "$/permissions/user"
import PostPermissions from "$/permissions/post"
import CommentPermissions from "$/permissions/comment"
import SemesterPermissions from "$/permissions/semester"
import ProfanityPermissions from "$/permissions/profanity"
import DepartmentPermissions from "$/permissions/department"
import AuditTrailPermissions from "$/permissions/audit_trail"

export const tag = new TagPermissions()
export const role = new RolePermissions()
export const user = new UserPermissions()
export const post = new PostPermissions()
export const comment = new CommentPermissions(post)
export const semester = new SemesterPermissions()
export const profanity = new ProfanityPermissions()
export const department = new DepartmentPermissions()
export const auditTrail = new AuditTrailPermissions()
