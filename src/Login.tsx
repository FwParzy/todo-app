const Login = () => {

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <form>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email</strong></label>
            <input type="email"  placeholder="Enter email" className="form-control rounded-0"/>
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong> </label>
            <input type="password"  placeholder="Enter password" className="form-control rounded-0"/>
          </div>
          <button className="btn btn-success w-100"><strong>Log in</strong></button>
          <p>Ben Yes Ben</p>
          <button className="btn btn-default border w-100 bg-light">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
