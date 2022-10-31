<template>
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
				<div class="flex">
					<span class="material-icons icon">
						account_circle
					</span>
					{{ userProfile.data.name }}
				</div>
				<small class="post-details">
					<!-- Institute Name and posted hours -->
					Posted on INS(Institute Name) 1 hour ago
				</small>
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

	<!-- show comment section on user's post  -->
	<div class="comment-preview">
		<div class="comment-filter">
			<span class="material-icons icon">
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
				class="comment-messages"/>
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
			<div class="comment-user">
				<!-- user's comment -->
				Tropa Time
			</div>
		</div>
		<div class="vote-view">
			<span class="material-icons up-vote">
				<!-- add view vote  -->
				north_east
			</span>
			<span class="material-icons">
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


.created-post{
	@apply flex justify-between items-center;
	@apply m-5 p-4 rounded-1rem shadow-inner bg-light-800 min-w-85;
	width: 90%;

	.post-create{
		@apply p-4 rounded-1rem bg-gray-300 text-dark-500;
		width: 90%;


	.account-attachment{
		@apply ml-2;
	}

}
}
.comment-post{
	@apply p-5 m-5 bg-light-800 shadow-lg rounded-1rem min-w-85;
	width: 90%;
	.post-main{
		@apply flex justify-between;
	}

	.post-profile{
		@apply mb-5 flex <sm:flex-col items-center;
	}

	.post-details{
		@apply ml-2;
	}

	.post-messages{
		@apply mt-5;
	}
	.post-view-comments{
		@apply mt-10 flex items-center;
	}
}

.comment-preview{
	@apply p-5 m-5 bg-light-800 shadow-lg rounded-1rem min-w-85;
	width: 90%;

	.comment-messages{
	@apply p-4 rounded-1rem bg-gray-300 text-dark-500 min-w-55;
		width: 100%;
}
	.comment-filter{
		@apply flex justify-end;
	}
	.write-comment{
		@apply flex items-center;
		width: 90%;
	}

	.comment-user{
	@apply flex items-center p-5 bg-gray-300 shadow-lg rounded-1rem;
	width: 90%;
}

	.vote-view{
		@apply flex items-center ml-2;
	}

	.comment-replied-user{
		@apply p-5 bg-gray-300 shadow-lg rounded-1rem w-500 flex items-center;
	}
}


.icon{
	@apply mr-2;
}
.file-media{
	@apply mr-2;
}
.up-vote{
	@apply ml-10;
}
.message{
	@apply ml-2 mr-2;
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
