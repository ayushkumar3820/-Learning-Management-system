// "use client";
// import React, { FC, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import {
//   AiOutlineEye,
//   AiOutlineEyeInvisible,
//   AiFillGithub,
// } from "react-icons/ai";
// import { FcGoogle } from "react-icons/fc";
// import { Email, Password } from "@mui/icons-material";
// import { styles } from "@/app/styles/styles";

// type Props = {
//   SetRoute: (route: string) => void;
// };

// const schema = Yup.object().shape({
//   name: Yup.string().required("Please enter your name"),
//   email: Yup.string()
//     .email("Invalid email")
//     .required("Please enter your email"),
//   password: Yup.string().required("Please enter your password").min(6),
// });

// const SignUp: FC<Props> = ({ SetRoute }) => {
//   const [show, setShow] = useState(false);
//   const formik = useFormik({
//     initialValues: { name: "", email: "", password: "" },
//     validationSchema: schema,
//     onSubmit: async ({ email, password }) => {
//       console.log(email, password);
//     },
//   });

//   const { errors, touched, values, handleChange, handleSubmit } = formik;

//   return (
//     <div className="w-full">
//       <h1 className={`${styles.title}`}>join to Learning</h1>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className={`${styles.label}`} htmlFor="name">
//             Enter your name
//           </label>
//           <input
//             type="name"
//             name=""
//             value={values.name}
//             onChange={handleChange}
//             id="name"
//             placeholder="Ayush Kumar"
//             className={`${errors.email && touched.email && "border-red-500"}`}
//           />
//           {errors.name && touched.name && (
//             <span className="text-red-500 pt-2  block ">{errors.name}</span>
//           )}
//         </div>
//         <label className={`${styles.label}`} htmlFor="email">
//           Enter your email
//         </label>
//         <input
//           type="email"
//           name=""
//           value={values.email}
//           onChange={handleChange}
//           id="email"
//           placeholder="Loginmail@gmail.com"
//           className={`${errors.email && touched.email && "border-red-500"}`}
//         />
//         {errors.email && touched.email && (
//           <span className="text-red-500 pt-2  block ">{errors.email}</span>
//         )}
//         <div className="w-full  mt-5  relative mb-1">
//           <label className={`${styles.label}`} htmlFor="password">
//             Enter your password
//           </label>
//           <input
//             type={!show ? "password" : "text"}
//             name="password"
//             value={values.password}
//             onChange={handleChange}
//             id="password"
//             placeholder="password!@%"
//             className={`${
//               errors.password && touched.password && "border-red-500"
//             }`}
//           />
//           {!show ? (
//             <AiOutlineEyeInvisible
//               className="absolute  bottom-3  right-2 z-1  cursor-pointer"
//               size={20}
//               onClick={() => setShow(true)}
//             />
//           ) : (
//             <AiOutlineEyeInvisible
//               className="absolute  bottom-3  right-2 z-1  cursor-pointer"
//               size={20}
//               onClick={() => setShow(true)}
//             />
//           )}
//           {errors.password && touched.password && (
//             <span className="text-red-500 pt-2  block ">{errors.email}</span>
//           )}
//         </div>
//         <div className="w-full  mt-5">
//           <input type="submit" value="Login" className={`${styles.button}`} />
//         </div>
//         <br />
//         <h5 className="text-center  pt-4  font-Poppins text-[14px]  text-black dark:text-white ">
//           Or join with
//         </h5>
//         <div className="flex  items-center justify-center my-3">
//           <FcGoogle size={30} className="cursor-pointer mr-2" />
//           <AiFillGithub size={30} className="cursor-pointer ml-2" />
//         </div>
//         <h5 className=" text-center  pt-4  font-Poppins text-[14px] ">
//           Not Have any account ?{""}
//           <span
//             className="text-[#2190ff]  pl-1  cursor-pointe"
//             onClick={() => SetRoute("Sign-Up")}
//           >
//             Sign_in
//           </span>
//         </h5>
//       </form>
//     </div>
//   );
// };

// export default SignUp;
