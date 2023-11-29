import { useContext, useEffect, useRef, useState } from "react";
import { TaskType } from '../types/taskTypes';
import TaskEdit from "./TaskEdit";
import TaskList from "./TaskList";
import { handleEnterKey } from "../utils/keyboardUtils";
import { CategoryType } from "../types/categoryType";
import { AuthContext } from "../context/authContext";
import { TaskCreateValidation } from "../utils/Validations";
import "../css/category.css"
import WaffleIcon from '../assets/WaffleIcon.png';
import axiosInstance from "../context/axiosContext";

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
    setErrors({
      name: '',
      userId: '',
      categoryId: '',
      api: ''
    })
  }

  function handleCategoryPopup() {
    setIsCategoryEditVisible(!isCategoryEditVisible)
  }

  const taskNameRef = useRef<HTMLInputElement>(null)
  const [tasks, setTasks] = useState<TaskType[]>([{
  id: 0,
  categoryId: 0,
  name: '0',
  completed: false,
  createTs: null,
  cancelTs: null,
  deleteTs: null
}]);

  const fetchTasks = () => {
    if (currentUser) {
      axiosInstance.get(`/api/task/${currentUser.id}&${category.id}`)
        .then(response => {
          setTasks(response.data);
        })
        .catch(err => {
          const response = err.response ? err.response.data.message : 'Cannot connect to the server'
          setErrors(prevErrors => ({
            ...prevErrors,
            api: response
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
      await axiosInstance.post('/api/task/create', values);
      fetchTasks();
      taskNameRef.current.value = ''
    } catch (err) {
      const response = err.response ? err.response.data.message : 'Cannot connect to the server'
      setErrors(prevErrors => ({
        ...prevErrors,
        api: response
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
      await axiosInstance.post('/api/cat/updateName', values);
    } catch (err) {
      const response = err.response ? err.response.data.message : 'Cannot connect to the server'
      setErrors(prevErrors => ({
        ...prevErrors,
        api: response
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
      await axiosInstance.post('/api/cat/delete', values);
      await axiosInstance.post('/api/task/deleteCat', values);
    } catch (err) {
      const response = err.response ? err.response.data.message : 'Cannot connect to the server'
      setErrors(prevErrors => ({
        ...prevErrors,
        api: response
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
      <div className="category-container">
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
          <div className="header-container">
            <h2 className="category-title" onClick={handleTaskPopup} > {category.name} </h2>
            <button onClick={handleCategoryPopup} className="category-btn">
              <img className="edit-img" src={WaffleIcon} alt="alt" />
            </button>
          </div>
        }
        {isCategoryEditVisible &&
          <div className='category-edit'
            onBlur={handleBlur} >
            <input
              ref={catEditRef}
              type="text"
              name="inputCategory"
              onKeyDown={(e) => handleEnterKey(e, handleOk)}
              className='category-edit-input'
              autoFocus
            />
            <div className="category-edit-btns">
              <button onClick={handleDelete} className='category-edit-btn btn-del'>Delete</button>
              <button onClick={handleCancel} className="category-edit-btn btn-cancel">Cancel</button>
              <button onClick={handleOk} className='category-edit-btn btn-wide'>Ok</button>
            </div>
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
