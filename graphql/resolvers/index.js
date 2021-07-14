const postResolver = require('./posts');
const userResolver = require('./users');
module.exports = {
    Post: {
        likesCount: parent => parent.likes.length,
        commentsCount: parent => parent.comments.length
    },
    Query: {
        ...postResolver.Query
    },

    Mutation: {
        ...userResolver.Mutation,
        ...postResolver.Mutation
    }
}