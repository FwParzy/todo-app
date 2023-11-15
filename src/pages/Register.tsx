import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { RegistrationValidation } from "../utils/Validations"
import "../css/user-forms.css"
import axiosInstance from "../context/axiosContext"

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

  const createTutorial = async (userId: number) => {
    const tutorialCategories = [
      {
        name: 'Tutorial', userId: userId, tasks: [
          'Welcome to my app! This is a recreation of my favorite notes app',
          'No need to alt tab to this app to find your notes',
          'If your on Windows Press \'Alt+Shift+i\' to bring this app in focus',
          'If your on Mac Press \'Command+Shift+i\' to bring this app in focus'
        ]
      },
      {
        name: 'This is a Category', userId: userId, tasks: [
          'This is a Task!',
          'Click on a Category name to add a Task',
          'Click on a task\'s circle to complete it',
          'Completed tasks are deleted at midnight',
          'Click on a Tasks name to edit your task if you made a mistake',
          'Clicking the waffle icon to the right of a Category name will let you edit/delete the categories too'
        ]
      }
    ];

    // Create each category
    for (const category of tutorialCategories) {
      try {
        const res = await axiosInstance.post('/api/cat/create', { name: category.name, userId });
        console.log(res.data)
        const categoryId = res.data.categoryId;

        // Create tasks for this category
        for (const taskName of category.tasks) {
          console.log({
            name: taskName,
            userId,
            categoryId
          })
          await axiosInstance.post('/api/task/create', {
            name: taskName,
            userId,
            categoryId
          });
        }
      } catch (err) {
        console.error('Error creating tutorial category or tasks:', err);
      }
    }
  };

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
      const res = await axiosInstance.post('/api/auth/register', values);
      if (res.data.userId) {
        await createTutorial(res.data.userId);
      }

      navigate('/login');
    } catch (err) {
      const response = err.response ? err.response.data.message : 'Cannot connect to the server'
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
