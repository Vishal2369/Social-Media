const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/post');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (error) {
                throw new Error(error)
            }
        },

        getPost: async (_, { postId }, context, info) => {
            try {
                const post = await Post.findById(postId);

                if (!post) {
                    throw new Error('Post not found');
                }

                return post;

            } catch (err) {
                throw new Error(err);
            }
        }
    },

    Mutation: {
        createPost: async (_, { body }, context, info) => {
            const user = checkAuth(context);

            if (body.trim() === '') {
                throw new Error('Post body must not be empty');
            }
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const post = await newPost.save();

            return post;
        },

        deletePost: async (_, { postId }, context, info) => {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);
                if (post.username === user.username) {
                    await post.delete();
                    return "Post deleted successfully";
                } else {
                    throw new AuthenticationError('Action denied');
                }
            } catch (err) {
                throw new Error(err);
            }
        },

        createComment: async (_, { postId, body }, context, info) => {
            const { username } = checkAuth(context);

            if (body.trim() === '') {
                throw new UserInputError('Empty String', {
                    errors: {
                        body: 'Comment body must not be empty'
                    }
                }
                );
            }

            const post = await Post.findById(postId);

            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })

                await post.save();

                return post;
            }

            throw new UserInputError('Post not found')

        },

        deleteComment: async (_, { postId, commentId }, context, info) => {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                const commentIndex = post.comments.findIndex(c => c.id === commentId);

                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1);

                    await post.save();

                    return "Comment delete successfully";
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            }

            throw new UserInputError('Post not found');
        },

        likePost: async (_, { postId }, context, info) => {
            const { username } = checkAuth(context);

            try {
                const post = await Post.findById(postId);

                if (post) {
                    if (post.likes.find(l => l.username === username)) {

                        post.likes = post.likes.filter(l => l.username !== username);

                    } else {
                        post.likes.push({
                            username,
                            createdAt: new Date().toISOString()
                        })
                    }

                    await post.save();

                    return post;
                } else {
                    throw new UserInputError('Action not allowed')
                }

            } catch (err) {
                throw new Error(err);
            }
        }
    }

}