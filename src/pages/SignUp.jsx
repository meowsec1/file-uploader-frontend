import { useState } from 'react';

function SignUp() {

    const [ usernameValue, setUsernameValue ] = useState('');
    const [ passwordValue, setPasswordValue ] = useState('');
    const [ passwordConfirmValue, setPasswordConfirmValue ] = useState('');
    const [ errorMessages, setErrorMessages ] = useState([]);

    async function handleSubmit(e) {
        e.preventDefault()
        console.log("form submitted! signing user up");
        const url = `${import.meta.env.VITE_DEV_API_URL}signup`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameValue,
                password: passwordValue,
                passwordConfirm: passwordConfirmValue
            })
        });
        const data = await response.json();
        console.log("Data: ", data);

        // failed sign up, display the messages
        if (!data.success) {
            setErrorMessages(data.errors)
        } else {
            return;
            // redirect to someplace else
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input id="username" name="username" type="text" onChange={e => setUsernameValue(e.target.value)} required />
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input id="password" name="password" type="password" onChange={e => setPasswordValue(e.target.value)} required />
                </div>

                <div>
                    <label htmlFor="passwordConfirm">Confirm Password:</label>
                    <input id="passwordConfirm" name="passwordConfirm" type="password" onChange={e => setPasswordConfirmValue(e.target.value)} required />
                </div>

                <button type="submit">Sign Up</button>
            </form>
            {errorMessages.map(error => <li key={error.msg}>{error.msg}</li> )}
        </>
    )
}

export default SignUp;