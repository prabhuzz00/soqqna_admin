import React, { useContext, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Rating from "@mui/material/Rating";
import UploadBox from "../../Components/UploadBox";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { IoMdClose } from "react-icons/io";
import { Button } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import { deleteImages, fetchDataFromApi, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";

const label = { inputProps: { "aria-label": "Switch demo" } };

const AddProduct = () => {
  const [formFields, setFormFields] = useState({
    name: "",
    arbName: "",
    description: "",
    arbDescription: "",
    images: [],
    brand: "",
    price: "",
    oldPrice: "",
    category: "",
    catName: "",
    catId: "",
    subCatId: "",
    subCat: "",
    thirdsubCat: "",
    thirdsubCatId: "",
    countInStock: "",
    rating: "",
    isFeatured: false,
    discount: "",
    bannerTitleName: "",
    bannerimages: [],
    isDisplayOnHomeBanner: false,
    isVerified: true,
    vendorId: null,
    barcode: "",
    tags: [],
  });

  const [productCat, setProductCat] = React.useState("");
  const [productSubCat, setProductSubCat] = React.useState("");
  const [productFeatured, setProductFeatured] = React.useState("");
  const [productRams, setProductRams] = React.useState([]);
  const [productRamsData, setProductRamsData] = React.useState([]);
  const [productWeight, setProductWeight] = React.useState([]);
  const [productWeightData, setProductWeightData] = React.useState([]);
  const [productSize, setProductSize] = React.useState([]);
  const [productSizeData, setProductSizeData] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productThirdLavelCat, setProductThirdLavelCat] = useState("");

  const [variations, setVariations] = useState([
    {
      color: { label: "", images: [] },
      sizes: [{ label: "", price: "", countInStock: "" }],
    },
  ]);

  const [previews, setPreviews] = useState([]);
  const [bannerPreviews, setBannerPreviews] = useState([]);
  const [checkedSwitch, setCheckedSwitch] = useState(false);

  const history = useNavigate();

  const context = useContext(MyContext);

  useEffect(() => {
    fetchDataFromApi("/api/product/productRAMS/get").then((res) => {
      if (res?.error === false) {
        setProductRamsData(res?.data);
      }
    });

    fetchDataFromApi("/api/product/productWeight/get").then((res) => {
      if (res?.error === false) {
        setProductWeightData(res?.data);
      }
    });

    fetchDataFromApi("/api/product/productSize/get").then((res) => {
      if (res?.error === false) {
        setProductSizeData(res?.data);
      }
    });
  }, []);

  //discount logic
  useEffect(() => {
    const price = parseFloat(formFields.price);
    const oldPrice = parseFloat(formFields.oldPrice);

    if (!isNaN(price) && !isNaN(oldPrice) && oldPrice > 0) {
      const discount = ((oldPrice - price) / oldPrice) * 100;
      setFormFields((prev) => ({
        ...prev,
        discount: Math.round(discount),
      }));
    }
  }, [formFields.price, formFields.oldPrice]);

  //generate barcode
  useEffect(() => {
    const generateBarcode = () => {
      const timestamp = Date.now().toString(); // 13 digits
      const randomPart = Math.floor(
        100000000 + Math.random() * 900000000
      ).toString(); // 9 digits
      const barcode = (timestamp + randomPart).slice(0, 20); // Make sure it’s exactly 20 digits

      setFormFields((prev) => ({
        ...prev,
        barcode: barcode,
      }));
    };

    generateBarcode();
  }, []);

  //handle variation

  const handleAddVariation = () => {
    setVariations([
      ...variations,
      {
        color: { label: "", images: [] },
        sizes: [{ label: "", price: "", countInStock: "" }],
      },
    ]);
  };

  const handleRemoveVariation = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const handleVariationChange = (index, field, value) => {
    const updated = [...variations];
    updated[index].color[field] = value;
    setVariations(updated);
  };

  const handleSizeChange = (vIndex, sIndex, field, value) => {
    const updated = [...variations];
    updated[vIndex].sizes[sIndex][field] = value;
    setVariations(updated);
  };

  const handleAddSize = (vIndex) => {
    const updated = [...variations];
    updated[vIndex].sizes.push({ label: "", price: "", countInStock: "" });
    setVariations(updated);
  };

  const handleRemoveSize = (vIndex, sIndex) => {
    const updated = [...variations];
    updated[vIndex].sizes.splice(sIndex, 1);
    setVariations(updated);
  };

  const handleChangeProductCat = (event) => {
    setProductCat(event.target.value);
    formFields.catId = event.target.value;
    formFields.category = event.target.value;
  };

  const selectCatByName = (name) => {
    formFields.catName = name;
  };

  const handleChangeProductSubCat = (event) => {
    setProductSubCat(event.target.value);
    formFields.subCatId = event.target.value;
  };

  const selectSubCatByName = (name) => {
    formFields.subCat = name;
  };

  const handleChangeProductThirdLavelCat = (event) => {
    setProductThirdLavelCat(event.target.value);
    formFields.thirdsubCatId = event.target.value;
  };

  const selectSubCatByThirdLavel = (name) => {
    formFields.thirdsubCat = name;
  };

  const handleChangeProductFeatured = (event) => {
    setProductFeatured(event.target.value);
    formFields.isFeatured = event.target.value;
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      setFormFields(() => {
        return {
          ...formFields,
          [name]: value.split(",").map((tag) => tag.trim()),
        };
      });
    } else {
      setFormFields(() => {
        return {
          ...formFields,
          [name]: value,
        };
      });
    }
  };

  const onChangeRating = (e) => {
    setFormFields((formFields) => ({
      ...formFields,
      rating: e.target.value,
    }));
  };

  const setPreviewsFun = (previewsArr) => {
    const imgArr = previews;
    for (let i = 0; i < previewsArr.length; i++) {
      imgArr.push(previewsArr[i]);
    }

    setPreviews([]);
    setTimeout(() => {
      setPreviews(imgArr);
      formFields.images = imgArr;
    }, 10);
  };

  const setBannerImagesFun = (previewsArr) => {
    const imgArr = bannerPreviews;
    for (let i = 0; i < previewsArr.length; i++) {
      imgArr.push(previewsArr[i]);
    }

    setBannerPreviews([]);
    setTimeout(() => {
      setBannerPreviews(imgArr);
      formFields.bannerimages = imgArr;
    }, 10);
  };

  const removeImg = (image, index) => {
    var imageArr = [];
    imageArr = previews;
    deleteImages(`/api/category/deleteVendorImage?img=${image}`).then((res) => {
      imageArr.splice(index, 1);

      setPreviews([]);
      setTimeout(() => {
        setPreviews(imageArr);
        formFields.images = imageArr;
      }, 100);
    });
  };

  const removeBannerImg = (image, index) => {
    var imageArr = [];
    imageArr = bannerPreviews;
    deleteImages(`/api/category/deleteVendorImage?img=${image}`).then((res) => {
      imageArr.splice(index, 1);

      setBannerPreviews([]);
      setTimeout(() => {
        setBannerPreviews(imageArr);
        formFields.bannerimages = imageArr;
      }, 100);
    });
  };

  const removeColorImage = (variationIndex, imageToRemove) => {
    // Make a copy of the current color image array
    const updatedVariations = [...variations];

    deleteImages(`/api/category/deleteVendorImage?img=${imageToRemove}`).then(
      () => {
        // Remove image from color.images in the specified variation
        updatedVariations[variationIndex].color.images = updatedVariations[
          variationIndex
        ].color.images.filter((img) => img !== imageToRemove);

        // Update state after short delay for visual consistency
        setVariations([]);
        setTimeout(() => {
          setVariations(updatedVariations);
        }, 100);
      }
    );
  };

  const handleChangeSwitch = (event) => {
    setCheckedSwitch(event.target.checked);
    formFields.isDisplayOnHomeBanner = event.target.checked;
  };

  const handleSubmitg = (e) => {
    e.preventDefault(0);

    if (formFields.name === "") {
      context.alertBox("error", "Please enter product name");
      return false;
    }

    if (formFields.arbName === "") {
      context.alertBox("error", "Please enter product Arbic Name");
      return false;
    }
    if (formFields.arbDescription === "") {
      context.alertBox("error", "Please enter product Arbic Description");
      return false;
    }

    if (formFields.description === "") {
      context.alertBox("error", "Please enter product description");
      return false;
    }

    if (formFields?.catId === "") {
      context.alertBox("error", "Please select product category");
      return false;
    }

    if (formFields?.price === "") {
      context.alertBox("error", "Please enter product price");
      return false;
    }

    if (formFields?.oldPrice === "") {
      context.alertBox("error", "Please enter product old Price");
      return false;
    }

    if (formFields?.countInStock === "") {
      context.alertBox("error", "Please enter  product stock");
      return false;
    }

    if (formFields?.brand === "") {
      context.alertBox("error", "Please enter product brand");
      return false;
    }

    if (formFields?.discount === "") {
      context.alertBox("error", "Please enter product discount");
      return false;
    }

    if (formFields?.rating === "") {
      context.alertBox("error", "Please enter  product rating");
      return false;
    }

    if (previews?.length === 0) {
      context.alertBox("error", "Please select product images");
      return false;
    }

    const productData = {
      ...formFields,
      variation: variations, // <-- include your variations state here
    };

    setIsLoading(true);

    postData("/api/product/create", productData).then((res) => {
      if (res?.error === false) {
        context.alertBox("success", res?.message);
        setTimeout(() => {
          setIsLoading(false);
          context.setIsOpenFullScreenPanel({
            open: false,
          });
          history("/products");
        }, 1000);
      } else {
        setIsLoading(false);
        context.alertBox("error", res?.message);
      }
    });
  };

  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmitg}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4">
          <div className="grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Name
              </h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="name"
                value={formFields.name}
                onChange={onChangeInput}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Name in Arbic
              </h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="arbName"
                value={formFields.arbName}
                onChange={onChangeInput}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Description
              </h3>
              <textarea
                type="text"
                className="w-full h-[140px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="description"
                value={formFields.description}
                onChange={onChangeInput}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Description in Arbic
              </h3>
              <textarea
                type="text"
                className="w-full h-[140px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="arbDescription"
                value={formFields.arbDescription}
                onChange={onChangeInput}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-3 gap-4">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Category
              </h3>

              {context?.catData?.length !== 0 && (
                <Select
                  labelId="demo-simple-select-label"
                  id="productCatDrop"
                  size="small"
                  className="w-full"
                  value={productCat}
                  label="Category"
                  onChange={handleChangeProductCat}
                >
                  {context?.catData?.map((cat, index) => {
                    return (
                      <MenuItem
                        value={cat?._id}
                        onClick={() => selectCatByName(cat?.name)}
                      >
                        {cat?.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Sub Category
              </h3>

              {context?.catData?.length !== 0 && (
                <Select
                  labelId="demo-simple-select-label"
                  id="productCatDrop"
                  size="small"
                  className="w-full"
                  value={productSubCat}
                  label="Sub Category"
                  onChange={handleChangeProductSubCat}
                >
                  {context?.catData?.map((cat, index) => {
                    return (
                      cat?.children?.length !== 0 &&
                      cat?.children?.map((subCat, index_) => {
                        return (
                          <MenuItem
                            value={subCat?._id}
                            onClick={() => selectSubCatByName(subCat?.name)}
                          >
                            {subCat?.name}
                          </MenuItem>
                        );
                      })
                    );
                  })}
                </Select>
              )}
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Third Lavel Category
              </h3>

              {context?.catData?.length !== 0 && (
                <Select
                  labelId="demo-simple-select-label"
                  id="productCatDrop"
                  size="small"
                  className="w-full"
                  value={productThirdLavelCat}
                  label="Sub Category"
                  onChange={handleChangeProductThirdLavelCat}
                >
                  {context?.catData?.map((cat) => {
                    return (
                      cat?.children?.length !== 0 &&
                      cat?.children?.map((subCat) => {
                        return (
                          subCat?.children?.length !== 0 &&
                          subCat?.children?.map((thirdLavelCat, index) => {
                            return (
                              <MenuItem
                                value={thirdLavelCat?._id}
                                key={index}
                                onClick={() =>
                                  selectSubCatByThirdLavel(thirdLavelCat?.name)
                                }
                              >
                                {thirdLavelCat?.name}
                              </MenuItem>
                            );
                          })
                        );
                      })
                    );
                  })}
                </Select>
              )}
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Price
              </h3>
              <input
                type="number"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm "
                name="price"
                value={formFields.price}
                onChange={onChangeInput}
              />
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1  text-black">
                Product Old Price
              </h3>
              <input
                type="number"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm "
                name="oldPrice"
                value={formFields.oldPrice}
                onChange={onChangeInput}
              />
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Is Featured?
              </h3>
              <Select
                labelId="demo-simple-select-label"
                id="productCatDrop"
                size="small"
                className="w-full"
                value={productFeatured}
                label="Category"
                onChange={handleChangeProductFeatured}
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Stock
              </h3>
              <input
                type="number"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm "
                name="countInStock"
                value={formFields.countInStock}
                onChange={onChangeInput}
              />
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Brand
              </h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm "
                name="brand"
                value={formFields.brand}
                onChange={onChangeInput}
              />
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Discount
              </h3>
              <input
                type="number"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm "
                name="discount"
                value={formFields.discount}
                onChange={onChangeInput}
                readOnly
              />
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Tags
              </h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="tags"
                value={formFields.tags}
                onChange={onChangeInput}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-3 gap-4">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1  text-black">
                Product Rating{" "}
              </h3>
              <Rating
                name="half-rating"
                defaultValue={1}
                onChange={onChangeRating}
              />
            </div>
          </div>

          {/* variant Box create here with add variant and remove variant button */}

          <h3 className="font-bold text-lg mb-2">Product Variations</h3>
          {variations.map((variation, index) => (
            <div key={index} className="border p-4 mb-4 bg-white rounded-md">
              <div className="mb-2">
                <label className="font-medium">Color Label</label>
                <input
                  type="text"
                  value={variation.color.label}
                  onChange={(e) =>
                    handleVariationChange(index, "label", e.target.value)
                  }
                  className="input-style"
                />
              </div>

              <div className="mb-2">
                <label className="font-medium">Color Images</label>
                <UploadBox
                  multiple={true}
                  name="colorImages"
                  url="/api/product/uploadColorImages"
                  setPreviewsFun={(uploadedImages) => {
                    // This updates the correct variation's color images
                    setVariations((prevVariations) =>
                      prevVariations.map((variation, i) =>
                        i === index
                          ? {
                              ...variation,
                              color: {
                                ...variation.color,
                                images: [
                                  ...(variation.color.images || []),
                                  ...uploadedImages,
                                ],
                              },
                            }
                          : variation
                      )
                    );
                  }}
                />

                {/* Image Preview — also in ProductForm */}
                <div className="flex flex-wrap mt-2">
                  {variations[index]?.color?.images?.map((img, i) => (
                    <div
                      key={i}
                      className="relative mr-2 mb-2"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <img
                        src={img}
                        alt={`variation-${index}-img-${i}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        onClick={() => removeColorImage(index, img)}
                        className="absolute -top-2 -right-2 bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm z-10"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-2">
                <label className="font-medium">Sizes</label>
                {variation.sizes.map((size, sIndex) => (
                  <div key={sIndex} className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      placeholder="Label"
                      value={size.label}
                      onChange={(e) =>
                        handleSizeChange(index, sIndex, "label", e.target.value)
                      }
                      className="input-style"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={size.price}
                      onChange={(e) =>
                        handleSizeChange(index, sIndex, "price", e.target.value)
                      }
                      className="input-style"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={size.countInStock}
                      onChange={(e) =>
                        handleSizeChange(
                          index,
                          sIndex,
                          "countInStock",
                          e.target.value
                        )
                      }
                      className="input-style"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddSize(index)}
                  className="btn-sm"
                >
                  + Add Size
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveVariation(index)}
                className="btn-red mt-2"
              >
                Remove Variation
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddVariation}
            className="btn-blue mt-4"
          >
            + Add Variation
          </button>

          <div className="col w-full p-5 px-0">
            <h3 className="font-[700] text-[18px] mb-3">Media & Images</h3>

            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {previews?.length !== 0 &&
                previews?.map((image, index) => {
                  return (
                    <div className="uploadBoxWrapper relative" key={index}>
                      <span
                        className="absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                        onClick={() => removeImg(image, index)}
                      >
                        <IoMdClose className="text-white text-[17px]" />
                      </span>

                      <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                        <img src={image} className="w-100" />
                      </div>
                    </div>
                  );
                })}

              <UploadBox
                multiple={true}
                name="images"
                url="/api/product/uploadImages"
                setPreviewsFun={setPreviewsFun}
              />
            </div>
          </div>

          <div className="col w-full p-5 px-0">
            <div className="bg-gray-100 p-4 w-full">
              <div className="flex items-center gap-8">
                <h3 className="font-[700] text-[18px] mb-3">Banner Images</h3>
                <Switch
                  {...label}
                  onChange={handleChangeSwitch}
                  checked={checkedSwitch}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                {bannerPreviews?.length !== 0 &&
                  bannerPreviews?.map((image, index) => {
                    return (
                      <div className="uploadBoxWrapper relative" key={index}>
                        <span
                          className="absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                          onClick={() => removeBannerImg(image, index)}
                        >
                          <IoMdClose className="text-white text-[17px]" />
                        </span>

                        <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                          <img src={image} className="w-100" />
                        </div>
                      </div>
                    );
                  })}

                <UploadBox
                  multiple={true}
                  name="bannerimages"
                  url="/api/product/uploadBannerImages"
                  setPreviewsFun={setBannerImagesFun}
                />
              </div>

              <br />

              <h3 className="font-[700] text-[18px] mb-3">Banner Title</h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="bannerTitleName"
                value={formFields.bannerTitleName}
                onChange={onChangeInput}
              />
            </div>
          </div>
        </div>

        <hr />
        <br />
        <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">
          {isLoading === true ? (
            <CircularProgress color="inherit" />
          ) : (
            <>
              <FaCloudUploadAlt className="text-[25px] text-white" />
              Publish and View
            </>
          )}
        </Button>
      </form>
    </section>
  );
};

export default AddProduct;
