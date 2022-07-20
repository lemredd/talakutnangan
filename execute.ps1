<#
.SYNOPSIS
Custom commands for the project

.DESCRIPTION
Executes custom ommands for ease of use

.PARAMETER Help
Outputs the help info of the command

.PARAMETER Test
Switch to runs tests.

.PARAMETER SuiteName
Only required if `-Test` switch is on.
It contains the name of test suite to run.

.PARAMETER Watch
Only required if `-Test` switch is on.
This watches the files included on specified tests.

.INPUTS
All inputs are done through arguments.

.OUTPUTS
Depends on the command ran.

.EXAMPLE
PS> ./execute -help

Show the full help.

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

	[Parameter(ParameterSetName="Test", Position=0)]
	[switch]
	$Test,

	[Parameter(ParameterSetName="Test", Mandatory, Position=1)]
	[ValidateSet(
		"unit:share",
		"unit:front",
		"unit:ui",
		"unit:back",
		"unit:server",
		"unit:database",
		"intg:front",
		"intg:back"
	)]
	[string]
	$SuiteName,

	[Parameter(ParameterSetName="Test", Position=2)]
	[switch]
	$Watch
)

if ($Help) {
	Get-Help $PSCommandPath -full
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
