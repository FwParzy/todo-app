import { useContext, useEffect, useState } from "react";
import { CategoryType } from "../types/categoryType";
import { AuthContext } from "../context/authContext";
import Dropdown from 'react-bootstrap/Dropdown';
import "../css/categoryDropdown.css"
import axiosInstance from "../context/axiosContext";

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
        axiosInstance.get(`/api/cat/${currentUser.id}`)
          .then(response => {
            setCategories(response.data);
          })
          .catch(err => {
            const response = err.response ? err.response.data.message : 'Cannot connect to the server'
            setErrors(prevErrors => ({
              ...prevErrors,
              api: response
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
              onClick={() => handleChange(category.id)} >
              {category.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {errors.api && <span className="text-danger">{errors.api}</span>}
    </div>
  );
};
