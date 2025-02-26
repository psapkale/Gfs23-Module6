import { useSelector, useDispatch } from "react-redux";
import { setUsersData } from "../slices/UsersSlice";

function Radio() {
   const allUsers = useSelector((state) => state.constUserData);
   const dispatch = useDispatch();

   function filter(e) {
      const selectedCategory = e.target.value;
      switch (selectedCategory) {
         case "All":
            dispatch(setUsersData(allUsers));
            break;

         case "Male": {
            let maleData = allUsers.filter((item) => item.gender === "male");
            dispatch(setUsersData(maleData));
            break;
         }

         case "Female": {
            let femaleData = allUsers.filter(
               (item) => item.gender === "female"
            );
            dispatch(setUsersData(femaleData));
            break;
         }

         default:
            dispatch(setUsersData(allUsers));
            break;
      }
   }
   return (
      <fieldset
         onChange={(e) => filter(e)}
         style={{
            width: "80%",
            display: "flex",
            justifyContent: "space-around",
         }}
      >
         <legend style={{ margin: "20px" }}>
            Filter table based on Gender
         </legend>

         <div>
            <input
               type="radio"
               id="All"
               name="Gender"
               value="All"
               defaultChecked
            />
            <label htmlFor="All">All</label>
         </div>

         <div>
            <input type="radio" id="Male" name="Gender" value="Male" />
            <label htmlFor="Male">Male</label>
         </div>

         <div>
            <input type="radio" id="Female" name="Gender" value="Female" />
            <label htmlFor="Female">Female</label>
         </div>
      </fieldset>
   );
}

export default Radio;
