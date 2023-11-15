import { useContext, useEffect, useRef, useState } from 'react';
import { handleEnterKey } from '../utils/keyboardUtils';
import CategoryList from '../components/CategoryList';
import { CategoryType } from '../types/categoryType';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { CategoryCreateValidation } from '../utils/Validations';
import "../css/app.css"
import axiosInstance from '../context/axiosContext';

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

  const [newCategoryVisibility, setNewCategoryVisibility] = useState(false)
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const categoryNameRef = useRef<HTMLInputElement>(null)
  const [values, setValues] = useState({
    name: '',
    userId: currentUser?.id
  })
  const [errors, setErrors] = useState({
    name: '',
    userId: '',
    api: ''
  })

  const fetchCategories = () => {
    if (!currentUser) return
    axiosInstance.get(`/api/cat/${currentUser.id}`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(err => {
        const response = err.response ? err.response.data.message : 'Cannot connect to the server'
        setErrors(prevErrors => ({
          ...prevErrors,
          api: response
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
        await axiosInstance.post('/api/task/deleteOld', values);
      } catch (err) {
        const response = err.response ? err.response.data.message : 'Cannot connect to the server'
        setErrors(prevErrors => ({
          ...prevErrors,
          api: response
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

  function toggleNewCatVisibility() {
    setNewCategoryVisibility(!newCategoryVisibility)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleAddCategory = async () => {
    const validationErrors = CategoryCreateValidation(values);
    setErrors(validationErrors);
    if (validationErrors.name !== '' || validationErrors.userId !== '') return;

    try {
      await axiosInstance.post('/api/cat/create', values);
      fetchCategories();
      categoryNameRef.current.value = ''
    } catch (err) {
      const response = err.response ? err.response.data.message : 'Cannot connect to the server'
      setErrors(prevErrors => ({
        ...prevErrors,
        api: response
      }));
    }
  }

  const handleDownloadMd = async () => {
    if (!currentUser?.id) return;

    console.log('downloading')
    try {
      const catUrl = `/api/cat/${currentUser.id}`
      const taskUrl = `/api/task/all-${currentUser.id}`

      const categoriesResponse = await axiosInstance.get(catUrl);
      const tasksResponse = await axiosInstance.get(taskUrl);

      const categoriesData = categoriesResponse.data;
      const tasksData = tasksResponse.data;

      const response = await axiosInstance.post('/api/export/md',
        { categories: categoriesData, tasks: tasksData }, {
        responseType: 'blob'
      });

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', 'notes.md');
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.parentNode.removeChild(fileLink);
      window.URL.revokeObjectURL(fileURL);

    } catch (err) {
      const response = err.response ? err.response.data.message : 'Cannot connect to the server'
      setErrors(prevErrors => ({
        ...prevErrors,
        api: response
      }));
    }
  };

  return (
    <div className='app-container'>
      <div className='user'>
        <button type="button"
          className={`user-btns ${newCategoryVisibility ? 'active' : ''}`}
          onClick={toggleNewCatVisibility} >Add a Category</button>
        <button type="button" className='user-btns' onClick={handleDownloadMd}>
          Download as Md
        </button>
        {currentUser && <button
          type="button"
          className='user-btns'
          onClick={() => navigate('/editUser')}
        >Edit {currentUser.username}</button>}
        <button type="button"
          className='user-btns'
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >Logout</button>
      </div>
      <span className="text-danger">{errors.api}</span>
      <div className='cat-list'>
        <CategoryList
          categories={categories}
          onUpdateCategory={fetchCategories}
        />
        {newCategoryVisibility &&
          <div className='add-category'>
            <input
              className='app-input'
              ref={categoryNameRef}
              type="text"
              name="name"
              placeholder="Enter Category"
              onChange={handleInput}
              onKeyDown={(e) => handleEnterKey(e, handleAddCategory)}
              autoFocus
            />
            <button className='app-input-btn' onClick={handleAddCategory}>Add Category</button>
          </div>
        }
      </div>
      <span className="text-danger">{errors.name}</span>
      <span className="text-danger">{errors.userId}</span>
    </div>
  )
}

export default App;
