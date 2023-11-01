import { handleEnterKey } from '../utils/keyboardUtils';
import { CategoryDropdown } from './CategoryDropdown';

interface Props {
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onOk: () => void;
  onDelete?: () => void;
  currentCategory?: number;
  onCategoryChange?: (categoryId: number) => void;
};

const TaskEdit = ({ inputRef, currentCategory, onChange, onCancel, onOk, onDelete, onCategoryChange }: Props) => {

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    // Guard for CategoryDropdown
    if (event.currentTarget.contains(event.relatedTarget)) return;

    onCancel();
  };

  return (
    <div className='task_edit' onBlur={handleBlur}>
      <input
        ref={inputRef}
        type="text"
        name="name"
        onChange={onChange}
        placeholder="Enter Task"
        onKeyDown={(e) => handleEnterKey(e, onOk)}
        className='task_input'
        autoFocus
      />
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onOk} className='task_ok'>Ok</button>
      {onDelete &&
        <button onClick={onDelete} className='task_delete'>Delete</button>
      }
      {onCategoryChange &&
        <CategoryDropdown
          onCategoryChange={onCategoryChange}
          currentCategory={currentCategory}
          onOk={onOk}
        />
      }
    </div>
  )
}

export default TaskEdit
