import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { Collapse } from "react-collapse";
import { MyContext } from "../../App";
import { SiBloglovin } from "react-icons/si";
import { fetchDataFromApi } from "../../utils/api";
import { IoLogoBuffer } from "react-icons/io";

const Sidebar = () => {
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const isOpenSubMenu = (index) => {
    if (submenuIndex === index) {
      setSubmenuIndex(null);
    } else {
      setSubmenuIndex(index);
    }
  };

  const context = useContext(MyContext);

  const logout = () => {
    context?.windowWidth < 992 && context?.setisSidebarOpen(false);
    setSubmenuIndex(null);

    fetchDataFromApi(
      `/api/admin/logout?token=${localStorage.getItem("accessToken")}`,
      { withCredentials: true }
    ).then((res) => {
      if (res?.error === false) {
        context.setIsLogin(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        history("/login");
      }
    });
  };

  return (
    <>
      <div
        className={`sidebar fixed top-0 left-0 z-[52] bg-[#0d215c] h-full text-white border-r border-[rgba(0,0,0,0.1)] py-2 px-4 w-[${
          context.isSidebarOpen === true ? `${20}%` : "0px"
        }]`}
      >
        <div
          className="py-2 w-full"
          onClick={() => {
            context?.windowWidth < 992 && context?.setisSidebarOpen(false);
            setSubmenuIndex(null);
          }}
        >
          <Link to="/">
            <img
              src="/logo.svg"
              className="w-[170px] md:min-w-[200px] h-[56px] mt-[20px] ml-[10px] "
            />
          </Link>
        </div>

        <ul className="mt-4 overflow-y-scroll max-h-[80vh]">
          <li>
            <Link
              to="/"
              onClick={() => {
                context?.windowWidth < 992 && context?.setisSidebarOpen(false);
                setSubmenuIndex(null);
              }}
            >
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]">
                <RxDashboard className="text-[18px]" /> <span>Dashboard</span>
              </Button>
            </Link>
          </li>
          <li>
            <Link
              to="/reports"
              onClick={() => {
                context?.windowWidth < 992 && context?.setisSidebarOpen(false);
                setSubmenuIndex(null);
              }}
            >
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]">
                <RxDashboard className="text-[18px]" /> <span>Reports</span>
              </Button>
            </Link>
          </li>

          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]"
              onClick={() => isOpenSubMenu(1)}
            >
              <FaRegImage className="text-[18px]" /> <span>Home Slides</span>
              <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`transition-all ${
                    submenuIndex === 1 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>

            <Collapse isOpened={submenuIndex === 1 ? true : false}>
              <ul className="w-full">
                <li className="w-full">
                  <Link
                    to="/homeSlider/list"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Home Banners List
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Button
                    className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3"
                    onClick={() => {
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add Home Slide",
                      });
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(null);
                    }}
                  >
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                    Add Home Banner Slide
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]"
              onClick={() => isOpenSubMenu(3)}
            >
              <TbCategory className="text-[18px]" /> <span>Category</span>
              <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`transition-all ${
                    submenuIndex === 3 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>

            <Collapse isOpened={submenuIndex === 3 ? true : false}>
              <ul className="w-full">
                <li className="w-full">
                  <Link
                    to="/category/list"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Category List
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Button
                    className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3"
                    onClick={() => {
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add New Category",
                      });
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(null);
                    }}
                  >
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                    Add a Category
                  </Button>
                </li>
                <li className="w-full">
                  <Link
                    to="/subCategory/list"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                      Sub Category List
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Button
                    className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3"
                    onClick={() => {
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add New Sub Category",
                      });
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(null);
                    }}
                  >
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                    Add a Sub Category
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]"
              onClick={() => isOpenSubMenu(4)}
            >
              <RiProductHuntLine className="text-[18px]" />{" "}
              <span>Inventory</span>
              <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`transition-all ${
                    submenuIndex === 4 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>

            <Collapse isOpened={submenuIndex === 4 ? true : false}>
              <ul className="w-full">
                <li className="w-full">
                  <Link
                    to="/products"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Products
                    </Button>
                  </Link>
                </li>
                {/* <li className="w-full">
                  <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3" onClick={() => {
                    context.setIsOpenFullScreenPanel({
                      open: true,
                      model: "Add Product"
                    })
                    context?.windowWidth < 992 && context?.setisSidebarOpen(false)
                    setSubmenuIndex(null)
                  }}>
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                    Product Upload
                  </Button>
                </li> */}

                <li className="w-full">
                  <Link
                    to="/product/addRams"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                      Product Color
                    </Button>
                  </Link>
                </li>

                <li className="w-full">
                  <Link
                    to="/product/addWeight"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                      Product Weight
                    </Button>
                  </Link>
                </li>

                <li className="w-full">
                  <Link
                    to="/product/addSize"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                      Product Size
                    </Button>
                  </Link>
                </li>

                <li className="w-full">
                  <Link
                    to="/product/tags" //add url for tag
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                      Product Tags
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/product/brands"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                      Product Brands
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/product/label"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(null);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
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
                context?.windowWidth < 992 && context?.setisSidebarOpen(false);
                setSubmenuIndex(null);
              }}
            >
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]">
                <IoBagCheckOutline className="text-[20px]" />{" "}
                <span>Orders</span>
              </Button>
            </Link>
          </li>

          <li>
            <Link
              to="/incomplete-orders"
              onClick={() => {
                context?.windowWidth < 992 && context?.setisSidebarOpen(false);
                setSubmenuIndex(null);
              }}
            >
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]">
                <IoBagCheckOutline className="text-[20px]" />{" "}
                <span>Incomplete Orders</span>
              </Button>
            </Link>
          </li>
          <li>
            <Link
              to="/delivered-orders"
              onClick={() => {
                context?.windowWidth < 992 && context?.setisSidebarOpen(false);
                setSubmenuIndex(null);
              }}
            >
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]">
                <IoBagCheckOutline className="text-[20px]" />{" "}
                <span>Delivered Orders</span>
              </Button>
            </Link>
          </li>
          <li>
            <Link
              to="/shippingcost"
              onClick={() => {
                context?.windowWidth < 992 && context?.setisSidebarOpen(false);
                setSubmenuIndex(null);
              }}
            >
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]">
                <IoBagCheckOutline className="text-[20px]" />{" "}
                <span>Shipping Cost</span>
              </Button>
            </Link>
          </li>
          <li>
            <Link
              to="/service-zone"
              onClick={() => {
                context?.windowWidth < 992 && context?.setisSidebarOpen(false);
                setSubmenuIndex(null);
              }}
            >
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]">
                <IoBagCheckOutline className="text-[20px]" />{" "}
                <span>Service Zone</span>
              </Button>
            </Link>
          </li>
          <li>
            <Link
              to="/order-returns"
              onClick={() => {
                context?.windowWidth < 992 && context?.setisSidebarOpen(false);
                setSubmenuIndex(null);
              }}
            >
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]">
                <IoBagCheckOutline className="text-[20px]" />{" "}
                <span>Order Return</span>
              </Button>
            </Link>
          </li>

          <li>
            <Link
              to="/users"
              onClick={() => {
                context?.windowWidth < 992 && context?.setisSidebarOpen(false);
                setSubmenuIndex(null);
              }}
            >
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]">
                <FiUsers className="text-[18px]" /> <span>Users</span>
              </Button>
            </Link>
          </li>

          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]"
              onClick={() => isOpenSubMenu(5)}
            >
              <RiProductHuntLine className="text-[18px]" />
              <span>Banners</span>
              <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`transition-all ${
                    submenuIndex === 5 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>

            <Collapse isOpened={submenuIndex === 5 ? true : false}>
              <ul className="w-full">
                <li className="w-full">
                  <Link
                    to="/bannerV1/List"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(5);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Home Banner List
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Button
                    className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3"
                    onClick={() => {
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add Home Banner List 1",
                      });
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(5);
                    }}
                  >
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                    Add Home Banner
                  </Button>
                </li>

                <li className="w-full">
                  <Link
                    to="/bannerlist2/List"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(5);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Home Banner List 2
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Button
                    className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3"
                    onClick={() => {
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add Home Banner List2",
                      });
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(5);
                    }}
                  >
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                    Add Banner
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]"
              onClick={() => isOpenSubMenu(6)}
            >
              <SiBloglovin className="text-[18px]" />
              <span>Blogs</span>
              <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`transition-all ${
                    submenuIndex === 6 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>

            <Collapse isOpened={submenuIndex === 6 ? true : false}>
              <ul className="w-full">
                <li className="w-full">
                  <Link
                    to="/blog/List"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(6);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                      Blog List
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Button
                    className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3"
                    onClick={() => {
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add Blog",
                      });
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(6);
                    }}
                  >
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                    Add Blog
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>
          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]"
              onClick={() => isOpenSubMenu(7)}
            >
              <FaRegImage className="text-[18px]" /> <span>Vendors</span>
              <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`transition-all ${
                    submenuIndex === 7 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>

            <Collapse isOpened={submenuIndex === 7 ? true : false}>
              <ul className="w-full">
                <li className="w-full">
                  <Link
                    to="/vendors/verified-vendors"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(7);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Verified Vendors
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/vendors/unverified-vendors"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(7);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Unverified Vendors
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/vendors/verify-products"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(7);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Verify Products
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/vendors/withdrawal-request"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(7);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Verify Withdrawal
                    </Button>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>
          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]"
              onClick={() => isOpenSubMenu(8)}
            >
              <FaRegImage className="text-[18px]" /> <span>Coupons</span>
              <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`transition-all ${
                    submenuIndex === 8 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 8 ? true : false}>
              <ul className="w-full">
                <li className="w-full">
                  <Link
                    to="/coupons"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(8);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Coupon List
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/coupon-summary"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(8);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Coupon Summary
                    </Button>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>

          {/* <li>
            <Link
              to="/logo/manage"
              onClick={() => {
                context?.windowWidth < 992 && context?.setisSidebarOpen(false);
                setSubmenuIndex(null);
              }}
            >
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]">
                <IoLogoBuffer className="text-[20px]" />{" "}
                <span>Site Setting</span>
              </Button>
            </Link>
          </li> */}

          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]"
              onClick={() => isOpenSubMenu(9)}
            >
              <FaRegImage className="text-[18px]" /> <span>Site Settings</span>
              <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`transition-all ${
                    submenuIndex === 9 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 9 ? true : false}>
              <ul className="w-full">
                <li className="w-full">
                  <Link
                    to="/logo/manage"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(9);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Manage Logo
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/site-settings/details"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(9);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Site Details
                    </Button>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]"
              onClick={() => isOpenSubMenu(10)}
            >
              <FaRegImage className="text-[18px]" /> <span>Delivery Boy</span>
              <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`transition-all ${
                    submenuIndex === 10 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 10 ? true : false}>
              <ul className="w-full">
                <li className="w-full">
                  <Link
                    to="/deliveryboy/create"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(10);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Create
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/deliveryboy/assign"
                    onClick={() => {
                      context?.windowWidth < 992 &&
                        context?.setisSidebarOpen(false);
                      setSubmenuIndex(10);
                    }}
                  >
                    <Button className="!text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000] !capitalize !justify-start !w-full !text-[13px] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>{" "}
                      Assign Orders
                    </Button>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(255,255,255,0.8)] !font-[500] items-center !py-2 hover:!bg-[#ffffff] hover:!text-[#000000]"
              onClick={logout}
            >
              <IoMdLogOut className="text-[20px]" /> <span>Logout</span>
            </Button>
          </li>
        </ul>
      </div>

      {context?.windowWidth < 920 && context?.isSidebarOpen === true && (
        <div
          className="sidebarOverlay pointer-events-none fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] w-full h-full
       z-[51]"
          onClick={() => {
            context?.setisSidebarOpen(false);
            setSubmenuIndex(null);
          }}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
