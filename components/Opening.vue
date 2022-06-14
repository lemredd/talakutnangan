<template>
<div class="text-center">
	<h1 class="p-5 text-1.5rem">
		Insert phrase here.
	</h1>
	<p class="px-5 text-0.75rem">
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aliquid illo vel possimus suscipit consequuntur maxime doloremque explicabo tenetur dolor.
	</p>

	<div class="graphics">
		<div class="person-talking left">
			<span class="material-icons person">person</span>
			<span class="material-icons chat">chat</span>
		</div>
		<div class="person-talking right">
			<span class="material-icons person">person</span>
			<span class="material-icons chat">chat</span>
		</div>
	</div>
</div>

<div class="text-center">
	<h1 class="p-5 text-1.5rem">
		Insert phrase here.
	</h1>
	<p class="px-5 text-0.75rem">
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aliquid illo vel possimus suscipit consequuntur maxime doloremque explicabo tenetur dolor.
	</p>

	<div class="graphics graphics-left">
		<div class="person-announce">
			<span class="material-icons person">person</span>
			<span class="material-icons campaign">campaign</span>
		</div>
	</div>
</div>
</template>
<style scoped lang="scss">
.graphics {
	display: flex;
	justify-content: center;

	margin-top:4em;
}
 .person-talking, .person-announce  {
	 position: relative;
	.person {
		font-size: 15vw;
	}
	.chat {
		position: absolute;
		top: 0; right: -5px;
		font-size: 5vw;
	}
	.campaign {
			position: absolute;
			top: -5px; right: -30px;
			font-size: 10vw;
			transform: rotate(-20deg);
			
			
	}		
	&.left {
		margin-right: 3vw;
	}
	&.right {
		transform: scaleX(-1);
	}
}



@media screen and (min-width: 768px) {
	.graphics {
		justify-content: flex-end;

		&.graphics-left {
			justify-content: flex-start;
		}
	}
	.person {
		font-size: 150px !important;
	}
	.chat {
		font-size: 45px !important;
	}
	.campaign {
		font-size: 80px !important;
	}
	
	.left {
		margin-right: 2em !important;
	}
}


</style>

<script lang="ts" setup>

</script>
