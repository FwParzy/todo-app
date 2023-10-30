import { useContext, useEffect, useRef, useState } from 'react';
import { handleEnterKey } from '../utils/keyboardUtils';
import CategoryList from '../components/CategoryList';
import { CategoryType } from '../types/categoryType';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CategoryCreateValidation } from '../utils/Validations';
// Remove unusedPackages uuid
// Rebase timeUtils

function App() {

  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const categoryNameRef = useRef<HTMLInputElement>(null)

  const fetchCategories = () => {
    if (currentUser) {
      axios.get(`http://localhost:8081/api/cat/${currentUser.id}`)
        .then(response => {
          setCategories(response.data);
          // console.log(response.data[3].name)
        })
        .catch(error => {
          console.error("Error fetching categories:", error);
        });
    }
  }
  // Populate the page with categories api
  useEffect(() => {
    fetchCategories()
}, [currentUser]);

  const [values, setValues] = useState({
    name: '',
    userId: currentUser.id
  })
  const [errors, setErrors] = useState({
    name: '',
    userId: '',
    api: ''
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }))
  }

const handleAddCategory = async() => {
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
    <div>
      <CategoryList
        categories={categories}
        onUpdateCategory={fetchCategories}
      />
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
      <button type="button"
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >Logout</button>
      {currentUser && <button type="button" onClick={() => navigate('/editUser')}> Edit {currentUser.username}</button>}
      <span className="text-danger">{errors.api}</span>
      <span className="text-danger">{errors.name}</span>
      <span className="text-danger">{errors.userId}</span>
    </div>
  )
}

export default App;
