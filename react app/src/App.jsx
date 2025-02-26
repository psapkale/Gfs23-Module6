import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductCard from "./pages/ProductCard";
import Users from "./pages/Users";
import Contact from "./pages/Contact";
import { Provider } from "react-redux";
import store from "./store/store";

function App() {
   const router = createBrowserRouter([
      {
         path: "/",
         element: <Signin />,
      },
      {
         path: "/home",
         element: <Home />,
      },
      {
         path: "/products",
         element: <Products />,
      },
      {
         path: "/products/:id",
         element: <ProductCard />,
      },
      {
         path: "/users",
         element: <Users />,
      },
      {
         path: "/contact",
         element: <Contact />,
      },
      {
         path: "/*",
         element: <div>Not found</div>,
      },
   ]);

   return (
      <Provider store={store}>
         <RouterProvider router={router} />
      </Provider>
   );
}

export default App;
