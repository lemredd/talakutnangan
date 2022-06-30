import { writeFile } from "fs"
import { promisify } from "util"
import RequestEnvironment from "!/helpers/request_environment"
import TagPermissions from "$/permissions/tag_permissions"
import RolePermissions from "$/permissions/role_permissions"
import PostPermissions from "$/permissions/post_permissions"
import UserPermissions from "$/permissions/user_permissions"
import CommentPermissions from "$/permissions/comment_permissions"
import SemesterPermissions from "$/permissions/semester_permissions"
import ProfanityPermissions from "$/permissions/profanity_permissions"
import DepartmentPermissions from "$/permissions/department_permissions"
import AuditTrailPermissions from "$/permissions/audit_trail_permissions"

async function main() {
	const tag = new TagPermissions()
	const role = new RolePermissions()
	const post = new PostPermissions()
	const user = new UserPermissions()
	const comment = new CommentPermissions()
	const semester = new SemesterPermissions()
	const profanity = new ProfanityPermissions()
	const department = new DepartmentPermissions()
	const auditTrail = new AuditTrailPermissions()

	const roles = [
		{
			name: "Admin",
			departmentFlags: department.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"merge"
			),
			roleFlags: role.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore"
			),
			semesterFlags: semester.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore"
			),
			tagFlags: tag.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore"
			),
			postFlags: post.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readOverallScope",
				"writeOverallScope",
				"tag"
			),
			commentFlags: comment.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readOverallScope",
				"writeOverallScope",
				"vote"
			),
			profanityFlags: profanity.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readOverallScope",
				"writeOverallScope"
			),
			userFlags: user.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readOverallScope",
				"writeOverallScope",
				"resetPassword"
			),
			auditTrailFlags: auditTrail.generateMask("view")
		},
		{
			name: "Dean",
			departmentFlags: department.generateMask(
				"view",
				"update"
			),
			roleFlags: role.generateMask(
				"view"
			),
			semesterFlags: semester.generateMask(
				"view"
			),
			tagFlags: tag.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore"
			),
			postFlags: post.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope",
				"tag"
			),
			commentFlags: comment.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope",
				"vote"
			),
			profanityFlags: profanity.generateMask(
				"view",
				"readOverallScope"
			),
			userFlags: user.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope"
			),
			auditTrailFlags: auditTrail.generateMask()
		},
		{
			name: "FoSH",
			departmentFlags: department.generateMask(
				"view"
			),
			roleFlags: role.generateMask(
				"view"
			),
			semesterFlags: semester.generateMask(
				"view"
			),
			tagFlags: tag.generateMask(
				"view"
			),
			postFlags: post.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope",
				"tag"
			),
			commentFlags: comment.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope",
				"vote"
			),
			profanityFlags: profanity.generateMask(
				"view",
				"readOverallScope"
			),
			userFlags: user.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope"
			),
			auditTrailFlags: auditTrail.generateMask()
		},
		{
			name: "Secretary",
			departmentFlags: department.generateMask(
				"view"
			),
			roleFlags: role.generateMask(
				"view"
			),
			semesterFlags: semester.generateMask(
				"view"
			),
			tagFlags: tag.generateMask(
				"view"
			),
			postFlags: post.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeOwnScope",
				"tag"

			),
			commentFlags: comment.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeOwnScope",
				"vote"
			),
			profanityFlags: profanity.generateMask(
				"view",
				"readOverallScope"
			),
			userFlags: user.generateMask(
				"view",
				"create",
				"update",
				"readDepartmentScope",
				"writeDepartmentScope"
			),
			auditTrailFlags: auditTrail.generateMask()
		},
		{
			name: "Service Head",
			departmentFlags: department.generateMask(
				"view",
				"update"
			),
			roleFlags: role.generateMask(
				"view"
			),
			semesterFlags: semester.generateMask(
				"view"
			),
			tagFlags: tag.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore"
			),
			postFlags: post.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope",
				"tag"
			),
			commentFlags: comment.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope",
				"vote"
			),
			profanityFlags: profanity.generateMask(
				"view",
				"readOverallScope"
			),
			userFlags: user.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope"
			),
			auditTrailFlags: auditTrail.generateMask()
		},

		{
			name: "Service Employee",
			departmentFlags: department.generateMask(
				"view"
			),
			roleFlags: role.generateMask(
				"view"
			),
			semesterFlags: semester.generateMask(
				"view"
			),
			tagFlags: tag.generateMask(
				"view"
			),
			postFlags: post.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeOwnScope",
				"tag"
			),
			commentFlags: comment.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeOwnScope",
				"vote"
			),
			profanityFlags: profanity.generateMask(
				"view",
				"readOverallScope"
			),
			userFlags: user.generateMask(
				"view",
				"create",
				"update",
				"readOwnScope",
				"writeOwnScope",
			),
			auditTrailFlags: auditTrail.generateMask()
		},
		{
			name: "Professor",
			departmentFlags: department.generateMask(
				"view"
			),
			roleFlags: role.generateMask(
				"view"
			),
			semesterFlags: semester.generateMask(
				"view"
			),
			tagFlags: tag.generateMask(
				"view"
			),
			postFlags: post.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeOwnScope",
				"tag"
			),
			commentFlags: comment.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeOwnScope",
				"vote"
			),
			profanityFlags: profanity.generateMask(
				"view",
				"readOverallScope"
			),
			userFlags: user.generateMask(
				"view",
				"create",
				"update",
				"readOwnScope",
				"writeOwnScope",
			),
			auditTrailFlags: auditTrail.generateMask()
		},
		{
			name: "Student",
			departmentFlags: department.generateMask(
				"view"
			),
			roleFlags: role.generateMask(
				"view"
			),
			semesterFlags: semester.generateMask(
				"view"
			),
			tagFlags: tag.generateMask(
				"view"
			),
			postFlags: post.generateMask(
				"view",
				"readDepartmentScope"
			),
			commentFlags: comment.generateMask(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeOwnScope",
				"vote"
			),
			profanityFlags: profanity.generateMask(
				"view",
				"readOverallScope"
			),
			userFlags: user.generateMask(
				"view",
				"create",
				"update",
				"readOwnScope",
				"writeOwnScope",
			),
			auditTrailFlags: auditTrail.generateMask()
		},
		// Add other roles here using this object
		// {
		// 	name: "admin",
		// 	departmentFlags: department.generateMask(),
		// 	roleFlags: role.generateMask(),
		// 	semesterFlags: semester.generateMask(),
		// 	tagFlags: tag.generateMask(),
		// 	postFlags: post.generateMask(),
		// 	commentFlags: comment.generateMask(),
		// 	profanityFlags: profanity.generateMask(),
		// 	userFlags: user.generateMask(),
		// 	auditTrailFlags: auditTrail.generateMask("view")
		// }
	]

	console.log("Generating the roles...")
	const outputPath = `${RequestEnvironment.root}/database/seeders/initial_roles.json`
	const outputContents = JSON.stringify({
		info: "DO NOT EDIT THIS FILE MANUALLY! THIS IS AUTO-GENERATED BY *~/server/cli/make_initial_roles.ts*",
		data: roles
	})
	await promisify(writeFile)(outputPath, outputContents)
	console.log("Generated the roles")
}

main()
