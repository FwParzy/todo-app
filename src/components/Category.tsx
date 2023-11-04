import { useContext, useEffect, useRef, useState } from "react";
import { TaskType } from '../types/taskTypes';
import TaskEdit from "./TaskEdit";
import TaskList from "./TaskList";
import { getCurrentTimestamp } from "../utils/timeUtils";
import { handleEnterKey } from "../utils/keyboardUtils";
import { CategoryType } from "../types/categoryType";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { TaskCreateValidation } from "../utils/Validations";

interface Props {
  category: CategoryType;
  onUpdateCategory: () => void;
}

const Category = ({ category, onUpdateCategory }: Props) => {

  const { currentUser } = useContext(AuthContext);
  const [isTaskEditVisible, setIsTaskEditVisible] = useState(false)
  const [isCategoryEditVisible, setIsCategoryEditVisible] = useState(false)

  function handleTaskPopup() {
    setIsTaskEditVisible(!isTaskEditVisible)
  }

  function handleCategoryPopup() {
    setIsCategoryEditVisible(!isCategoryEditVisible)
  }

  const taskNameRef = useRef<HTMLInputElement>(null)
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const fetchTasks = () => {
    if (currentUser) {
      axios.get(`http://localhost:8081/api/task/${currentUser.id}&${category.id}`)
        .then(response => {
          setTasks(response.data);
        })
        .catch(err => {
          setErrors(prevErrors => ({
            ...prevErrors,
            api: err.response.data.message
          }));
        });
    }
  }
  // Populate the page with categories api
  useEffect(() => {
    fetchTasks()
  }, [currentUser, category]);

  const [values, setValues] = useState({
    name: '',
    userId: currentUser.id,
    categoryId: category.id
  })
  const [errors, setErrors] = useState({
    name: '',
    userId: '',
    categoryId: '',
    api: ''
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleAddTask = async () => {
    const validationErrors = TaskCreateValidation(values);
    setErrors(validationErrors);
    if (validationErrors.name !== ''
      || validationErrors.userId !== ''
      || validationErrors.categoryId !== '') return;

    try {
      await axios.post('http://localhost:8081/api/task/create', values);
      fetchTasks();
      taskNameRef.current.value = ''
    } catch (err) {
      setErrors(prevErrors => ({
        ...prevErrors,
        api: err.response.data.message
      }));
    }
  }

  const catEditRef = useRef<HTMLInputElement>(null)

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    // Guard for Ok and delete buttons
    if (event.currentTarget.contains(event.relatedTarget)) return;

    handleCancel();
  };

  const handleOk = async () => {
    const values = {
      name: catEditRef.current?.value,
      userId: currentUser.id,
      id: category.id
    };
    if (!values.name) return;

    try {
      await axios.post('http://localhost:8081/api/cat/updateName', values);
    } catch (err) {
      setErrors(prevErrors => ({
        ...prevErrors,
        api: err.response.data.message
      }));
    }
    onUpdateCategory();
    setIsCategoryEditVisible(false);
  }

  function handleCancel() {
    setIsCategoryEditVisible(false)
  }

  const handleDelete = async () => {
    const values = {
      userId: currentUser.id,
      id: category.id
    }
    try {
      await axios.post('http://localhost:8081/api/cat/delete', values);
      await axios.post('http://localhost:8081/api/task/deleteCat', values);
    } catch (err) {
      setErrors(prevErrors => ({
        ...prevErrors,
        api: err.response.data.message
      }));
    }
    onUpdateCategory();
    setIsCategoryEditVisible(false);
  }

  // This sets the ref to the name for Category editing
  useEffect(() => {
    if (isCategoryEditVisible && catEditRef.current) {
      catEditRef.current.value = category.name;
    }
  }, [isCategoryEditVisible]);

  return (
    category.deleteTs === null && (
      <div>
        {isTaskEditVisible &&
          <>
            <h2 className="category-title"> {category.name} </h2>
            <TaskEdit
              inputRef={taskNameRef}
              onChange={handleInput}
              onCancel={handleTaskPopup}
              onOk={handleAddTask}
              currentCategory={category.id}
            />
            <span className="text-danger">{errors.api}</span>
            <span className="text-danger">{errors.name}</span>
            <span className="text-danger">{errors.userId}</span>
            <span className="text-danger">{errors.categoryId}</span>
          </>
        }
        {!isTaskEditVisible && !isCategoryEditVisible &&
          <>
            <h2 onClick={handleTaskPopup} className="category-title"> {category.name} </h2>
            <button onClick={handleCategoryPopup} > Edit </button>
          </>
        }
        {isCategoryEditVisible &&
          <div className='category_edit category-title' onBlur={handleBlur} >
            <input
              ref={catEditRef}
              type="text"
              name="inputCategory"
              onKeyDown={(e) => handleEnterKey(e, handleOk)}
              className='category_edit_input'
              autoFocus
            />
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleOk} className='category_ok'>Ok</button>
            <button onClick={handleDelete} className='category_delete'>Delete</button>
          </div>
        }
        <TaskList
          tasks={tasks}
          category={category.id}
          onUpdateTask={fetchTasks}
          onUpdateCategory={onUpdateCategory}
        />
      </div>
    )
  )
}
export default Category
