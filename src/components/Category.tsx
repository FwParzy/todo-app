import { useState } from "react";
import NewTask from "./NewTask";

interface Props {
  category: any;
}

const Category = ({ category }:Props) => {

  const [addTaskVisibility, setAddTaskVisibility] = useState(false)

  function handleTaskPopup() {
    setAddTaskVisibility(!addTaskVisibility)
  }


  return (
    <div>
      <h2 onClick={handleTaskPopup}>
        {category.name}
      </h2>
      {addTaskVisibility && <NewTask onCancel={handleTaskPopup}/>}
    </div>
  )
}
      // need to display tasklist
      // and also pass task list down to new task
      // so that new task can add tasks to task list
      // <TaskList tasks={tasks}/>

export default Category
