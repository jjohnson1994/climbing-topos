"use client"

import { PropsWithChildren } from "react"
import useUser from '@/app/api/user';
import { redirect } from 'next/navigation'

const AuthenticaedRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    redirect('/login')
  }

  return (
    <>
      {children}
    </>
  )
}

export default AuthenticaedRoute
