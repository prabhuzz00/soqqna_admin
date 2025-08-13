import { Button } from "@mui/material";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";
import { SiBloglovin } from "react-icons/si";
import { BsCashCoin } from "react-icons/bs";
import { Collapse } from "react-collapse";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";

const Sidebar = () => {
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const isOpenSubMenu = (index) => {
    setSubmenuIndex(submenuIndex === index ? null : index);
  };

  const logout = () => {
    if (context?.windowWidth < 992) {
      context?.setisSidebarOpen?.(false);
    }
    setSubmenuIndex(null);

    fetchDataFromApi(
      `/api/admin/logout?token=${localStorage.getItem("accessToken")}`,
      { withCredentials: true }
    ).then((res) => {
      if (res?.error === false) {
        context?.setIsLogin?.(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      }
    });
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 z-50 h-full bg-[#0d215c] text-white border-r border-gray-700 py-2 px-4 transition-transform duration-300 ease-in-out ${
          context?.isSidebarOpen
            ? "translate-x-0 w-64 md:w-80"
            : "-translate-x-full w-0"
        } overflow-y-auto max-h-screen scrollbar-hide`}
      >
        <div
          className="py-2 w-full"
          onClick={() => {
            if (context?.windowWidth < 992) {
              context?.setisSidebarOpen?.(false);
            }
            setSubmenuIndex(null);
          }}
        >
          <Link to="/">
            <img
              src="/logo.svg"
              className="w-40 md:w-48 h-14 mt-5 ml-2"
              alt="Logo"
            />
          </Link>
        </div>

        <ul className="mt-4 space-y-2">
          <li>
            <Link
              to="/"
              onClick={() => {
                if (context?.windowWidth < 992) {
                  context?.setisSidebarOpen?.(false);
                }
                setSubmenuIndex(null);
              }}
            >
              <Button className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full">
                <RxDashboard className="text-lg" /> <span>Dashboard</span>
              </Button>
            </Link>
          </li>

          {context?.userData?.role === "SUPERADMIN" && (
            <li>
              <Link
                to="/reports"
                onClick={() => {
                  if (context?.windowWidth < 992) {
                    context?.setisSidebarOpen?.(false);
                  }
                  setSubmenuIndex(null);
                }}
              >
                <Button className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full">
                  <RxDashboard className="text-lg" /> <span>Reports</span>
                </Button>
              </Link>
            </li>
          )}

          <li>
            <Button
              className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full"
              onClick={() => isOpenSubMenu(1)}
            >
              <FaRegImage className="text-lg" /> <span>Home Slides</span>
              <span className="ml-auto w-8 h-8 flex items-center justify-center">
                <FaAngleDown
                  className={`transition-transform duration-200 ${
                    submenuIndex === 1 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 1}>
              <ul className="w-full space-y-1">
                <li>
                  <Link
                    to="/homeSlider/list"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Home Banners List
                    </Button>
                  </Link>
                </li>
                <li>
                  <Button
                    className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3"
                    onClick={() => {
                      context?.setIsOpenFullScreenPanel?.({
                        open: true,
                        model: "Add Home Slide",
                      });
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                    Add Home Banner Slide
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button
              className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full"
              onClick={() => isOpenSubMenu(3)}
            >
              <TbCategory className="text-lg" /> <span>Category</span>
              <span className="ml-auto w-8 h-8 flex items-center justify-center">
                <FaAngleDown
                  className={`transition-transform duration-200 ${
                    submenuIndex === 3 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 3}>
              <ul className="w-full space-y-1">
                <li>
                  <Link
                    to="/category/list"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Category List
                    </Button>
                  </Link>
                </li>
                <li>
                  <Button
                    className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3"
                    onClick={() => {
                      context?.setIsOpenFullScreenPanel?.({
                        open: true,
                        model: "Add New Category",
                      });
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                    Add a Category
                  </Button>
                </li>
                <li>
                  <Link
                    to="/subCategory/list"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Sub Category List
                    </Button>
                  </Link>
                </li>
                <li>
                  <Button
                    className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3"
                    onClick={() => {
                      context?.setIsOpenFullScreenPanel?.({
                        open: true,
                        model: "Add New Sub Category",
                      });
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                    Add a Sub Category
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button
              className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full"
              onClick={() => isOpenSubMenu(4)}
            >
              <RiProductHuntLine className="text-lg" /> <span>Inventory</span>
              <span className="ml-auto w-8 h-8 flex items-center justify-center">
                <FaAngleDown
                  className={`transition-transform duration-200 ${
                    submenuIndex === 4 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 4}>
              <ul className="w-full space-y-1">
                <li>
                  <Link
                    to="/products"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Products
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/addRams"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Product Color
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/addWeight"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Product Weight
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/addSize"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Product Size
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/tags"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Product Tags
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/brands"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Product Brands
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/label"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Product Label
                    </Button>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Link
              to="/orders"
              onClick={() => {
                if (context?.windowWidth < 992) {
                  context?.setisSidebarOpen?.(false);
                }
                setSubmenuIndex(null);
              }}
            >
              <Button className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full">
                <IoBagCheckOutline className="text-xl" /> <span>Orders</span>
              </Button>
            </Link>
          </li>

          <li>
            <Link
              to="/incomplete-orders"
              onClick={() => {
                if (context?.windowWidth < 992) {
                  context?.setisSidebarOpen?.(false);
                }
                setSubmenuIndex(null);
              }}
            >
              <Button className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full">
                <IoBagCheckOutline className="text-xl" />{" "}
                <span>Incomplete Orders</span>
              </Button>
            </Link>
          </li>

          <li>
            <Link
              to="/delivered-orders"
              onClick={() => {
                if (context?.windowWidth < 992) {
                  context?.setisSidebarOpen?.(false);
                }
                setSubmenuIndex(null);
              }}
            >
              <Button className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full">
                <IoBagCheckOutline className="text-xl" />{" "}
                <span>Delivered Orders</span>
              </Button>
            </Link>
          </li>

          <li>
            <Link
              to="/shippingcost"
              onClick={() => {
                if (context?.windowWidth < 992) {
                  context?.setisSidebarOpen?.(false);
                }
                setSubmenuIndex(null);
              }}
            >
              <Button className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full">
                <BsCashCoin className="text-xl" /> <span>Shipping Cost</span>
              </Button>
            </Link>
          </li>

          <li>
            <Link
              to="/exchange-rate"
              onClick={() => {
                if (context?.windowWidth < 992) {
                  context?.setisSidebarOpen?.(false);
                }
                setSubmenuIndex(null);
              }}
            >
              <Button className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full">
                <BsCashCoin className="text-xl" /> <span>Exchange Rate</span>
              </Button>
            </Link>
          </li>

          <li>
            <Link
              to="/service-zone"
              onClick={() => {
                if (context?.windowWidth < 992) {
                  context?.setisSidebarOpen?.(false);
                }
                setSubmenuIndex(null);
              }}
            >
              <Button className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full">
                <IoBagCheckOutline className="text-xl" />{" "}
                <span>Service Zone</span>
              </Button>
            </Link>
          </li>

          <li>
            <Link
              to="/order-returns"
              onClick={() => {
                if (context?.windowWidth < 992) {
                  context?.setisSidebarOpen?.(false);
                }
                setSubmenuIndex(null);
              }}
            >
              <Button className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full">
                <IoBagCheckOutline className="text-xl" />{" "}
                <span>Order Return</span>
              </Button>
            </Link>
          </li>

          {context?.userData?.role === "SUPERADMIN" && (
            <li>
              <Link
                to="/admin-users"
                onClick={() => {
                  if (context?.windowWidth < 992) {
                    context?.setisSidebarOpen?.(false);
                  }
                  setSubmenuIndex(null);
                }}
              >
                <Button className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full">
                  <FiUsers className="text-lg" /> <span>Admin Users</span>
                </Button>
              </Link>
            </li>
          )}

          <li>
            <Link
              to="/users"
              onClick={() => {
                if (context?.windowWidth < 992) {
                  context?.setisSidebarOpen?.(false);
                }
                setSubmenuIndex(null);
              }}
            >
              <Button className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full">
                <FiUsers className="text-lg" /> <span>Users</span>
              </Button>
            </Link>
          </li>

          <li>
            <Button
              className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full"
              onClick={() => isOpenSubMenu(5)}
            >
              <RiProductHuntLine className="text-lg" /> <span>Banners</span>
              <span className="ml-auto w-8 h-8 flex items-center justify-center">
                <FaAngleDown
                  className={`transition-transform duration-200 ${
                    submenuIndex === 5 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 5}>
              <ul className="w-full space-y-1">
                <li>
                  <Link
                    to="/bannerV1/List"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Home Banner List
                    </Button>
                  </Link>
                </li>
                <li>
                  <Button
                    className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3"
                    onClick={() => {
                      context?.setIsOpenFullScreenPanel?.({
                        open: true,
                        model: "Add Home Banner List 1",
                      });
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                    Add Home Banner
                  </Button>
                </li>
                <li>
                  <Link
                    to="/bannerlist2/List"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Home Banner List 2
                    </Button>
                  </Link>
                </li>
                <li>
                  <Button
                    className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3"
                    onClick={() => {
                      context?.setIsOpenFullScreenPanel?.({
                        open: true,
                        model: "Add Home Banner List2",
                      });
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                    Add Banner
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button
              className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full"
              onClick={() => isOpenSubMenu(6)}
            >
              <SiBloglovin className="text-lg" /> <span>Blogs</span>
              <span className="ml-auto w-8 h-8 flex items-center justify-center">
                <FaAngleDown
                  className={`transition-transform duration-200 ${
                    submenuIndex === 6 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 6}>
              <ul className="w-full space-y-1">
                <li>
                  <Link
                    to="/blog/List"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Blog List
                    </Button>
                  </Link>
                </li>
                <li>
                  <Button
                    className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3"
                    onClick={() => {
                      context?.setIsOpenFullScreenPanel?.({
                        open: true,
                        model: "Add Blog",
                      });
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                    Add Blog
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button
              className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full"
              onClick={() => isOpenSubMenu(7)}
            >
              <FaRegImage className="text-lg" /> <span>Vendors</span>
              <span className="ml-auto w-8 h-8 flex items-center justify-center">
                <FaAngleDown
                  className={`transition-transform duration-200 ${
                    submenuIndex === 7 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 7}>
              <ul className="w-full space-y-1">
                <li>
                  <Link
                    to="/vendors/verified-vendors"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Verified Vendors
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vendors/unverified-vendors"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Unverified Vendors
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vendors/verify-products"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Unverified Products
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vendors/withdrawal-request"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Verify Withdrawal
                    </Button>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button
              className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full"
              onClick={() => isOpenSubMenu(8)}
            >
              <FaRegImage className="text-lg" /> <span>Coupons</span>
              <span className="ml-auto w-8 h-8 flex items-center justify-center">
                <FaAngleDown
                  className={`transition-transform duration-200 ${
                    submenuIndex === 8 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 8}>
              <ul className="w-full space-y-1">
                <li>
                  <Link
                    to="/coupons"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Coupon List
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/coupon-summary"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Coupon Summary
                    </Button>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button
              className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full"
              onClick={() => isOpenSubMenu(9)}
            >
              <FaRegImage className="text-lg" /> <span>Site Settings</span>
              <span className="ml-auto w-8 h-8 flex items-center justify-center">
                <FaAngleDown
                  className={`transition-transform duration-200 ${
                    submenuIndex === 9 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 9}>
              <ul className="w-full space-y-1">
                <li>
                  <Link
                    to="/logo/manage"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Manage Logo
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/site-settings/details"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Site Details
                    </Button>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button
              className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full"
              onClick={() => isOpenSubMenu(10)}
            >
              <FaRegImage className="text-lg" /> <span>Delivery Boy</span>
              <span className="ml-auto w-8 h-8 flex items-center justify-center">
                <FaAngleDown
                  className={`transition-transform duration-200 ${
                    submenuIndex === 10 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 10}>
              <ul className="w-full space-y-1">
                <li>
                  <Link
                    to="/deliveryboy/create"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Create
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/deliveryboy/assign"
                    onClick={() => {
                      if (context?.windowWidth < 992) {
                        context?.setisSidebarOpen?.(false);
                      }
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black !capitalize !justify-start !w-full !text-xs !pl-9 flex gap-3">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      Assign Orders
                    </Button>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button
              className="!capitalize !justify-start flex gap-3 text-sm !text-white/80 !font-medium items-center !py-2 hover:!bg-white hover:!text-black w-full"
              onClick={logout}
            >
              <IoMdLogOut className="text-xl" /> <span>Logout</span>
            </Button>
          </li>
        </ul>
      </div>

      {context?.windowWidth < 992 && context?.isSidebarOpen && (
        <div
          className="fixed top-0 left-0 z-40 w-full h-full bg-black/50"
          onClick={() => {
            context?.setisSidebarOpen?.(false);
            setSubmenuIndex(null);
          }}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
