import { useContext, useEffect, useState } from "react";
import { CategoryType } from "../types/categoryType";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import Dropdown from 'react-bootstrap/Dropdown';
import "../css/categoryDropdown.css"


interface Props {
  currentCategory: number;
  onCategoryChange: (categoryId: number) => void;
}

export const CategoryDropdown = ({ currentCategory, onCategoryChange }: Props) => {
  const { currentUser } = useContext(AuthContext);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [errors, setErrors] = useState({
    api: ''
  })

  useEffect(() => {
    const fetchCategories = async () => {
      if (currentUser) {
        axios.get(`http://localhost:8081/api/cat/${currentUser.id}`)
          .then(response => {
            setCategories(response.data);
          })
          .catch(err => {
            setErrors(prevErrors => ({
              ...prevErrors,
              api: err.response.data.message
            }));
          });
      }
    };
    fetchCategories();
  }, [currentUser]);

  const handleChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle
          variant="secondary"
          id="category-dropdown"
          className="dropdown-container">
          {categories.find(cat => cat.id === selectedCategory)?.name || 'Select Category'}
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-menu">
          {categories.map((category: CategoryType) => (
            <Dropdown.Item
              key={category.id}
              className="dropdown-item"
              onClick={() => handleChange(category.id)}
            >
              {category.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {errors.api && <span className="text-danger">{errors.api}</span>}
    </div>
  );
};
