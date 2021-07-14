import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../utils/graphql';

function DeleteButton({ postId, callback, commentId }) {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrMutation] = useMutation(mutation, {

        update(proxy) {
            setConfirmOpen(false);
            if (!commentId) {
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                })

                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        getPosts: data.getPosts.filter(post => post.id !== postId)
                    }
                });
            }

            if (callback) {
                callback();
            }
        },
        onError(err) {
            console.log(err);
        },

        variables: {
            postId,
            commentId
        }
    })
    return (
        <>
            <Popup content={commentId ? 'Delete Comment' : 'Delete Post'} inverted trigger={
                <Button as="div" color="red" style={{ float: 'right' }} onClick={() => setConfirmOpen(true)}>
                    <Icon name="trash" />
                </Button>
            } />
            <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePostOrMutation} />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId : ID!){
        deletePost(postId : $postId)
    }
`;

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId : ID!, $commentId : ID!){
        deleteComment(postId : $postId, commentId : $commentId)
    }
`;
export default DeleteButton;