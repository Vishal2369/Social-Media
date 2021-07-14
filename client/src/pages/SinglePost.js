import React, { useContext, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Card, Grid, Image, Button, Label, Icon, Form, Popup } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';

import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

function SinglePost(props) {
    const postId = props.match.params.postId;

    const { user } = useContext(AuthContext);

    const history = useHistory();

    const [comment, setComment] = useState('');
    const commentInputRef = useRef(null);

    const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    });

    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update() {
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    })

    function deletePostCallback() {
        history.push('/');
    }

    let postMarkup;

    if (!getPost) {
        postMarkup = <h1>Loading...</h1>
    } else {
        postMarkup = (
            <h1>Hello</h1>
        );
        const { id, body, createdAt, username, comments, likes, likesCount, commentsCount } = getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image src='https://react.semantic-ui.com/images/avatar/large/elliot.jpg' alt='profile pic' size='small' float='right' />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likesCount, likes }} />
                                <Popup content="Comment" inverted trigger={<Button as='div' labelPosition='right'>
                                    <Button basic color='blue'>
                                        <Icon name='comments' />
                                    </Button>
                                    <Label basic color='blue' pointing='left'>
                                        {commentsCount}
                                    </Label>
                                </Button>} />
                                {user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback} />}
                            </Card.Content>
                        </Card>
                        {
                            user && (
                                <Card fluid>
                                    <Card.Content>
                                        <p>Post a comment</p>
                                        <Form>
                                            <div className="ui action input fluid">
                                                <input type="text" placeholder="Comment..." value={comment} onChange={e => setComment(e.target.value)} ref={commentInputRef} />
                                                <button type="submit" className="ui button teal" disabled={comment.trim() === ''} onClick={createComment}>Comment</button>
                                            </div>
                                        </Form>
                                    </Card.Content>
                                </Card>
                            )
                        }
                        {
                            comments.map(comment => (
                                <Card fluid key={comment.id}>
                                    <Card.Content>
                                        {user && user.username === comment.username && <DeleteButton postId={id} commentId={comment.id} />}
                                        <Card.Header>{comment.username}</Card.Header>
                                        <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                        <Card.Description>{comment.body}</Card.Description>
                                    </Card.Content>
                                </Card>
                            ))
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup
}

const FETCH_POST_QUERY = gql`
    query($postId : ID!){
        getPost(postId : $postId){
            id
            username
            body
            createdAt
            likesCount
            likes{
                username
            }
            commentsCount
            comments{
                id
                body
                username
                createdAt
            }
        }
    }
`;

const CREATE_COMMENT_MUTATION = gql`
    mutation createComment($postId : ID!, $body : String!){
        createComment(postId : $postId, body : $body){
            id
            commentsCount
            comments{
                id
                body
                username
                createdAt
            }
        }
    }
`;
export default SinglePost;