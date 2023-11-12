import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useRef, useState } from "react"
import { EditUserValidation } from "../utils/Validations"
import axios from "axios"
import { AuthContext } from "../context/authContext"
import "../css/user-forms.css"

const EditUser = () => {
  const { currentUser, editUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const usernameEditRef = useRef<HTMLInputElement>(null)
  const emailEditRef = useRef<HTMLInputElement>(null)


  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
    if (usernameEditRef.current) {
      usernameEditRef.current.value = currentUser.username;
    }
    if (emailEditRef.current) {
      emailEditRef.current.value = currentUser.email;
    }
  }, [currentUser, navigate]);

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    api: ''
  })
  const [values, setValues] = useState({
    id: currentUser.id,
    username: currentUser.username,
    email: currentUser.email,
    password: '',
    passwordConfirm: ''
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = EditUserValidation(values);
    setErrors(validationErrors);

    // Check for errors
    if (validationErrors.username !== ''
      || validationErrors.email !== ''
      || validationErrors.password !== ''
      || validationErrors.passwordConfirm !== '')
      return;
    // Check if edited
    if (values.username === currentUser.username
      && values.email === currentUser.email
      && values.password === '')
      return validationErrors.api = 'Nothing to update'
    try {
      await axios.post('http://localhost:8081/api/auth/editUser', values);
      await editUser(values)
      navigate('/');
    } catch (err) {
      const response = err.response ? err.response.data.messgae : 'Cannot connect to the server'
      setErrors(prevErrors => ({
        ...prevErrors,
        api: response 
      }));
    }
  }

  return (
    <div className="container">
      <div className="form-box">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="input-label">Username</label>
            <input
              type="username"
              ref={usernameEditRef}
              onChange={handleInput}
              name="username"
              className="form-control text-input" />
            {errors.username && <span className="text-danger">{errors.username}</span>}
          </div>
          <div>
            <label htmlFor="email" className="input-label">Email</label>
            <input
              type="email"
              ref={emailEditRef}
              onChange={handleInput}
              name="email"
              className="form-control text-input" />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div>
            <label htmlFor="password" className="input-label">Password </label>
            <input
              type="password"
              placeholder="Enter new password"
              onChange={handleInput}
              name="password"
              className="form-control text-input" />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>
          <div>
            <label htmlFor="passwordConfirm" className="input-label">Confirm Password </label>
            <input
              type="password"
              placeholder="Confirm new password"
              onChange={handleInput}
              name="passwordConfirm"
              className="form-control text-input" />
            {errors.passwordConfirm &&
              <span className="text-danger">{errors.passwordConfirm}</span>}
          </div>
          <button type="submit" className="submit-btn">Update Profile</button>
          <span className="text-danger">{errors.api}</span>
          <button type="button" className="redirect-btn" onClick={() => navigate('/')}>
            Go Back</button>
        </form>
      </div>
    </div>
  )
}

export default EditUser;
