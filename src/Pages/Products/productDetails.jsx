import React, { useEffect, useRef, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import { MdBrandingWatermark } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdRateReview } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import Rating from "@mui/material/Rating";
import CircularProgress from "@mui/material/CircularProgress";

const ProductDetails = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [product, setProduct] = useState();
  const [reviewsData, setReviewsData] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null); // Track selected color
  const [currentImages, setCurrentImages] = useState([]); // Images for the selected color
  const zoomSliderBig = useRef();
  const zoomSliderSml = useRef();

  const { id } = useParams();

  useEffect(() => {
    fetchDataFromApi(`/api/user/getReviews?productId=${id}`).then((res) => {
      if (res?.error === false) {
        setReviewsData(res.reviews);
      }
    });
  }, [id]);

  useEffect(() => {
    fetchDataFromApi(`/api/product/${id}`).then((res) => {
      if (res?.error === false) {
        setTimeout(() => {
          setProduct(res?.product);
          // Set default selected color and images (first variation if available)
          if (res?.product?.variation?.length > 0) {
            setSelectedColor(res?.product?.variation[0]);
            setCurrentImages(
              res?.product?.variation[0]?.color?.images ||
                res?.product?.images ||
                []
            );
          } else {
            setCurrentImages(res?.product?.images || []);
          }
        }, 500);
      }
    });
  }, [id]);

  const goto = (index) => {
    setSlideIndex(index);
    zoomSliderSml.current.swiper.slideTo(index);
    zoomSliderBig.current.swiper.slideTo(index);
  };

  const handleColorClick = (variation) => {
    setSelectedColor(variation);
    setSlideIndex(0); // Reset slide index when changing color
    setCurrentImages(variation?.color?.images || product?.images || []);
  };

  return (
    <>
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[18px] font-[600]">Product Details</h2>
      </div>

      <br />

      {product?._id !== "" &&
      product?._id !== undefined &&
      product?._id !== null ? (
        <>
          <div className="productDetails flex gap-8">
            <div className="w-[40%]">
              {currentImages?.length !== 0 && (
                <div className="flex gap-3">
                  <div className={`slider w-[15%]`}>
                    <Swiper
                      ref={zoomSliderSml}
                      direction={"vertical"}
                      slidesPerView={5}
                      spaceBetween={10}
                      navigation={true}
                      modules={[Navigation]}
                      className={`zoomProductSliderThumbs h-[400px] overflow-hidden ${
                        currentImages?.length > 5 && "space"
                      }`}
                    >
                      {currentImages?.map((item, index) => (
                        <SwiperSlide key={index}>
                          <div
                            className={`item rounded-md overflow-hidden cursor-pointer group ${
                              slideIndex === index ? "opacity-1" : "opacity-30"
                            }`}
                            onClick={() => goto(index)}
                          >
                            <img
                              src={item}
                              className="w-full transition-all group-hover:scale-105"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  <div className="zoomContainer w-[85%] overflow-hidden rounded-md">
                    <Swiper
                      ref={zoomSliderBig}
                      slidesPerView={1}
                      spaceBetween={0}
                      navigation={false}
                    >
                      {currentImages?.map((item, index) => (
                        <SwiperSlide key={index}>
                          <InnerImageZoom
                            zoomType="hover"
                            zoomScale={1}
                            src={item}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              )}
            </div>

            <div className="w-[60%]">
              <h1 className="text-[22px] font-[600] mb-4">{product?.name}</h1>

              <div className="flex items-center py-1">
                <span className="w-[20%] font-[500] flex items-center gap-2 text-[14px]">
                  <MdBrandingWatermark className="opacity-65" /> Brand :{" "}
                </span>
                <span className="text-[14px]">{product?.brand}</span>
              </div>

              <div className="flex items-center py-1">
                <span className="w-[20%] font-[500] flex items-center gap-2 text-[14px]">
                  <BiSolidCategoryAlt className="opacity-65" /> Category :{" "}
                </span>
                <span className="text-[14px]">{product?.catName}</span>
              </div>

              <div className="flex items-center py-1">
                <span className="w-[20%] font-[500] flex items-center gap-2 text-[14px]">
                  <MdRateReview className="opacity-65" /> Review :{" "}
                </span>
                <span className="text-[14px]">
                  ({reviewsData?.length > 0 ? reviewsData?.length : 0}) Review
                </span>
              </div>

              <div className="flex items-center py-1">
                <span className="w-[20%] font-[500] flex items-center gap-2 text-[14px]">
                  <BsPatchCheckFill className="opacity-65" /> Published :{" "}
                </span>
                <span className="text-[14px]">
                  {product?.createdAt?.split("T")[0]}
                </span>
              </div>

              {/* Color Variation Buttons */}
              {product?.variation?.length > 0 && (
                <div className="flex items-center py-1">
                  <span className="w-[20%] font-[500] flex items-center gap-2 text-[14px]">
                    Colors :{" "}
                  </span>
                  <div className="flex gap-3">
                    {product?.variation?.map((variation, index) => {
                      const colorLabel = variation?.color?.label?.toLowerCase();
                      return (
                        <button
                          key={index}
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                            selectedColor?.color?.label ===
                            variation?.color?.label
                              ? "border-black scale-110"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: colorLabel }}
                          onClick={() => handleColorClick(variation)}
                          title={variation?.color?.label}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Variation Details Table */}
              {selectedColor && selectedColor?.sizes?.length > 0 && (
                <div className="py-3">
                  <h3 className="text-[16px] font-[500] mb-2">
                    Details for {selectedColor?.color?.label}
                  </h3>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left text-[14px]">
                          Size
                        </th>
                        <th className="border border-gray-300 p-2 text-left text-[14px]">
                          Price
                        </th>
                        <th className="border border-gray-300 p-2 text-left text-[14px]">
                          Stock Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedColor?.sizes?.map((size, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-2 text-[14px]">
                            {size?.label || "N/A"}
                          </td>
                          <td className="border border-gray-300 p-2 text-[14px]">
                            ${size?.price || "N/A"}
                          </td>
                          <td className="border border-gray-300 p-2 text-[14px]">
                            {size?.countInStock || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <br />

              <h2 className="text-[20px] font-[500] mb-3">
                Product Description
              </h2>
              {product?.description && (
                <p className="text-[14px]">{product?.description}</p>
              )}
            </div>
          </div>

          <br />
          {reviewsData?.length !== 0 && (
            <h2 className="text-[18px] font-[500]">Customer Reviews</h2>
          )}

          <div className="reviewsWrap mt-3">
            {reviewsData?.length !== 0 &&
              reviewsData?.map((review, index) => (
                <div
                  className="reviews w-full h-auto mb-3 p-4 bg-white rounded-sm shadow-md flex items-center justify-between"
                  key={index}
                >
                  <div className="flex items-center gap-8">
                    <div className="img w-[65px] h-[65px] rounded-full overflow-hidden">
                      {review?.image !== "" && review?.image !== null ? (
                        <img
                          src={review?.image}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={"/user.jpg"}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="info w-[80%]">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[16px] font-[500]">
                          {review?.userName}
                        </h4>
                        <Rating
                          name="read-only"
                          value={review?.rating}
                          readOnly
                          size="small"
                        />
                      </div>
                      <span className="text-[13px]">
                        {review?.createdAt?.split("T")[0]}
                      </span>
                      <p className="text-[13px] mt-2">{review?.review}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-96">
          <CircularProgress color="inherit" />
        </div>
      )}
    </>
  );
};

export default ProductDetails;
