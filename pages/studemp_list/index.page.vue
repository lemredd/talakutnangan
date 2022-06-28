<template>
	<h1 class="">Institute Name</h1>
	<UsersManager :users="users"/>

</template>

<script setup lang="ts">
import UsersManager from "@/user_management/UsersManager.vue";
import { ManagerKind } from "@/user_management/types";
import { users } from "./data"
import { onBeforeMount, provide, ref } from "vue";

const managerKind = "dean" as ManagerKind
provide("managerKind", managerKind)

const roles = ref<string[]>([])

onBeforeMount(function() {
    const rolesNoDuplicate = new Set([...roles.value])
    users.forEach(user => rolesNoDuplicate.add(user.role))

    roles.value = [...rolesNoDuplicate]
})
provide("filterList", roles)
</script>
