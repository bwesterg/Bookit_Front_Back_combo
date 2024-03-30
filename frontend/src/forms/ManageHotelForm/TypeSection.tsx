import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../config/hotel-options-config"; 
import { HotelFormData } from "./ManageHotelForm";

const TypeSection = () => {
  const { 
    register, 
    watch, 
    formState: { errors }
  } = useFormContext<HotelFormData>();
  const typeWatch = watch("type");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Type</h2>
      <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 text-center">
        {hotelTypes.map((type)=>(
          <label className={
            typeWatch === type 
              ? "cursor-pointer bg-purple-600 text-sm rounded-full px-4 py-2 font-semibold text-white" 
              : "cursor-pointer bg-gray-300 text-sm rounded-full px-4 py-2 font-semibold" 
          }>
            <input type="radio" value={type} {...register("type", {
              required: "Required"
            })}
              className="hidden"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
      {errors.type && (
        <span className="text-red-400 text-sm font-bold">{errors.type.message}</span>
      )}
    </div>
  );
};

export default TypeSection;