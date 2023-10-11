import { useState } from "react";
import NewTask from './NewTask';

interface Props {
  items: string[];
  header: string;
  onSelectItem: (item: string) => void;
}

function Header({ items, header, onSelectItem }: Props) {


  items.map(item => <li>{item}</li>)
  // TODO use item.id for key

  const getMessage = () => {
    return items.length === 0 && <p key="none">No headers found</p>;
  }
  const [selectedIndex, setSelectedIndex] = useState(-1);


  return (
    <>
      <h2>{header ? header : "Ah im broken"}</h2>
      <ul className="list-group">
        {getMessage()}
        {items.map((item, index) =>
          <li
            key={item}
            onClick={() => {
              setSelectedIndex(index)
              onSelectItem(item)
            }}
            className={selectedIndex === index ? "list-group-item active" : "list-group-item"}>
            {item}
            {selectedIndex === index
              && <NewTask onSubmit={() => console.log('submit')} onClose={() => setSelectedIndex(-1)}/>}
          </li>)}
      </ul>
    </>
  )
}

export default Header;
