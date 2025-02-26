/* eslint-disable react/no-unknown-property */
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import { setUsersData } from "../slices/UsersSlice";
import { setUsersHolder } from "../slices/UsersHolderSlice";
import RadioFilter from "../components/RadioFilter";

function Users() {
   const data = useSelector((state) => state.usersData);
   const dispatch = useDispatch();

   useEffect(() => {
      (async function () {
         await fetch("https://randomuser.me/api/?results=20")
            .then((res) => res.json())
            .then((d) => {
               dispatch(setUsersData(d.results));
               dispatch(setUsersHolder(d.results));
            })
            .catch((e) => console.log(e));
      })();
   }, []);

   return (
      <>
         <Navbar />
         <div className="users w-full flex items-center flex-col">
            <h2 className="w-[80%] my-3">User Deatils</h2>
            <p className="w-[80%] my-3">
               Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam
               ipsum aspernatur atque consequatur assumenda fuga libero a! Iusto
               ullam aliquam sunt quos minima facere ex quibusdam voluptatum
               eligendi autem, quisquam adipisci aliquid cumque a assumenda aut
               dolorem, porro ipsa explicabo! Ab in ullam provident distinctio
               accusamus dolorum nam aspernatur quia rem iure, corporis sit
               consectetur sequi blanditiis nemo explicabo, quas maxime
               molestias sunt. Rerum repellat excepturi illo eius minus commodi,
               atque laudantium quis necessitatibus suscipit omnis aut delectus.
               Excepturi totam a adipisci sequi quis, numquam ullam voluptatibus
               quibusdam repudiandae quae at ratione odit quasi omnis tempore ea
               maiores corporis assumenda.
            </p>
            <RadioFilter />
            <table frame="box" rules="all" className="table w-[80%] my-3">
               <thead className="bg-black text-white">
                  <tr>
                     <th className="py-2 pr-1">IMAGE</th>
                     <th className="py-2 pr-1">NAME</th>
                     <th className="py-2 pr-1">EMAIL</th>
                     <th className="py-2 pr-1">GENDER</th>
                  </tr>
               </thead>
               <tbody>
                  {data?.map((item) => {
                     return (
                        <tr key={item.login.uuid}>
                           <td className="text-center">
                              <img
                                 src={item.picture.medium}
                                 alt={item.login.uuid}
                                 width="100px"
                                 height="100px"
                                 loading="lazy"
                              />
                           </td>
                           <td className="text-center">{item.name.first}</td>
                           <td className="text-center">{item.email}</td>
                           <td className="text-center">{item.gender}</td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </>
   );
}

export default Users;
