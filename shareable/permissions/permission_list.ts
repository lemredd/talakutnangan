import TagPermissions from "$/permissions/tag_permissions"
import RolePermissions from "$/permissions/role_permissions"
import UserPermissions from "$/permissions/user_permissions"
import PostPermissions from "$/permissions/post_permissions"
import CommentPermissions from "$/permissions/comment_permissions"
import SemesterPermissions from "$/permissions/semester_permissions"
import ProfanityPermissions from "$/permissions/profanity_permissions"
import DepartmentPermissions from "$/permissions/department_permissions"
import AuditTrailPermissions from "$/permissions/audit_trail_permissions"

export const tag = new TagPermissions()
export const role = new RolePermissions()
export const user = new UserPermissions()
export const post = new PostPermissions()
export const comment = new CommentPermissions()
export const semester = new SemesterPermissions()
export const profanity = new ProfanityPermissions()
export const department = new DepartmentPermissions()
export const auditTrail = new AuditTrailPermissions()
