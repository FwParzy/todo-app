import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { handleEnterKey } from './utils/keyboardUtils';
import CategoryList from './components/CategoryList';

const LOCAL_STORAGE_KEY = 'todoApp.categories'
function App() {

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

  function handleAddCategory() {
    const name = categoryNameRef.current?.value;
    if (!name) return
    setCategories(prevCategories => {
      return [...prevCategories, { id: uuidv4(), name: name }]
    })
    categoryNameRef.current.value = ''
  }

  return (
    <div>
      <CategoryList categories={categories} />
      <input
        ref={categoryNameRef}
        type="text"
        name="inputCategory"
        placeholder="Enter Category"
        onKeyDown={(e) => handleEnterKey(e, handleAddCategory)}
        autoFocus
      />
      <button onClick={handleAddCategory}>Add Category</button>
    </div>
  )
}

export default App;
