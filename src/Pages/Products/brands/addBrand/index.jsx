import React, { useState, useContext } from 'react';
import { Button } from '@mui/material';
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import UploadBox from '../../../../Components/UploadBox';
import { MyContext } from '../../../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchDataFromApi, postData, deleteImages, editDataCommon } from '../../../../utils/api';
import { useNavigate } from 'react-router-dom';

const AddBrand = () => {
    const [formFields, setFormFields] = useState({
        name: "",
        images: [],
        is_featured: false,
        status: "active",
    });

    const [previews, setPreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [brandStatus, setBrandStatus] = useState('active');
    const navigate = useNavigate(); // Renamed from history for clarity
    const context = useContext(MyContext);

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onChangeFeature = (e) => {
        setFormFields((prev) => ({
            ...prev,
            is_featured: e.target.checked, // Use checked for checkbox
        }));
    };

    const onChangeStatus = (event) => {
        const newStatus = event.target.value;
        setBrandStatus(newStatus);
        setFormFields((prev) => ({
            ...prev,
            status: newStatus,
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

    const removeImg = (image, index) => {
        const imageArr = [...previews];
        deleteImages(`/api/brands/deleteImage?img=${image}`).then((res) => { // Fixed typo: deteleImage -> deleteImage
            imageArr.splice(index, 1);
            setPreviews([]);
            setTimeout(() => {
                setPreviews(imageArr);
                setFormFields((prev) => ({
                    ...prev,
                    images: imageArr,
                }));
            }, 100);
        }).catch((error) => {
            context.alertBox("error", "Failed to delete image");
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        context?.setProgress(50);
        setIsLoading(true);

        if (formFields.name === "") {
            context.alertBox("error", "Please enter brand name");
            setIsLoading(false);
            return;
        }

        if (previews.length === 0) {
            context.alertBox("error", "Please select brand image");
            setIsLoading(false);
            return;
        }

        postData("/api/brands/create", formFields)
            .then((res) => {
                context?.setProgress(75);
                setTimeout(() => {
                    setIsLoading(false);
                    context.setIsOpenFullScreenPanel({ open: false });
                    context?.getBrand();
                    navigate('/product/brands', { replace: false }); // Explicit navigation
                    context?.setProgress(100);
                }, 2500);
            })
            .catch((error) => {
                context.alertBox("error", "Failed to add brand");
                setIsLoading(false);
                context?.setProgress(0);
            });
    };

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0 mt-3">
                <h2 className="text-[18px] font-[600]">Add Brand</h2>
            </div>

            <div className="card my-4 pt-5 pb-5 shadow-md sm:rounded-lg bg-white w-[100%] sm:w-[100%] lg:w-[65%]">
                <form className="form py-3 p-6" onSubmit={handleSubmit}>
                    <div className="col mb-4">
                        <h3 className="text-[14px] font-[500] mb-1 text-black">BRAND NAME</h3>
                        <input
                            type="text"
                            className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            name="name"
                            value={formFields.name}
                            onChange={onChangeInput}
                        />
                    </div>

                    <div className="col mb-4">
                        <h3 className="text-[14px] font-[500] mb-1 text-black">BRAND LOGO</h3>
                        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                            {previews.length !== 0 &&
                                previews.map((image, index) => (
                                    <div className="uploadBoxWrapper mr-3 relative" key={index}>
                                        <span
                                            className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                                            onClick={() => removeImg(image, index)}
                                        >
                                            <IoMdClose className="text-white text-[17px]" />
                                        </span>
                                        <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                                            <img src={image} className="w-100" alt="Brand logo" />
                                        </div>
                                    </div>
                                ))}
                            <UploadBox
                                multiple={false}
                                name="images"
                                url="/api/brands/uploadImages"
                                setPreviewsFun={setPreviewsFun}
                            />
                        </div>
                    </div>

                    <div className="col mb-4">
                        <h3 className="text-[14px] font-[500] mb-1 text-black">IS FEATURED</h3>
                        <input
                            type="checkbox"
                            className="h-[20px] w-[20px]"
                            checked={formFields.is_featured}
                            onChange={onChangeFeature}
                        />
                    </div>

                    <div className="col mb-4">
                        <h3 className="text-[14px] font-[500] mb-1 text-black">STATUS</h3>
                        <select
                            className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            value={brandStatus}
                            onChange={onChangeStatus}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">
                        {isLoading ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-[25px] text-white" />
                                Publish and View
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </>
    );
};

export default AddBrand;