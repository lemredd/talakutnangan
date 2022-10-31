<template>
	<div>
		<div class="post">
			<div
				class="created-post">
				<span class="material-icons account-attachment">
					account_circle
				</span>
				<input
					type="text"
					placeholder="What's on your mind?"
					class="post-create"/>
				<span class="material-icons account-attachment">
					attachment
				</span>
			</div>
		</div>
		<div class="comment-post">
			<div class="post-main">
				<div class="post-profile">
					<span class="material-icons icon">
						account_circle
					</span>
					{{ userProfile.data.name }}
					<div class="post-details">
						<!-- Institute Name and posted hours -->
						Posted on INS(Institute Name) 1 hour ago
					</div>
				</div>
				<span class="material-icons icon">
					more_vert
				</span>
			</div>
			<div class="post-messages">
				Lorem Ipsum
			</div>
			<div class="post-view-comments">
				<span class="material-icons icon">
					comment
				</span>
				<!-- insert number of comments -->
				50 Comments
			</div>
		</div>
	</div>

	<!-- show comment section on user's post  -->
	<div class="comment-preview">
		<div class="comment-filter flex justify-end mr-25">
			<span class="material-icons text-10">
				arrow_drop_down
			</span>
			<!-- Comment filter -->
			Most Relevant
		</div>
		<div class="write-comment mb-5">
			<span class="material-icons icon">
				account_circle
			</span>
			<input
				type="text"
				placeholder="Write to comment"
				class="post-message p-4 rounded-1rem bg-gray-300 text-dark-500 w-180"/>
			<span class="material-icons file-media">
				<!-- add component -->
				photo
			</span>
			<span class="material-icons file-media">
				<!-- add component -->
				attachment
			</span>
		</div>
		<div class="account-replied ml-15">
			<!-- replied user name and date created -->
			Tropa T. Time 10/30/2022
		</div>
		<div class="write-comment">
			<span class="material-icons icon mt-2">
				account_circle
			</span>
			<div class="comment-user ">
				<!-- user's comment -->
				Tropa Time
			</div>
		</div>
		<div class="vote-view">
			<span class="material-icons up-vote">
				<!-- add view vote  -->
				north_east
			</span>
			<span class="material-icons down-vote">
				<!-- add view vote  -->
				south_west
			</span>
			2K Votes
			<span class="material-icons message">
				<!-- add view comments  -->
				comment
			</span>
			Reply
		</div>
		<div class="view-reply ml-8 mt-5">
			<div class="replied-comment ml-15 mt-5">
				<!-- replied user name and date created -->
				You replied to Tropa 10/31/2022
			</div>
			<div class="write-comment">
				<span class="material-icons icon mt-2">
					account_circle
				</span>
				<div class="comment-replied-user">
					Osige na nga
				</div>
				<span class="material-icons icon">
					more_horiz
				</span>
			</div>
			<div class="vote-view">
				<span class="material-icons up-vote">
					<!-- add view vote  -->
					north_east
				</span>
				<span class="material-icons down-vote">
					<!-- add view vote  -->
					south_west
				</span>
				500 Votes
				<span class="material-icons message">
					<!-- add view comments  -->
					comment
				</span>
				Reply
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@media (min-width: 600px){
.created-post{
	@apply flex justify-between items-center;
	@apply m-5 p-4 max-w-800 rounded-1rem shadow-inner bg-light-800;

	.post-create{
		@apply p-4 rounded-1rem bg-gray-300 text-dark-500 min-w-100;

	.account-attachment{
		@apply text-40px mr-2;
	}
	}
}
}

.comment-post{
	@apply p-5 m-5 bg-light-800 shadow-lg rounded-1rem max-w-800;

	.post-main{
		@apply flex justify-between;
	}

	.post-profile{
		@apply mb-5 flex items-center text-20px;
	}

	.post-details{
		@apply ml-2 text-15px;
	}

	.post-messages{
		@apply mt-5 text-40px;
	}
	.post-view-comments{
		@apply mt-10 flex items-center;
	}
}

.comment-preview{
	@apply p-5 m-5 bg-light-800 shadow-lg rounded-1rem max-w-800;

	.write-comment{
		@apply flex items-center;
	}

	.comment-user{
	@apply flex items-center p-5 bg-gray-300 shadow-lg rounded-1rem w-500;
	}

	.vote-view{
		@apply flex items-center ml-2 text-20px;
	}

	.comment-replied-user{
		@apply p-5 bg-gray-300 shadow-lg rounded-1rem w-500 flex items-center;
	}
}


.icon{
	@apply text-35px mr-2;
}
.file-media{
	@apply text-35px mr-2;
}
.up-vote{
	@apply text-20px ml-10;
}
.down-vote{
	@apply text-20px;
}
.message{
	@apply text-20px ml-2 mr-2;
}
</style>

<script setup lang="ts">
import { ref, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedPostResource } from "$/types/documents/post"

import makeSwitch from "$@/helpers/make_switch"

import MultiplePostViewer from "@/post/multiviewer.vue"
import CreatePostForm from "@/post/create_post_form.vue"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

type RequiredExtraProps = "posts"|"departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

const posts = ref<DeserializedPostResource<"poster"|"posterRole">[]>(
	pageProps.posts.data as DeserializedPostResource<"poster"|"posterRole">[]
)

const {
	"state": isCreateShown,
	"on": showCreateForm,
	"off": hideCreateForm
} = makeSwitch(false)

</script>
