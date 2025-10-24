'use client';

import { signIn } from '@/app/data/actions/user';

import LoginContent from './pageContent';
import Link from 'next/link';

const Login = () => {
  return (
    <section className="section">
      <div className="container box">
        <h1 className="title">Login</h1>
        <LoginContent signIn={signIn} />
      </div>
      <div className="container">
        <div className="is-flex is-justify-content-center is-align-items-center">
          Don't have an account yet?
          <Link href="/signup">Sign up</Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
