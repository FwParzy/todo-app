import { useContext, useEffect, useRef, useState } from 'react';
import { handleEnterKey } from '../utils/keyboardUtils';
import CategoryList from '../components/CategoryList';
import { CategoryType } from '../types/categoryType';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CategoryCreateValidation } from '../utils/Validations';
import "../css/app.css"
// Remove unusedPackages uuid

function App() {

  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const firstRender = useRef(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const categoryNameRef = useRef<HTMLInputElement>(null)
  const [values, setValues] = useState({
    name: '',
    userId: currentUser.id
  })
  const [errors, setErrors] = useState({
    name: '',
    userId: '',
    api: ''
  })

  const fetchCategories = () => {
    if (!currentUser) return
    axios.get(`http://localhost:8081/api/cat/${currentUser.id}`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(err => {
        setErrors(prevErrors => ({
          ...prevErrors,
          api: err.response.data.message
        }));
      });
  }
  // Populate the page with categories api
  useEffect(() => {
    fetchCategories()
  }, [currentUser]);

  // This effectively deletes completed tasks at midnight
  useEffect(() => {
    const updateTasks = async () => {
      try {
        await axios.post('http://localhost:8081/api/task/deleteOld', values);
      } catch (err) {
        setErrors(prevErrors => ({
          ...prevErrors,
          api: err.response.data.message
        }));
      }
    };

    if (firstRender.current) {
      updateTasks();
      firstRender.current = false;
    }

    // Set up the interval to call the callback function every hour
    const intervalId = setInterval(updateTasks, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleAddCategory = async () => {
    const validationErrors = CategoryCreateValidation(values);
    setErrors(validationErrors);
    if (validationErrors.name !== '' || validationErrors.userId !== '') return;

    try {
      await axios.post('http://localhost:8081/api/cat/create', values);
      fetchCategories();
      categoryNameRef.current.value = ''
    } catch (err) {
      setErrors(prevErrors => ({
        ...prevErrors,
        api: err.response.data.message
      }));
    }
  }

  return (
    <div className='app-container'>
      <span className="text-danger">{errors.api}</span>
      <div className='cat-list'>
        <CategoryList
          categories={categories}
          onUpdateCategory={fetchCategories}
        />
        <div className='add-category'>
          <input
            ref={categoryNameRef}
            type="text"
            name="name"
            placeholder="Enter Category"
            onChange={handleInput}
            onKeyDown={(e) => handleEnterKey(e, handleAddCategory)}
            autoFocus
          />
          <button onClick={handleAddCategory}>Add Category</button>
        </div>

      </div>
      <div className='user'>
        <button type="button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >Logout</button>
        {currentUser && <button type="button" onClick={() => navigate('/editUser')}> Edit {currentUser.username}</button>}
      </div>

      <span className="text-danger">{errors.name}</span>
      <span className="text-danger">{errors.userId}</span>
    </div>
  )
}

export default App;
