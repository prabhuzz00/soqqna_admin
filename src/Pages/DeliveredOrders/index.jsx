import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogContent } from "@mui/material";
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

export const DeliveredOrders = () => {
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");

  const [ordersData, setOrdersData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pageOrder, setPageOrder] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalOrdersData, setTotalOrdersData] = useState([]);
  const [sigOpen, setSigOpen] = useState(false);
  const [sigSrc, setSigSrc] = useState("");

  const context = useContext(MyContext);

  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };

  useEffect(() => {
    context?.setProgress(50);
    fetchDataFromApi(`/api/order/delivered?page=${pageOrder}&limit=10`).then(
      (res) => {
        if (res?.error === false) {
          setOrdersData(res?.data);
          context?.setProgress(100);
        }
      }
    );
    fetchDataFromApi(`/api/order/delivered`).then((res) => {
      if (res?.error === false) {
        setTotalOrdersData(res);
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
      fetchDataFromApi(`/api/order/delivered?page=${pageOrder}&limit=10`).then(
        (res) => {
          if (res?.error === false) {
            setOrders(res);
            setOrdersData(res?.data);
          }
        }
      );
    }
  }, [searchQuery]);

  const deleteOrder = (id) => {
    if (context?.userData?.role === "SUPERADMIN") {
      deleteData(`/api/order/deleteOrder/${id}`).then((res) => {
        fetchDataFromApi(
          `/api/order/order-list?page=${pageOrder}&limit=5`
        ).then((res) => {
          if (res?.error === false) {
            setOrdersData(res?.data);
            context?.setProgress(100);
            context.alertBox("success", "Order Delete successfully!");
          }
        });

        fetchDataFromApi(`/api/order/order-list`).then((res) => {
          if (res?.error === false) {
            setTotalOrdersData(res);
          }
        });
      });
    } else {
      context.alertBox("error", "Only admin can delete data");
    }
  };

  return (
    <div className="card my-2 md:mt-4 shadow-md sm:rounded-lg bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 px-5 py-5 flex-col sm:flex-row">
        <h2 className="text-[18px] font-[600] text-left mb-2 lg:mb-0">
          Recent Orders
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
                Total Amount
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Email
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Delivered By
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Customer Signature
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
                        {order?.totalAmt}
                      </td>

                      <td className="px-6 py-4 font-[500]">
                        {order?.userId?.email}
                      </td>
                      <td className="px-6 py-4 font-[500]">
                        {order?.deliveredBy?.name}
                      </td>
                      <td className="px-6 py-4 font-[500]">
                        {order?.deliverySignature && (
                          <img
                            onClick={() => {
                              setSigSrc(
                                order.deliverySignature.startsWith("data:")
                                  ? order.deliverySignature
                                  : `data:image/png;base64,${order.deliverySignature}`
                              );
                              setSigOpen(true);
                            }}
                            src={
                              order.deliverySignature.startsWith("data:")
                                ? order.deliverySignature
                                : `data:image/png;base64,${order.deliverySignature}`
                            }
                            alt="Customer signature"
                            className="h-12 w-auto object-contain border rounded cursor-pointer"
                            style={{ transform: "rotate(90deg)" }}
                          />
                        )}
                      </td>

                      <td className="px-6 py-4 font-[500]">
                        <span className="text-primary">
                          {order?.userId?._id}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-[500]">
                        {order?.order_status}
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

      <Dialog
        open={sigOpen}
        onClose={() => setSigOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent className="flex justify-center">
          <img
            src={sigSrc}
            alt="Signature full view"
            className="max-h-[80vh] w-auto object-contain"
            style={{ transform: "rotate(90deg)" }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveredOrders;
