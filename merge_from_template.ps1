#!/usr/bin/env pwsh
param($branch)

git checkout template--$branch
git pull template $branch
git checkout merged_template

git merge template--$branch
if ($LastExitCode -ne 0) {
	& git status

	$answer = Read-Host -prompt "Have you fixed the conflicts? Enter 'y' to continue"
	if ($answer -eq "y") {
		& git add .
		& git commit
	} else {
		exit 1
	}
}

git merge master
if ($LastExitCode -ne 0) {
	& git status

	$answer = Read-Host -prompt "Have you fixed the conflicts (currently in merged template)? Enter 'y' to continue"
	if ($answer -eq "y") {
		& git add .
		& git commit
	} else {
		exit 1
	}
}

git checkout master
git checkout merged_template -- .

if ($LastExitCode -ne 0) {
	& git status

	$answer = Read-Host -prompt "Have you fixed the conflicts (currently in master)? Enter 'y' to continue"
	if ($answer -ne "y") {
		exit 1
	}
}

& git add .
& git commit
