import { useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { handleEnterKey } from './utils/keyboardUtils';
import CategoryList from './components/CategoryList';
import { CategoryType } from './types/categoryType';
import { getCurrentTimestamp } from './utils/timeUtils';
import { AuthContext } from './context/authContext';
import { useNavigate } from 'react-router-dom';

const LOCAL_STORAGE_KEY = 'todoApp.categories'
function App() {

  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const categoryNameRef = useRef<HTMLInputElement>(null)

  const initializeCategories = () => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  };
  const [categories, setCategories] = useState(initializeCategories)

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
  }, [categories])

  const refreshCategories = () => {
    console.log("refreshing tasks")
    const updatedCategories = initializeCategories();
    setCategories(updatedCategories);
  }

  function handleAddCategory() {
    const name = categoryNameRef.current?.value;
    if (!name) return

    refreshCategories()
    setCategories((prevCategories: CategoryType[]) => {
      return [...prevCategories, {
        id: uuidv4(),
        name: name,
        createTs: getCurrentTimestamp(),
        cancelTs: null,
        deleteTs: null
      }]
    })
    categoryNameRef.current.value = ''
  }

  function handleUpdateCategory(updatedCategory: CategoryType) {
    setCategories((prevCategories: CategoryType[]) => {
      return prevCategories.map(cat =>
        cat.id === updatedCategory.id ? updatedCategory : cat
      );
    });
  }

  return (
    <div>
      <CategoryList
        categories={categories}
        onUpdateCategory={handleUpdateCategory}
      />
      <input
        ref={categoryNameRef}
        type="text"
        name="inputCategory"
        placeholder="Enter Category"
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
    </div>
  )
}

export default App;
