interface Props {
  task: any;
  toggleTask: any;
}

const Task = ({ task, toggleTask }:Props) => {

  function handleTaskClick() {
    toggleTask(task.id)
  }

  return (
    <div>
      <input type="checkbox" checked={task.completed} onChange={handleTaskClick} />
      {task.name}
    </div>
  )
}

export default Task
