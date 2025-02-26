import "./Navbar.css";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";

function Navbar() {
   return (
      <nav>
         <div className="nav-sub">
            <ul>
               <li>
                  <Link className="link" to="/home">
                     Home
                  </Link>
               </li>
               <li>
                  <Link className="link" to="/products">
                     Products
                  </Link>
               </li>
               <li>
                  <Link className="link" to="/users">
                     Users
                  </Link>
               </li>
               <li>
                  <Link className="link" to="/contact">
                     Contact
                  </Link>
               </li>
               <li>
                  <Link className="link" to="/">
                     <FiLogOut />
                  </Link>
               </li>
            </ul>
         </div>
      </nav>
   );
}

export default Navbar;
