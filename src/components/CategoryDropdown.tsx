import { useContext, useEffect, useState } from "react";
import { CategoryType } from "../types/categoryType";
import axios from "axios";
import { handleEnterKey } from "../utils/keyboardUtils";
import { AuthContext } from "../context/authContext";

interface Props {
  currentCategory: number;
  onCategoryChange: (categoryId: number) => void;
  onOk: () => void;
}

export const CategoryDropdown = ({ currentCategory, onCategoryChange, onOk }: Props) => {
  const { currentUser } = useContext(AuthContext);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);

  useEffect(() => {
    const fetchCategories = async () => {
      if (currentUser) {
        axios.get(`http://localhost:8081/api/cat/${currentUser.id}`)
          .then(response => {
            setCategories(response.data);
          })
          .catch(error => {
            console.error("Error fetching categories:", error);
          });
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = Number(event.target.value);
    setSelectedCategory(newCategoryId);
    onCategoryChange(newCategoryId);
  };

  return (
    <>
      <select
        value={selectedCategory}
        onChange={handleChange}
        onKeyDown={(e) => handleEnterKey(e as React.KeyboardEvent<HTMLSelectElement>, onOk)}
      >
        {categories.map((category: CategoryType) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </>
  );
};
