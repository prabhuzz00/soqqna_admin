import React, { useContext, useEffect, useState } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from "@mui/material";
import { MyContext } from "../../App";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { deleteData, editData, deleteImages } from "../../utils/api";
import UploadBox from "../../Components/UploadBox";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { IoMdClose } from "react-icons/io";

export const EditSubCatBox = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectVal, setSelectVal] = useState("");
  const [previews, setPreviews] = useState([]);
  const [formFields, setFormFields] = useState({
    name: "",
    arName: "",
    parentCatName: null,
    parentId: null,
    images: [],
    isAdminCategory: false,
  });

  const context = useContext(MyContext);

  useEffect(() => {
    setFormFields({
      name: props?.name || "",
      arName: props?.arName || "",
      parentCatName: props?.selectedCatName || null,
      parentId: props?.selectedCat || null,
      images: props?.images || [],
      isAdminCategory: props?.isAdminCategory || false,
    });
    setSelectVal(props?.selectedCat || "");
    setPreviews(props?.images || []);
  }, [props]);

  const onChangeInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  

  const handleChange = (event) => {
    setSelectVal(event.target.value);
    setFormFields((prev) => ({
      ...prev,
      parentId: event.target.value,
    }));
  };

  const selecteCatFun = (catName) => {
    setFormFields((prev) => ({
      ...prev,
      parentCatName: catName,
    }));
  };

  const setPreviewsFun = (previewsArr) => {
    const imgArr = [...previews];
    for (let i = 0; i < previewsArr.length; i++) {
      imgArr.push(previewsArr[i]);
    }
    setPreviews([]);
    setTimeout(() => {
      setPreviews(imgArr);
      setFormFields((prev) => ({
        ...prev,
        images: imgArr,
      }));
    }, 10);
  };

  const removeImg = (image, index) => {
    const imageArr = [...previews];
    deleteImages(`/api/category/deteleImage?img=${image}`).then((res) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.name === "") {
      context.alertBox("error", "Please enter category name");
      setIsLoading(false);
      return false;
    }

    if (formFields.parentId === null) {
      context.alertBox("error", "Please select parent category");
      setIsLoading(false);
      return false;
    }

    if (previews?.length === 0) {
      context.alertBox("error", "Please select category image");
      setIsLoading(false);
      return false;
    }

    editData(`/api/category/${props?.id}`, formFields).then((res) => {
      setTimeout(() => {
        context.alertBox("success", res?.data?.message);
        context?.getCat();
        setIsLoading(false);
        setEditMode(false);
      }, 1000);
    });
  };

  const deleteCat = (id) => {
    if (context?.userData?.role === "SUPERADMIN") {
      deleteData(`/api/category/${id}`).then((res) => {
        context?.getCat();
      });
    } else {
      context.alertBox("error", "Only admin can delete data");
    }
  };

  return (
    <form
      className="w-100 flex items-center gap-3 p-0 px-4"
      onSubmit={handleSubmit}
    >
      {editMode ? (
        <div className="flex flex-col w-full py-2 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Category
              </h3>
              <Select
                style={{ zoom: "75%" }}
                className="w-full"
                size="small"
                value={selectVal}
                onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                {props?.catData?.length !== 0 &&
                  props?.catData?.map((item, index) => (
                    <MenuItem
                      value={item?._id}
                      key={index}
                      onClick={() => selecteCatFun(item?.name)}
                    >
                      {item?.name}
                    </MenuItem>
                  ))}
              </Select>
            </div>
            <div>
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Sub Category Name
              </h3>
              <input
                type="text"
                className="w-full h-[30px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="name"
                value={formFields?.name}
                onChange={onChangeInput}
              />
            </div>
            <div>
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Sub Category Arabic Name
              </h3>
              <input
                type="text"
                className="w-full h-[30px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="arName"
                value={formFields?.arName}
                onChange={onChangeInput}
              />
            </div>
            <div>
              <label className="flex items-center space-x-2 text-[14px] font-[500] text-black mt-1">
                <input
                  type="checkbox"
                  name="isAdminCategory"
                  checked={formFields.isAdminCategory}
                  onChange={onChangeInput}
                  className="w-[16px] h-[16px] accent-blue-600"
                />
                <span>Is Admin Category</span>
              </label>
            </div>

          </div>
          <div>
            <h3 className="text-[14px] font-[500] mb-2 text-black">
              Sub Category Image
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {previews?.length !== 0 &&
                previews?.map((image, index) => (
                  <div className="uploadBoxWrapper mr-3 relative" key={index}>
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
                url="/api/category/uploadImages"
                setPreviewsFun={setPreviewsFun}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="small"
              className="btn-blue"
              type="submit"
              variant="contained"
            >
              {isLoading ? <CircularProgress color="inherit" /> : "Save"}
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full py-2 gap-4">
          <div className="flex items-center gap-4">
            <span className="font-[500] text-[14px]">{props?.name}</span>
            <span className="font-[500] text-[14px]">
              {props?.arName || "N/A"}
            </span>
            {props?.images?.length > 0 && (
              <div className="flex gap-2">
                {props?.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    className="w-[50px] h-[50px] object-cover rounded"
                    alt="Category"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black"
              onClick={() => setEditMode(true)}
            >
              <MdOutlineModeEdit />
            </Button>
            <Button
              className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black"
              onClick={() => deleteCat(props?.id)}
            >
              <FaRegTrashAlt />
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default EditSubCatBox;
