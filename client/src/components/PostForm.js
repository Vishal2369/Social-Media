import React from 'react';
import { Form, Button, TextArea } from 'semantic-ui-react';
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag';

import { useForm } from '../utils/hooks';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

function PostForm() {
    const { handleSubmit, handleChange, values } = useForm(createPostCallback, {
        body: ''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {

            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })

            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: [result.data.createPost, ...data.getPosts]
                }
            });

            values.body = '';
        },
        onError(err) {
            return err;
        }
    })

    function createPostCallback() {
        createPost();
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <h2 style={{ textAlign: 'center' }}>Create a Post</h2>
                <Form.Field>
                    <TextArea
                        placeholder="Hi World!!!"
                        name="body"
                        value={values.body}
                        onChange={handleChange}
                        error={error ? true : ''}
                    />
                    <Button type="submit" color="teal" style={{ marginTop: '2rem' }}>Submit</Button>
                </Form.Field>
            </Form>
            {
                error && (
                    <div className="ui error message">
                        <ul className="list">
                            <li>{error.graphQLErrors[0].message}</li>
                        </ul>
                    </div>
                )
            }
        </>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body : String!){
        createPost(body : $body){
            id
            body
            createdAt
            username
            likes{
                id
                username
                createdAt
            }
            likesCount
            comments{
                id
                body
                username
                createdAt
            }
            commentsCount
        }
    }
`;
export default PostForm;