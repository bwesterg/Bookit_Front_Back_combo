import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm";

const DetailsSection = () => {
  const { 
    register, 
    formState: { errors } 
  } = useFormContext<HotelFormData>();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-3">Add Hotel</h1>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Name
        <input 
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("name", {required: "Required"})}
        ></input>
        {errors.name && (
            <span className="text-orange-500">{errors.name.message}</span>
          )}
      </label>

      <div className="flex gap-4">
        <label className="text-gray-700 text-sm font-bold flex-1">
          City
          <input 
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("city", {required: "Required"})}
          ></input>
          {errors.city && (
              <span className="text-orange-500">{errors.city.message}</span>
            )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          State
          <input 
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("state", {required: "Required"})}
          ></input>
          {errors.state && (
              <span className="text-orange-500">{errors.state.message}</span>
            )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Country
          <input 
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("country", {required: "Required"})}
          ></input>
          {errors.country && (
              <span className="text-orange-500">{errors.country.message}</span>
            )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Description
        <textarea 
          rows={10}
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("description", {required: "Required"})}
        ></textarea>
        {errors.description && (
            <span className="text-orange-500">{errors.description.message}</span>
          )}
      </label>

    </div>
  );
};

export default DetailsSection;