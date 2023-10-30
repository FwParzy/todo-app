import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { RegistrationValidation } from "../utils/Validations"
import axios from "axios"

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
      setErrors(prevErrors => ({
        ...prevErrors,
        api: err.response.data.message
      }));
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username"><strong>Username</strong></label>
            <input type="username" placeholder="Enter Username" onChange={handleInput} name="username"
              className="form-control rounded-0" />
            {errors.username && <span className="text-danger">{errors.username}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email</strong></label>
            <input type="email" placeholder="Enter email" onChange={handleInput} name="email"
              className="form-control rounded-0" />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong> </label>
            <input type="password" placeholder="Enter password" onChange={handleInput} name="password"
              className="form-control rounded-0" />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="passwordConfirm"><strong>Confirm Password</strong> </label>
            <input type="password" placeholder="Confirm password" onChange={handleInput} name="passwordConfirm"
              className="form-control rounded-0" />
            {errors.passwordConfirm && <span className="text-danger">{errors.passwordConfirm}</span>}
          </div>
          <button type="submit" className="btn btn-success w-100 mb-1"><strong>Sign up</strong></button>
          <span className="text-danger">{errors.api}</span>
          <Link to="/login"
            className="btn btn-default border w-100 bg-light">Log in</Link>
        </form>
      </div>
    </div>
  )
}

export default Register
