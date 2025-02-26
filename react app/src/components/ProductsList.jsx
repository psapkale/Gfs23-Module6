import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ProductsList() {
   const data = useSelector((state) => state.productsData);
   const navigate = useNavigate();

   function clickedProduct(e, id) {
      navigate(`/products/${id}`);
   }

   return (
      <div className="productList flex justify-center p-5">
         <ul className="w-[90%]">
            {data?.map((item) => (
               <li
                  className="w-full font-semibold text-black py-1 my-2 rounded-md cursor-pointer hover:bg-[whitesmoke] list-disc"
                  onClick={(e) => clickedProduct(e, item.id)}
                  key={item.id}
               >
                  {item.title}
               </li>
            ))}
         </ul>
      </div>
   );
}

export default ProductsList;
