const { gql } = require('apollo-server')

module.exports = gql`
type Post {
    id : ID!,
    body : String!,
    username : String!,
    createdAt : String!,
    comments : [Comment]!,
    likes : [like]!,
    likesCount : Int!,
    commentsCount : Int!
}

type Comment{
    id : ID!,
    body : String!,
    username : String!,
    createdAt : String!
}

type like{
    id : ID!,
    username : String!,
    createdAt : String!
}

input RegisterInput {
    username : String!,
    email : String!,
    password : String!,
    confirmPassword : String!
}

type User {
    id : ID!,
    email : String!,
    username : String!,
    token : String!,
    createdAt : String!
}
type Query {
    getPosts : [Post],
    getPost(postId : ID!) : Post
}

type Mutation{
    register(registerInput : RegisterInput) : User!,
    login(username : String!, password : String!) : User!,
    createPost(body : String!) : Post!,
    deletePost(postId : ID!) : String!,
    createComment(postId : ID!, body : String!) : Post!,
    deleteComment(postId : ID!, commentId : ID!) : String!,
    likePost(postId : ID!) : Post!
}
`;