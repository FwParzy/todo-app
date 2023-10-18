import { CategoryType } from "../types/categoryType";
import Category from "./Category";

interface Props {
  categories: CategoryType[];
  onUpdateCategory: (updatedCategory: CategoryType) => void;
}

const CategoryList = ({ categories, onUpdateCategory }: Props) => {
  return (
    categories.map(category => {
      return <Category key={category.id} category={category} onUpdateCategory={onUpdateCategory} />
    })
  )
}

export default CategoryList
