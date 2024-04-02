//separate file for fetch requests

import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelType } from "../../backend/src/shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
// ^^ since I am deploying front and backend on one server,
//    I am letting render know to use the same server for
//    fetch requests to the same server (the '||').

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if(!response.ok) {
    throw new Error(responseBody.message)
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  const body = await response.json();
  if(!response.ok) {
    throw new Error(body.message)
  };
  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error("Token invalid")
  }
  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST"
  });
  if (!response.ok) {
    throw new Error("problem signing out");
  }
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  // ^^^ frontend and backend are working on the same schema
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`,  {
    credentials: "include"
  });
  if (!response.ok){
    throw new Error("Could not fetch hotels");
  }
  return response.json();
}