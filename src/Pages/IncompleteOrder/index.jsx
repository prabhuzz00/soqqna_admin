import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { FaAngleDown } from "react-icons/fa6";
import Badge from "../../Components/Badge";
import SearchBox from "../../Components/SearchBox";
import { FaAngleUp } from "react-icons/fa6";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import Pagination from "@mui/material/Pagination";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useContext } from "react";

import { MyContext } from "../../App.jsx";

export const IncompleteOrders = () => {
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");

  const [ordersData, setOrdersData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pageOrder, setPageOrder] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalOrdersData, setTotalOrdersData] = useState([]);

  const context = useContext(MyContext);

  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };

  const handleChange = (event, id) => {
    const newStatus = event.target.value;
    setOrderStatus(newStatus);

    const obj = {
      id: id,
      order_status: newStatus,
    };

    editData(`/api/order/order-status/${id}`, obj).then((res) => {
      if (res?.data?.error === false) {
        context.alertBox("success", res?.data?.message);

        // Re-fetch data from backend
        fetchDataFromApi(
          `/api/order/incomplete-order-list?page=${pageOrder}&limit=5`
        ).then((res) => {
          if (res?.error === false) {
            setOrdersData(res?.data);
          }
        });
      }
    });
  };

  useEffect(() => {
    context?.setProgress(50);
    fetchDataFromApi(
      `/api/order/incomplete-order-list?page=${pageOrder}&limit=5`
    ).then((res) => {
      if (res?.error === false) {
        setOrdersData(res?.data);
        context?.setProgress(100);
      }
    });
  }, [orderStatus, pageOrder]);

  useEffect(() => {
    // Filter orders based on search query
    if (searchQuery !== "") {
      const filteredOrders = totalOrdersData?.data?.filter(
        (order) =>
          order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order?.userId?.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order?.userId?.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order?.createdAt.includes(searchQuery)
      );
      setOrdersData(filteredOrders);
    } else {
      fetchDataFromApi(
        `/api/order/incomplete-order-list?page=${pageOrder}&limit=5`
      ).then((res) => {
        if (res?.error === false) {
          setOrders(res);
          setOrdersData(res?.data);
        }
      });
    }
  }, [searchQuery]);

  const deleteOrder = (id) => {
    if (context?.userData?.role === "SUPERADMIN") {
      deleteData(`/api/order/deleteOrder/${id}`).then((res) => {
        fetchDataFromApi(
          `/api/order/incomplete-order-list?page=${pageOrder}&limit=5`
        ).then((res) => {
          if (res?.error === false) {
            setOrdersData(res?.data);
            context?.setProgress(100);
            context.alertBox("success", "Order Delete successfully!");
          }
        });

        fetchDataFromApi(`/api/order/incomplete-order-list`).then((res) => {
          if (res?.error === false) {
            setTotalOrdersData(res);
          }
        });
      });
    } else {
      context.alertBox("error", "Only admin can delete data");
    }
  };

  const printLabelAndMarkReceived = async (orderId) => {
    try {
      // 1️⃣ Download the shipping label (PDF)
      const shippingLabelUrl = `${
        import.meta.env.VITE_API_URL
      }/api/order/shipping-label/${orderId}`;
      const response = await fetch(shippingLabelUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `shipping-label-${orderId}.pdf`;
      link.click();

      // 2️⃣ Update order status to "Received"
      const obj = {
        id: orderId,
        order_status: "Received",
      };
      const res = await editData(`/api/order/order-status/${orderId}`, obj);
      if (res?.data?.error === false) {
        context.alertBox("success", "Order marked as Received!");
        fetchDataFromApi(
          `/api/order/incomplete-order-list?page=${pageOrder}&limit=5`
        ).then((res) => {
          if (res?.error === false) {
            setOrdersData(res?.data);
            context?.setProgress(100);
          }
        });
      } else {
        context.alertBox("error", "Failed to update order status.");
      }
    } catch (error) {
      console.error("Error printing shipping label:", error);
      context.alertBox("error", "Error printing shipping label.");
    }
  };

  return (
    <div className="card my-2 md:mt-4 shadow-md sm:rounded-lg bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 px-5 py-5 flex-col sm:flex-row">
        <h2 className="text-[18px] font-[600] text-left mb-2 lg:mb-0">
          Incomplete Orders
        </h2>
        <div className="ml-auto w-full">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPageOrder={setPageOrder}
          />
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                &nbsp;
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Order Id
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Paymant Id
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Name
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Address
              </th>

              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Total Amount
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Email
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                User Id
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Order Status
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Date
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {ordersData?.length !== 0 &&
              ordersData?.map((order, index) => {
                return (
                  <>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4 font-[500]">
                        <Button
                          className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]"
                          onClick={() => isShowOrderdProduct(index)}
                        >
                          {isOpenOrderdProduct === index ? (
                            <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                          ) : (
                            <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                          )}
                        </Button>
                      </td>
                      <td className="px-6 py-4 font-[500]">
                        <span className="text-primary">{order?._id}</span>
                      </td>

                      <td className="px-6 py-4 font-[500]">
                        <span className="text-primary whitespace-nowrap text-[13px]">
                          {order?.paymentId
                            ? order?.paymentId
                            : "CASH ON DELIVERY"}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-[500] whitespace-nowrap">
                        {order?.userId?.name}
                      </td>

                      <td className="px-6 py-4 font-[500]">
                        {order?.delivery_address?.mobile}
                      </td>

                      <td className="px-6 py-4 font-[500]">
                        <span className="inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md">
                          {order?.delivery_address?.addressType}
                        </span>
                        <span className="block w-[400px]">
                          {order?.delivery_address?.address_line1 +
                            " " +
                            order?.delivery_address?.city +
                            " " +
                            order?.delivery_address?.area +
                            " " +
                            order?.delivery_address?.landmark}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-[500]">
                        {order?.totalAmt}
                      </td>

                      <td className="px-6 py-4 font-[500]">
                        {order?.userId?.email}
                      </td>

                      <td className="px-6 py-4 font-[500]">
                        <span className="text-primary">
                          {order?.userId?._id}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-[500]">
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          value={
                            order?.order_status !== null
                              ? order?.order_status
                              : orderStatus
                          }
                          label="Status"
                          size="small"
                          style={{ zoom: "80%" }}
                          className="w-full"
                          onChange={(e) => handleChange(e, order?._id)}
                        >
                          <MenuItem value={"Pending"}>Pending</MenuItem>
                          <MenuItem value={"Received"}>Received</MenuItem>
                          <MenuItem value={"Picked"}>Picked</MenuItem>
                          <MenuItem value={"In-Transist"}>In-Transist</MenuItem>
                          <MenuItem value={"Out for Delivery"}>
                            Out for Delivery
                          </MenuItem>
                          <MenuItem value={"Delivered"}>Delivered</MenuItem>
                          <MenuItem value={"Canceled"}>Canceled</MenuItem>
                        </Select>
                      </td>
                      <td className="px-6 py-4 font-[500] whitespace-nowrap">
                        {order?.createdAt?.split("T")[0]}
                      </td>
                      <td className="px-6 py-4 font-[500] whitespace-nowrap">
                        <Button
                          onClick={() => deleteOrder(order?._id)}
                          variant="outlined"
                          color="error"
                          size="small"
                        >
                          Delete
                        </Button>

                        <Button
                          onClick={() => printLabelAndMarkReceived(order._id)}
                          variant="contained"
                          color="primary"
                          size="small"
                        >
                          Print Label
                        </Button>
                      </td>
                    </tr>

                    {isOpenOrderdProduct === index && (
                      <tr>
                        <td className="pl-20" colSpan="6">
                          <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Product Id
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Product Title
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Image
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Quantity
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Price
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Sub Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {order?.products?.map((item, index) => {
                                  return (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                      <td className="px-6 py-4 font-[500]">
                                        <span className="text-gray-600">
                                          {item?._id}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 font-[500]">
                                        <div className="w-[200px]">
                                          {item?.name}
                                        </div>
                                      </td>

                                      <td className="px-6 py-4 font-[500]">
                                        <img
                                          src={item?.image}
                                          className="w-[40px] h-[40px] object-cover rounded-md"
                                        />
                                      </td>

                                      <td className="px-6 py-4 font-[500] whitespace-nowrap">
                                        {item?.quantity}
                                      </td>

                                      <td className="px-6 py-4 font-[500]">
                                        {item?.price?.toLocaleString("en-US", {
                                          style: "currency",
                                          currency: "USD",
                                        })}
                                      </td>

                                      <td className="px-6 py-4 font-[500]">
                                        {(
                                          item?.price * item?.quantity
                                        )?.toLocaleString("en-US", {
                                          style: "currency",
                                          currency: "USD",
                                        })}
                                      </td>
                                    </tr>
                                  );
                                })}

                                <tr>
                                  <td
                                    className="bg-[#f1f1f1]"
                                    colSpan="12"
                                  ></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
          </tbody>
        </table>
      </div>

      {orders?.totalPages > 1 && (
        <div className="flex items-center justify-center mt-10 pb-5">
          <Pagination
            showFirstButton
            showLastButton
            count={orders?.totalPages}
            page={pageOrder}
            onChange={(e, value) => setPageOrder(value)}
          />
        </div>
      )}
    </div>
  );
};

export default IncompleteOrders;
