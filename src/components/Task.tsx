import { useEffect, useRef, useState } from "react";
import TaskEdit from "./TaskEdit";
import { getCurrentTimestamp, setTaskDeleteTs } from "../utils/timeUtils";
import { TaskType } from "../types/taskTypes";

interface Props {
  task: TaskType;
  toggleTask: any;
  editTask: (updatedTask: TaskType) => void;
}


const Task = ({ task: initialTask, toggleTask, editTask }: Props) => {
  const [task, setTask] = useState<TaskType>(initialTask);
  const firstRender = useRef(true);

  useEffect(() => {
    // Define the callback function
    const updateTask = () => {
      if (task.cancelTs === null) return;
      if (task.deleteTs !== null) return;

      const updatedTask = setTaskDeleteTs(task);
      if (!updatedTask) return

      setTask(updatedTask);
      console.log('Deleted ' + task.name);
      editTask(updatedTask);
    };


    if (firstRender.current) {
      updateTask();
      firstRender.current = false;
    }

    // Set up the interval to call the callback function every hour
    const intervalId = setInterval(updateTask, 60 * 60 * 1000);
    // const intervalId = setInterval(updateTask, 10 * 1000);
    return () => clearInterval(intervalId);
  }, [task]);


  const taskNameRef = useRef<HTMLInputElement>(null)
  const [editTaskVisibility, setEditTaskVisibility] = useState(false)
  const [changedCategory, setChangedCategory] = useState(task.categoryId)


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
    setEditTaskVisibility(!editTaskVisibility)
  }

  function handleEditTask() {
    const name = taskNameRef.current?.value;
    if (!name) return
    if (!changedCategory) return

    const updatedTask = {
      ...task,
      name: name,
      categoryId: changedCategory
    };

    editTask(updatedTask)

    // I know this isnt very react of me, but i am stupid and spent 4 hours
    // trying to get categories to update from here. This is a compromise
    if(task.categoryId !== updatedTask.categoryId) window.location.reload();

    handleTaskPopup()
  }

  function handleDeleteTask() {
    const deleteTs = getCurrentTimestamp()
    const cancelTs = getCurrentTimestamp()
    if (!deleteTs) return

    const updatedTask = {
      ...task,
      cancelTs: cancelTs,
      deleteTs: deleteTs
    };

    editTask(updatedTask)
    handleTaskPopup()
  }

  function handleCategoryChange(selectedCategory: string) {
    setChangedCategory(selectedCategory)
  }

  function handleTaskClick() {
    toggleTask(task.id)
  }

  return (
    task.deleteTs === null && (
      <div>
        <input type="checkbox" checked={task.completed} onChange={handleTaskClick} />

        {!editTaskVisibility &&
          <span onClick={handleTaskPopup}>{task.name}</span>
        }

        {editTaskVisibility &&
          <>
            <span>{task.name}</span>
            <TaskEdit
              inputRef={taskNameRef}
              onCancel={handleTaskPopup}
              onOk={handleEditTask}
              onDelete={handleDeleteTask}
              currentCategory={task.categoryId}
              onCategoryChange={handleCategoryChange}
            />
          </>
        }
      </div>
    )
  )
}

export default Task
