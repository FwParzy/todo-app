import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { TaskType } from '../types/taskTypes';

import TaskEdit from "./TaskEdit";
import TaskList from "./TaskList";
import { getCurrentTimestamp } from "../utils/timeUtils";
import { handleEnterKey } from "../utils/keyboardUtils";
import { CategoryType } from "../types/categoryType";

interface Props {
  category: any;
  onUpdateCategory: (updatedCategory: CategoryType) => void;
}

const LOCAL_STORAGE_KEY = 'todoApp.tasks'

const Category = ({ category, onUpdateCategory }: Props) => {

  const [isTaskEditVisible, setIsTaskEditVisible] = useState(false)
  const [isCategoryEditVisible, setIsCategoryEditVisible] = useState(false)

  function handleTaskPopup() {
    setIsTaskEditVisible(!isTaskEditVisible)
  }

  function handleCategoryPopup() {
    setIsCategoryEditVisible(!isCategoryEditVisible)
  }

  const initializeTasks = () => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  };

  const taskNameRef = useRef<HTMLInputElement>(null)
  const [tasks, setTasks] = useState<TaskType[]>(initializeTasks);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks])

  const refreshTasks = () => {
    console.log("refreshing tasks")
    const updatedTasks = initializeTasks();
    setTasks(updatedTasks);
  }

  function handleAddTask() {
    const name = taskNameRef.current?.value;
    if (!name) return

    refreshTasks()
    setTasks((prevTasks: TaskType[]) => {
      return [...prevTasks, {
        id: uuidv4(),
        categoryId: category.id,
        name: name,
        completed: false,
        createTs: getCurrentTimestamp(),
        cancelTs: null,
        deleteTs: null
      }]
    })
    taskNameRef.current.value = ''
  }

  function handleEditTask(updatedTask: TaskType) {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? { ...updatedTask } : task,
      )
    );
  }

  function toggleTaskCompleted(id: any) {
    const newTasks = [...tasks]
    const task = newTasks.find(task => task.id === id)
    task.completed = !task.completed
    task.cancelTs = getCurrentTimestamp()
    if (!task.completed) task.cancelTs = null
    setTasks(newTasks)
  }

  const catEditRef = useRef<HTMLInputElement>(null)

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    // Guard for Ok and delete buttons
    if (event.currentTarget.contains(event.relatedTarget)) return;

    handleCancel();
  };

  function handleOk() {
    console.log("handling Ok")
    const newName = catEditRef.current?.value;
    if (!newName) return;

    const updatedCategory = {
      ...category,
      name: newName
    };
    onUpdateCategory(updatedCategory);
    setIsCategoryEditVisible(false);
  }

  function handleCancel() {
    setIsCategoryEditVisible(false)
  }

  function handleDelete() {
    console.log("handling Delete")
    const deleted = getCurrentTimestamp()
    const canceled = getCurrentTimestamp()

    const updatedCategory = {
      ...category,
      cancelTs: canceled,
      deleteTs: deleted
    };
    onUpdateCategory(updatedCategory);
    setIsCategoryEditVisible(false);

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.categoryId === updatedCategory.id
          ? { ...task, cancelTs: canceled, deleteTs: deleted }
          : task
      )
    );
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
            <h2> {category.name} </h2>
            <TaskEdit
              inputRef={taskNameRef}
              onCancel={handleTaskPopup}
              onOk={handleAddTask}
              currentCategory={category.id}
            />
          </>
        }
        {!isTaskEditVisible && !isCategoryEditVisible &&
          <>
            <h2 onClick={handleTaskPopup}> {category.name} </h2>
            <button onClick={handleCategoryPopup} > Edit </button>
          </>
        }
        {isCategoryEditVisible &&
          <div className='task_edit' onBlur={handleBlur}>
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
          toggleTask={toggleTaskCompleted}
          category={category.id}
          editTask={handleEditTask}
        />
      </div>
    )
  )
}
export default Category
