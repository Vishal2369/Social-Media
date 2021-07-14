import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { Button, Form } from 'semantic-ui-react';

import { useForm } from '../utils/hooks';
import { AuthContext } from '../context/auth';

const Login = () => {
    const context = useContext(AuthContext);
    const history = useHistory();

    const [errors, setErrors] = useState({});

    const { values, handleChange, handleSubmit } = useForm(loginCallback, {
        username: '',
        password: '',
    })

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, { data: { login: userData } }) {
            console.log(userData);
            context.login(userData)
            history.push('/')
        },
        onError(err) {
            console.log(err);
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    })

    function loginCallback() {
        loginUser();
    }


    return (
        <div className="form-container">
            <Form onSubmit={handleSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Login</h1>
                <Form.Input
                    type="text"
                    error={errors.username ? true : false}
                    label="Username"
                    placeholder="Username.."
                    name="username"
                    value={values.username} onChange={handleChange} />

                <Form.Input
                    type="password"
                    error={errors.password ? true : false}
                    label="Password"
                    placeholder="Password.."
                    name="password"
                    value={values.password} onChange={handleChange} />

                <Button type="submit" primary>Login</Button>
            </Form>

            { Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map((val, idx) => (
                            <li key={idx}>{val}</li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    )
}

const LOGIN_USER = gql`
    mutation login(
        $username : String!
        $password : String!
    ) {
        login(
            username : $username    
            password : $password
        ){
            id
            username
            email
            createdAt
            token
        }
    }
`;

export default Login;