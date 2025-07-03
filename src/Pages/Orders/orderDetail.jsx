import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { MdLocationOn, MdPerson, MdPayment, MdLocalShipping } from "react-icons/md";
import { BsCalendar3, BsBoxSeam } from "react-icons/bs";
import { FaBarcode, FaQrcode } from "react-icons/fa";
import { BiSolidUser, BiSolidPhone } from "react-icons/bi";
import Barcode from "react-barcode";

const OrderDetails = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await fetchDataFromApi(`/api/order/order-details/${id}`);
            if (response?.success) {
                setOrder(response.order);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "processing":
                return "bg-blue-100 text-blue-800";
            case "shipped":
                return "bg-purple-100 text-purple-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            case "returned":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <CircularProgress color="inherit" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
                    <p className="text-gray-600">The order you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center justify-between px-2 py-0 mt-3">
                <h2 className="text-[18px] font-[600]">Order Details</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                </div>
            </div>

            <br />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-[16px] font-[600] mb-4">Order Information</h3>

                    <div className="space-y-3">
                        <div className="flex items-center py-1">
                            <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                <BsBoxSeam className="opacity-65" /> Order ID:
                            </span>
                            <span className="text-[14px] font-mono">#{order._id}</span>
                        </div>

                        <div className="flex items-center py-1">
                            <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                <BsCalendar3 className="opacity-65" /> Order Date:
                            </span>
                            <span className="text-[14px]">{formatDate(order.createdAt)}</span>
                        </div>

                        <div className="flex items-center py-1">
                            <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                <MdPayment className="opacity-65" /> Payment:
                            </span>
                            <span className="text-[14px]">{order.payment_status || "Pending"}</span>
                        </div>

                        <div className="flex items-center py-1">
                            <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                <MdLocalShipping className="opacity-65" /> Total Amount:
                            </span>
                            <span className="text-[14px] font-[600]">${order.totalAmt}</span>
                        </div>

                        {order.couponCode && (
                            <div className="flex items-center py-1">
                                <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                    Coupon:
                                </span>
                                <span className="text-[14px]">{order.couponCode} (-${order.couponDiscount})</span>
                            </div>
                        )}

                        {order.barcode && (
                            <div className="flex items-center py-1">
                                <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                    <FaBarcode className="opacity-65" /> Barcode:
                                </span>
                                <Barcode value={order.barcode} width={1.5} height={50} fontSize={14} />
                                {/* <span className="text-[14px] font-mono">{order.barcode}</span> */}
                            </div>
                        )}

                        {order.qrCode && (
                            <div className="flex items-center py-1">
                                <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                    <FaQrcode className="opacity-65" /> QR Code:
                                </span>
                                <img src={order.qrCode} alt="QR Code" className="w-24 h-24 object-contain" />
                                {/* <span className="text-[14px] font-mono">{order.qrCode}</span> */}
                            </div>
                        )}
                    </div>
                </div>

                {/* Customer Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-[16px] font-[600] mb-4">Customer Information</h3>

                    {order.userId && (
                        <div className="space-y-3">
                            <div className="flex items-center py-1">
                                <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                    <BiSolidUser className="opacity-65" /> Name:
                                </span>
                                <span className="text-[14px]">{order.userId.name}</span>
                            </div>

                            <div className="flex items-center py-1">
                                <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                    <MdPerson className="opacity-65" /> Email:
                                </span>
                                <span className="text-[14px]">{order.userId.email}</span>
                            </div>

                            <div className="flex items-center py-1">
                                <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                    <BiSolidPhone className="opacity-65" /> Phone:
                                </span>
                                <span className="text-[14px]">{order.userId.phone}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <br />

            {/* Delivery Address */}
            {order.delivery_address && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-[16px] font-[600] mb-4 flex items-center gap-2">
                        <MdLocationOn className="opacity-65" /> Delivery Address
                    </h3>

                    <div className="text-[14px] space-y-1">
                        <p>{order.delivery_address.addressLine1}</p>
                        {order.delivery_address.addressLine2 && (
                            <p>{order.delivery_address.addressLine2}</p>
                        )}
                        <p>
                            {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.pincode}
                        </p>
                        <p>{order.delivery_address.country}</p>
                        {order.delivery_address.mobile && (
                            <p className="font-[500]">Mobile: {order.delivery_address.mobile}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-[16px] font-[600] mb-4">Order Items</h3>

                <div className="space-y-4">
                    {order.products?.map((product, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <BsBoxSeam size={24} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <h4 className="font-[500] text-[14px] mb-1">{product.name}</h4>
                                <div className="text-[12px] text-gray-600 space-y-1">
                                    <p>Quantity: {product.quantity}</p>
                                    <p>Price: ${product.price}</p>
                                    {product.selectedColor && <p>Color: {product.selectedColor}</p>}
                                    {product.size && <p>Size: {product.size}</p>}
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-[600] text-[14px]">${product.subTotal}</p>
                                {product.isReturn && (
                                    <span className="text-[12px] text-red-600 bg-red-100 px-2 py-1 rounded">
                                        Return Requested
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Status History */}
            {order.statusHistory?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-[16px] font-[600] mb-4">Order Status History</h3>

                    <div className="space-y-3">
                        {order.statusHistory.map((status, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status.status)}`}>
                                    {status.status}
                                </span>
                                <span className="text-[14px] text-gray-600">
                                    {formatDate(status.updatedAt)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Delivery Information */}
            {(order.deliveryBoyId || order.deliveredBy?.id) && (
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h3 className="text-[16px] font-[600] mb-4">Delivery Information</h3>

                    {order.deliveryBoyId && (
                        <div className="space-y-3">
                            <div className="flex items-center py-1">
                                <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                    <MdLocalShipping className="opacity-65" /> Delivery Boy:
                                </span>
                                <span className="text-[14px]">{order.deliveryBoyId.name}</span>
                            </div>

                            <div className="flex items-center py-1">
                                <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                    <BiSolidPhone className="opacity-65" /> Contact:
                                </span>
                                <span className="text-[14px]">{order.deliveryBoyId.phone}</span>
                            </div>
                        </div>
                    )}

                    {order.deliveredBy?.id && (
                        <div className="space-y-3 mt-4">
                            <div className="flex items-center py-1">
                                <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                    Delivered By:
                                </span>
                                <span className="text-[14px]">{order.deliveredBy.name}</span>
                            </div>
                        </div>
                    )}

                    {order.deliveryStatus && (
                        <div className="flex items-center py-1">
                            <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                Delivery Status:
                            </span>
                            <span className="text-[14px]">{order.deliveryStatus}</span>
                        </div>
                    )}

                    {order.pickupPoint && (
                        <div className="flex items-center py-1">
                            <span className="w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                                Pickup Point:
                            </span>
                            <span className="text-[14px]">{order.pickupPoint}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderDetails;