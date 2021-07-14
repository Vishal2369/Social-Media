import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { Button, Form } from 'semantic-ui-react';

import { useForm } from '../utils/hooks';
import { AuthContext } from '../context/auth';

const Register = () => {
    const context = useContext(AuthContext);
    const history = useHistory();

    const [errors, setErrors] = useState({});

    const { values, handleChange, handleSubmit } = useForm(register, {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, { data: { register: userData } }) {
            context.login(userData);
            history.push('/login')
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })

    function register() {
        addUser();
    }


    return (
        <div className="form-container">
            <Form onSubmit={handleSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Register</h1>
                <Form.Input
                    type="text"
                    error={errors.username ? true : false}
                    label="Username"
                    placeholder="Username.."
                    name="username"
                    value={values.username} onChange={handleChange} />

                <Form.Input
                    type="email"
                    error={errors.email ? true : false}
                    label="Email"
                    placeholder="Email.."
                    name="email"
                    value={values.email} onChange={handleChange} />

                <Form.Input
                    type="password"
                    error={errors.password ? true : false}
                    label="Password"
                    placeholder="Password.."
                    name="password"
                    value={values.password} onChange={handleChange} />

                <Form.Input
                    type="password"
                    error={errors.confirmPassword ? true : false}
                    label="Confirm Password"
                    placeholder="Confirm Password.."
                    name="confirmPassword"
                    value={values.confirmPassword} onChange={handleChange} />

                <Button type="submit" primary>Register</Button>
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

const REGISTER_USER = gql`
    mutation register(
        $username : String!
        $email : String!
        $password : String!
        $confirmPassword : String!
    ) {
        register(
            registerInput : {
                username : $username
                email : $email
                password : $password
                confirmPassword : $confirmPassword
            }
        ){
            id
            username
            email
            createdAt
            token
        }
    }
`;

export default Register;