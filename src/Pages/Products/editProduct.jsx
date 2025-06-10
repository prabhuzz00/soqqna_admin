import React, { useContext, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Rating from "@mui/material/Rating";
import UploadBox from "../../Components/UploadBox";
import { IoMdClose } from "react-icons/io";
import { Button } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import { deleteImages, editData, fetchDataFromApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";

const generateRandomBarcode = () => {
  const timestamp = Date.now().toString(); // 13 digits
  const randomPart = Math.floor(
    100000000 + Math.random() * 900000000
  ).toString(); // 9 digits
  return (timestamp + randomPart).slice(0, 20); // 20‑digit string
};
const label = { inputProps: { "aria-label": "Switch demo" } };

const EditProduct = () => {
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

  const [productCat, setProductCat] = useState("");
  const [productSubCat, setProductSubCat] = useState("");
  const [productThirdLavelCat, setProductThirdLavelCat] = useState("");
  const [productFeatured, setProductFeatured] = useState("");
  const [productRamsData, setProductRamsData] = useState([]);
  const [productWeightData, setProductWeightData] = useState([]);
  const [productSizeData, setProductSizeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [bannerPreviews, setBannerPreviews] = useState([]);
  const [checkedSwitch, setCheckedSwitch] = useState(false);

  const [variations, setVariations] = useState([
    {
      color: { label: "", images: [] },
      sizes: [{ label: "", price: "", countInStock: "", vbarcode: "" }],
    },
  ]);

  const history = useNavigate();
  const context = useContext(MyContext);

  // Fetch product data and other API data
  useEffect(() => {
    // Fetch RAMs, Weights, and Sizes
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

    // Fetch product data for editing
    fetchDataFromApi(`/api/product/${context?.isOpenFullScreenPanel?.id}`).then(
      (res) => {
        const product = res?.product;

        // Calculate discount
        const price = parseFloat(product?.price);
        const oldPrice = parseFloat(product?.oldPrice);
        let discount = "";
        if (!isNaN(price) && !isNaN(oldPrice) && oldPrice > 0) {
          discount = Math.round(((oldPrice - price) / oldPrice) * 100);
        }

        setFormFields({
          name: product?.name || "",
          arbName: product?.arbName || "",
          description: product?.description || "",
          arbDescription: product?.arbDescription || "",
          images: product?.images || [],
          brand: product?.brand || "",
          price: product?.price || "",
          oldPrice: product?.oldPrice || "",
          category: product?.category || "",
          catName: product?.catName || "",
          catId: product?.catId || "",
          subCatId: product?.subCatId || "",
          subCat: product?.subCat || "",
          thirdsubCat: product?.thirdsubCat || "",
          thirdsubCatId: product?.thirdsubCatId || "",
          countInStock: product?.countInStock || "",
          rating: product?.rating || "",
          isFeatured: product?.isFeatured || false,
          discount: discount || product?.discount || "",
          bannerTitleName: product?.bannerTitleName || "",
          bannerimages: product?.bannerimages || [],
          isDisplayOnHomeBanner: product?.isDisplayOnHomeBanner || false,
          isVerified: product?.isVerified || true,
          vendorId: product?.vendorId || null,
          barcode: product?.barcode || "",
          tags: product?.tags || [],
        });

        setProductCat(product?.catId || "");
        setProductSubCat(product?.subCatId || "");
        setProductThirdLavelCat(product?.thirdsubCatId || "");
        setProductFeatured(product?.isFeatured || false);
        setCheckedSwitch(product?.isDisplayOnHomeBanner || false);
        setPreviews(product?.images || []);
        setBannerPreviews(product?.bannerimages || []);
        setVariations(
          product?.variation || [
            {
              color: { label: "", images: [] },
              sizes: [{ label: "", price: "", countInStock: "", vbarcode: "" }],
            },
          ]
        );
      }
    );
  }, [context?.isOpenFullScreenPanel?.id]);

  // Discount logic
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

  useEffect(() => {
    const totalStock = variations.reduce((total, variation) => {
      return (
        total +
        variation.sizes.reduce((sum, size) => {
          const stock = parseInt(size.countInStock);
          return sum + (isNaN(stock) ? 0 : stock);
        }, 0)
      );
    }, 0);

    setFormFields((prev) => ({
      ...prev,
      countInStock: totalStock,
    }));
  }, [variations]);

  // Variation handlers
  const handleAddVariation = () => {
    setVariations([
      ...variations,
      {
        color: { label: "", images: [] },
        sizes: [
          {
            label: "",
            price: "",
            countInStock: "",
            vbarcode: generateRandomBarcode(),
          },
        ],
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
    updated[vIndex].sizes.push({
      label: "",
      price: "",
      countInStock: "",
      vbarcode: generateRandomBarcode(),
    });
    setVariations(updated);
  };

  const handleRemoveSize = (vIndex, sIndex) => {
    const updated = [...variations];
    updated[vIndex].sizes.splice(sIndex, 1);
    setVariations(updated);
  };

  const removeColorImage = (variationIndex, imageToRemove) => {
    const updatedVariations = [...variations];
    deleteImages(`/api/category/deleteVendorImage?img=${imageToRemove}`).then(
      () => {
        updatedVariations[variationIndex].color.images = updatedVariations[
          variationIndex
        ].color.images.filter((img) => img !== imageToRemove);
        setVariations([]);
        setTimeout(() => {
          setVariations(updatedVariations);
        }, 100);
      }
    );
  };

  // Form input handlers
  const handleChangeProductCat = (event) => {
    setProductCat(event.target.value);
    setFormFields((prev) => ({
      ...prev,
      catId: event.target.value,
      category: event.target.value,
    }));
  };

  const selectCatByName = (name) => {
    setFormFields((prev) => ({
      ...prev,
      catName: name,
    }));
  };

  const handleChangeProductSubCat = (event) => {
    setProductSubCat(event.target.value);
    setFormFields((prev) => ({
      ...prev,
      subCatId: event.target.value,
    }));
  };

  const selectSubCatByName = (name) => {
    setFormFields((prev) => ({
      ...prev,
      subCat: name,
    }));
  };

  const handleChangeProductThirdLavelCat = (event) => {
    setProductThirdLavelCat(event.target.value);
    setFormFields((prev) => ({
      ...prev,
      thirdsubCatId: event.target.value,
    }));
  };

  const selectSubCatByThirdLavel = (name) => {
    setFormFields((prev) => ({
      ...prev,
      thirdsubCat: name,
    }));
  };

  const handleChangeProductFeatured = (event) => {
    setProductFeatured(event.target.value);
    setFormFields((prev) => ({
      ...prev,
      isFeatured: event.target.value,
    }));
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      setFormFields((prev) => ({
        ...prev,
        tags: value.split(",").map((tag) => tag.trim()),
      }));
    } else {
      setFormFields((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onChangeRating = (e) => {
    setFormFields((prev) => ({
      ...prev,
      rating: e.target.value,
    }));
  };

  const setPreviewsFun = (previewsArr) => {
    const imgArr = [...previews, ...previewsArr];
    setPreviews([]);
    setTimeout(() => {
      setPreviews(imgArr);
      setFormFields((prev) => ({
        ...prev,
        images: imgArr,
      }));
    }, 10);
  };

  const setBannerImagesFun = (previewsArr) => {
    const imgArr = [...bannerPreviews, ...previewsArr];
    setBannerPreviews([]);
    setTimeout(() => {
      setBannerPreviews(imgArr);
      setFormFields((prev) => ({
        ...prev,
        bannerimages: imgArr,
      }));
    }, 10);
  };

  const removeImg = (image, index) => {
    const imageArr = [...previews];
    deleteImages(`/api/category/deleteVendorImage?img=${image}`).then(() => {
      imageArr.splice(index, 1);
      setPreviews([]);
      setTimeout(() => {
        setPreviews(imageArr);
        setFormFields((prev) => ({
          ...prev,
          images: imageArr,
        }));
      }, 100);
    });
  };

  const removeBannerImg = (image, index) => {
    const imageArr = [...bannerPreviews];
    deleteImages(`/api/category/deleteVendorImage?img=${image}`).then(() => {
      imageArr.splice(index, 1);
      setBannerPreviews([]);
      setTimeout(() => {
        setBannerPreviews(imageArr);
        setFormFields((prev) => ({
          ...prev,
          bannerimages: imageArr,
        }));
      }, 100);
    });
  };

  const handleChangeSwitch = (event) => {
    setCheckedSwitch(event.target.checked);
    setFormFields((prev) => ({
      ...prev,
      isDisplayOnHomeBanner: event.target.checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formFields.name === "") {
      context.alertBox("error", "Please enter product name");
      return false;
    }

    if (formFields.arbName === "") {
      context.alertBox("error", "Please enter product Arabic Name");
      return false;
    }

    if (formFields.description === "") {
      context.alertBox("error", "Please enter product description");
      return false;
    }

    if (formFields.arbDescription === "") {
      context.alertBox("error", "Please enter product Arabic Description");
      return false;
    }

    if (formFields.catId === "") {
      context.alertBox("error", "Please select product category");
      return false;
    }

    if (formFields.price === "") {
      context.alertBox("error", "Please enter product price");
      return false;
    }

    if (formFields.oldPrice === "") {
      context.alertBox("error", "Please enter product old price");
      return false;
    }

    if (formFields.countInStock === "") {
      context.alertBox("error", "Please enter product stock");
      return false;
    }

    if (formFields.brand === "") {
      context.alertBox("error", "Please enter product brand");
      return false;
    }

    if (formFields.discount === "") {
      context.alertBox("error", "Please enter product discount");
      return false;
    }

    if (formFields.rating === "") {
      context.alertBox("error", "Please enter product rating");
      return false;
    }

    if (previews.length === 0) {
      context.alertBox("error", "Please select product images");
      return false;
    }

    const productData = {
      ...formFields,
      variation: variations,
    };

    setIsLoading(true);

    editData(
      `/api/product/updateProduct/${context?.isOpenFullScreenPanel?.id}`,
      productData
    ).then((res) => {
      if (res?.data?.error === false) {
        context.alertBox("success", res?.data?.message);
        setTimeout(() => {
          setIsLoading(false);
          context.setIsOpenFullScreenPanel({
            open: false,
          });
          history("/products");
        }, 1000);
      } else {
        setIsLoading(false);
        context.alertBox("error", res?.data?.message);
      }
    });
  };

  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmit}>
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
                Product Name in Arabic
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
                Product Description in Arabic
              </h3>
              <textarea
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
                  {context?.catData?.map((cat) => (
                    <MenuItem
                      value={cat?._id}
                      key={cat?._id}
                      onClick={() => selectCatByName(cat?.name)}
                    >
                      {cat?.name}
                    </MenuItem>
                  ))}
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
                  {context?.catData?.map(
                    (cat) =>
                      cat?.children?.length !== 0 &&
                      cat?.children?.map((subCat) => (
                        <MenuItem
                          value={subCat?._id}
                          key={subCat?._id}
                          onClick={() => selectSubCatByName(subCat?.name)}
                        >
                          {subCat?.name}
                        </MenuItem>
                      ))
                  )}
                </Select>
              )}
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Third Level Category
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
                  {context?.catData?.map(
                    (cat) =>
                      cat?.children?.length !== 0 &&
                      cat?.children?.map(
                        (subCat) =>
                          subCat?.children?.length !== 0 &&
                          subCat?.children?.map((thirdLavelCat) => (
                            <MenuItem
                              value={thirdLavelCat?._id}
                              key={thirdLavelCat?._id}
                              onClick={() =>
                                selectSubCatByThirdLavel(thirdLavelCat?.name)
                              }
                            >
                              {thirdLavelCat?.name}
                            </MenuItem>
                          ))
                      )
                  )}
                </Select>
              )}
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Price
              </h3>
              <input
                type="number"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="price"
                value={formFields.price}
                onChange={onChangeInput}
              />
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Old Price
              </h3>
              <input
                type="number"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
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
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="countInStock"
                value={formFields.countInStock}
                onChange={onChangeInput}
                readOnly
              />
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Brand
              </h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
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
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
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
                value={formFields.tags.join(", ")}
                onChange={onChangeInput}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-3 gap-4">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Rating
              </h3>
              <Rating
                name="rating"
                value={parseFloat(formFields.rating) || 0}
                onChange={onChangeRating}
              />
            </div>
          </div>

          <h3 className="font-bold text-lg mb-2">Product Variations</h3>
          {variations.map((variation, index) => (
            <div key={index} className="border p-4 mb-4 bg-white rounded-md">
              <div className="grid grid-cols-1 gap-2 mb-2">
                <label className="font-medium">Color Label</label>
                <select
                  value={variation.color.label}
                  onChange={(e) =>
                    handleVariationChange(index, "label", e.target.value)
                  }
                  className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                >
                  <option value="">Select Color</option>
                  {productRamsData.map((colorOption) => (
                    <option key={colorOption._id} value={colorOption.name}>
                      {colorOption.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label className="font-medium">Color Images</label>
                <div className="grid grid-cols-6 gap-2 mb-2">
                  <UploadBox
                    multiple={true}
                    name="colorImages"
                    url="/api/product/uploadColorImages"
                    setPreviewsFun={(uploadedImages) => {
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
              </div>

              <div className="mb-2">
                <label className="font-medium">Sizes</label>
                {variation.sizes.map((size, sIndex) => (
                  <div key={sIndex} className="grid grid-cols-4 gap-2 mb-2">
                    <select
                      value={size.label}
                      onChange={(e) =>
                        handleSizeChange(index, sIndex, "label", e.target.value)
                      }
                      className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                    >
                      <option value="">Select size</option>
                      {productSizeData.map((sizeOption) => (
                        <option key={sizeOption._id} value={sizeOption.name}>
                          {sizeOption.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Price"
                      value={size.price}
                      onChange={(e) =>
                        handleSizeChange(index, sIndex, "price", e.target.value)
                      }
                      className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
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
                      className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(index, sIndex)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                      - Remove size
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddSize(index)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  + Add Size
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveVariation(index)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Remove Variation
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddVariation}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            + Add Variation
          </button>

          <div className="col w-full p-5 px-0">
            <h3 className="font-[700] text-[18px] mb-3">Media & Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {previews?.length !== 0 &&
                previews?.map((image, index) => (
                  <div className="uploadBoxWrapper relative" key={index}>
                    <span
                      className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                      onClick={() => removeImg(image, index)}
                    >
                      <IoMdClose className="text-white text-[17px]" />
                    </span>
                    <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                      <img src={image} className="w-100" />
                    </div>
                  </div>
                ))}
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
                  bannerPreviews?.map((image, index) => (
                    <div className="uploadBoxWrapper relative" key={index}>
                      <span
                        className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                        onClick={() => removeBannerImg(image, index)}
                      >
                        <IoMdClose className="text-white text-[17px]" />
                      </span>
                      <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                        <img src={image} className="w-100" />
                      </div>
                    </div>
                  ))}
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
          {isLoading ? (
            <CircularProgress color="inherit" />
          ) : (
            <>
              <FaCloudUploadAlt className="text-[25px] text-white" />
              Update and View
            </>
          )}
        </Button>
      </form>
    </section>
  );
};

export default EditProduct;
