<#
.SYNOPSIS
Custom commands for the project

.DESCRIPTION
Executes custom ommands for ease of use

.PARAMETER Help
Outputs the detailed help info of the command

.PARAMETER Examples
Only works if `-Help` switch is on.
Includes examples in the help info.

.PARAMETER Push
Pushes the current branch to remote.

.PARAMETER Pull
Pulls the all branches from remote and prunes remotely-deleted branches.

.PARAMETER Remote
Only works if one of `-Push` or `-Pull` switches is on.
Specifies which remote to ush or pull.

.PARAMETER Test
Switch to runs tests.

.PARAMETER SuiteName
Only required if `-Test` switch is on.
It contains the name of test suite to run.

.PARAMETER Watch
Only works if `-Test` switch is on.
This watches the files included on specified tests.

.INPUTS
All inputs are done through arguments.

.OUTPUTS
Depends on the command ran.

.EXAMPLE
PS> ./execute -help

Show the detailed help.

.EXAMPLE
PS> ./execute -test unit:front -watch

Runs the front-end unit tests.

.EXAMPLE
PS> ./execute -test -suitenames unit:server -watch

Runs and watches the server unit tests.
#>

Param(
	[Parameter(ParameterSetName="Help", Position=0)]
	[switch]
	$Help,

	[Parameter(ParameterSetName="Help", Position=1)]
	[switch]
	$Examples,

	[Parameter(ParameterSetName="PushRepo", Position=0)]
	[switch]
	$Push,

	[Parameter(ParameterSetName="PullRepo", Position=0)]
	[switch]
	$Pull,

	[Parameter(ParameterSetName="PushRepo", Position=1)]
	[Parameter(ParameterSetName="PullRepo", Position=1)]
	[string]
	$Remote = "origin",

	[Parameter(ParameterSetName="Test", Position=0)]
	[switch]
	$Test,

	[Parameter(ParameterSetName="Test", Mandatory, Position=1)]
	[ValidateSet(
		"unit:share",
		"unit:front",
		"unit:server",
		"unit:database",
		"intg:back"
	)]
	[string]
	$SuiteName,

	[Parameter(ParameterSetName="Test", Position=2)]
	[switch]
	$Watch
)

if ($Help) {
	Get-Help $PSCommandPath -detailed
	if ($Examples) {
		Get-Help $PSCommandPath -examples
	}
}

if ($Test) {
	$type, $name = $SuiteName.Split(":")

	$configuration = "jest.$($name).$($type).config.json"
	if ($type -eq "unit") {
		$configuration = "jest.$($name).config.json"
	}

	$watchFlag = ""
	if ($Watch) {
		$watchFlag = "--watch"
	}

	& npx cross-env NODE_ENV=$($type)_test jest -c ${configuration} $($watchFlag)
}

if ($Push) {
	$currentBranch = & git branch --show-current
	& git push -u $($Remote) $($currentBranch)
}
