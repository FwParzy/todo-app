import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginValidation } from "./Validations";

const Login = () => {
  const [errors, setErrors] = useState({
    email: '',
    password: ''

  })
  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({...prev, [name]: value}))
  }

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = LoginValidation(values);
    setErrors(validationErrors);
  }

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email</strong></label>
            <input type="email"  placeholder="Enter email" onChange={handleInput} name="email"
              className="form-control rounded-0"/>
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong> </label>
            <input type="password"  placeholder="Enter password" onChange={handleInput} name="password"
              className="form-control rounded-0"/>
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-success w-100"><strong>Log in</strong></button>
          <p>Ben Yes Ben</p>
          <Link to="/register" className="btn btn-default border w-100 bg-light">Register</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
