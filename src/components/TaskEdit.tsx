import { handleEnterKey } from '../utils/keyboardUtils';

interface Props {
  inputRef: React.RefObject<HTMLInputElement>;
  onCancel: () => void;
  onOk: () => void;
};

const TaskEdit = ({ inputRef, onCancel, onOk }: Props) => {

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        name="inputCategory"
        placeholder="Enter Task"
        onKeyDown={(e) => handleEnterKey(e, onOk)}
        autoFocus
      />
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onOk}>Ok</button>
    </div>
  )
}

export default TaskEdit
