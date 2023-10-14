import { useEffect, useRef, useState } from "react";
import TaskEdit from "./TaskEdit";

interface Props {
  task: any;
  toggleTask: any;
  editTaskName: (id: string, name: string) => void;
}


const Task = ({ task, toggleTask, editTaskName }: Props) => {

  const taskNameRef = useRef<HTMLInputElement>(null)
  const [editTaskVisibility, setEditTaskVisibility] = useState(false)

  function handleTaskPopup() {
    setEditTaskVisibility(!editTaskVisibility)
  }

  function handleEditTask() {
    const name = taskNameRef.current?.value;
    if (!name) return
    editTaskName(task.id, name)
    handleTaskPopup()
  }

  useEffect(() => {
    if (editTaskVisibility && taskNameRef.current) {
      taskNameRef.current.value = task.name;
    }
  }, [editTaskVisibility]);

  function handleTaskClick() {
    toggleTask(task.id)
  }

  return (
    <div>
      <input type="checkbox" checked={task.completed} onChange={handleTaskClick} />
      <span onClick={handleTaskPopup}>{task.name}</span>

      {editTaskVisibility &&
        <TaskEdit
          inputRef={taskNameRef}
          onCancel={handleTaskPopup}
          onOk={handleEditTask}
        />
      }
    </div>
  )
}

export default Task
