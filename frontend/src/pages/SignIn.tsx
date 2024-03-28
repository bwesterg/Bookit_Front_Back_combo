import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
}

const SignIn = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { 
    register, 
    formState: { errors },
    handleSubmit
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async ()=> {
      // console.log("user signed in")
      showToast({ message: "Signed In Successfully!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");


    }, onError: (error: Error) => {
      // show Toast
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  })

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>

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
      <span className="flex items-center justify-between">
        <span className="text-sm">
          Not Yet Registered? <Link className="underline" to="/register">Create Account</Link>
        </span>
        <button 
          type="submit"
          className="bg-purple-600 text-white p-2 font-bold hover:bg-purple-500 text-xl"
        >Sign In</button>
      </span>
    </form>
  );
};

export default SignIn;