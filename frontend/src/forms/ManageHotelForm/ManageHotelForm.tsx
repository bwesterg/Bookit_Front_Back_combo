import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";

// import { useEffect } from "react";

export type HotelFormData = {
  name: string;
  city: string;
  state: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number,
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[],
  adultCount: number;
  childCount: number;
}

type Props = {
  hotel?: HotelType;
  onSave: (HotelFormData: FormData) => void;
  isLoading: boolean;
}

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset } = formMethods;

  useEffect(()=> {
    reset(hotel);
  },[hotel,reset])

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    //create new FormData object and call API
    const formData = new FormData();

    if(hotel){
      formData.append("hotelId", hotel._id);
    }

    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("state", formDataJson.state);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    //toString() is to address a TypeScript default type of string.
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());
    
    // formData.append("facilities", formDataJson.facilities.toString());
    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });
    // console.log("hello", formData);

    // updates new image array
    if(formDataJson.imageUrls){
      formDataJson.imageUrls.forEach((url, index)=> {
        formData.append(`imageUrls[${index}]`, url);
      })
    }

    // formData.append("imageFiles", formDataJson.imageFiles);
    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });
    onSave(formData);
  });

  return <FormProvider {...formMethods}>
    <form className="flex flex-col gap-10" onSubmit={onSubmit}>
      <DetailsSection />
      <TypeSection />
      <FacilitiesSection />
      <GuestsSection/>
      <ImagesSection />
      <span className="flex justify-end">
        <button 
          // prevents user from trying to add hotel again while initial
          // request is still loading
          disabled={isLoading}
          className="disabled:bg-gray-500 bg-purple-600 text-white font-bold hover:bg-purple-500 text-xl p-3">
          {isLoading? "Saving..." : "Save"}
        </button>
      </span>
    </form>
  </FormProvider>
};

export default ManageHotelForm;