import { writeFile } from "fs"
import { promisify } from "util"
import RequestEnvironment from "$!/singletons/request_environment"
import TagPermissions from "$/permissions/tag"
import RolePermissions from "$/permissions/role"
import PostPermissions from "$/permissions/post"
import UserPermissions from "$/permissions/user"
import CommentPermissions from "$/permissions/comment"
import SemesterPermissions from "$/permissions/semester"
import ProfanityPermissions from "$/permissions/profanity"
import DepartmentPermissions from "$/permissions/department"
import AuditTrailPermissions from "$/permissions/audit_trail"

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
			"name": "Admin",
			"departmentFlags": department.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"merge"
			),
			"roleFlags": role.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore"
			),
			"semesterFlags": semester.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore"
			),
			"tagFlags": tag.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore"
			),
			"postFlags": post.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readOverallScope",
				"writeOverallScope",
				"tag"
			),
			"commentFlags": comment.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readOverallScope",
				"writeOverallScope",
				"vote"
			),
			"profanityFlags": profanity.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readOverallScope",
				"writeOverallScope"
			),
			"userFlags": user.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readOverallScope",
				"writeOverallScope",
				"resetPassword"
			),
			"auditTrailFlags": auditTrail.generateFlags("view")
		},
		{
			"name": "Dean",
			"departmentFlags": department.generateFlags(
				"view"
			),
			"roleFlags": role.generateFlags(
				"view"
			),
			"semesterFlags": semester.generateFlags(
				"view"
			),
			"tagFlags": tag.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore"
			),
			"postFlags": post.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope",
				"tag"
			),
			"commentFlags": comment.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope",
				"vote"
			),
			"profanityFlags": profanity.generateFlags(
				"view",
				"readOverallScope"
			),
			"userFlags": user.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope"
			),
			"auditTrailFlags": auditTrail.generateFlags()
		},
		{
			"name": "FoSH",
			"departmentFlags": department.generateFlags(
				"view"
			),
			"roleFlags": role.generateFlags(
				"view"
			),
			"semesterFlags": semester.generateFlags(
				"view"
			),
			"tagFlags": tag.generateFlags(
				"view"
			),
			"postFlags": post.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope",
				"tag"
			),
			"commentFlags": comment.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope",
				"vote"
			),
			"profanityFlags": profanity.generateFlags(
				"view",
				"readOverallScope"
			),
			"userFlags": user.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope"
			),
			"auditTrailFlags": auditTrail.generateFlags()
		},
		{
			"name": "Secretary",
			"departmentFlags": department.generateFlags(
				"view"
			),
			"roleFlags": role.generateFlags(
				"view"
			),
			"semesterFlags": semester.generateFlags(
				"view"
			),
			"tagFlags": tag.generateFlags(
				"view"
			),
			"postFlags": post.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeOwnScope",
				"tag"

			),
			"commentFlags": comment.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeOwnScope",
				"vote"
			),
			"profanityFlags": profanity.generateFlags(
				"view",
				"readOverallScope"
			),
			"userFlags": user.generateFlags(
				"view",
				"create",
				"update",
				"readDepartmentScope",
				"writeDepartmentScope"
			),
			"auditTrailFlags": auditTrail.generateFlags()
		},
		{
			"name": "Service Head",
			"departmentFlags": department.generateFlags(
				"view"
			),
			"roleFlags": role.generateFlags(
				"view"
			),
			"semesterFlags": semester.generateFlags(
				"view"
			),
			"tagFlags": tag.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore"
			),
			"postFlags": post.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope",
				"tag"
			),
			"commentFlags": comment.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope",
				"vote"
			),
			"profanityFlags": profanity.generateFlags(
				"view",
				"readOverallScope"
			),
			"userFlags": user.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeDepartmentScope"
			),
			"auditTrailFlags": auditTrail.generateFlags()
		},

		{
			"name": "Service Employee",
			"departmentFlags": department.generateFlags(
				"view"
			),
			"roleFlags": role.generateFlags(
				"view"
			),
			"semesterFlags": semester.generateFlags(
				"view"
			),
			"tagFlags": tag.generateFlags(
				"view"
			),
			"postFlags": post.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeOwnScope",
				"tag"
			),
			"commentFlags": comment.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeOwnScope",
				"vote"
			),
			"profanityFlags": profanity.generateFlags(
				"view",
				"readOverallScope"
			),
			"userFlags": user.generateFlags(
				"view",
				"create",
				"update",
				"readOwnScope",
				"writeOwnScope"
			),
			"auditTrailFlags": auditTrail.generateFlags()
		},
		{
			"name": "Professor",
			"departmentFlags": department.generateFlags(
				"view"
			),
			"roleFlags": role.generateFlags(
				"view"
			),
			"semesterFlags": semester.generateFlags(
				"view"
			),
			"tagFlags": tag.generateFlags(
				"view"
			),
			"postFlags": post.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeOwnScope",
				"tag"
			),
			"commentFlags": comment.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeOwnScope",
				"vote"
			),
			"profanityFlags": profanity.generateFlags(
				"view",
				"readOverallScope"
			),
			"userFlags": user.generateFlags(
				"view",
				"create",
				"update",
				"readOwnScope",
				"writeOwnScope"
			),
			"auditTrailFlags": auditTrail.generateFlags()
		},
		{
			"name": "Student",
			"departmentFlags": department.generateFlags(
				"view"
			),
			"roleFlags": role.generateFlags(
				"view"
			),
			"semesterFlags": semester.generateFlags(
				"view"
			),
			"tagFlags": tag.generateFlags(
				"view"
			),
			"postFlags": post.generateFlags(
				"view",
				"readDepartmentScope"
			),
			"commentFlags": comment.generateFlags(
				"view",
				"create",
				"update",
				"archiveAndRestore",
				"readDepartmentScope",
				"writeOwnScope",
				"vote"
			),
			"profanityFlags": profanity.generateFlags(
				"view",
				"readOverallScope"
			),
			"userFlags": user.generateFlags(
				"view",
				"create",
				"update",
				"readOwnScope",
				"writeOwnScope"
			),
			"auditTrailFlags": auditTrail.generateFlags()
		}

		/*
		 * Add other roles here using this object
		 * {
		 *    name: "admin",
		 *    departmentFlags: department.generateFlags(),
		 *    roleFlags: role.generateFlags(),
		 *    semesterFlags: semester.generateFlags(),
		 *    tagFlags: tag.generateFlags(),
		 *    postFlags: post.generateFlags(),
		 *    commentFlags: comment.generateFlags(),
		 *    profanityFlags: profanity.generateFlags(),
		 *    userFlags: user.generateFlags(),
		 *    auditTrailFlags: auditTrail.generateFlags("view")
		 * }
		 */
	]

	console.log("Generating the roles...")
	const outputPath = `${RequestEnvironment.root}/database/seeders/initial_roles.json`

	const outputContents = JSON.stringify({
		// eslint-disable-next-line max-len
		"info": "DO NOT EDIT THIS FILE MANUALLY! THIS IS AUTO-GENERATED BY *~/server/cli/make_initial_roles.ts*",
		"data": roles
	})
	await promisify(writeFile)(outputPath, outputContents)
	console.log("Generated the roles")
}

main()
