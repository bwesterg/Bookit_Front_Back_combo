import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";

const Booking = () => {
  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  // console.log(currentUser?.email);

  return <div className="grid md:grid-cols-[1fr_2fr]">
    <div className="bg-green-200">Reservation Details</div>
      {/* booking form will only display if there is a current user. */}
      {currentUser && <BookingForm currentUser={currentUser}/>}
    
  </div>
};

export default Booking;