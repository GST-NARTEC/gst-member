import React, { useState, useEffect } from "react";
import { useDisclosure, Chip, Button } from "@nextui-org/react";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdBusiness,
  MdArrowBack,
} from "react-icons/md";
import { useForm, Controller } from "react-hook-form";
import OtpVerificationModal from "../../../components/auth/registration/OtpVerificationModal";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import LocationPicker from "../../../components/auth/registration/LocationPicker";
import LocationSelects from "../../../components/auth/registration/LocationSelects";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// api
import {
  useSendOtpMutation,
  useCreateUserMutation,
  useVerifyLicenseMutation,
} from "../../../store/apis/endpoints/user";
import toast from "react-hot-toast";
import { LoadScript } from "@react-google-maps/api";
import LicenseRegistrationModal from "../../../components/auth/registration/LicenseRegistrationModal";
import { selectCartItems } from "../../../store/slices/cartSlice";
import { useSelector } from "react-redux";

const MembershipForm = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const cartItems = useSelector(selectCartItems);

  // api call
  const [
    sendOtp,
    {
      isLoading: isSendingOtp,
      isSuccess: isEmailSent,
      isError: isEmailError,
      error: emailError,
      data: emailData,
    },
  ] = useSendOtpMutation();
  const [
    createUser,
    {
      isLoading: isCreatingUser,
      isSuccess: isUserCreated,
      isError: isUserError,
      error: userError,
      data: userData,
    },
  ] = useCreateUserMutation();
  const [
    verifyLicense,
    {
      isLoading: isVerifyingLicense,
      isSuccess: isLicenseSuccess,
      isError: isLicenseError,
      error: licenseError,
    },
  ] = useVerifyLicenseMutation();

  const {
    register,
    watch,
    formState: { errors, isValid },
    setValue,
    control,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      companyLicenseNo: "",
      companyNameAr: "",
      companyNameEn: "",
      mobileNumber: "",
      landline: "",
      country: "",
      region: "",
      city: "",
      zipCode: "",
      streetAddress: "",
      latitude: null,
      longitude: null,
    },
    reValidateMode: "onChange",
  });

  const email = watch("email");

  // Show verify button when valid email is entered
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setShowVerifyButton(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    if (isEmailError) {
      toast.error(emailError?.data?.message);
    } else if (isEmailSent) {
      toast.success("OTP sent to your email successfully");
    }
  }, [isEmailError, emailError, isEmailSent]);

  const handleVerifyClick = async () => {
    try {
      await sendOtp({ email }).unwrap();
      onOpen();
    } catch (error) {
      console.error("Failed to send OTP:", error);
    }
  };
  const [hasAttemptedEmailVerification, setHasAttemptedEmailVerification] =
    useState(false);
  const [hasAttemptedLicenseVerification, setHasAttemptedLicenseVerification] =
    useState(false);

  const handleOtpVerify = () => {
    setIsVerified(true);
    setHasAttemptedEmailVerification(true);
    onOpenChange(false);
  };

  const [isLicenseVerified, setIsLicenseVerified] = useState(false);
  const [showLicenseVerifyButton, setShowLicenseVerifyButton] = useState(false);
  const [isLicenseInvalid, setIsLicenseInvalid] = useState(false);
  const [showLicenseRegModal, setShowLicenseRegModal] = useState(false);

  const handleLicenseVerify = async () => {
    const licenseNo = watch("companyLicenseNo");
    try {
      await verifyLicense({
        licenseKey: licenseNo,
      }).unwrap();

      setIsLicenseVerified(true);
      setIsLicenseInvalid(false);
      setHasAttemptedLicenseVerification(true);
    } catch (error) {
      setIsLicenseVerified(false);
      setIsLicenseInvalid(true);
      setHasAttemptedLicenseVerification(true);
      setValue("companyLicenseNo", "");
      console.log(error);
    }
  };

  useEffect(() => {
    const licenseNo = watch("companyLicenseNo") || "";
    if (licenseNo.length === 10 && !isLicenseVerified) {
      setShowLicenseVerifyButton(true);
      setIsLicenseInvalid(false);
    } else {
      setShowLicenseVerifyButton(false);
    }
  }, [watch("companyLicenseNo"), isLicenseVerified]);

  useEffect(() => {
    if (isLicenseError) {
      toast.error(licenseError?.data?.message || "License verification failed");
    } else if (isLicenseSuccess) {
      toast.success("License verified successfully");
    }
  }, [isLicenseError, licenseError, isLicenseSuccess]);

  useEffect(() => {
    if (isUserError) {
      toast.error(userError?.data?.message || "Failed to create user");
    } else if (isUserCreated) {
      localStorage.setItem("userData", JSON.stringify(userData?.data?.user));
      navigate("/register/payment");
    }
  }, [isUserError, userError, isUserCreated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: watch("email"),
      companyLicenseNo: watch("companyLicenseNo"),
      companyNameEn: watch("companyNameEn"),
      companyNameAr: watch("companyNameAr"),
      landline: watch("landline"),
      mobile: watch("mobileNumber"),
      country: watch("country"),
      region: watch("region"),
      city: watch("city"),
      zipCode: watch("zipCode"),
      streetAddress: watch("streetAddress"),
      latitude: parseFloat(watch("latitude")),
      longitude: parseFloat(watch("longitude")),
      cartItems: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        addons:
          item.selectedAddons?.map((addon) => ({
            id: addon.id,
            quantity: addon.quantity,
          })) || [],
      })),
    };

    try {
      await createUser(formData).unwrap();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleLocationChange = (location) => {
    setValue("latitude", location.latitude);
    setValue("longitude", location.longitude);
    setValue("streetAddress", location.address);
  };

  const handleLicenseInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setValue("companyLicenseNo", value);
  };

  const handleLicenseRegistrationSuccess = ({ licenseNumber, isVerified }) => {
    setValue("companyLicenseNo", licenseNumber);
    setIsLicenseVerified(true);
    setIsLicenseInvalid(false);
    setHasAttemptedLicenseVerification(true);
    setShowLicenseVerifyButton(false);
    toast.success("License registered and verified successfully");
    setShowLicenseRegModal(false);
  };

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-2 md:px-4 lg:px-8">
        <div className="mx-auto  overflow-hidden  rounded-lg">
          <div className="border-b border-gray-100 bg-white px-2 md:px-4 lg:px-8">
            <h2 className="text-lg py-4 sm:py-6 md:text-2xl font-semibold text-gray-800">
              International Barcode Number Registration Form
            </h2>
            <p className="text-sm text-gray-500 mt-1 pb-4">
              Please fill in your International Barcode Number information
            </p>
          </div>

          <div className="p-2 md:p-4 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 sm:gap-x-6 lg:gap-x-8">
              {/* Email and License Number Row */}
              <div className="relative">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <MdEmail className="w-4 h-4 mr-2 text-navy-700" />
                    Email Address
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  {hasAttemptedEmailVerification && (
                    <Chip
                      startContent={
                        isVerified ? (
                          <BsCheckCircleFill className="text-green-500" />
                        ) : (
                          <BsXCircleFill className="text-red-500" />
                        )
                      }
                      variant="flat"
                      color={isVerified ? "success" : "danger"}
                      size="sm"
                    >
                      {isVerified ? "Verified" : "Unverified"}
                    </Chip>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email",
                      },
                    })}
                    className={`w-full px-4 py-2.5 border ${
                      errors.email ? "border-red-500" : "border-gray-400"
                    } rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white`}
                    placeholder="Enter email address"
                  />
                  {showVerifyButton && !isVerified && (
                    <button
                      onClick={handleVerifyClick}
                      disabled={isSendingOtp}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-navy-600 text-white rounded-md text-sm hover:bg-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSendingOtp ? "Sending..." : "Verify"}
                    </button>
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <MdBusiness className="w-4 h-4 mr-2 text-navy-700" />
                    Company License No
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  {hasAttemptedLicenseVerification && (
                    <Chip
                      startContent={
                        isLicenseVerified ? (
                          <BsCheckCircleFill className="text-green-500" />
                        ) : (
                          <BsXCircleFill className="text-red-500" />
                        )
                      }
                      variant="flat"
                      color={isLicenseVerified ? "success" : "danger"}
                      size="sm"
                    >
                      {isLicenseVerified ? "Verified" : "Unverified"}
                    </Chip>
                  )}
                </label>
                <div className="relative">
                  <input
                    disabled={!isVerified}
                    type="text"
                    value={watch("companyLicenseNo")}
                    onChange={handleLicenseInputChange}
                    className={`w-full px-4 py-2.5 border ${
                      isLicenseInvalid ? "border-red-500" : "border-gray-400"
                    } rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter license number"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                    {showLicenseVerifyButton &&
                      !isLicenseVerified &&
                      !isLicenseInvalid && (
                        <button
                          onClick={handleLicenseVerify}
                          disabled={isVerifyingLicense}
                          className="px-3 py-1 bg-navy-600 text-white rounded-md text-sm hover:bg-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isVerifyingLicense ? "Verifying..." : "Verify"}
                        </button>
                      )}
                    {isLicenseInvalid && (
                      <button
                        onClick={() => setShowLicenseRegModal(true)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                      >
                        Register License
                      </button>
                    )}
                  </div>
                </div>
                {errors.companyLicenseNo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.companyLicenseNo.message}
                  </p>
                )}
                {isLicenseInvalid && (
                  <p className="text-red-500 text-sm mt-1">
                    Invalid license number. You can register a new license.
                  </p>
                )}
              </div>

              {/* Company Names Row */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MdBusiness className="w-4 h-4 mr-2 text-navy-700" />
                  Company Name (English)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  disabled={!isVerified || !isLicenseVerified}
                  {...register("companyNameEn", {
                    required: "Company name is required",
                  })}
                  className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter company name"
                />
                {errors.companyNameEn && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.companyNameEn.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MdBusiness className="w-4 h-4 mr-2 text-navy-700" />
                  Company Name (Arabic)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  disabled={!isVerified || !isLicenseVerified}
                  {...register("companyNameAr", {
                    required: "Company name is required",
                  })}
                  className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="اسم الشركة"
                  dir="rtl"
                />
                {errors.companyNameAr && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.companyNameAr.message}
                  </p>
                )}
              </div>

              {/* Phone Numbers Row */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MdPhone className="w-4 h-4 mr-2 text-navy-700" />
                  Landline
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Controller
                  name="landline"
                  control={control}
                  rules={{ required: "Landline number is required" }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      country={"sa"}
                      value={value}
                      onChange={onChange}
                      disabled={!isVerified || !isLicenseVerified}
                      inputClass="!w-full !h-[45px] !text-base !border-gray-400 !rounded-lg focus:!ring-navy-600 !bg-gray-50 focus:!bg-white disabled:!opacity-50 disabled:!cursor-not-allowed"
                      containerClass="!w-full"
                      buttonClass={`!border-gray-400 !border !rounded-l-lg !h-[45px] !bg-gray-50`}
                      dropdownClass="!bg-white !z-10"
                    />
                  )}
                />
                {errors.landline && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.landline.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MdPhone className="w-4 h-4 mr-2 text-navy-700" />
                  Mobile Number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Controller
                  name="mobileNumber"
                  control={control}
                  rules={{ required: "Mobile number is required" }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      country={"sa"}
                      value={value}
                      onChange={onChange}
                      disabled={!isVerified || !isLicenseVerified}
                      inputClass="!w-full !h-[45px] !text-base !border-gray-400 !rounded-lg focus:!ring-navy-600 !bg-gray-50 focus:!bg-white disabled:!opacity-50 disabled:!cursor-not-allowed"
                      containerClass="!w-full"
                      buttonClass={`!border-gray-400 !border !rounded-l-lg !h-[45px] !bg-gray-50`}
                      dropdownClass="!bg-white !z-10"
                    />
                  )}
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>

              {/* Location Row 1 */}
              <LocationSelects
                control={control}
                isDisabled={!isVerified || !isLicenseVerified}
                errors={errors}
              />

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MdLocationOn className="w-4 h-4 mr-2 text-navy-700" />
                  Zip Code
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  disabled={!isVerified || !isLicenseVerified}
                  {...register("zipCode", {
                    required: "Zip code is required",
                  })}
                  className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter zip code"
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>

              {/* Street Address - Full Width */}
              <div className="sm:col-span-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MdLocationOn className="w-4 h-4 mr-2 text-navy-700" />
                  Location & Address
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <LoadScript
                  googleMapsApiKey={googleMapsApiKey}
                  libraries={["places"]}
                  loadingElement={
                    <div className="flex items-center justify-center mx-auto animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600" />
                  }
                >
                  <LocationPicker
                    onLocationChange={handleLocationChange}
                    isDisabled={!isVerified || !isLicenseVerified}
                    error={errors.streetAddress?.message}
                    defaultLocation={
                      watch("latitude") && watch("longitude")
                        ? {
                            latitude: watch("latitude"),
                            longitude: watch("longitude"),
                            address: watch("streetAddress"),
                          }
                        : null
                    }
                  />
                </LoadScript>
              </div>
            </div>

            {/* Submit Button - Navy Blue */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
              <Button
                onClick={() => navigate("/register/barcodes")}
                className="w-full sm:w-auto mb-4 sm:mb-0 inline-flex items-center justify-center gap-2 px-6 py-3 text-navy-600 hover:text-navy-700"
                startContent={<MdArrowBack size={20} />}
                color="default"
              >
                <span>Back to Barcodes</span>
              </Button>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-auto px-6 py-3 bg-navy-600 text-white rounded-lg hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  !isVerified ||
                  !isLicenseVerified ||
                  !isValid ||
                  isCreatingUser
                }
              >
                {isCreatingUser ? "Saving..." : "Save & Next"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <OtpVerificationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onVerify={handleOtpVerify}
        email={email}
        emailData={emailData}
      />

      <LicenseRegistrationModal
        isOpen={showLicenseRegModal}
        onClose={() => setShowLicenseRegModal(false)}
        onLicenseSuccess={handleLicenseRegistrationSuccess}
      />
    </>
  );
};

export default MembershipForm;
