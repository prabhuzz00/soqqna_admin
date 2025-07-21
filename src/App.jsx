import "./App.css";
import "./responsive.css";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import { createContext, useState } from "react";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Products from "./Pages/Products";

import HomeSliderBanners from "./Pages/HomeSliderBanners";
import CategoryList from "./Pages/Categegory";
import SubCategoryList from "./Pages/Categegory/subCatList";
import AdminUsers from "./Pages/AdminUsers";
import Users from "./Pages/Users"
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/Orders/orderDetail";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyAccount from "./Pages/VerifyAccount";
import ChangePassword from "./Pages/ChangePassword";

import toast, { Toaster } from "react-hot-toast";
import { fetchDataFromApi } from "./utils/api";
import { useEffect } from "react";
import Profile from "./Pages/Profile";
import ProductDetails from "./Pages/Products/productDetails";
import AddRAMS from "./Pages/Products/addRAMS";
import AddWeight from "./Pages/Products/addWeight";
import AddSize from "./Pages/Products/addSize";
import BannerV1List from "./Pages/Banners/bannerV1List";
import { BannerList2 } from "./Pages/Banners/bannerList2";
import { BlogList } from "./Pages/Blog";
import ManageLogo from "./Pages/ManageLogo";
import LoadingBar from "react-top-loading-bar";
import VerifiedVendors from "./Pages/VerifiedVendor";
import UnverifiedVendors from "./Pages/UnverifiedVendor";
import EditVendor from "./Pages/EditVendor";
import AddBrand from "./Pages/Products/brands/addBrand";
import AddTags from "./Pages/Products/tags/addTags";
import AddLabel from "./Pages/Products//label/addLabel";
import Brands from "./Pages/Products/brands";
import Tags from "./Pages/Products/tags";
import Label from "./Pages/Products/label";
import VerifiedProducts from "./Pages/VerifyProducts";
import IncompleteOrders from "./Pages/IncompleteOrder";
import OrdersReturn from "./Pages/OrderReturn";
import Withdrawal from "./Pages/VerifyWithdraw";
import AddUsers from "./Pages/AddUsers";
import CouponList from "./Pages/Coupons/CouponList";
import CouponSummary from "./Pages/Coupons/CouponSummary";
import SiteSettingForm from "./Pages/Site-Setting";
import ShippingCostForm from "./Pages/ShippingCost";
import AdminReport from "./Pages/AdminReport";
import CreateDeliveryBoy from "./Pages/DeliveryBoy/CreateDeliveryBoy";
import ServiceZoneList from "./Pages/ServiceZone/ServiceZoneList";
import AssignOrders from "./Pages/DeliveryBoy/AssignOrders";
import DeliveredOrders from "./Pages/DeliveredOrders";
import CurrencyExchangeForm from "./Pages/CurrencyExchange";

const MyContext = createContext();
function App() {
  const [isSidebarOpen, setisSidebarOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [address, setAddress] = useState([]);
  const [catData, setCatData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarWidth, setSidebarWidth] = useState(18);

  const [progress, setProgress] = useState(0);

  const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
    open: false,
    id: "",
  });

  useEffect(() => {
    if (windowWidth < 992) {
      setisSidebarOpen(false);
      setSidebarWidth(100);
    } else {
      setSidebarWidth(18);
    }
  }, [windowWidth]);

  useEffect(() => {
    if (userData?.role !== "SUPERADMIN") {
      const handleContextmenu = (e) => {
        e.preventDefault();
      };
      document.addEventListener("contextmenu", handleContextmenu);
      return function cleanup() {
        document.removeEventListener("contextmenu", handleContextmenu);
      };
    }
  }, [userData]);

  const router = createBrowserRouter([
    {
      path: "/",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <Dashboard />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/login",
      exact: true,
      element: (
        <>
          <Login />
        </>
      ),
    },
    {
      path: "/sign-up",
      exact: true,
      element: (
        <>
          <SignUp />
        </>
      ),
    },
    {
      path: "/forgot-password",
      exact: true,
      element: (
        <>
          <ForgotPassword />
        </>
      ),
    },
    {
      path: "/verify-account",
      exact: true,
      element: (
        <>
          <VerifyAccount />
        </>
      ),
    },
    {
      path: "/change-password",
      exact: true,
      element: (
        <>
          <ChangePassword />
        </>
      ),
    },

    {
      path: "/vendors/edit/:id",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <EditVendor />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/vendors/verified-vendors",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <VerifiedVendors />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/vendors/unverified-vendors",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <UnverifiedVendors />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/vendors/verify-products",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <VerifiedProducts />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/vendors/withdrawal-request",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <Withdrawal />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/products",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <Products />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/homeSlider/list",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "82%" }}
              >
                <HomeSliderBanners />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/category/list",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <CategoryList />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/subCategory/list",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <SubCategoryList />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/admin-users",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <AdminUsers />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/users",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                  }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <Users />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/orders",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <Orders />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/orders/:id",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                  }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <OrderDetails />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/delivered-orders",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <DeliveredOrders />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/incomplete-orders",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <IncompleteOrders />
              </div>
            </div>
          </section>
        </>
      ),
    },

    {
      path: "/exchange-rate",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                  }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <CurrencyExchangeForm/>
              </div>
            </div>
          </section>
        </>
      ),
    },

    {
      path: "users/addusers",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <AddUsers />
              </div>
            </div>
          </section>
        </>
      ),
    },

    {
      path: "/coupons",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <CouponList />
              </div>
            </div>
          </section>
        </>
      ),
    },

    {
      path: "/coupon-summary",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <CouponSummary />
              </div>
            </div>
          </section>
        </>
      ),
    },

    {
      path: "/reports",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <AdminReport />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/order-returns",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <OrdersReturn />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/profile",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <Profile />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/:id",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <ProductDetails />
              </div>
            </div>
          </section>
        </>
      ),
    },

    {
      path: "/product/addRams",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <AddRAMS />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/addWeight",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <AddWeight />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/addSize",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <AddSize />
              </div>
            </div>
          </section>
        </>
      ),
    },

    {
      path: "/product/brands",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <Brands />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/brands/addBrand",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <AddBrand />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/tags",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <Tags />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/tags/addTags",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <AddTags />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/label",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <Label />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/label/addLabel",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <AddLabel />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/bannerV1/list",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <BannerV1List />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/bannerlist2/List",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <BannerList2 />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/blog/List",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <BlogList />
              </div>
            </div>
          </section>
        </>
      ),
    },

    {
      path: "/deliveryboy/create",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <CreateDeliveryBoy />
              </div>
            </div>
          </section>
        </>
      ),
    },

    {
      path: "/deliveryboy/assign",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <AssignOrders />
              </div>
            </div>
          </section>
        </>
      ),
    },

    {
      path: "/service-zone",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <ServiceZoneList />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/logo/manage",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <ManageLogo />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/site-settings/details",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <SiteSettingForm />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/shippingcost",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSidebarOpen === true
                    ? windowWidth < 992
                      ? `w-[${sidebarWidth / 1.5}%]`
                      : `w-[20%]`
                    : "w-[0px] opacity-0 invisible"
                } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${
                  isSidebarOpen === true && windowWidth < 992 && "opacity-0"
                }  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : "80%" }}
              >
                <ShippingCostForm />
              </div>
            </div>
          </section>
        </>
      ),
    },
  ]);

  const alertBox = (type, msg) => {
    if (type === "success") {
      toast.success(msg);
    }
    if (type === "error") {
      toast.error(msg);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true);

      fetchDataFromApi(`/api/admin/user-details`).then((res) => {
        setUserData(res.data);
        if (res?.response?.data?.message === "You have not login") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsLogin(false);
          alertBox("error", "Your session is closed please login again");

          //window.location.href = "/login"
        }
      });
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  useEffect(() => {
    getCat();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getCat = () => {
    fetchDataFromApi("/api/category").then((res) => {
      setCatData(res?.data);
    });
  };

  const getBrand = () => {
    fetchDataFromApi("/api/brands").then((res) => {
      setBrandData(res?.data);
    });
  };

  const values = {
    isSidebarOpen,
    setisSidebarOpen,
    isLogin,
    setIsLogin,
    isOpenFullScreenPanel,
    setIsOpenFullScreenPanel,
    alertBox,
    setUserData,
    userData,
    setAddress,
    address,
    catData,
    setCatData,
    getCat,
    brandData,
    setBrandData,
    getBrand,
    windowWidth,
    setSidebarWidth,
    sidebarWidth,
    setProgress,
    progress,
  };

  return (
    <>
      <MyContext.Provider value={values}>
        <RouterProvider router={router} />
        <LoadingBar
          color="#1565c0"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          className="topLoadingBar"
          height={3}
        />
        <Toaster />
      </MyContext.Provider>
    </>
  );
}

export default App;
export { MyContext };
