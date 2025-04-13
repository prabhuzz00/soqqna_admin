// components/EditVendor.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, TextField, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Box, Typography, CircularProgress, Stack } from "@mui/material";
import { MyContext } from "../../App";
import { fetchDataFromApi, patchDataLatest } from "../../utils/api";
import UploadBox from '../../Components/UploadBox';
import { IoMdClose } from "react-icons/io";

const EditVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [vendorData, setVendorData] = useState({
    storeName: "",
    storeDescription: "",
    ownerName: "",
    emailAddress: "",
    phoneNumber: "",
    storeAddress: "",
    storeLogo: [],
    storeBanner: [],
    productCategories: [],
    commissionRate: "",
    paymentDetails: "",
    taxIdentificationNumber: "",
    termsAgreement: false,
    isVerified: false,
    status: true,
  });
  const [storeLogoPreview, setStoreLogoPreview] = useState(null);
  const [storeBannerPreview, setStoreBannerPreview] = useState(null);

  const [previews, setPreviews] = useState([]);
      const [bannerPreviews, setBannerPreviews] = useState([]);

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchDataFromApi(`/api/vendor/list?id=${id}`);
      if (res?.vendors?.length > 0) {
        const vendor = res.vendors[0];
        setVendorData({
          storeName: vendor.storeName || "",
          storeDescription: vendor.storeDescription || "",
          ownerName: vendor.ownerName || "",
          emailAddress: vendor.emailAddress || "",
          phoneNumber: vendor.phoneNumber || "",
          storeAddress: vendor.storeAddress || "",
          storeLogo: null,
          storeBanner: null,
          productCategories: vendor.productCategories || [],
          commissionRate: vendor.commissionRate ? vendor.commissionRate.toString() : "",
          paymentDetails: vendor.paymentDetails || "",
          taxIdentificationNumber: vendor.taxIdentificationNumber || "",
          termsAgreement: Boolean(vendor.termsAgreement),
          isVerified: Boolean(vendor.isVerified),
          status: Boolean(vendor.status),
        });
        setStoreLogoPreview(vendor.storeLogo || null);
        setStoreBannerPreview(vendor.storeBanner || null);
      } else {
        context.alertBox("error", "Vendor not found");
        navigate(location.state?.from || "/vendors/verified-vendors");
      }
    } catch (error) {
      console.error("Fetch vendor error:", error);
      context.alertBox("error", "Failed to fetch vendor data");
      navigate(location.state?.from || "/vendors/verified-vendors");
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVendorData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setVendorData((prev) => ({ ...prev, [name]: files[0] }));
      const previewUrl = URL.createObjectURL(files[0]);
      if (name === "storeLogo") {
        setStoreLogoPreview(previewUrl);
      } else if (name === "storeBanner") {
        setStoreBannerPreview(previewUrl);
      }
    }
  };

  
      const setPreviewsFun = (previewsArr) => {
          const imgArr = previews;
          for (let i = 0; i < previewsArr.length; i++) {
              imgArr.push(previewsArr[i])
          }
  
          setPreviews([])
          setTimeout(() => {
              setPreviews(imgArr)
              formFields.images = imgArr
          }, 10);
      }
  
  
      const setBannerImagesFun = (previewsArr) => {
          const imgArr = bannerPreviews;
          for (let i = 0; i < previewsArr.length; i++) {
              imgArr.push(previewsArr[i])
          }
  
          setBannerPreviews([])
          setTimeout(() => {
              setBannerPreviews(imgArr)
              formFields.bannerimages = imgArr
          }, 10);
      }
  
  
  
     const removeImg = (image, index) => {
          var imageArr = [];
          imageArr = previews;
          deleteImages(`/api/vendor/deteleImage?img=${image}`).then((res) => {
              imageArr.splice(index, 1);
  
              setPreviews([]);
              setTimeout(() => {
                  setPreviews(imageArr);
                  formFields.images = imageArr
              }, 100);
  
          })
      }
  
  
      const removeBannerImg = (image, index) => {
          var imageArr = [];
          imageArr = bannerPreviews;
          deleteImages(`/api/vendor/deteleImage?img=${image}`).then((res) => {
              imageArr.splice(index, 1);
  
              setBannerPreviews([]);
              setTimeout(() => {
                  setBannerPreviews(imageArr);
                  formFields.bannerimages = imageArr
              }, 100);
  
          })
      }

  const handleCategoriesChange = (e) => {
    setVendorData((prev) => ({
      ...prev,
      productCategories: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Removed termsAgreement check since checkbox is commented out
    // if (!vendorData.termsAgreement) {
    //   context.alertBox("error", "You must agree to the terms");
    //   return;
    // }

    setIsLoading(true);
    const formData = new FormData();
    Object.keys(vendorData).forEach((key) => {
      if (key === "productCategories") {
        formData.append(key, JSON.stringify(vendorData[key]));
      } else if (key === "termsAgreement" || key === "isVerified" || key === "status") {
        formData.append(key, vendorData[key].toString());
      } else if (vendorData[key] !== null && vendorData[key] !== undefined) {
        formData.append(key, vendorData[key]);
      }
    });

    console.log("Sending FormData:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    try {
      const res = await patchDataLatest(`/api/vendor/${id}`, formData);
      if (res.error) {
        context.alertBox("error", `Update failed: ${res.message}`);
      } else {
        context.alertBox("success", "Vendor updated successfully");
        console.log("Update response:", res.data);
        navigate(location.state?.from || "/vendors/verified-vendors");
      }
    } catch (error) {
      console.error("Submit error:", error);
      context.alertBox("error", "Failed to update vendor: " + error.message);
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    navigate(location.state?.from || "/vendors/verified-vendors");
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: "auto", my: 4, p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom>
        Edit Vendor
      </Typography>

      <TextField
        fullWidth
        label="Store Name"
        name="storeName"
        value={vendorData.storeName}
        onChange={handleInputChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Store Description"
        name="storeDescription"
        value={vendorData.storeDescription}
        onChange={handleInputChange}
        margin="normal"
        multiline
        rows={4}
      />
      <TextField
        fullWidth
        label="Owner Name"
        name="ownerName"
        value={vendorData.ownerName}
        onChange={handleInputChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Email Address"
        name="emailAddress"
        type="email"
        value={vendorData.emailAddress}
        onChange={handleInputChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Phone Number"
        name="phoneNumber"
        value={vendorData.phoneNumber}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Store Address"
        name="storeAddress"
        value={vendorData.storeAddress}
        onChange={handleInputChange}
        margin="normal"
      />
      {/* <Box sx={{ mt: 2 }}>
        <InputLabel>Store Logo</InputLabel>
        {storeLogoPreview && (
          <Box component="img" src={storeLogoPreview} alt="Store Logo Preview" sx={{ width: 100, height: 100, objectFit: "cover", mb: 1 }} />
        )}
        <input
          type="file"
          name="storeLogo"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginTop: "8px" }}
        />
      </Box> */}

       <Box sx={{ mt: 2 }}>
        <InputLabel>Store Logo</InputLabel>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                            {
                                previews?.length !== 0 && previews?.map((image, index) => {
                                    return (
                                        <div className="uploadBoxWrapper relative" key={index}>

                                            <span className='absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer' onClick={() => removeImg(image, index)}><IoMdClose className='text-white text-[17px]' /></span>


                                            <div className='uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>

                                                <img src={image} className='w-100' />
                                            </div>
                                        </div>
                                    )
                                })
                            }


                            <UploadBox multiple={true} name="images" url="/api/vendor/uploadImages" setPreviewsFun={setPreviewsFun} />
                        </div>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <InputLabel>Store Banner</InputLabel>
        {/* {storeBannerPreview && (
          <Box component="img" src={storeBannerPreview} alt="Store Banner Preview" sx={{ width: 200, height: 100, objectFit: "cover", mb: 1 }} />
        )}
        <input
          type="file"
          name="storeBanner"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginTop: "8px" }}
        /> */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">

{
    bannerPreviews?.length !== 0 && bannerPreviews?.map((image, index) => {
        return (
            <div className="uploadBoxWrapper relative" key={index}>

                <span className='absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer' onClick={() => removeBannerImg(image, index)}><IoMdClose className='text-white text-[17px]' /></span>


                <div className='uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>

                    <img src={image} className='w-100' />
                </div>
            </div>
        )
    })
}


<UploadBox multiple={true} name="bannerimages" url="/api/product/uploadBannerImages" setPreviewsFun={setBannerImagesFun} />
</div>
      </Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Product Categories</InputLabel>
        <Select
          multiple
          name="productCategories"
          value={vendorData.productCategories}
          onChange={handleCategoriesChange}
          renderValue={(selected) => selected.join(", ")}
        >
          {["electronics", "clothing", "books", "home", "toys"].map((category) => (
            <MenuItem key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Commission Rate (%)"
        name="commissionRate"
        type="number"
        value={vendorData.commissionRate}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Payment Details"
        name="paymentDetails"
        value={vendorData.paymentDetails}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Tax Identification Number"
        name="taxIdentificationNumber"
        value={vendorData.taxIdentificationNumber}
        onChange={handleInputChange}
        margin="normal"
      />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              name="status"
              checked={vendorData.status}
              onChange={handleInputChange}
            />
          }
          label="Active"
          sx={{ m: 0 }}
        />
      </Stack>

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditVendor;