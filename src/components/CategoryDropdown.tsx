import { useState } from "react";
import { CategoryType } from "../types/categoryType";
import { handleEnterKey } from "../utils/keyboardUtils";

interface Props {
  currentCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onOk: () => void;
}

export const CategoryDropdown = ({ currentCategory, onCategoryChange, onOk }: Props) => {

  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const storedCategories = JSON.parse(localStorage.getItem('todoApp.categories'));

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = event.target.value;
    console.log("newCatID " + newCategoryId)
    setSelectedCategory(newCategoryId)
    onCategoryChange(newCategoryId)
  };

  return (
    <>
      <select
        value={selectedCategory}
        onChange={handleChange}
        onKeyDown={(e) => handleEnterKey(e as React.KeyboardEvent<HTMLSelectElement>, onOk)}
      >
        {storedCategories.map((category: CategoryType) => (
          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>
        ))}
      </select>
    </>
  )
}
