import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRedirectIfAuthenticated } from '../hooks/useRedirectIfAuthenticated';

function Login() {

  const [ usernameValue, setUsernameValue ] = useState('');
  const [ passwordValue, setPasswordValue ] = useState('');

  const navigate = useNavigate();

  useRedirectIfAuthenticated('login', '/folders');

  async function handleSubmit(e) {
    e.preventDefault();

    const url = `${import.meta.env.VITE_DEV_API_URL}login`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: usernameValue,
        password: passwordValue,
      }),
      credentials: 'include'
    });

    const data = await response.json();
    console.log(data)
    if (data.success) {
      console.log("The token is: ", data.auth.token);
      navigate('/folders', { replace: true });
    }
    else {
      console.log(data.message);
    }

  }

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}> 
          <div>
            <label>
              Username: 
              <input name='username' type='text' value={usernameValue} onChange={e => setUsernameValue(e.target.value)} required/>
            </label>
          </div>
          <div>
            <label> 
              Password:
              <input name='password' type='password' value={passwordValue} onChange={e => setPasswordValue(e.target.value)} required/>
            </label>
          </div>
          <button type='submit'>Log in</button>
        </form>
        <Link to={'/signup'}>Sign up here</Link>
      </div>
    </>
  )
}

export default Login
