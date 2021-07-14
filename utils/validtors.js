exports.validateRegisterInput = (username, email, password, confirmPassword) => {
    const errors = {};

    if (username.trim() === "") {
        errors.username = 'Username must not be empty';
    }

    if (email.trim() === "") {
        errors.email = 'Email must not be empty';
    } else {
        let regExp = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
        if (!regExp.test(email)) {
            errors.email = 'Email should be a valid email';
        }
    }

    if (password.trim() === "") {
        errors.password = 'Password must not be empty';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords must match";
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}

exports.validateLoginInput = (username, password) => {
    const errors = {};

    if (username.trim() === "") {
        errors.username = "Username must not be empty";
    }

    if (password.trim() === "") {
        errors.password = "Password must not be empty";
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}