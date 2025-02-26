import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsCurrencyRupee } from "react-icons/bs";
import Navbar from "../components/Navbar";

function ProductCard() {
   const { id } = useParams();
   const data = useSelector((state) => state.productsData)?.filter(
      (item) => item.id === +id
   );

   return (
      <>
         <Navbar />
         <div className="main product-card flex items-center justify-center">
            <div className="card w-[85%] h-[85%] shadow-md rounded-md">
               <header className="bg-green-400 font-semibold text-2xl capitalize text-center h-[10%]">
                  {data[0]?.category} Category
               </header>
               <section className="w-full h-[90%] flex">
                  <div className="p-left w-[35%] h-full flex items-center justify-center">
                     <img
                        src={data[0]?.image}
                        alt={data[0]?.id}
                        loading="lazy"
                        width="76%"
                        height="90%"
                     />
                  </div>
                  <div className="p-right w-[65%] h-full flex justify-around flex-col">
                     <div>
                        <label className="font-semibold">Product Name</label>
                        <p>{data[0]?.title}</p>
                     </div>
                     <div>
                        <label className="font-semibold">Product Price</label>
                        <p className="flex items-center">
                           <BsCurrencyRupee />
                           {data[0]?.price}
                        </p>
                     </div>
                     <div>
                        <label className="font-semibold">
                           Product Description
                        </label>
                        <p>{data[0]?.description}</p>
                     </div>
                     <div>
                        <label className="font-semibold">Product Rating</label>
                        <p>{data[0]?.rating.rate}</p>
                     </div>
                  </div>
               </section>
            </div>
         </div>
      </>
   );
}

export default ProductCard;
