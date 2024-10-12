'use client';

import { Suspense } from 'react';

import LoginContent from './pageContent';

const Login = () => {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}

export default Login;
