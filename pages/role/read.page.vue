<template>
	<form @submit.prevent="openConfirmation">
		<div class="role-name">
			<RoleNameField
				v-model="role.data.name"
				label="Role Name"
				type="text"
				:editable="true"/>
		</div>

		<FlagSelector
			v-for="flagSelector in flagSelectors"
			:key="flagSelector.permissionGroup.name"
			v-model="flagSelector.model.value"
			:header="flagSelector.header"
			:base-permission-group="flagSelector.permissionGroup"
			:dependent-permission-groups="flagSelector.dependentGroups"
			@check-external-dependency-flags="flagSelector.checkExternal"
			@uncheck-externally-dependent-flags="flagSelector.uncheckExternal"/>

		<div class="controls flex justify-between">
			<button type="submit" class="btn btn-primary">
				Submit
			</button>
			<button
				v-if="isDeleted"
				type="button"
				class="btn btn-primary"
				@click="restoreRole">
				Restore
			</button>
			<button
				v-else
				type="button"
				class="btn btn-primary"
				@click="archiveRole">
				Archive
			</button>
		</div>
		<ConfirmationPassword
			v-model="password"
			:must-confirm="isBeingConfirmed"
			@cancel="closeConfirmation"
			@confirm="updateRole"/>
	</form>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { ref, inject, computed, Ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedRoleDocument } from "$/types/documents/role"
import type { ExternalPermissionDependencyInfo } from "$/types/permission"

import Fetcher from "$@/fetchers/role"
import makeUnique from "$/array/make_unique"
import makeSwitch from "$@/helpers/make_switch"
import PermissionGroup from "$/permissions/base"
import {
	semester as semesterPermissions,
	tag as tagPermissions,
	post as postPermissions,
	comment as commentPermissions,
	profanity as profanityPermissions,
	user as userPermissions,
	auditTrail as auditTrailPermissions
} from "$/permissions/permission_list"

import FlagSelector from "@/role/flag_selector.vue"
import RoleNameField from "@/fields/non-sensitive_text.vue"
import ConfirmationPassword from "@/authentication/confirmation_password.vue"

type RequiredExtraProps = "role"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const role = ref<DeserializedRoleDocument<"read">>(
	pageProps.role as DeserializedRoleDocument<"read">
)
const isDeleted = computed<boolean>(() => Boolean(role.value.deletedAt))
const password = ref<string>("")

const fetcher: Fetcher = new Fetcher()

function checkExternalDependencies(dependencies: ExternalPermissionDependencyInfo<any, any>[])
: void {
	for (const dependency of dependencies) {
		const {
			group,
			permissionDependencies
		} = dependency

		const flagsToAdd = group.generateMask(...permissionDependencies)

		const newFlags = role.value.data[group.name] | flagsToAdd
		role.value.data[group.name] = newFlags

		const externalDependencies = group.identifyExternalDependencies(permissionDependencies)
		checkExternalDependencies(externalDependencies)
	}
}

function uncheckExternalDependents(dependents: ExternalPermissionDependencyInfo<any, any>[])
: void {
	if (dependents.length === 0) return

	let externalDependencyNames: string[] = []
	const dependentNames: string[] = []

	for (const dependent of dependents) {
		const {
			group,
			permissionDependencies
		} = dependent

		const internalDependents = group.identifyDependents(permissionDependencies)
		const allDependents = makeUnique([
			...permissionDependencies,
			...internalDependents
		])
		const flagsToRemove = group.generateMask(...allDependents)

		// eslint-disable-next-line no-bitwise
		const filteredFlags = role.value.data[group.name] & ~flagsToRemove
		role.value.data[group.name] = filteredFlags

		dependentNames.push(group.name)
		const externalDependencies = group.identifyExternalDependencies(permissionDependencies)

		for (const dependency of externalDependencies) {
			externalDependencyNames.push(dependency.group.name)
		}
	}

	externalDependencyNames = makeUnique(externalDependencyNames)
	const unsuspectedNames = makeUnique([ ...externalDependencyNames, ...dependentNames ])

	const possibleDependents = [
		semesterPermissions,
		tagPermissions,
		postPermissions,
		commentPermissions,
		profanityPermissions,
		userPermissions,
		auditTrailPermissions
	].filter(info => !unsuspectedNames.includes(info.name))

	const subdependents = possibleDependents
	.map(subdependent => {
		const permissionDependencies = subdependent.identifyExternallyDependents(dependents)

		return {
			"group": subdependent,
			permissionDependencies
		}
	})
	.filter(subdependentInfo => subdependentInfo.permissionDependencies.length > 0)

	uncheckExternalDependents(subdependents)
}

interface FlagSelectorInfo {
	"model": Ref<number>,
	"header": string,
	"permissionGroup": PermissionGroup<any, any>,
	"dependentGroups": PermissionGroup<any, any>[],
	"uncheckExternal": (dependencies: ExternalPermissionDependencyInfo<any, any>[]) => void,
	"checkExternal": (dependencies: ExternalPermissionDependencyInfo<any, any>[]) => void
}

function makeFlagSelectorInfo(
	header: string,
	permissionGroup: PermissionGroup<any, any>,
	{
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		uncheckExternal = () => {},
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		checkExternal = () => {},
		dependentGroups = []
	}: Partial<{
		"dependentGroups": PermissionGroup<any, any>[]
		"uncheckExternal": (dependencies: ExternalPermissionDependencyInfo<any, any>[]) => void,
		"checkExternal": (dependencies: ExternalPermissionDependencyInfo<any, any>[]) => void
	}> = {}
): FlagSelectorInfo {
	return {
		checkExternal,
		dependentGroups,
		header,
		"model": computed<number>({
			get(): number { return role.value.data[permissionGroup.name] },
			set(newValue: number): void { role.value.data[permissionGroup.name] = newValue }
		}),
		permissionGroup,
		uncheckExternal
	}
}

const flagSelectors: FlagSelectorInfo[] = [
	makeFlagSelectorInfo("Semester", semesterPermissions),
	makeFlagSelectorInfo("Tag", tagPermissions),
	makeFlagSelectorInfo("Post", postPermissions, {
		"dependentGroups": [ commentPermissions ],
		"uncheckExternal": uncheckExternalDependents
	}),
	makeFlagSelectorInfo("Comment", commentPermissions, {
		"checkExternal": checkExternalDependencies
	}),
	makeFlagSelectorInfo("Profanity", profanityPermissions),
	makeFlagSelectorInfo("User", userPermissions),
	makeFlagSelectorInfo("Audit Trail", auditTrailPermissions)
]

const {
	"state": isBeingConfirmed,
	"on": openConfirmation,
	"off": closeConfirmation
} = makeSwitch(false)

async function updateRole() {
	await fetcher.update(role.value.data.id, {
		"auditTrailFlags": role.value.data.auditTrailFlags,
		"commentFlags": role.value.data.commentFlags,
		"deletedAt": role.value.data.deletedAt?.toJSON() || null,
		"departmentFlags": role.value.data.departmentFlags,
		"name": role.value.data.name,
		"postFlags": role.value.data.postFlags,
		"profanityFlags": role.value.data.profanityFlags,
		"roleFlags": role.value.data.roleFlags,
		"semesterFlags": role.value.data.semesterFlags,
		"tagFlags": role.value.data.tagFlags,
		"userFlags": role.value.data.userFlags
	}, {
		"extraDataFields": {
			"meta": {
				"password": password.value
			}
		}
	})
	.then(({ body, status }) => {
		closeConfirmation()
		password.value = ""
		console.log(body, status)
	})
}

async function archiveRole() {
	await fetcher.archive([ role.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

async function restoreRole() {
	await fetcher.restore([ role.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}
</script>
