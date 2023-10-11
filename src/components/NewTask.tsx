import { useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

type Props = {
  onCancel: () => void;
};

const NewTask = ({ onCancel }: Props) => {

  const taskNameRef = useRef<HTMLInputElement>(null)
  const [tasks, setTasks] = useState()

  function handleAddTask() {
    console.log("Handling")
    const name = taskNameRef.current?.value;
    if (!name) return 
    setTasks(prevTasks => {
      return [...prevTasks, { id: uuidv4(), name: name }]
    })
    taskNameRef.current.value = ''
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddTask()
    }
  };

  return (
    <div>
      <input 
        ref={taskNameRef} 
        type="text" 
        name="inputCategory" 
        placeholder="Enter Task" 
        onKeyDown={handleKeyDown}
      />
      <button onClick={onCancel}>Cancel</button>
      <button onClick={handleAddTask}>Add</button>
    </div>
  )
}

export default NewTask
