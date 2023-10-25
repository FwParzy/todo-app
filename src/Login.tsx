import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginValidation } from "./Validations";
import { AuthContext } from './context/authContext';
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    api: ''

  })
  const [values, setValues] = useState({
    username: '',
    password: ''
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({...prev, [name]: value}))
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = LoginValidation(values);
    setErrors(validationErrors);

      console.log('before guard')
    if (validationErrors.username !== '' || validationErrors.password !== '') return;
      console.log('after guard')
    try {
      console.log('inside try')
      await axios.post('http://localhost:8081/api/auth/login', values);
      console.log('post post')
      await login(values);
      console.log('post login')
      navigate('/');
    } catch (err) {
      setErrors(prevErrors => ({
        ...prevErrors,
        api: err.response.data.message
      }));
      console.log(err.response.data.message)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username"><strong>Username</strong></label>
            <input type="text" placeholder="Enter username" onChange={handleInput} name="username"
              className="form-control rounded-0"/>
            {errors.username && <span className="text-danger">{errors.username}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong> </label>
            <input type="password"  placeholder="Enter password" onChange={handleInput} name="password"
              className="form-control rounded-0"/>
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-success w-100"><strong>Log in</strong></button>
          <span className="text-danger">{errors.api}</span>
          <Link to="/register" className="btn btn-default border w-100 bg-light">Register</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
