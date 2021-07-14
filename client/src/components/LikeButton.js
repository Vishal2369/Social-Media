import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { Button, Label, Icon, Popup } from 'semantic-ui-react';

function LikeButton({ user, post: { id, likes, likesCount } }) {

    const [liked, setLiked] = useState(false);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id }
    })

    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [user, likes])

    const likeButton = user ?
        (liked ? (
            <Button color='teal' >
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic >
                <Icon name='heart' />
            </Button>
        )
        )
        : (
            <Button as={Link} to={'/login'} color='teal' basic >
                <Icon name='heart' />
            </Button>
        )

    return (
        <Popup content={liked ? 'Dislike' : 'Like'} inverted trigger={
            <Button as='div' labelPosition='right' onClick={likePost}>
                {likeButton}
                <Label as='a' basic color='teal' pointing='left'>
                    {likesCount}
                </Label>
            </Button>
        } />
    )
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId : ID!){
        likePost(postId : $postId){
            id
            likes{
                id
                username
            }
            likesCount
        }
    }
`;

export default LikeButton;