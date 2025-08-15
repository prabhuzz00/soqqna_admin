import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Select,
  MenuItem,
  Rating,
  Box,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdLocalPrintshop,
} from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Barcode from "react-barcode";

import SearchBox from "../../Components/SearchBox";
import { MyContext } from "../../App";
import {
  fetchDataFromApi,
  deleteData,
  deleteMultipleData,
} from "../../utils/api";
import { MdQrCodeScanner } from "react-icons/md";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

// Column definitions for table header (checkbox column handled separately)
const columns = [
  { id: "expand", label: "", minWidth: 45 }, // caret dropdown
  { id: "product", label: "PRODUCT", minWidth: 150 },
  { id: "category", label: "CATEGORY", minWidth: 100 },
  { id: "subcategory", label: "SUB CATEGORY", minWidth: 150 },
  { id: "vendorStore", label: "VENDOR STORE", minWidth: 160 },
  { id: "vendorOwner", label: "VENDOR OWNER", minWidth: 160 },
  { id: "price", label: "PRICE", minWidth: 130 },
  { id: "sales", label: "SALES", minWidth: 100 },
  { id: "stock", label: "STOCK", minWidth: 100 },
  { id: "rating", label: "RATING", minWidth: 100 },
  { id: "barcode", label: "BARCODE", minWidth: 100 },
  { id: "action", label: "ACTION", minWidth: 100 },
];

const Products = () => {
  const [productCat, setProductCat] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const [productData, setProductData] = useState([]);
  const [productTotalData, setProductTotalData] = useState([]);

  const [productSubCat, setProductSubCat] = useState("");
  const [productThirdLavelCat, setProductThirdLavelCat] = useState("");
  const [sortedIds, setSortedIds] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [pageOrder, setPageOrder] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [photos, setPhotos] = useState([]);
  const [openLightbox, setOpenLightbox] = useState(false);

  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const [barcodeToPrint, setBarcodeToPrint] = useState(null);
  const [copyCount, setCopyCount] = useState(1);

  const [openRowId, setOpenRowId] = useState(null); // track dropdown row
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerError, setScannerError] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const context = useContext(MyContext);

  const VariationRow = ({ open, variation = [] }) => (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box sx={{ m: 2 }}>
        {variation.length === 0 ? (
          <em>No variations</em>
        ) : (
          <Table size="medium" sx={{ width: "150" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Color</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Size</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>BARCODE</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(variation || [])
                .filter(Boolean) // drop null / undefined entries
                .flatMap((v, i) => {
                  const sizes = Array.isArray(v?.sizes) ? v.sizes : [{}]; // at least one
                  return sizes.map((s, j) => (
                    <TableRow key={`${i}-${j}`}>
                      <TableCell>{v?.color?.label ?? "—"}</TableCell>
                      <TableCell>{s?.label ?? "—"}</TableCell>
                      <TableCell>
                        {s?.price !== undefined ? `₹${s.price}` : "—"}
                      </TableCell>
                      <TableCell>{s?.countInStock ?? "—"}</TableCell>
                      <TableCell>
                        {s?.vbarcode ? (
                          <Barcode
                            value={s.vbarcode}
                            width={1}
                            height={40}
                            fontSize={12}
                          />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {s?.vbarcode && (
                          <Button
                            size="small"
                            onClick={() => {
                              setBarcodeToPrint(s.vbarcode);
                              setOpenPrintDialog(true);
                            }}
                          >
                            <MdLocalPrintshop />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ));
                })}
            </TableBody>
          </Table>
        )}
      </Box>
    </Collapse>
  );

  useEffect(() => {
    getProducts(page, rowsPerPage);
  }, [context?.isOpenFullScreenPanel, page, rowsPerPage]);

  useEffect(() => {
    if (!searchQuery) {
      getProducts(page, rowsPerPage);
      return;
    }

    const q = searchQuery.toLowerCase();

    const list = productTotalData?.totalProducts?.length // full list if we have it
      ? productTotalData.totalProducts
      : productData.products ?? []; // fallback to current page

    const filtered = list.filter((p) => {
      /* top-level columns */
      const top =
        (p._id || "").toLowerCase().includes(q) ||
        (p.name || "").toLowerCase().includes(q) ||
        (p.catName || "").toLowerCase().includes(q) ||
        (p.subCat || "").toLowerCase().includes(q) ||
        (p.barcode || "").includes(q);

      /* variation barcodes */
      const varMatch =
        Array.isArray(p.variation) &&
        p.variation.some(
          (v) =>
            Array.isArray(v?.sizes) &&
            v.sizes.some((s) => (s?.vbarcode || "").includes(q))
        );

      return top || varMatch;
    });

    setProductData({
      ...productData,
      products: filtered,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / rowsPerPage),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Handler to toggle all checkboxes
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;

    // Update all items' checked status
    const updatedItems = productData?.products?.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setProductData({
      error: false,
      success: true,
      products: updatedItems,
      total: updatedItems?.length,
      page: parseInt(page),
      totalPages: Math.ceil(updatedItems?.length / rowsPerPage),
      totalCount: productData?.totalCount,
    });

    // Update the sorted IDs state
    if (isChecked) {
      const ids = updatedItems.map((item) => item._id).sort((a, b) => a - b);
      setSortedIds(ids);
    } else {
      setSortedIds([]);
    }
  };

  // Handler to toggle individual checkboxes
  const handleCheckboxChange = (e, id, index) => {
    const updatedItems = productData?.products?.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item
    );
    setProductData({
      error: false,
      success: true,
      products: updatedItems,
      total: updatedItems?.length,
      page: parseInt(page),
      totalPages: Math.ceil(updatedItems?.length / rowsPerPage),
      totalCount: productData?.totalCount,
    });

    // Update the sorted IDs state
    const selectedIds = updatedItems
      .filter((item) => item.checked)
      .map((item) => item._id)
      .sort((a, b) => a - b);
    setSortedIds(selectedIds);
  };

  const getProducts = async (page, limit) => {
    setIsloading(true);
    fetchDataFromApi(
      `/api/product/getAllProducts?page=${page + 1}&limit=${limit}`
    ).then((res) => {
      setProductData(res);

      setProductTotalData(res);
      setIsloading(false);

      let arr = [];

      for (let i = 0; i < res?.products?.length; i++) {
        arr.push({
          src: res?.products[i]?.images[0],
        });
      }

      setPhotos(arr);
    });
  };

  const handleChangeProductCat = (event) => {
    if (event.target.value !== null) {
      setProductCat(event.target.value);
      setProductSubCat("");
      setProductThirdLavelCat("");
      setIsloading(true);
      fetchDataFromApi(
        `/api/product/getAllProductsByCatId/${event.target.value}`
      ).then((res) => {
        if (res?.error === false) {
          setProductData({
            error: false,
            success: true,
            products: res?.products,
            total: res?.products?.length,
            page: parseInt(page),
            totalPages: Math.ceil(res?.products?.length / rowsPerPage),
            totalCount: res?.products?.length,
          });

          setTimeout(() => {
            setIsloading(false);
          }, 300);
        }
      });
    } else {
      getProducts(0, 50);
      setProductSubCat("");
      setProductCat(event.target.value);
      setProductThirdLavelCat("");
    }
  };

  const handleChangeProductSubCat = (event) => {
    if (event.target.value !== null) {
      setProductSubCat(event.target.value);
      setProductCat("");
      setProductThirdLavelCat("");
      setIsloading(true);
      fetchDataFromApi(
        `/api/product/getAllProductsBySubCatId/${event.target.value}`
      ).then((res) => {
        if (res?.error === false) {
          setProductData({
            error: false,
            success: true,
            products: res?.products,
            total: res?.products?.length,
            page: parseInt(page),
            totalPages: Math.ceil(res?.products?.length / rowsPerPage),
            totalCount: res?.products?.length,
          });
          setTimeout(() => {
            setIsloading(false);
          }, 500);
        }
      });
    } else {
      setProductSubCat(event.target.value);
      getProducts(0, 50);
      setProductCat("");
      setProductThirdLavelCat("");
    }
  };

  const handleChangeProductThirdLavelCat = (event) => {
    if (event.target.value !== null) {
      setProductThirdLavelCat(event.target.value);
      setProductCat("");
      setProductSubCat("");
      setIsloading(true);
      fetchDataFromApi(
        `/api/product/getAllProductsByThirdLavelCat/${event.target.value}`
      ).then((res) => {
        console.log(res);
        if (res?.error === false) {
          setProductData({
            error: false,
            success: true,
            products: res?.products,
            total: res?.products?.length,
            page: parseInt(page),
            totalPages: Math.ceil(res?.products?.length / rowsPerPage),
            totalCount: res?.products?.length,
          });
          setTimeout(() => {
            setIsloading(false);
          }, 300);
        }
      });
    } else {
      setProductThirdLavelCat(event.target.value);
      getProducts(0, 50);
      setProductCat("");
      setProductSubCat("");
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteProduct = (id) => {
    if (context?.userData?.role === "SUPERADMIN") {
      deleteData(`/api/product/${id}`).then((res) => {
        getProducts();
        context.alertBox("success", "Product deleted");
      });
    } else {
      context.alertBox("error", "Only admin can delete data");
    }
  };

  const deleteMultipleProduct = async () => {
    if (context?.userData?.role !== "SUPERADMIN") {
      context.alertBox("error", "Only admin can delete data");
      return;
    }

    if (sortedIds.length === 0) {
      context.alertBox("error", "Please select items to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${sortedIds.length} selected product(s)?`
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteMultipleData(`/api/product/deleteMultiple`, {
        data: { ids: sortedIds },
      });

      getProducts();
      context.alertBox("success", "Products deleted");
      setSortedIds([]);
    } catch (error) {
      context.alertBox("error", "Error deleting items.");
    }
  };

  const handleChangePage = (event, newPage) => {
    getProducts(page, rowsPerPage);
    setPage(newPage);
  };

  const cleanupScanner = async (html5QrCodeRef) => {
    if (html5QrCodeRef.current) {
      if (html5QrCodeRef.current.isScanning) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (err) {
          console.error("Failed to stop scanner during cleanup:", err);
        }
      }
      try {
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error("Failed to clear scanner during cleanup:", err);
      }
      html5QrCodeRef.current = null;
    }
  };

  const safeCleanupScanner = async (html5QrCodeRef, containerId) => {
    if (html5QrCodeRef.current) {
      if (html5QrCodeRef.current.isScanning) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (err) {
          console.error("Failed to stop scanner during cleanup:", err);
        }
      }
      // Only call clear if the container exists
      if (document.getElementById(containerId)) {
        try {
          await html5QrCodeRef.current.clear();
        } catch (err) {
          console.error("Failed to clear scanner during cleanup:", err);
        }
      }
      html5QrCodeRef.current = null;
    }
  };

  const BarcodeScanner = () => {
    const [scannerStarted, setScannerStarted] = useState(false);
    const [scannerError, setScannerError] = useState("");
    const html5QrCode = useRef(null);
    const scannedRef = useRef(false);

    const [containerId] = useState(
      () => `scanner-container-${Date.now()}-${Math.random()}`
    );

    useEffect(() => {
      let isMounted = true;
      let timeoutId;

      async function startScanner() {
        setScannerError("");
        setScannerStarted(false);
        scannedRef.current = false;

        await safeCleanupScanner(html5QrCode);

        await new Promise((resolve) => setTimeout(resolve, 200));

        if (isScannerOpen && isMounted) {
          const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import(
            "html5-qrcode"
          );
          html5QrCode.current = new Html5Qrcode(scannerContainerId.current);

          const qrboxSize =
            window.innerWidth < 768
              ? { width: 200, height: 80 }
              : { width: 250, height: 100 };

          const config = {
            fps: 10,
            qrbox: qrboxSize,
            formatsToSupport: [
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.CODE_93,
            ],
            rememberLastUsedCamera: true,
            aspectRatio: 4 / 3,
          };

          const onScanSuccess = (decodedText) => {
            if (scannedRef.current) return;
            scannedRef.current = true;
            setSearchQuery(decodedText);
            context.alertBox("success", `Barcode detected: ${decodedText}`);
            handleClose();
          };

          try {
            await html5QrCode.current.start(
              { facingMode: "environment" },
              config,
              onScanSuccess,
              (errorMessage) => {}
            );
            setScannerStarted(true);
          } catch (err) {
            setScannerError(
              "Failed to start camera. Please check permissions and try again."
            );
            setScannerStarted(false);
            await safeCleanupScanner(html5QrCode);
          }

          // Fallback: If camera doesn't start in 10 seconds, show error and cleanup
          timeoutId = setTimeout(async () => {
            if (!scannerStarted) {
              setScannerError(
                "Camera initialization timed out. Please close and try again."
              );
              await safeCleanupScanner(html5QrCode);
            }
          }, 10000);
        }
      }

      startScanner();

      return () => {
        clearTimeout(timeoutId);
        safeCleanupScanner(html5QrCode, containerId);
        setScannerStarted(false);
      };
    }, [isScannerOpen]);

    const handleRetry = () => {
      setScannerError("");
      setIsScannerOpen(false);
      setTimeout(() => setIsScannerOpen(true), 100);
    };

    const handleClose = async () => {
      await safeCleanupScanner(html5QrCode);
      setIsScannerOpen(false);
      setScannerError("");
      setScannerStarted(false);
    };

    return (
      <div className="fixed top-0 left-0 w-full h-full bg-[#000000dd] z-50 flex flex-col justify-center items-center">
        <div className="bg-white rounded-lg p-4 shadow-lg max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Scan Barcode</h3>
            <Button
              onClick={handleClose}
              className="!min-w-[30px] !w-[30px] !h-[30px] !text-gray-600"
            >
              ✕
            </Button>
          </div>

          {scannerError ? (
            <div className="text-center p-4">
              <div className="text-red-500 mb-4 text-sm">{scannerError}</div>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleRetry}
                  className="!text-blue-600 !border-blue-600"
                >
                  Try Again
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClose}
                  className="!text-gray-600 !border-gray-400"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div
                id={containerId}
                className="w-full bg-black rounded-lg overflow-hidden relative"
                style={{
                  position: "relative",
                  width: "100%",
                  height: "50vh",
                  minHeight: "256px",
                  maxHeight: "400px",
                }}
              >
                {!scannerStarted && (
                  <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                    <CircularProgress size={24} style={{ color: "white" }} />
                    <span className="ml-2">Initializing camera...</span>
                  </div>
                )}
              </div>

              {scannerStarted && (
                <div className="absolute inset-0 pointer-events-none z-20 flex justify-center items-center">
                  <div className="w-[80%] max-w-[250px] h-20 border-2 border-green-500 bg-transparent rounded"></div>
                </div>
              )}

              <p className="text-center mt-2 text-sm text-gray-600">
                {scannerStarted
                  ? "Position barcode in the frame"
                  : "Initializing camera..."}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };
  // ───────────────────────────── Render ──────────────────────────────
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[18px] font-[600]">Products</h2>
        <div className="flex items-center gap-3">
          {sortedIds.length !== 0 && (
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={deleteMultipleProduct}
            >
              Delete
            </Button>
          )}
          <Button
            className="btn-blue !text-white btn-sm flex items-center gap-2"
            onClick={() => setIsScannerOpen(true)}
            title="Scan Barcode"
          >
            <MdQrCodeScanner className="text-[18px]" />
            Scan
          </Button>
          <Button
            className="btn-blue !text-white btn-sm"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add Product",
              })
            }
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 lg:grid-cols-4 w-full px-5 justify-beetween gap-4">
          <div className="col">
            <h4 className="font-[600] text-[13px] mb-2">Category By</h4>
            {context?.catData?.length !== 0 && (
              <Select
                style={{ zoom: "80%" }}
                labelId="demo-simple-select-label"
                id="productCatDrop"
                size="small"
                className="w-full"
                value={productCat}
                label="Category"
                onChange={handleChangeProductCat}
              >
                <MenuItem value={null}>None</MenuItem>
                {context?.catData?.map((cat, index) => {
                  return <MenuItem value={cat?._id}>{cat?.name}</MenuItem>;
                })}
              </Select>
            )}
          </div>

          <div className="col">
            <h4 className="font-[600] text-[13px] mb-2">Sub Category By</h4>
            {context?.catData?.length !== 0 && (
              <Select
                style={{ zoom: "80%" }}
                labelId="demo-simple-select-label"
                id="productCatDrop"
                size="small"
                className="w-full"
                value={productSubCat}
                label="Sub Category"
                onChange={handleChangeProductSubCat}
              >
                <MenuItem value={null}>None</MenuItem>
                {context?.catData?.map((cat, index) => {
                  return (
                    cat?.children?.length !== 0 &&
                    cat?.children?.map((subCat, index_) => {
                      return (
                        <MenuItem value={subCat?._id}>{subCat?.name}</MenuItem>
                      );
                    })
                  );
                })}
              </Select>
            )}
          </div>

          <div className="col">
            <h4 className="font-[600] text-[13px] mb-2">
              Third Level Sub Category By
            </h4>
            {context?.catData?.length !== 0 && (
              <Select
                style={{ zoom: "80%" }}
                labelId="demo-simple-select-label"
                id="productCatDrop"
                size="small"
                className="w-full"
                value={productThirdLavelCat}
                label="Sub Category"
                onChange={handleChangeProductThirdLavelCat}
              >
                <MenuItem value={null}>None</MenuItem>
                {context?.catData?.map((cat) => {
                  return (
                    cat?.children?.length !== 0 &&
                    cat?.children?.map((subCat) => {
                      return (
                        subCat?.children?.length !== 0 &&
                        subCat?.children?.map((thirdLavelCat, index) => {
                          return (
                            <MenuItem value={thirdLavelCat?._id} key={index}>
                              {thirdLavelCat?.name}
                            </MenuItem>
                          );
                        })
                      );
                    })
                  );
                })}
              </Select>
            )}
          </div>

          <div className="col w-full ml-auto flex items-center">
            <div style={{ alignSelf: "end" }} className="w-full">
              <SearchBox
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setPageOrder={setPageOrder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {/* Master checkbox */}
                <TableCell padding="checkbox">
                  <Checkbox
                    {...label}
                    size="small"
                    checked={
                      productData?.products?.length > 0 &&
                      productData.products.every((i) => i.checked)
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {/* Header cells */}
                {columns.map((col) => (
                  <TableCell key={col.id} style={{ minWidth: col.minWidth }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : (
                productData?.products?.map((product) => (
                  <React.Fragment key={product._id}>
                    <TableRow
                      className={product.checked ? "!bg-[#1976d21f]" : ""}
                    >
                      {/* Checkbox */}
                      <TableCell padding="checkbox">
                        <Checkbox
                          {...label}
                          size="small"
                          checked={!!product.checked}
                          onChange={(e) => handleCheckboxChange(e, product._id)}
                        />
                      </TableCell>
                      {/* Expand caret */}
                      <TableCell padding="none">
                        <IconButton
                          size="small"
                          onClick={() =>
                            setOpenRowId(
                              openRowId === product._id ? null : product._id
                            )
                          }
                        >
                          {openRowId === product._id ? (
                            <MdKeyboardArrowUp />
                          ) : (
                            <MdKeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      {/* Product cell */}
                      <TableCell>
                        <div
                          className="flex items-center gap-4 w-[300px]"
                          title={product.name}
                        >
                          <div
                            className="w-[65px] h-[65px] rounded-md overflow-hidden group cursor-pointer"
                            onClick={() => setOpenLightbox(true)}
                          >
                            <LazyLoadImage
                              alt="img"
                              effect="blur"
                              src={product.images[0] || "/placeholder.png"}
                              className="w-full group-hover:scale-105 transition-all"
                            />
                          </div>
                          <div className="w-[75%]">
                            <h3 className="font-[600] text-[12px] leading-4 hover:text-primary">
                              <Link to={`/product/${product._id}`}>
                                {product.name.slice(0, 50)}…
                              </Link>
                            </h3>
                            <span className="text-[12px]">{product.brand}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.catName}</TableCell>
                      <TableCell>{product.subCat}</TableCell>
                      <TableCell>
                        {product.vendorId?.storeName || "—"}
                      </TableCell>
                      <TableCell>
                        {product.vendorId?.ownerName || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="line-through text-gray-500 text-[14px]">
                            {product.oldPrice.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </span>
                          <span className="text-primary font-[600] text-[14px]">
                            {product.price.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{product.sale} sale</TableCell>
                      <TableCell>
                        <span className="text-primary font-[600]">
                          {product.countInStock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Rating
                          name="rating"
                          size="small"
                          value={product.rating}
                          readOnly
                        />
                      </TableCell>
                      <TableCell>
                        <Barcode
                          value={product.barcode}
                          width={1}
                          height={40}
                          fontSize={12}
                        />
                      </TableCell>
                      {/* Action buttons */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            className="!min-w-[35px] !w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full"
                            onClick={() =>
                              context.setIsOpenFullScreenPanel({
                                open: true,
                                model: "Edit Product",
                                id: product._id,
                              })
                            }
                          >
                            <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                          </Button>
                          <Link to={`/product/${product._id}`}>
                            <Button className="!min-w-[35px] !w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full">
                              <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                            </Button>
                          </Link>
                          <Button
                            className="!min-w-[35px] !w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full"
                            onClick={() => deleteProduct(product._id)}
                          >
                            <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                          </Button>
                          <Button
                            className="!min-w-[35px] !w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full"
                            onClick={() => {
                              setBarcodeToPrint(product.barcode);
                              setOpenPrintDialog(true);
                            }}
                          >
                            <MdLocalPrintshop className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {/* Collapsible variations row */}
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + 1 /* checkbox */}
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                      >
                        <VariationRow
                          open={openRowId === product._id}
                          variation={product.variation}
                        />
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[50, 100, 150, 200]}
          component="div"
          count={(productData?.totalPages || 0) * rowsPerPage}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </div>

      {/* Lightbox for images */}
      <Lightbox
        open={openLightbox}
        close={() => setOpenLightbox(false)}
        slides={photos}
      />

      {/* Print dialog (unchanged from your original implementation) */}
      {openPrintDialog && (
        // … keep your existing print-dialog markup & logic …
        <div className="fixed top-0 left-0 w-full h-full bg-[#00000055] z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[400px]">
            <h3 className="text-[18px] font-semibold mb-4">Print Barcode</h3>
            <label className="text-sm">Number of Copies:</label>
            <input
              type="number"
              min={1}
              value={copyCount}
              onChange={(e) => setCopyCount(parseInt(e.target.value))}
              className="border px-3 py-2 rounded w-full mt-2 mb-4"
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpenPrintDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setOpenPrintDialog(false);

                  setTimeout(() => {
                    const printWindow = window.open("", "_blank");

                    if (!printWindow) {
                      alert(
                        "Popup blocked. Please allow popups for this site."
                      );
                      return;
                    }

                    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print Barcode</title>
          <style>
            @media print {
              body {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
              }
              .barcode-container {
                margin: 10px;
                text-align: center;
              }
            }
          </style>
        </head>
        <body>
          ${Array.from({ length: copyCount })
            .map(
              (_, i) => `<div class="barcode-container">
                  <svg id="barcode-${i}"></svg>
                </div>`
            )
            .join("")}

          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            window.onload = function () {
              const total = ${copyCount};
              for (let i = 0; i < total; i++) {
                JsBarcode("#barcode-" + i, "${barcodeToPrint}", {
                  format: "CODE128",
                  width: 2,
                  height: 60,
                  displayValue: true,
                  fontSize: 14
                });
              }
              setTimeout(() => {
                window.print();
                window.onafterprint = () => {
                  window.close();
                };
              }, 500);
            };
          </script>
        </body>
        </html>
      `;

                    printWindow.document.write(htmlContent);
                    printWindow.document.close();
                  }, 100);
                }}
              >
                Print
              </Button>
            </div>
          </div>
        </div>
      )}

      {isScannerOpen && <BarcodeScanner />}
    </>
  );
};

export default Products;
