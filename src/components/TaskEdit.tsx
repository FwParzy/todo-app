import { useEffect } from 'react';
import { handleEnterKey } from '../utils/keyboardUtils';

interface Props {
  inputRef: React.RefObject<HTMLInputElement>;
  onCancel: () => void;
  onOk: () => void;
};

const TaskEdit = ({ inputRef, onCancel, onOk }: Props) => {

  useEffect(() => {
    const openTasks = document.querySelectorAll('.task_input');
    if (openTasks.length === 2) {
      const task1Name = (openTasks[0] as HTMLInputElement)?.value;
      const task2Name = (openTasks[1] as HTMLInputElement)?.value;

      console.log(`Doing things to ${task1Name} and ${task2Name}`);
    }
  }, []);

  return (
    <div className='task_edit'>
      <input
        ref={inputRef}
        type="text"
        name="inputCategory"
        placeholder="Enter Task"
        onKeyDown={(e) => handleEnterKey(e, onOk)}
        className='task_input'
        autoFocus
      />
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onOk} className='task_ok'>Ok</button>
      <button className='task_delete'>Delete</button>
    </div>
  )
}

export default TaskEdit
