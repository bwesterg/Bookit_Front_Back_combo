import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { 
    register, 
    watch, 
    handleSubmit, 
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      // console.log("reg successful");
      showToast({ message: "You Are Registered!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      // console.log(error.message);
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data)=> {
    mutation.mutate(data);
  })
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input 
            className="border rounded w-full py-1 px-2 font-normal" 
            {...register("firstName", {required: "Required"})}
          ></input>
          {errors.firstName && (
            <span className="text-orange-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input 
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", {required: "Required"})}
          ></input>
          {errors.lastName && (
            <span className="text-orange-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input 
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", {required: "Required"})}
        ></input>
        {errors.email && (
            <span className="text-orange-500">{errors.email.message}</span>
          )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Password
        <input 
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "Required", 
            minLength: {
              value: 6,
              message: "Password must be 6 char or more"
            },
          })}
        ></input>
        {errors.password && (
            <span className="text-orange-500">{errors.password.message}</span>
          )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Confirm Password
        <input 
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("confirmPassword", {
            validate:(val)=>{
              if (!val) {
                return "Required";
              } else if (watch("password") !== val) {
                return "Passwords do not match";
              }
            }
          })}
        ></input>
        {errors.confirmPassword && (
            <span className="text-orange-500">{errors.confirmPassword.message}</span>
          )}
      </label>
      <div className="flex items-center justify-between">
        <span className="text-sm">
          Already Have an Account? <Link className="underline" to="/sign-in">Sign In</Link>
        </span>
        <span>
          <button 
            type="submit"
            className="bg-purple-600 text-white p-2 font-bold hover:bg-purple-500 text-xl"
          >Create Account</button>
        </span>
      </div>
    </form>
  )
}

export default Register;