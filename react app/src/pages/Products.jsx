import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProductsData } from "../slices/ProductsSlice";
import Navbar from "../components/Navbar";
import ProductsList from "../components/ProductsList";

const categoryList = [
   "Electronics",
   "Jewelery",
   "Men's clothing",
   "Women's clothing",
];

function Products() {
   const [selectedCategory, setSelectedCategory] = useState("electronics");
   const dispatch = useDispatch();

   useEffect(() => {
      fetch(`https://fakestoreapi.com/products/category/${selectedCategory}`)
         .then((res) => res.json())
         .then((json) => {
            dispatch(setProductsData(json));
         })
         .catch((e) => console.log(e));
   }, [selectedCategory]);

   function change(e) {
      const clicked = e.target.innerText.toLowerCase();
      if (clicked !== selectedCategory) {
         setSelectedCategory(clicked);
      }
   }
   return (
      <>
         <Navbar />
         <div className="main products flex">
            <div className="categories w-[30%] bg-[rgb(36,35,35)]">
               <ul className="w-full pt-3 flex items-center flex-col list-none">
                  {categoryList?.map((item) => (
                     <li
                        key={item}
                        className={`font-semibold w-[100%] h-[35px] pl-10 py-2 flex items-center my-3 rounded-md cursor-pointer ${
                           selectedCategory === item.toLowerCase()
                              ? "bg-white text-black"
                              : "text-white"
                        } hover:bg-white hover:text-black`}
                        onClick={(e) => change(e)}
                     >
                        {item}
                     </li>
                  ))}
               </ul>
            </div>
            <div className="products-list flex justify-center">
               <ProductsList />
            </div>
         </div>
      </>
   );
}

export default Products;
