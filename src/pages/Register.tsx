import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { RegistrationValidation } from "../utils/Validations"
import axios from "axios"
import "../css/user-forms.css"

const Register = () => {

  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    api: ''
  })
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = RegistrationValidation(values);
    setErrors(validationErrors);

    if (validationErrors.username !== ''
      || validationErrors.email !== ''
      || validationErrors.password !== ''
      || validationErrors.passwordConfirm !== '')
      return;
    try {
      await axios.post('http://localhost:8081/api/auth/register', values);
      navigate('/login');
    } catch (err) {
      const response = err.response ? err.response.data.messgae : 'Cannot connect to the server'
      setErrors(prevErrors => ({
        ...prevErrors,
        api: response
      }));
    }
  }

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div className="container">
      <div className="form-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="input-label">Username</label>
            <input
              type="username"
              placeholder="Enter Username"
              onChange={handleInput}
              name="username"
              className="form-control text-input" />
            {errors.username && <span className="text-danger">{errors.username}</span>}
          </div>
          <div>
            <label
              htmlFor="email"
              className="input-label">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              onChange={handleInput}
              name="email"
              className="form-control text-input" />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div>
            <label
              htmlFor="password"
              className="input-label">Password </label>
            <input
              type="password"
              placeholder="Enter password"
              onChange={handleInput}
              name="password"
              className="form-control text-input" />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>
          <div>
            <label
              htmlFor="passwordConfirm"
              className="input-label">Confirm Password </label>
            <input
              type="password"
              placeholder="Confirm password"
              onChange={handleInput}
              name="passwordConfirm"
              className="form-control text-input" />
            {errors.passwordConfirm &&
              <span className="text-danger">{errors.passwordConfirm}</span>}
          </div>
          <button type="submit" className="submit-btn">Sign up</button>
          <span className="text-danger">{errors.api}</span>
          <button type="button" className="redirect-btn"
            onClick={handleLogin}>Log in</button>
        </form>
      </div>
    </div>
  )
}

export default Register
