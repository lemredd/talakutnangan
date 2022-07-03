<#
.SYNOPSIS
Custom commands for the project

.DESCRIPTION
Executes custom ommands for ease of use

.PARAMETER Help
Outputs the help info of the command

.PARAMETER Test
Switch to runs tests.

.PARAMETER SuiteNames
Only required if `-Test` switch is on.
It contains comma-delimited names of test suites to run.

.PARAMETER Watch
Only required if `-Test` switch is on.
It does not work properly if there are multiple suite names.

.INPUTS
All inputs are done through arguments.

.OUTPUTS
Depends on the command ran.

.EXAMPLE
PS> ./execute -help

Show the full help.

.EXAMPLE
PS> ./execute -test unit:server -watch

Runs the server unit tests.
#>

Param(
	[Parameter(ParameterSetName="Help")]
	[switch]
	$Help,

	[Parameter(ParameterSetName="Test")]
	[switch]
	$Test,

	[Parameter(ParameterSetName="Test", Mandatory)]
	[ValidateSet(
		"unit:share",
		"unit:front",
		"unit:server",
		"unit:database"
	)]
	[string[]]
	$SuiteNames,

	[Parameter(ParameterSetName="Test")]
	[switch]
	$Watch
)

if ($Help) {
	Get-Help $PSCommandPath -full
}

if ($Test) {
	foreach($name in $SuiteNames) {

	}
}
