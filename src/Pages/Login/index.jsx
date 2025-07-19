import { Button } from "@mui/material";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CgLogIn } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
import LoadingButton from "@mui/lab/LoadingButton";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchDataFromApi, postData } from "../../utils/api";
import { useContext } from "react";
import { MyContext } from "../../App.jsx";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import { useEffect } from "react";
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const [loadingGoogle, setLoadingGoogle] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isPasswordShow, setisPasswordShow] = useState(false);

  const [formFields, setFormsFields] = useState({
    email: "",
    password: "",
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    fetchDataFromApi("/api/logo").then((res) => {
      localStorage.setItem("logo", res?.logo[0]?.logo);
    });
  }, []);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormsFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const valideValue = Object.values(formFields).every((el) => el);

  const forgotPassword = () => {
    if (formFields.email === "") {
      context.alertBox("error", "Please enter email id");
      return false;
    } else {
      context.alertBox("success", `OTP send to ${formFields.email}`);
      localStorage.setItem("userEmail", formFields.email);
      localStorage.setItem("actionType", "forgot-password");

      postData("/api/admin/forgot-password", {
        email: formFields.email,
      }).then((res) => {
        if (res?.error === false) {
          context.alertBox("success", res?.message);
          history("/verify-account");
        } else {
          context.alertBox("error", res?.message);
        }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.email === "") {
      context.alertBox("error", "Please enter email id");
      return false;
    }

    if (formFields.password === "") {
      context.alertBox("error", "Please enter password");
      return false;
    }

    postData("/api/admin/login", formFields, { withCredentials: true }).then(
      (res) => {
        if (res?.error !== true) {
          setIsLoading(false);
          context.alertBox("success", res?.message);
          setFormsFields({
            email: "",
            password: "",
          });

          localStorage.setItem("accessToken", res?.data?.accesstoken);
          localStorage.setItem("refreshToken", res?.data?.refreshToken);

          context.setIsLogin(true);

          history("/");
        } else {
          context.alertBox("error", res?.message);
          setIsLoading(false);
        }
      }
    );
  };

  const authWithGoogle = () => {
    setLoadingGoogle(true);

    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          password: null,
          avatar: user.providerData[0].photoURL,
          mobile: user.providerData[0].phoneNumber,
          role: "USER",
        };

        postData("/api/admin/authWithGoogle", fields).then((res) => {
          if (res?.error !== true) {
            setLoadingGoogle(false);
            setIsLoading(false);
            context.alertBox("success", res?.message);
            localStorage.setItem("userEmail", fields.email);
            localStorage.setItem("accessToken", res?.data?.accesstoken);
            localStorage.setItem("refreshToken", res?.data?.refreshToken);

            context.setIsLogin(true);

            history("/");
          } else {
            context.alertBox("error", res?.message);
            setIsLoading(false);
          }
        });

        console.log(user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <img
          src="/patern.webp"
          className="w-full h-full object-cover"
          alt="Background Pattern"
        />
      </div>
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 z-50">
        <div className="flex justify-center mb-6">
          <img
            src="logo.svg"
            className="w-40 h-[56px] filter drop-shadow-md"
            alt="Logo"
          />
        </div>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formFields.email}
              onChange={onChangeInput}
              disabled={isLoading}
              className="w-full bg-transparent border-b-2 border-white/30 focus:border-indigo-300 text-white placeholder-white/50 focus:outline-none py-2 transition-all duration-300"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type={isPasswordShow ? "text" : "password"}
              name="password"
              value={formFields.password}
              onChange={onChangeInput}
              disabled={isLoading}
              autoComplete="off"
              className="w-full bg-transparent border-b-2 border-white/30 focus:border-indigo-300 text-white placeholder-white/50 focus:outline-none py-2 transition-all duration-300"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute top-10 right-2 text-white/70 hover:text-white focus:outline-none"
              onClick={() => setIsPasswordShow(!isPasswordShow)}
            >
              {isPasswordShow ? (
                <i className="fas fa-eye-slash"></i>
              ) : (
                <i className="fas fa-eye"></i>
              )}
            </button>
          </div>
          <div className="mb-6 flex items-center justify-between">
            <label className="flex items-center text-white text-sm">
              <input
                type="checkbox"
                defaultChecked
                className="mr-2 accent-indigo-300"
              />
              Remember Me
            </label>
            <a
              onClick={forgotPassword}
              className="text-indigo-200 hover:text-indigo-100 font-medium text-sm cursor-pointer transition-colors"
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            disabled={!valideValue || isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:scale-105 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-transform duration-300 flex items-center justify-center"
            style={{ color: "#FFFFFF" }} // Ensures bright white text
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 1v2.7a10 10 0 0 0 5.3 8.7l2.7-4.6h-5A5 5 0 0 1 4 1z"
                ></path>
              </svg>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </section>
    // <section className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center p-4">
    //   <div className="absolute inset-0 opacity-10">
    //     <img
    //       src="/patern.webp"
    //       className="w-full h-full object-cover"
    //       alt="Background Pattern"
    //     />
    //   </div>
    //   {/* <header className="w-full fixed top-0 left-0 px-4 py-3 flex items-center justify-center z-50">
    //     <h1 className="text-white text-2xl font-bold">Welcome</h1>
    //   </header> */}
    //   <div className="relative w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 z-50">
    //     <div className="flex justify-center mb-6">
    //       <img
    //         src="/public/logo_blk.svg"
    //         className="w-40 filter drop-shadow-md"
    //         alt="Logo"
    //       />
    //     </div>
    //     <form className="w-full" onSubmit={handleSubmit}>
    //       <div className="mb-6">
    //         <label className="block text-white text-sm font-medium mb-2">
    //           Email
    //         </label>
    //         <input
    //           type="email"
    //           name="email"
    //           value={formFields.email}
    //           onChange={onChangeInput}
    //           disabled={isLoading}
    //           className="w-full bg-transparent border-b-2 border-white/30 focus:border-indigo-300 text-white placeholder-white/50 focus:outline-none py-2 transition-all duration-300"
    //           placeholder="Enter your email"
    //         />
    //       </div>
    //       <div className="mb-6 relative">
    //         <label className="block text-white text-sm font-medium mb-2">
    //           Password
    //         </label>
    //         <input
    //           type={isPasswordShow ? "text" : "password"}
    //           name="password"
    //           value={formFields.password}
    //           onChange={onChangeInput}
    //           disabled={isLoading}
    //           className="w-full bg-transparent border-b-2 border-white/30 focus:border-indigo-300 text-white placeholder-white/50 focus:outline-none py-2 transition-all duration-300"
    //           placeholder="Enter your password"
    //         />
    //         <button
    //           type="button"
    //           className="absolute top-10 right-2 text-white/70 hover:text-white focus:outline-none"
    //           onClick={() => setIsPasswordShow(!isPasswordShow)}
    //         >
    //           {isPasswordShow ? (
    //             <i className="fas fa-eye-slash"></i>
    //           ) : (
    //             <i className="fas fa-eye"></i>
    //           )}
    //         </button>
    //       </div>
    //       <div className="mb-6 flex items-center justify-between">
    //         <label className="flex items-center text-white text-sm">
    //           <input
    //             type="checkbox"
    //             defaultChecked
    //             className="mr-2 accent-indigo-300"
    //           />
    //           Remember Me
    //         </label>
    //         <a
    //           onClick={forgotPassword}
    //           className="text-indigo-200 hover:text-indigo-100 font-medium text-sm cursor-pointer transition-colors"
    //         >
    //           Forgot Password?
    //         </a>
    //       </div>
    //       <button
    //         type="submit"
    //         disabled={!valideValue || isLoading}
    //         className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:scale-105 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-transform duration-300 flex items-center justify-center"
    //       >
    //         {isLoading ? (
    //           <svg
    //             className="animate-spin h-5 w-5 text-white"
    //             xmlns="http://www.w3.org/2000/svg"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //           >
    //             <circle
    //               className="opacity-25"
    //               cx="12"
    //               cy="12"
    //               r="10"
    //               stroke="currentColor"
    //               strokeWidth="4"
    //             ></circle>
    //             <path
    //               className="opacity-75"
    //               fill="currentColor"
    //               d="M4 1v2.7a10 10 0 0 0 5.3 8.7l2.7-4.6h-5A5 5 0 0 1 4 1z"
    //             ></path>
    //           </svg>
    //         ) : (
    //           "Sign In"
    //         )}
    //       </button>
    //     </form>
    //   </div>
    // </section>
    // <section className="bg-white w-full">
    //   <header className="w-full static lg:fixed top-0 left-0  px-4 py-3 flex items-center justify-center sm:justify-between z-50"></header>
    //   <img src="/patern.webp" className="w-full fixed top-0 left-0 opacity-5" />

    //   <div className="loginBox card w-full md:w-[600px] h-[auto] pb-20 mx-auto pt-5 lg:pt-20 relative z-50">
    //     <div className="flex justify-center">
    //       <img src="/public/logo_blk.svg" className="w-[200px]  " />
    //     </div>
    //     <br />

    //     <form className="w-full px-8 mt-3" onSubmit={handleSubmit}>
    //       <div className="form-group mb-4 w-full">
    //         <h4 className="text-[14px] font-[500] mb-1">Email</h4>
    //         <input
    //           type="email"
    //           className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
    //           name="email"
    //           value={formFields.email}
    //           disabled={isLoading === true ? true : false}
    //           onChange={onChangeInput}
    //         />
    //       </div>

    //       <div className="form-group mb-4 w-full">
    //         <h4 className="text-[14px] font-[500] mb-1">Password</h4>
    //         <div className="relative w-full">
    //           <input
    //             type={isPasswordShow === false ? "password" : "text"}
    //             className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
    //             name="password"
    //             value={formFields.password}
    //             disabled={isLoading === true ? true : false}
    //             onChange={onChangeInput}
    //           />
    //           <Button
    //             className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600"
    //             onClick={() => setisPasswordShow(!isPasswordShow)}
    //           >
    //             {isPasswordShow === false ? (
    //               <FaRegEye className="text-[18px]" />
    //             ) : (
    //               <FaEyeSlash className="text-[18px]" />
    //             )}
    //           </Button>
    //         </div>
    //       </div>

    //       <div className="form-group mb-4 w-full flex items-center justify-between">
    //         <FormControlLabel
    //           control={<Checkbox defaultChecked />}
    //           label="Remember Me"
    //         />

    //         <a
    //           onClick={forgotPassword}
    //           className="text-primary font-[700] text-[15px] hover:underline hover:text-gray-700 cursor-pointer"
    //         >
    //           Forgot Password?
    //         </a>
    //       </div>

    //       <Button
    //         type="submit"
    //         disabled={!valideValue}
    //         className="btn-blue btn-lg w-full"
    //       >
    //         {isLoading === true ? (
    //           <CircularProgress color="inherit" />
    //         ) : (
    //           "Sign In"
    //         )}
    //       </Button>
    //     </form>
    //   </div>
    // </section>
  );
};

export default Login;
