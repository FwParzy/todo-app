import Task from "./Task";

interface Props {
  tasks: any;
  toggleTask: any;
}

const TaskList = ({ tasks, toggleTask }:Props) => {
  return (
  tasks.map(task => {
      return <Task key={task.id} toggleTask={toggleTask} task={task} />
    })
  )
}

export default TaskList
