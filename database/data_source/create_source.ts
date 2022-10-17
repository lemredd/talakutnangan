import { Sequelize, SequelizeOptions } from "sequelize-typescript"

import type { SourceType } from "$/types/database"

import Tag from "%/models/tag"
import Role from "%/models/role"
import User from "%/models/user"
import Post from "%/models/post"
import Log from "$!/singletons/log"
import Comment from "%/models/comment"
import PostTag from "%/models/post_tag"
import Semester from "%/models/semester"
import Signature from "%/models/signature"
import Department from "%/models/department"
import AuditTrail from "%/models/audit_trail"
import ChatMessage from "%/models/chat_message"
import CommentVote from "%/models/comment_vote"
import Consultation from "%/models/consultation"
import AttachedRole from "%/models/attached_role"
import StudentDetail from "%/models/student_detail"
import FoundPostWord from "%/models/found_post_word"
import ProfilePicture from "%/models/profile_picture"
import PostAttachment from "%/models/post_attachment"
import ProfanityFilter from "%/models/profanity_filter"
import createConfiguration from "%/configuration/create"
import EmployeeSchedule from "%/models/employee_schedule"
import AsynchronousFile from "%/models/asynchronous_file"
import FoundCommentWord from "%/models/found_comment_word"
import AttachedChatFile from "%/models/attached_chat_file"
import ChatMessageActivity from "%/models/chat_message_activity"

export default async function(type: SourceType): Promise<Sequelize> {
	const configuration: SequelizeOptions = createConfiguration(type) as SequelizeOptions
	const models = [
		Tag,
		Role,
		User,
		Post,
		Comment,
		PostTag,
		Semester,
		Signature,
		AuditTrail,
		Department,
		ChatMessage,
		CommentVote,
		Consultation,
		AttachedRole,
		StudentDetail,
		FoundPostWord,
		ProfilePicture,
		PostAttachment,
		ProfanityFilter,
		EmployeeSchedule,
		AsynchronousFile,
		FoundCommentWord,
		AttachedChatFile,
		ChatMessageActivity
	]

	const sequelize = new Sequelize({
		...configuration,
		"logging": (query: string) => {
			Log.trace("query", query)
		},
		models
	})

	try {
		await sequelize.authenticate()
		Log.success("server", `Connected to the database server with ${models.length} models`)
	} catch (error) {
		Log.errorMessage("server", "Cannot connect to the database")
		Log.error("server", error as Error)
	}

	return sequelize
}
