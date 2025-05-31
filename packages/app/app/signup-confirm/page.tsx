import { auth } from '@/app/actions';
import { redirect } from 'next/navigation';
import { post as confirmSignUp } from '@/app/data/actions/user/verify/post';
import { get as requestVerificationCode } from '@/app/data/actions/pending-user/confirmation-code/get';
import { get as getVerificationCodeExpiration } from '@/app/data/actions/pending-user/verification-code-timeout/get';
import SignupConfirmContent from './pageContent';

async function SignupConfirm() {
  const subject = await auth();

  if (!subject) {
    redirect('/login');
  }

  const verificationCodeExpiration = await getVerificationCodeExpiration();

  return (
    <SignupConfirmContent
      confirmSignUp={confirmSignUp}
      verificationCodeExpiration={verificationCodeExpiration}
      requestVerificationCode={requestVerificationCode}
      email={subject.properties.email}
    />
  );
}

export default SignupConfirm;
