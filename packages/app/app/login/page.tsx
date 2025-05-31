'use client';

import { signIn } from '@/app/data/actions/user';

import LoginContent from './pageContent';

const Login = () => {
  return (
    <section className="section">
      <div className="container box">
        <h1 className="title">Login</h1>
        <LoginContent signIn={signIn} />
      </div>
    </section>
  );
};

export default Login;
