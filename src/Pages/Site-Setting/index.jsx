"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import toast from "react-hot-toast";
import { editDataCommon, fetchDataFromApi } from "../../utils/api";

const SiteSettingForm = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    siteTitle: "",
    email: "",
    contactNo: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    popularProductHeadingEn: "",
    popularProductHeadingAr: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    addressLine1ar: "",
    addressLine2ar: "",
    addressLine3ar: "",
    workingHourL1: "",
    workingHourL2: "",
    workingHourL3: "",
    workingHourL1ar: "",
    workingHourL2ar: "",
    workingHourL3ar: "",
  });

  useEffect(() => {
    fetchDataFromApi(`/api/site-settings`)
      .then((res) => {
        setInitialLoading(true);
        if (res.success && res.data) {
          setForm({ ...form, ...res.data });
        }
        setInitialLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch site settings");
        console.error("Error fetching site settings:", err);
      });
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Add all form fields except logo to FormData
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value || "");
      });

      editDataCommon(`/api/site-settings`, formData).then((res) => {
        setLoading(false);
        if (!res.success) {
          setError(res.message || "Failed to save settings");
          toast.error(res.message || "Failed to save settings");
        } else {
          toast.success("Site settings saved successfully");
          if (res.data) {
            setForm((prevForm) => ({ ...prevForm, ...res.data }));
          }
        }
      });
    } catch (err) {
      setError("Server error while saving");
      toast.error("Server error while saving");
      console.error("Error saving settings:", err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-5 text-center">Loading...</div>;

  return (
    <div className="p-5 w-full mx-auto bg-white dark:bg-themeDark rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[20px] font-[600]">Site Settings</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card dark:bg-themeDark p-5 dark:border-[rgba(255,255,255,0.1)]">
          <h2 className="text-[18px] font-[600] mb-4">Basic Details</h2>

          {/* Site Title */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Site Title
            </label>
            <input
              type="text"
              name="siteTitle"
              value={form.siteTitle}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Email ID
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>

          {/* Contact Number */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="contactNo"
              value={form.contactNo}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>

          {/* popularProductHeadingEn */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Popular Product Heading En
            </label>
            <input
              type="text"
              name="popularProductHeadingEn"
              value={form.popularProductHeadingEn}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>

          {/* popularProductHeadingAr */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Popular Product Heading Ar
            </label>
            <input
              type="text"
              name="popularProductHeadingAr"
              value={form.popularProductHeadingAr}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>

          {/* addressLine1 */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Address Line 1
            </label>
            <input
              type="text"
              name="addressLine1"
              value={form.addressLine1}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>
          {/* addressLine2 */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              name="addressLine2"
              value={form.addressLine2}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>
          {/* addressLine3 */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Address Line 3
            </label>
            <input
              type="text"
              name="addressLine3"
              value={form.addressLine3}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>
          {/* addressLine1ar */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Address Line 1 Arbic
            </label>
            <input
              type="text"
              name="addressLine1ar"
              value={form.addressLine1ar}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>
          {/* addressLine2 */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Address Line 2 Arbic
            </label>
            <input
              type="text"
              name="addressLine2ar"
              value={form.addressLine2ar}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>
          {/* addressLine3ar */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Address Line 3 Arbic
            </label>
            <input
              type="text"
              name="addressLine3ar"
              value={form.addressLine3ar}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>

          {/* workingHourL1 */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Working Hour Line 1
            </label>
            <input
              type="text"
              name="workingHourL1"
              value={form.workingHourL1}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>

          {/* workingHourL2 */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Working Hour Line 2
            </label>
            <input
              type="text"
              name="workingHourL2"
              value={form.workingHourL2}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>

          {/* workingHourL3 */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Working Hour Line 3
            </label>
            <input
              type="text"
              name="workingHourL3"
              value={form.workingHourL3}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>

          {/* workingHourL1ar */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Working Hour Line 1 Arbic
            </label>
            <input
              type="text"
              name="workingHourL1ar"
              value={form.workingHourL1ar}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>

          {/* workingHourL2ar */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Working Hour Line 2 Arbic
            </label>
            <input
              type="text"
              name="workingHourL2ar"
              value={form.workingHourL2ar}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>

          {/* workingHourL3ar */}
          <div className="mb-4">
            <label className="block font-[500] text-gray-600 text-[14px] mb-1">
              Working Hour Line 3 Arbic
            </label>
            <input
              type="text"
              name="workingHourL3ar"
              value={form.workingHourL3ar}
              onChange={handleInputChange}
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              required
            />
          </div>

          {/* Logo */}
          {/* <div className="mb-4">
                        <label className="block font-[500] text-gray-600 text-[14px] mb-1">Upload Logo</label>
                        {form.logo && (
                            <div className="mb-2 relative inline-block">
                                <img
                                    src={form.logo}
                                    alt="Logo Preview"
                                    className="h-[100px] object-contain border rounded"
                                />
                                <button
                                    type="button"
                                    onClick={handleDeleteLogo}
                                    disabled={deleteLoading}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 disabled:opacity-50"
                                >
                                    {deleteLoading ? "..." : "×"}
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            ref={logoInputRef}
                            className="w-full"
                        />
                    </div> */}

          {/* Social Links */}
          <h2 className="text-[18px] font-[600] mb-4 mt-6">Social Media</h2>

          {["facebook", "instagram", "twitter", "linkedin"].map((platform) => (
            <div className="mb-4" key={platform}>
              <label className="block font-[500] text-gray-600 text-[14px] mb-1">
                {platform.charAt(0).toUpperCase() + platform.slice(1)} URL
              </label>
              <input
                type="url"
                name={platform}
                value={form[platform]}
                onChange={handleInputChange}
                placeholder={`https://${platform}.com/yourpage`}
                className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>
          ))}

          <div className="flex gap-3 mt-5">
            <Button
              type="submit"
              variant="contained"
              className="btn-dark"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SiteSettingForm;
