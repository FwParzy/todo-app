import { useEffect, useRef, useState } from "react";
import TaskEdit from "./TaskEdit";
import { getCurrentTimestamp, setTaskDeleteTs } from "../utils/timeUtils";
import { TaskType } from "../types/taskTypes";

interface Props {
  task: any;
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

  function handleEditTaskName() {
    const name = taskNameRef.current?.value;
    if (!name) return

    const updatedTask = {
      ...task,
      name: name
    };

    editTask(updatedTask)
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

  function handleTaskClick() {
    toggleTask(task.id)
  }

  return (
    task.deleteTs === null && (
      <div>
        <input type="checkbox" checked={task.completed} onChange={handleTaskClick} />
        <span onClick={handleTaskPopup}>{task.name}</span>

        {editTaskVisibility &&
          <TaskEdit
            inputRef={taskNameRef}
            onCancel={handleTaskPopup}
            onOk={handleEditTaskName}
            onDelete={handleDeleteTask}
          />
        }
      </div>
    )
  )
}

export default Task
