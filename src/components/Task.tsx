import { useContext, useEffect, useRef, useState } from "react";
import TaskEdit from "./TaskEdit";
import { TaskType } from "../types/taskTypes";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { TaskCatValidation, TaskCreateValidation } from "../utils/Validations";
import "../css/task.css"

interface Props {
  task: TaskType;
  onUpdateTask: () => void;
  onUpdateCategory: () => void;
}


const Task = ({ task: initialTask, onUpdateTask, onUpdateCategory }: Props) => {
  const { currentUser } = useContext(AuthContext);
  const [task, setTask] = useState<TaskType>(initialTask);

  const [values, setValues] = useState({
    id: task.id,
    userId: currentUser.id,
    categoryId: task.categoryId,
    name: task.name,
    completed: task.completed,
    createTs: task.createTs,
    cancelTs: task.cancelTs,
    deleteTs: task.deleteTs,
  })
  const [errors, setErrors] = useState({
    userId: '',
    categoryId: '',
    name: '',
    api: ''
  })

  const taskNameRef = useRef<HTMLInputElement>(null)
  const [editTaskVisibility, setEditTaskVisibility] = useState(false)

  // This sets the ref to the name for Task editing
  useEffect(() => {
    if (editTaskVisibility && taskNameRef.current) {
      taskNameRef.current.value = task.name;
    }
  }, [editTaskVisibility]);

  // This updates the tasks after they are edited and saved
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  function handleTaskPopup() {
    if (editTaskVisibility) {
      setErrors({
        userId: '',
        categoryId: '',
        name: '',
        api: ''
      })
    }
    setEditTaskVisibility(!editTaskVisibility)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleEditTask = async () => {
    if (values.name === initialTask.name) {
      handleTaskPopup();
      return;
    }

    const validationErrors = TaskCreateValidation(values);
    setErrors(validationErrors);
    if (validationErrors.name !== ''
      || validationErrors.userId !== ''
      || validationErrors.categoryId !== '') return;

    try {
      await axios.post('http://localhost:8081/api/task/updateName', values);
    } catch (err) {
      setErrors(prevErrors => ({
        ...prevErrors,
        api: err.response.data.message
      }));
    }
    onUpdateTask();
    handleTaskPopup()
  }

  const handleDeleteTask = async () => {
    const validationErrors = TaskCreateValidation(values);
    setErrors(validationErrors);
    if (validationErrors.userId !== ''
      || validationErrors.categoryId !== '') return;

    try {
      await axios.post('http://localhost:8081/api/task/deleteOne', values);
    } catch (err) {
      setErrors(prevErrors => ({
        ...prevErrors,
        api: err.response.data.message
      }));
    }
    onUpdateTask();
    handleTaskPopup()
  }

  const handleTaskClick = async () => {
    try {
      await axios.post('http://localhost:8081/api/task/complete', values);
    } catch (err) {
      setErrors(prevErrors => ({
        ...prevErrors,
        api: err.response.data.message
      }));
    }
    onUpdateTask();
  }

  const handleCategoryChange = async (selectedCategory: number) => {
    const values = {
      id: task.id,
      userId: currentUser.id,
      categoryId: task.categoryId,
      newCatId: selectedCategory
    }
    const validationErrors = TaskCatValidation(values);
    setErrors(prevErrors => ({
      ...prevErrors,
      categoryId: validationErrors.categoryId
    }));

    if (validationErrors.categoryId !== '') return;

    try {
      await axios.post('http://localhost:8081/api/task/changeCat', values);
    } catch (err) {
      setErrors(prevErrors => ({
        ...prevErrors,
        api: err.response.data.message
      }));
    }
    onUpdateCategory()
    onUpdateTask()
    handleTaskPopup()
  }

  return (
    task.deleteTs === null && (
      <div>
        {!editTaskVisibility &&
          <div className="circle-checkbox">
            <input
              type="checkbox"
              checked={!!task.completed}
              id={`task-${task.id}`}
              onChange={handleTaskClick}
            />
            <span onClick={handleTaskClick} className="clickable-area"/>
            <span onClick={handleTaskPopup}>{task.name}</span>
          </div>
        }

        {editTaskVisibility &&
          <>
            <TaskEdit
              inputRef={taskNameRef}
              onCancel={handleTaskPopup}
              onChange={handleInput}
              onOk={handleEditTask}
              onDelete={handleDeleteTask}
              currentCategory={task.categoryId}
              onCategoryChange={handleCategoryChange}
              completed={task.completed}
              onTaskComplete={handleTaskClick}
            />
            <span className="text-danger">{errors.name}</span>
            <span className="text-danger">{errors.userId}</span>
            <span className="text-danger">{errors.categoryId}</span>
          </>
        }
        <span className="text-danger">{errors.api}</span>
      </div>
    )
  )
}

export default Task
