import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useRef, useState } from "react"
import { EditUserValidation } from "./Validations"
import axios from "axios"
import { AuthContext } from "./context/authContext"

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

    // Check for any errors
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
      setErrors(prevErrors => ({
        ...prevErrors,
        api: err.response.data.message
      }));
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username"><strong>Username</strong></label>
            <input type="username" ref={usernameEditRef} onChange={handleInput} name="username"
              className="form-control rounded-0" />
            {errors.username && <span className="text-danger">{errors.username}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email</strong></label>
            <input type="email" ref={emailEditRef} onChange={handleInput} name="email"
              className="form-control rounded-0" />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong> </label>
            <input type="password" placeholder="Enter new password" onChange={handleInput} name="password"
              className="form-control rounded-0" />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="passwordConfirm"><strong>Confirm Password</strong> </label>
            <input type="password" placeholder="Confirm new password" onChange={handleInput} name="passwordConfirm"
              className="form-control rounded-0" />
            {errors.passwordConfirm && <span className="text-danger">{errors.passwordConfirm}</span>}
          </div>
          <button type="submit" className="btn btn-success w-100 mb-1"><strong>Update Profile</strong></button>
          <span className="text-danger">{errors.api}</span>
          <button type="button" className="btn btn-success w-100 mb-1" onClick={() => navigate('/')}>
            <strong>Go Back</strong></button>
        </form>
      </div>
    </div>
  )
}

export default EditUser;
