import { handleEnterKey } from '../utils/keyboardUtils';
import { useEffect, useRef } from 'react';
import { CategoryDropdown } from './CategoryDropdown';
import "../css/taskEdit.css"

interface Props {
  inputRef: React.RefObject<HTMLInputElement>;
  currentCategory?: number;
  completed?: boolean | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onOk: () => void;
  onDelete?: () => void;
  onCategoryChange?: (categoryId: number) => void;
  onTaskComplete?: () => void;
};

const TaskEdit = ({
  inputRef,
  currentCategory,
  completed,
  onChange,
  onCancel,
  onOk,
  onDelete,
  onCategoryChange,
  onTaskComplete
}: Props) => {

  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onCancel();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef]);


  return (
    <div className='task-edit' ref={containerRef}>
      <input
        ref={inputRef}
        type="text"
        name="name"
        onChange={onChange}
        placeholder="Enter Task"
        onKeyDown={(e) => handleEnterKey(e, onOk)}
        className='task-input'
        autoFocus
      />
      <div className='task-options'>
        {onTaskComplete && completed != null &&
          <>
            <label className="custom-checkbox task-check">
              <input
                type="checkbox"
                defaultChecked={!!completed}
                onChange={onTaskComplete} />
              <span className="checkmark"></span>
            </label>
            <span className='task-span'>Completed</span>
          </>
        }
        {onCategoryChange &&
          <CategoryDropdown
            onCategoryChange={onCategoryChange}
            currentCategory={currentCategory}
          />
        }

      </div>
      <div className="task-btns">
        {onDelete &&
          <button onClick={onDelete} className='task-btn task-del'>Delete</button>
        }
        <button onClick={onCancel} className='task-btn task-cancel'>Cancel</button> <button onClick={onOk} className='task-btn task-ok'>Ok</button>
      </div>
    </div>
  )
}

export default TaskEdit
