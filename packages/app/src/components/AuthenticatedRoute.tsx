import { PropsWithChildren } from 'react'

function AuthenticatedRoute({ children }: PropsWithChildren) {
  return <>{children}</>
}

export default AuthenticatedRoute
