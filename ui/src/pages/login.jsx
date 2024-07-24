import { Helmet } from 'react-helmet-async';
import React, { useState, useContext } from 'react';

import { AuthContext } from 'src/components/oauth';

import { LoginView } from 'src/sections/login';

export default function LoginPage() {
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const handleLogin = async (username, password) => {
    try {
      const user = await authenticate({ username, password });
      setUser(user);
    } catch (err) {
      setError('Incorrect username or password.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Ansible Manager</title>
      </Helmet>
      <LoginView onLogin={handleLogin} />
      {error && <div>{error}</div>}
    </>
  );
}

const authenticate = async ({ username, password }) => {
  const response = await fetch('http://localhost:8080/v1/auth/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username,
      password,
      grant_type: 'password',
    }),
  });

  if (!response.ok) {
    throw new Error('Incorrect username or password.');
  }

  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return { username };
};
