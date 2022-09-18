There is a custom script in this repository to aid the development. Here are some of the custom commands:
- `./execute -help`. Show the full information about the script. Run this command to know other commands.
- `./execute -push`. Push the current branch to remote _origin_.
- `./execute -pull`. Pulls the current branch and prunes other branches from remote _origin_.
- `./execute -test [-suitename <suitename>]`. Run certain tests indicated by a configuration. Suite
  name can be `unit:front` to run the front-end tests, `unit:back` to run common back-end tests, or
  others.
- `./execute -test [-suitename <suitename>] -watch`. Same as above yet it watches the files related
  to the tests.

### Pair Programming
When doing pair programming, it is recommended to attach the [co-authors]. Below are examples of
what to add at the end of the messages.

- `Co-authored-by: Angelo Magtoto <19201.magtoto.angelo.l@gmail.com>`
- `Co-authored-by: AteKitty07 <kiritogregorio@gmail.com>`
- `Co-authored-by: IKnightSKyl <johnjeromepertez@yahoo.com>`
- `Co-authored-by: Jarlem Red de Peralta <lmoa.jhdp@gmail.com>`
- `Co-authored-by: Kenneth Trecy Tobias <19201.tobias.kennethtrecy.c@gmail.com>`

[co-authors]: https://github.blog/2018-01-29-commit-together-with-co-authors/
