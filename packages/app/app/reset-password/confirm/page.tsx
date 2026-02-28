import { redirect } from 'next/navigation';
import ResetPasswordConfirmContent from './pageContent';

interface Props {
  searchParams: Promise<{ email?: string }>;
}

async function ResetPasswordConfirm({ searchParams }: Props) {
  const params = await searchParams;
  const email = params.email;

  if (!email) {
    redirect('/reset-password');
  }

  return <ResetPasswordConfirmContent email={email} />;
}

export default ResetPasswordConfirm;
