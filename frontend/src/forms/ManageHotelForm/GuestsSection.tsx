import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const GuestsSection = () => {

  const {
    register,
    formState: { errors }
  } = useFormContext<HotelFormData>();

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-3">Guests</h2>
      <div className="grid sm:grid-cols-2 p-6 gap-5 bg-gray-300">
      <label className="text-gray-700 text-sm font-semibold">Guests (18+)
        <input
          className="border rounded w-full py-2 px-3 font-normal"
          type="number"
          // placeholder="0"
          min={1}
          {...register("adultCount", {required: "Required"})}
        />
        {errors.adultCount?.message && (
          <span className="text-red-500 text-sm font-bold">{errors.adultCount?.message}</span>
        )}
      </label>

      <label className="text-gray-700 text-sm font-semibold">Guests (below 18)
        <input
          className="border rounded w-full py-2 px-3 font-normal"
          type="number"
          placeholder="0"
          min={0}
          {...register("childCount", {required: "Required"})}
        ></input>
        {errors.childCount?.message && (
          <span className="text-red-500 text-sm font-bold">{errors.childCount?.message}</span>
        )}
      </label>
      </div>
    </div>
  );
};

export default GuestsSection;