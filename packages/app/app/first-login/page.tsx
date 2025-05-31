import AuthenticatedRoute from '@/app/components/AuthenticatedRoute';
import FirstLoginForm from './FirstLoginForm';

function FirstLogin() {
  return (
    <AuthenticatedRoute>
      <section className="section">
        <div className="container box">
          <h1 className="title">Welcome to ClimbingTopos.com</h1>
          <h5 className="subtitle is-5">Let's setup your account</h5>
          <div className="container">
            <FirstLoginForm />
          </div>
        </div>
      </section>
    </AuthenticatedRoute>
  );
}

export default FirstLogin;
