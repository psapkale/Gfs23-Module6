import { useState, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useLocalAuth } from "../hooks/useLocalAuth";

const Signin = () => {
   const emailRef = useRef();
   const passwordRef = useRef();
   const emailRef2 = useRef();
   const passwordRef2 = useRef();
   const [response, setResponse] = useState("");
   const [form2, setForm2] = useState(false);
   const [exists, setExists] = useState("");
   const navigate = useNavigate();
   const { validateData, updateLocalData } = useLocalAuth();

   const Check = (event) => {
      event.preventDefault();
      const res = validateData(
         emailRef.current.value,
         passwordRef.current.value
      );
      if (res === "navigate") {
         navigate("/home");
      } else {
         setResponse(res);
         setTimeout(() => setResponse(""), 2000);
      }
   };

   const check2 = (event) => {
      event.preventDefault();
      const res2 = updateLocalData(
         emailRef2.current.value,
         passwordRef2.current.value
      );
      setTimeout(() => setExists(""), 2000);
      setExists(res2);
      emailRef2.current.value = "";
      passwordRef2.current.value = "";
      if (res2 === "") {
         setForm2(false);
      }
   };

   return (
      <>
         {response === null ? (
            <div>Internal error</div>
         ) : response === "Wrong-Details" ? (
            <div>Wrong details provided</div>
         ) : (
            <div className="login w-full h-screen flex">
               <div className="left-login w-1/2 h-full flex items-center justify-center">
                  <form
                     onSubmit={(event) => Check(event)}
                     className="form1 w-[80%] h-[75%] flex justify-evenly flex-col"
                  >
                     <h1 className="text-[300%]">
                        Welcome back to Pretty Login
                     </h1>
                     <p>Its great to have you back</p>
                     <div className="email flex justify-end flex-col my-2">
                        <h3>Email: </h3>
                        <input
                           className="bg-[whitesmoke] h-[35px] pl-1 font-semibold focus:outline-none focus:border focus:border-[rgb(245,21,133)] focus:rounded-md"
                           type="email"
                           name="email"
                           required
                           autoComplete="off"
                           ref={emailRef}
                        />
                     </div>
                     <div className="password flex justify-end flex-col my-2">
                        <h3>Password: </h3>
                        <input
                           className="bg-[whitesmoke] h-[35px] pl-1 font-semibold focus:outline-none focus:border focus:border-[rgb(245,21,133)] focus:rounded-md"
                           minLength={8}
                           type="password"
                           name="psw"
                           required
                           autoComplete="off"
                           ref={passwordRef}
                        />
                     </div>
                     <div className="remember my-2 flex items-center justify-between">
                        <span className="flex items-center">
                           <input
                              className="bg-[whitesmoke] h-[35px] font-semibold focus pl-1:outline-none focus:border focus:border-[rgb(245,21,133)] focus:rounded-md accent-[rgb(245,21,133)]"
                              type="checkbox"
                           />
                           <p style={{ paddingLeft: "5px" }}>Remember me</p>
                        </span>
                        <span className="flex items-center">
                           <p>Forgot password?</p>
                        </span>
                     </div>
                     <div className="submit flex justify-between my-2">
                        <button
                           className="login-btn bg-[rgb(245,21,133)] text-white w-[45%] py-2 rounded-md font-semibold"
                           type="submit"
                        >
                           LOGIN
                        </button>
                        <button
                           className="signup-btn border border-[rgb(245,21,133)] bg-white text-[rgb(245,21,133)] w-[45%] py-2 rounded-md font-semibold hover:bg-[rgb(245,21,133)] hover:text-white"
                           onClick={() => setForm2(true)}
                        >
                           CREATE ACCOUNT
                        </button>
                     </div>
                     <div className="option text-center my-2">
                        <p>Or login with</p>
                        <p style={{ color: "rgb(245, 21, 133)" }}>
                           Facebook Google
                        </p>
                     </div>
                  </form>
               </div>
               <div
                  className="right-login w-1/2 h-full bg-no-repeat bg-cover"
                  style={{
                     backgroundImage:
                        'url("https://images.unsplash.com/photo-1506452305024-9d3f02d1c9b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9nZ3klMjBmb3Jlc3R8ZW58MHx8MHx8&w=1000&q=80")',
                  }}
               ></div>
            </div>
         )}
         <>
            <div
               className="form2-container w-full h-screen absolute top-0 left-0 bg-[rgba(0,0,0,0.9)] items-center justify-center"
               style={{ display: form2 ? "flex" : "none" }}
            >
               <form
                  className="form2 w-[80%] h-[75%] flex justify-evenly flex-col shadow-md px-12 bg-no-repeat bg-cover"
                  style={{
                     backgroundImage:
                        'url("https://images.unsplash.com/photo-1506452305024-9d3f02d1c9b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9nZ3klMjBmb3Jlc3R8ZW58MHx8MHx8&w=1000&q=80")',
                  }}
                  onSubmit={(event) => check2(event)}
               >
                  <span
                     className="flex items-center"
                     style={{ textAlign: "end" }}
                  >
                     <AiOutlineClose
                        className="close text-white font-semibold text-[200%] p-1 rounded-md hover:bg-green-500"
                        onClick={() => setForm2(false)}
                     />
                  </span>
                  <div className="email flex justify-end flex-col">
                     <h3 style={{ color: "white" }}>Email: </h3>
                     <input
                        className="bg-[whitesmoke] h-[35px] pl-1 font-semibold focus:outline-none focus:border focus:border-[rgb(245,21,133)] focus:rounded-md"
                        type="email"
                        name="email"
                        minLength={8}
                        required
                        autoComplete="off"
                        ref={emailRef2}
                     />
                  </div>
                  <div className="password flex justify-end flex-col">
                     <h3 style={{ color: "white" }}>Password: </h3>
                     <input
                        className="bg-[whitesmoke] h-[35px] pl-1 font-semibold focus:outline-none focus:border focus:border-[rgb(245,21,133)] focus:rounded-md"
                        minLength={8}
                        type="password"
                        name="psw"
                        required
                        autoComplete="off"
                        ref={passwordRef2}
                     />
                  </div>
                  <label style={{ color: "red", fontWeight: "bolder" }}>
                     {exists}
                  </label>
                  <button className="signup-btn border border-[rgb(245,21,133)] bg-white text-[rgb(245,21,133)] w-[45%] py-2 rounded-md font-semibold hover:bg-[rgb(245,21,133)] hover:text-white">
                     Add ACCOUNT
                  </button>
               </form>
            </div>
         </>
      </>
   );
};

export default Signin;
