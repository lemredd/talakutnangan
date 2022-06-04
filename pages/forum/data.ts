var posts =
[
    {
        id:1,
        user: "User 1",
        title: "Morbi blandit cursus risus at",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        voters: [
            "Names 1","Name 2", "Name 3"
        ],
        voteCount: function()
        {
            return this.voters.length;
        }
    },
    {
        id:2,
        user: "User 2",
        title: "Morbi blandit cursus risus at",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        voters: [
            "Names 1","Name 2", "Name 3"
        ],
        voteCount: function()
        {
            return this.voters.length;
        }
    },
    {  
        id:3,
        user: "User 3",
        title: "Morbi blandit cursus risus at",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        voters: [
            "Names 1","Name 2", "Name 3"
        ],
        voteCount: function()
        {
            return this.voters.length;
        }
    },
    {
        id:4,
        user: "User 4",
        title: "Morbi blandit cursus risus at",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        voters: [
            "Names 1","Name 2", "Name 3"
        ],
        voteCount: function()
        {
            return this.voters.length;
        }
    },
    {
        id:4,
        user: "User 5",
        title: "Morbi blandit cursus risus at",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        voters: [
            "Names 1","Name 2", "Name 3"
        ],
        voteCount: function()
        {
            return this.voters.length;
        }
    }
];

export function getPosts()
{
    return posts;
}
