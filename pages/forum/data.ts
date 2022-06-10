import { badWordExist } from "./profanityFilter";

var secludedPosts =
[

];

var posts =
[
    {
        id:1,
        user: "User 1",
        title: "Bagsak grade ko dahil kay Putanginang Domingo",
        desc: "gago ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        badWordExist: function()
        {
            return badWordExist(this.title)||badWordExist(this.desc);
        },
        voters: [
            "User 1"
        ],
        downVoters: [
           
        ],
        voteCount: function()
        {
            return this.voters.length;
        },
    },
    {
        id:2,
        user: "User 2",
        title: "Morbi blandit cursus risus at",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        badWordExist: function()
        {
            return badWordExist(this.title)||badWordExist(this.desc);
        },
        voters: [
            
        ],
        downVoters: [
            
        ],
        voteCount: function()
        {
            return this.voters.length;
        },
    },
    {
        id:3,
        user: "User 3",
        title: "Morbi blandit cursus risus at",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        badWordExist: function()
        {
            return badWordExist(this.title)||badWordExist(this.desc);
        },
        voters: [
            
        ],
        downVoters: [
            
        ],
        voteCount: function()
        {
            return this.voters.length;
        },
        
    },
    {
        id:4,
        user: "User 4",
        title: "Morbi blandit cursus risus at",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        badWordExist: function()
        {
            return badWordExist(this.title)||badWordExist(this.desc);
        },
        voters: [
            
        ],
        downVoters: [
           
        ],
        voteCount: function()
        {
            return this.voters.length;
        },
    },
    {
        id:5,
        user: "User 5",
        title: "Morbi blandit cursus risus at",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        badWordExist: function()
        {
            return badWordExist(this.title)||badWordExist(this.desc);
        },
        voters: [
            
        ],
        downVoters: [
           
        ],
        voteCount: function()
        {
            return this.voters.length;
        },
    }
];

export function getPosts()
{
    return posts;
}

export function getSecludedPosts()
{
    return secludedPosts;
}
