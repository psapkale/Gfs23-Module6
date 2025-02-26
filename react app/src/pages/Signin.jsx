import { useState, useRef } from "react";
import "./Signin.css";
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

   // Function to check after clicking on Login
   function Check(event) {
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
   }

   // Function to check after clicking on signup
   function check2(event) {
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
   }
   return (
      <>
         {response === null ? (
            <div>Internal error</div>
         ) : response === "Wrong-Details" ? (
            <div>Wrong details provided</div>
         ) : (
            <div className="login">
               <div className="left-login">
                  <form onSubmit={(event) => Check(event)} className="form1">
                     <h1>Welcome back to Pretty Login</h1>
                     <p>Its great to have you back</p>
                     <div className="email">
                        <h3>Email: </h3>
                        <input
                           type="email"
                           name="email"
                           required
                           autoComplete="off"
                           ref={emailRef}
                        />
                     </div>
                     <div className="password">
                        <h3>Password: </h3>
                        <input
                           minLength={8}
                           type="password"
                           name="psw"
                           required
                           autoComplete="off"
                           ref={passwordRef}
                        />
                     </div>
                     <div className="remember">
                        <span>
                           <input type="checkbox" />
                           <p style={{ paddingLeft: "5px" }}>Remember me</p>
                        </span>
                        <span>
                           <p>Forgot password?</p>
                        </span>
                     </div>
                     <div className="submit">
                        <button className="login-btn" type="submit">
                           LOGIN
                        </button>
                        <button
                           className="signup-btn"
                           onClick={() => setForm2(true)}
                        >
                           CREATE ACCOUNT
                        </button>
                     </div>
                     <div className="option">
                        <p>Or login with</p>
                        <p style={{ color: "rgb(245, 21, 133)" }}>
                           Facebook Google
                        </p>
                     </div>
                  </form>
               </div>
               <div className="right-login"></div>
            </div>
         )}
         <>
            <div
               className="form2-container"
               style={{ display: form2 ? "flex" : "none" }}
            >
               <form className="form2" onSubmit={(event) => check2(event)}>
                  <span style={{ textAlign: "end" }}>
                     <AiOutlineClose
                        className="close"
                        onClick={() => setForm2(false)}
                     />
                  </span>
                  <div className="email">
                     <h3 style={{ color: "white" }}>Email: </h3>
                     <input
                        type="email"
                        name="email"
                        minLength={8}
                        required
                        autoComplete="off"
                        ref={emailRef2}
                     />
                  </div>
                  <div className="password">
                     <h3 style={{ color: "white" }}>Password: </h3>
                     <input
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
                  <button className="signup-btn">Add ACCOUNT</button>
               </form>
            </div>
         </>
      </>
   );
};

export default Signin;
