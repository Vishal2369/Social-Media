import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Card, Image, Button, Icon, Label, Popup } from 'semantic-ui-react';

import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

import { AuthContext } from '../context/auth';

function PostCard({ post: { id, body, createdAt, commentsCount, comments, likesCount, likes, username } }) {

    const { user } = useContext(AuthContext);

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/elliot.jpg'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)} ago</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likesCount }} />
                <Popup
                    content="Comment"
                    inverted
                    trigger={
                        <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                            <Button basic color='blue'>
                                <Icon name='comment' />
                            </Button>
                            <Label basic color='blue' pointing='left'>
                                {commentsCount}
                            </Label>
                        </Button>
                    }
                />

                {
                    user && user.username === username && (
                        <DeleteButton postId={id} />
                    )
                }
            </Card.Content>
        </Card>
    )
}

export default PostCard;