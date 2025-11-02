import React from "react";
import { useForm, Controller } from "react-hook-form";
import { MdEmail, MdPhone, MdLocationOn, MdBusiness } from "react-icons/md";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import LocationPicker from "./LocationPicker";
import LocationSelects from "./LocationSelects";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../store/apis/endpoints/user";
import { Button } from "@heroui/react";
import { toast } from "react-hot-toast";

import { useSelector } from "react-redux";

function MemberPersonalInfo() {
  const { user: memberUser } = useSelector((state) => state.member);
  const { data: userData, isLoading } = useGetUserByIdQuery(
    {
      id: memberUser?.id,
      params: { fields: "profile" },
    },
    {
      skip: !memberUser?.id,
    }
  );

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const user = userData?.data?.user;

  const {
    register,
    control,
    formState: { errors, dirtyFields },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      email: "",
      companyLicenseNo: "",
      companyNameEn: "",
      companyNameAr: "",
      landline: "",
      mobileNumber: "",
      country: "",
      region: "",
      city: "",
      zipCode: "",
      streetAddress: "",
      latitude: 24.7136,
      longitude: 46.6753,
    },
    values: user
      ? {
          email: user.email,
          companyLicenseNo: user.companyLicenseNo,
          companyNameEn: user.companyNameEn,
          companyNameAr: user.companyNameAr,
          landline: user.landline,
          mobileNumber: user.mobile,
          country: user.country,
          region: user.region,
          city: user.city,
          zipCode: user.zipCode,
          streetAddress: user.streetAddress,
          latitude: user.latitude,
          longitude: user.longitude,
        }
      : undefined,
  });

  const handleLocationChange = (location) => {
    setValue("latitude", location.latitude, { shouldDirty: true });
    setValue("longitude", location.longitude, { shouldDirty: true });
    setValue("streetAddress", location.address, { shouldDirty: true });
  };

  const handleSaveChanges = async () => {
    const formValues = getValues();
    const changedValues = {};

    // Check which fields have been modified
    Object.keys(dirtyFields).forEach((field) => {
      changedValues[field] = formValues[field];
    });

    // Only proceed if there are changes
    if (Object.keys(changedValues).length > 0) {
      try {
        // Convert mobile and landline to proper format if needed
        if (changedValues.mobileNumber) {
          changedValues.mobile = changedValues.mobileNumber;
          delete changedValues.mobileNumber;
        }

        const payload = {
          id: memberUser?.id,
          data: changedValues,
        };

        await updateUser(payload).unwrap();
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error.data?.message || "Failed to update profile");
        console.error("Update failed:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      {/* Basic Info Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MdEmail className="w-4 h-4 mr-2 text-navy-700" />
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full h-[42px] px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MdBusiness className="w-4 h-4 mr-2 text-navy-700" />
              License No
            </label>
            <input
              type="text"
              {...register("companyLicenseNo")}
              className="w-full h-[42px] px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MdPhone className="w-4 h-4 mr-2 text-navy-700" />
              Mobile Number
            </label>
            <Controller
              name="mobileNumber"
              control={control}
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  country={"sa"}
                  value={value}
                  onChange={onChange}
                  inputClass="!w-full !h-[42px] !text-base !border-gray-400 !bg-gray-50 !rounded-lg"
                  containerClass="!w-full"
                  buttonClass="!border-gray-400 !border !rounded-l-lg !h-[42px]"
                  // inputStyle={""}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Company Info Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Company Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MdBusiness className="w-4 h-4 mr-2 text-navy-700" />
              Company Name (English)
            </label>
            <input
              type="text"
              {...register("companyNameEn")}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MdBusiness className="w-4 h-4 mr-2 text-navy-700" />
              Company Name (Arabic)
            </label>
            <input
              type="text"
              {...register("companyNameAr")}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50"
              dir="rtl"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MdPhone className="w-4 h-4 mr-2 text-navy-700" />
              Landline
            </label>
            <Controller
              name="landline"
              control={control}
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  country={"sa"}
                  value={value}
                  onChange={onChange}
                  inputClass="!w-full !h-[40px] !text-base !border-gray-400 !bg-gray-50 !rounded-lg"
                  containerClass="!w-full"
                  buttonClass="!border-gray-400 !border !rounded-l-lg !h-[40px]"
                />
              )}
            />
          </div>

        </div>
      </div>

      {/* Location Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Location Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <LocationSelects
            control={control}
            errors={errors}
            defaultValues={{
              country: user?.country,
              region: user?.region,
              city: user?.city,
            }}
          />
        </div>
        
        <div className="w-1/3  my-5">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MdLocationOn className="w-4 h-4 mr-2 text-navy-700" />
              Zip Code
            </label>
            <input
              type="text"
              {...register("zipCode")}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50"
            />
          </div>

          

        <LocationPicker
          onLocationChange={handleLocationChange}
          defaultLocation={{
            latitude: user?.latitude,
            longitude: user?.longitude,
            address: user?.streetAddress,
          }}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          isDisabled={
            Object.keys(errors).length > 0 ||
            Object.keys(dirtyFields).length === 0
          }
          onClick={handleSaveChanges}
          className="px-6 py-2.5 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export default MemberPersonalInfo;
