import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginValidation } from "../utils/Validations";
import { AuthContext } from '../context/authContext';
import axios from "axios";
import "../css/login.css"

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
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = LoginValidation(values);
    setErrors(validationErrors);

    if (validationErrors.username !== '' || validationErrors.password !== '') return;

    try {
      await axios.post('http://localhost:8081/api/auth/login', values);
      await login(values);
      navigate('/');
    } catch (err) {
      setErrors(prevErrors => ({
        ...prevErrors,
        api: err.response.data.message
      }));
    }
  }

return (
    <div className="login-container">
      <div className="login-box">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="login-label">Username</label>
            <input type="text" placeholder="Enter username" onChange={handleInput} name="username"
              className="form-control login-input" />
            {errors.username && <span className="text-danger">{errors.username}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="login-label">Password</label>
            <input type="password" placeholder="Enter password" onChange={handleInput} name="password"
              className="form-control login-input" />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>
          <button type="submit" className="login-button"><strong>Log in</strong></button>
          <span className="text-danger">{errors.api}</span>
          <button type="button"  className="login-register-btn">
            <Link to="/register" className="login-register-link">Register</Link>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
