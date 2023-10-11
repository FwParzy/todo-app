import Category from "./Category";

interface Props {
  categories: any;
}

const CategoryList = ({ categories }:Props) => {
  return (
  categories.map(category => {
      return <Category key={category.id} category={category} />
    })
  )
}

export default CategoryList
