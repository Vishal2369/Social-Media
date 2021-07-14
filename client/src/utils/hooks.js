import { useState } from 'react';

export const useForm = (callback, initialState = {}) => {

    const [values, setValues] = useState(initialState);

    const handleChange = (_, { name, value }) => {
        setValues({ ...values, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        callback();
    }

    return {
        values,
        handleChange,
        handleSubmit
    }
}