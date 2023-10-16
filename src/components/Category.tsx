import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { TaskType } from '../types/taskTypes';

import TaskEdit from "./TaskEdit";
import TaskList from "./TaskList";
import { checkDayChange, getCurrentTimestamp, processTasks } from "../utils/timeUtils";
import { handleEnterKey } from "../utils/keyboardUtils";

interface Props {
  category: any;
}

const LOCAL_STORAGE_KEY = 'todoApp.tasks'

const Category = ({ category }: Props) => {

  const [addTaskVisibility, setAddTaskVisibility] = useState(false)

  function handleTaskPopup() {
    setAddTaskVisibility(!addTaskVisibility)
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

  function handleAddTask() {
    const name = taskNameRef.current?.value;
    console.log(name)
    if (!name) return
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
    console.log(getCurrentTimestamp())
  }

  function handleEditTask(updatedTask: TaskType) {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? { ...updatedTask } : task,
      )
    );
  }

  function toggleTask(id: any) {
    const newTasks = [...tasks]
    const task = newTasks.find(task => task.id === id)
    task.completed = !task.completed
    task.cancelTs = getCurrentTimestamp()
    if (!task.completed) task.cancelTs = null
    setTasks(newTasks)
  }

  return (
    <div>
      <h2 onClick={handleTaskPopup}>
        {category.name}
      </h2>
      <TaskList
        tasks={tasks}
        toggleTask={toggleTask}
        category={category.id}
        editTask={handleEditTask}
      />
      {addTaskVisibility &&
        <TaskEdit
          inputRef={taskNameRef}
          onCancel={handleTaskPopup}
          onOk={handleAddTask}
        />
      }
    </div>
  )
}
export default Category
