import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Transition } from 'semantic-ui-react';

import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';

import { AuthContext } from '../context/auth';

import { FETCH_POSTS_QUERY } from '../utils/graphql';

const Home = () => {
    const { user } = useContext(AuthContext);

    const { loading, data } = useQuery(FETCH_POSTS_QUERY);

    return (
        <Grid columns={3}>
            <Grid.Row>
                {user && (
                    <PostForm />
                )}
            </Grid.Row>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                <Transition.Group>
                    {
                        loading ? <h1>Loading....</h1>
                            : (
                                data.getPosts && data.getPosts.map(post => (
                                    <Grid.Column key={post.id} style={{ marginBottom: '20px' }}>
                                        <PostCard post={post} />
                                    </Grid.Column>
                                ))
                            )
                    }
                </Transition.Group>
            </Grid.Row>
        </Grid>
    )
}



export default Home;