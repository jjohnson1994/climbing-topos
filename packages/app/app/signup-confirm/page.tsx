import { auth } from '@/app/actions';
import { redirect } from 'next/navigation';
import { post as confirmSignUp } from '@/app/data/actions/user/verify/post';
import SignupConfirmContent from './pageContent';

async function SignupConfirm() {
  const user = await auth();

  if (!user) {
    redirect('/login');
  }

  return (
    <SignupConfirmContent
      confirmSignUp={confirmSignUp}
      email={user.properties.email}
    />
  );
}

export default SignupConfirm;
