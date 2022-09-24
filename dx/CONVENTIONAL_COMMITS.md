## Conventional Commits
The purpose of this documentation is to guide collaborators of this project on committing according
to the type of change.

### Primary types
These are the general types of commit that repository has. There MAY be other types that will be
proposed in the future.

Type        | Description
--- | ---
*feat:*     | A type that focuses on the project's enhancement by implementing a new feature that is **felt or seen** by the users via browsers or APIs.
*types:*    | A type that focuses on commits to type files and application of new types to other components
*style:*    | This focuses on any kinds of changes in UI.
*config:*   | This focuses on changes in the configuration files of the project.
*ci:*       | A *config:* type where it focuses on changes in configurations of workflows.
*fix:*      | This focuses on debugging and solving problems in features, tests, or configurations.
*refactor:* | This focuses on refactored code.
*perf:*     | A *refactor:* type where it focuses on optimizing code.
*rfmt:*     | A *refactor:* type where it focuses on reformed HTML templates.
*docs:*     | This focuses on additions or changes in any of the documentation files.
*intrn:*    | Any commit that do not contribute to features but it is within on the **internals** of the feature.
*share:*    | A specific *intrn:* type focuses on general additions/changes/removal in shareable code.
*dx:*       | A type for commits which improved the developer experience but does not add value to the clients.
*test:*     | This focuses on any kinds of test scripts.
*unit:*     | A *test:* type for commits that focuses to unit tests.
*intg:*     | A *test:* type for commits that focuses to integration tests.
*chore:*    | Any other commits that are still uncategorized falls into this commit.

For more information, please visit the [specification].

### Scoped types
If a commit type has multiple types, it is possible to nest it under a primary type. For instance, a
"Test" commit can be classified as either unit or integration. To further specify the type of
commit, one can use "test(unit):" or "test(integration):". Below are scoped types usually used
during development.

Scope          | Description | Remarks
--- | --- | ---
server         |  For commits which affect server's mechanism (middlewares, routing, etc...).      | -
database       |  For commits which affect the communication between the app server and database.  | -
authentication |  For commits which affect authentication components.                              | -
email          |  For commits which affect email components or communication to SMTP server.       | -
call           |  For commits which affect call components or peer communication                   | -
deps           |  For commits which add, remove, or change dependencies                            | Strictly for *chore:* types only and are excluded in logs.
unit           |  For commits which affect the unit tests                                          | Strictly for *test:* types only
integration    |  For commits which affect the integration tests                                   | Strictly for *test:* types only

Note that some of the scopes are only recommendations. It is up to the developer's discretion on
what name would the scoped commit be given, as long as it lines up to the focus of the commit and is
appropriate.

### Guidelines
- When specifying scopes, complete spelling of the type is a MUST.
- Lowercase SHOULD be used for the scopes. The tool will properly capitalize the first letter upon
  generating the change log.
- Uppercase SHOULD be used if the scope is an acronym.
- It is best to follow the current scopes before the next release. Upon releasing the new version,
  developers SHOULD apply the new spellings of the labels.
- New scopes MAY be committed immediately.

### Further Reading
There is also a good [article] to read about the Conventional Commits.
A [guide] for these commits has been provided to better understand their usage.

[specification]: https://www.conventionalcommits.org/en/v1.0.0/
[article]: https://medium.com/neudesic-innovation/conventional-commits-a-better-way-78d6785c2e08
[guide]: ./commit_type_guide.png
