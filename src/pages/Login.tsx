import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginValidation } from "../utils/Validations";
import { AuthContext } from '../context/authContext';
import axios from "axios";
import "../css/user-forms.css"
import axiosInstance from "../context/axiosContext";

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
      await login(values);
      await axiosInstance.post('/api/auth/login', values);
      navigate('/');
    } catch (err) {
      const response = err.response ? err.response.data.message : 'Cannot connect to the server'
      setErrors(prevErrors => ({
        ...prevErrors,
        api: response
      }));
    }
  }

  const handleRegister = () => {
    navigate('/register')
  }

  return (
    <div className="container">
      <div className="form-box">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="input-label">Username</label>
            <input type="text" placeholder="Enter username" onChange={handleInput} name="username"
              className="form-control text-input" />
            {errors.username && <span className="text-danger">{errors.username}</span>}
          </div>
          <div>
            <label htmlFor="password" className="input-label">Password</label>
            <input type="password" placeholder="Enter password" onChange={handleInput} name="password"
              className="form-control text-input" />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>
          <button type="submit" className="submit-btn"><strong>Log in</strong></button>
          <span className="text-danger">{errors.api}</span>
          <button
            type="button"
            onClick={handleRegister}
            className="redirect-btn">Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
