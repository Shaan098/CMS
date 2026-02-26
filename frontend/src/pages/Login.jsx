import { Link } from 'react-router-dom';

const Login = () => {

  return (
    <div className="auth-wrap">
      <div className="card auth-chooser">
        <h2 className="auth-title">Choose Login Type</h2>
        <p className="muted">Use the correct portal for your account role.</p>

        <div className="auth-choice-grid">
          <Link className="auth-choice" to="/login/admin">
            <h3>Admin Login</h3>
            <p>For administrator accounts only.</p>
          </Link>

          <Link className="auth-choice" to="/login/user">
            <h3>User Login</h3>
            <p>For editor, approver, and viewer accounts.</p>
          </Link>
        </div>

        <p className="muted">
          New account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
