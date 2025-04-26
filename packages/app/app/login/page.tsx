'use client';

import { Suspense } from 'react';
import { signIn } from '@/app/data/actions/user';

import LoginContent from './pageContent';

const Login = () => {
  return <LoginContent signIn={signIn} />;
};

export default Login;
