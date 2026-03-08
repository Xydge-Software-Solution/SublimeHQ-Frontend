"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  Upload,
  Trash2,
  Check,
  AlertCircle,
  Clock,
  Shield,
  FileText,
  CreditCard,
  Loader2,
  Save,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { storage, type UserData, type AccountSettings, type AccountVerification } from "@/lib/storage";

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  { value: "Africa/Lagos", label: "West Africa Time (WAT)" },
  { value: "Africa/Johannesburg", label: "South Africa Standard Time (SAST)" },
];

const countries = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "AU", label: "Australia" },
  { value: "NG", label: "Nigeria" },
  { value: "GH", label: "Ghana" },
  { value: "KE", label: "Kenya" },
  { value: "ZA", label: "South Africa" },
  { value: "IN", label: "India" },
  { value: "JP", label: "Japan" },
  { value: "BR", label: "Brazil" },
  { value: "MX", label: "Mexico" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ar", label: "Arabic" },
];

export default function AccountPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "verification" | "address">("profile");
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState("US");

  // Address state
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressCountry, setAddressCountry] = useState("US");

  // Verification state
  const [idType, setIdType] = useState<AccountVerification["idType"]>("passport");
  const [idNumber, setIdNumber] = useState("");
  const [idImage, setIdImage] = useState("");
  const [idImageName, setIdImageName] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<AccountVerification["verificationStatus"]>("unverified");
  const [isUploadingId, setIsUploadingId] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const userData = storage.getUser();
      const accountSettings = storage.getAccountSettings();

      setUser(userData);

      if (accountSettings) {
        setFirstName(accountSettings.firstName || "");
        setLastName(accountSettings.lastName || "");
        setEmail(accountSettings.email || userData?.email || "");
        setPhone(accountSettings.phone || "");
        setAvatar(accountSettings.avatar || "");
        setTimezone(accountSettings.timezone || "America/New_York");
        setLanguage(accountSettings.language || "en");
        setCountry(accountSettings.country || "US");

        if (accountSettings.address) {
          setStreet(accountSettings.address.street || "");
          setCity(accountSettings.address.city || "");
          setState(accountSettings.address.state || "");
          setPostalCode(accountSettings.address.postalCode || "");
          setAddressCountry(accountSettings.address.country || "US");
        }

        if (accountSettings.verification) {
          setIdType(accountSettings.verification.idType || "passport");
          setIdNumber(accountSettings.verification.idNumber || "");
          setIdImage(accountSettings.verification.idImageUrl || "");
          setIdImageName(accountSettings.verification.idImageName || "");
          setVerificationStatus(accountSettings.verification.verificationStatus || "unverified");
        }
      } else if (userData) {
        const nameParts = userData.name.split(" ");
        setFirstName(nameParts[0] || "");
        setLastName(nameParts.slice(1).join(" ") || "");
        setEmail(userData.email || "");
      }

      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File must be less than 10MB");
        return;
      }
      setIsUploadingId(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setIdImage(event.target?.result as string);
        setIdImageName(file.name);
        setIsUploadingId(false);
      };
      reader.onerror = () => {
        alert("Error reading file");
        setIsUploadingId(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeIdImage = () => {
    setIdImage("");
    setIdImageName("");
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);

    const accountSettings: AccountSettings = {
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      avatar: avatar || undefined,
      timezone,
      language,
      country,
      address: street ? {
        street,
        city,
        state,
        postalCode,
        country: addressCountry,
      } : undefined,
      verification: idNumber ? {
        idType,
        idNumber,
        idImageUrl: idImage || undefined,
        idImageName: idImageName || undefined,
        verificationStatus,
        submittedAt: idImage ? new Date().toISOString() : undefined,
      } : undefined,
    };

    storage.updateAccountSettings(accountSettings);

    // Update user name as well
    if (user) {
      const fullName = `${firstName} ${lastName}`.trim();
      storage.setUser({ ...user, name: fullName, email });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const handleSubmitVerification = async () => {
    if (!idNumber || !idImage) {
      alert("Please provide your ID number and upload your ID document");
      return;
    }

    setIsSaving(true);
    
    // Simulate verification submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setVerificationStatus("pending");
    
    storage.updateAccountVerification({
      idType,
      idNumber,
      idImageUrl: idImage,
      idImageName,
      verificationStatus: "pending",
      submittedAt: new Date().toISOString(),
    });

    setIsSaving(false);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const getVerificationStatusBadge = () => {
    switch (verificationStatus) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
            <CheckCircle className="w-4 h-4" />
            Verified
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-full">
            <Clock className="w-4 h-4" />
            Pending Review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-700 text-sm font-medium rounded-full">
            <AlertCircle className="w-4 h-4" />
            Not Verified
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account</h1>
          <p className="text-gray-500 mt-1">Manage your personal information and verification</p>
        </div>
        {showSavedMessage && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Changes saved!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "profile"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("verification")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "verification"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Verification
        </button>
        <button
          onClick={() => setActiveTab("address")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "address"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Address
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Profile Photo */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h2>

            <div className="flex items-center gap-6">
              <div className="relative">
                {avatar ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setAvatar("")}
                      className="absolute bottom-0 right-0 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>

              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 cursor-pointer transition-colors">
                  <Camera className="w-4 h-4" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG or WebP. Max 5MB.</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {countries.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === "verification" && (
        <div className="space-y-6">
          {/* Verification Status */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Identity Verification</h2>
                  <p className="text-sm text-gray-500">Verify your identity to unlock all features</p>
                </div>
              </div>
              {getVerificationStatusBadge()}
            </div>

            {verificationStatus === "pending" && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Verification in progress</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      We&apos;re reviewing your documents. This usually takes 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {verificationStatus === "rejected" && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Verification rejected</p>
                    <p className="text-sm text-red-700 mt-1">
                      Please upload a clearer image of your ID document and try again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {verificationStatus === "verified" && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Identity verified</p>
                    <p className="text-sm text-green-700 mt-1">
                      Your identity has been verified successfully.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ID Document Upload */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">ID Document</h2>
            <p className="text-sm text-gray-500 mb-6">
              Upload a government-issued ID for verification
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "passport", label: "Passport", icon: FileText },
                    { value: "national_id", label: "National ID Card", icon: CreditCard },
                    { value: "drivers_license", label: "Driver's License", icon: CreditCard },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setIdType(option.value as AccountVerification["idType"])}
                      className={`flex items-center gap-3 p-4 border rounded-xl transition-colors ${
                        idType === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <option.icon
                        className={`w-5 h-5 ${
                          idType === option.value ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          idType === option.value ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {idType === "passport" ? "Passport Number" : "ID Number"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder={
                    idType === "passport"
                      ? "e.g., A12345678"
                      : "Enter your ID number"
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Document <span className="text-red-500">*</span>
                </label>
                {idImage ? (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{idImageName}</p>
                          <p className="text-sm text-gray-500">Document uploaded</p>
                        </div>
                      </div>
                      <button
                        onClick={removeIdImage}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                      isUploadingId
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-blue-500 hover:bg-blue-50/50"
                    }`}
                  >
                    {isUploadingId ? (
                      <>
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                        <span className="text-sm text-blue-600 font-medium">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          <span className="font-medium text-blue-600">Click to upload</span> or
                          drag and drop
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          JPG, PNG or PDF. Max 10MB.
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,application/pdf"
                      className="hidden"
                      onChange={handleIdUpload}
                      disabled={isUploadingId}
                    />
                  </label>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h3>
                <ul className="space-y-1 text-sm text-gray-500">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Document must be valid and not expired
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    All four corners of the document must be visible
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Image must be clear and readable
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    No glare or shadows on the document
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmitVerification}
              disabled={isSaving || !idNumber || !idImage || verificationStatus === "pending"}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              Submit for Verification
            </button>
          </div>
        </div>
      )}

      {activeTab === "address" && (
        <div className="space-y-6">
          {/* Address Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Billing Address</h2>
                <p className="text-sm text-gray-500">Your address for invoices and payouts</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="123 Main Street, Suite 100"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="NY"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal / ZIP Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10001"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={addressCountry}
                    onChange={(e) => setAddressCountry(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {countries.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
