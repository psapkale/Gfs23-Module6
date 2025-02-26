import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";

function Navbar() {
   return (
      <nav className="wfull h-[10vh] bg-[rgb(36,35,35)] flex justify-end">
         <div className="nav-sub w-1/2 h-full flex items-center justify-center">
            <ul className="w-full h-full flex items-center justify-evenly list-none text-white font-semibold">
               <li>
                  <Link
                     className="link text-white py-2 px-5 hover:bg-white hover:text-black hover:rounded-md"
                     to="/home"
                  >
                     Home
                  </Link>
               </li>
               <li>
                  <Link
                     className="link text-white py-2 px-5 hover:bg-white hover:text-black hover:rounded-md"
                     to="/products"
                  >
                     Products
                  </Link>
               </li>
               <li>
                  <Link
                     className="link text-white py-2 px-5 hover:bg-white hover:text-black hover:rounded-md"
                     to="/users"
                  >
                     Users
                  </Link>
               </li>
               <li>
                  <Link
                     className="link text-white py-2 px-5 hover:bg-white hover:text-black hover:rounded-md"
                     to="/contact"
                  >
                     Contact
                  </Link>
               </li>
               <li>
                  <Link
                     className="link text-white py-2 px-5 hover:bg-white hover:text-black hover:rounded-md flex"
                     to="/"
                  >
                     <FiLogOut />
                  </Link>
               </li>
            </ul>
         </div>
      </nav>
   );
}

export default Navbar;
