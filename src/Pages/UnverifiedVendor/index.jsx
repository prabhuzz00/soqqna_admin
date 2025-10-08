// components/UnverifiedVendors.jsx
import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import SearchBox from "../../Components/SearchBox";
import { MyContext } from "../../App";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { MdLocalPhone } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import {
  fetchDataFromApi,
  patchDataLatest,
  deleteDataCommon,
} from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { FaCheckDouble } from "react-icons/fa6";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
  { id: "index", label: "INDEX", minWidth: 80 },
  { id: "vendor", label: "VENDOR", minWidth: 80 },
  { id: "vendorPhone", label: "VENDOR PHONE NO", minWidth: 130 },
  { id: "serviceZone", label: "SERVICE ZONES", minWidth: 150 },
  { id: "verifyStatus", label: "VERIFICATION STATUS", minWidth: 130 },
  { id: "status", label: "STATUS", minWidth: 100 },
  { id: "createdDate", label: "CREATED", minWidth: 130 },
  { id: "action", label: "ACTION", minWidth: 150 },
];

const UnverifiedVendors = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [vendorData, setVendorData] = useState([]);
  const [vendorTotalData, setVendorTotalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  const [openCommissionDialog, setOpenCommissionDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedVendorStatus, setSelectedVendorStatus] = useState(null);
  const [commissionRate, setCommissionRate] = useState("");
  const [commissionError, setCommissionError] = useState("");

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getVendors(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const getVendors = (page, limit) => {
    setIsLoading(true);
    fetchDataFromApi(
      `/api/vendor/list?page=${page + 1}&limit=${limit}&isVerified=false`
    )
      .then((res) => {
        console.log("Fetched unverified vendors:", res);
        setVendorData(res);
        setVendorTotalData(res);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Fetch unverified vendors error:", error);
        context.alertBox("error", "Failed to fetch vendors");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (searchQuery !== "") {
      const filteredItems = vendorTotalData?.vendors?.filter(
        (vendor) =>
          vendor.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.emailAddress
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          vendor.createdAt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setVendorData({
        error: false,
        success: true,
        vendors: filteredItems,
        total: filteredItems?.length,
        page: parseInt(page),
        totalPages: Math.ceil(filteredItems?.length / rowsPerPage),
        totalVendorsCount: vendorData?.totalVendorsCount,
      });
    } else {
      getVendors(page, rowsPerPage);
    }
  }, [searchQuery]);

  const handleEditClick = (id) => {
    navigate(`/vendors/edit/${id}`, {
      state: { from: "/vendors/unverified-vendors" },
    });
  };

  const handleVerifyClick = (vendor) => {
    setSelectedVendor(vendor);
    setSelectedVendorId(vendor._id);
    setCommissionRate("");
    setCommissionError("");
    setOpenCommissionDialog(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedVendorId(id);
    setOpenDeleteDialog(true);
  };

  const handleStatusClick = (id, currentStatus) => {
    setSelectedVendorId(id);
    setSelectedVendorStatus(currentStatus);
    setOpenStatusDialog(true);
  };

  const handleVerifyDialogClose = () => {
    setOpenVerifyDialog(false);
    setSelectedVendorId(null);
  };

  const handleCommissionDialogClose = () => {
    setOpenCommissionDialog(false);
    setSelectedVendorId(null);
    setSelectedVendor(null);
    setCommissionRate("");
    setCommissionError("");
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedVendorId(null);
  };

  const handleStatusDialogClose = () => {
    setOpenStatusDialog(false);
    setSelectedVendorId(null);
    setSelectedVendorStatus(null);
  };

  const verifyVendor = (approved = true) => {
    // Validate commission rate if approving
    if (approved) {
      const rate = parseFloat(commissionRate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        setCommissionError("Please enter a valid commission rate between 0 and 100");
        return;
      }
    }

    setIsLoading(true);
    const requestData = approved 
      ? { commissionRate: parseFloat(commissionRate), approved: true }
      : { approved: false };

    patchDataLatest(`/api/vendor/verify/${selectedVendorId}`, requestData)
      .then((res) => {
        if (res.error) {
          context.alertBox("error", res.message);
        } else {
          const message = approved 
            ? "Vendor verified successfully" 
            : "Vendor application rejected";
          context.alertBox("success", message);
          getVendors(page, rowsPerPage);
        }
        handleCommissionDialogClose();
        setIsLoading(false);
      })
      .catch((error) => {
        context.alertBox("error", "Failed to process vendor application");
        console.error("Verify vendor error:", error);
        handleCommissionDialogClose();
        setIsLoading(false);
      });
  };

  const deleteVendor = () => {
    if (context?.userData?.role !== "SUPERADMIN") {
      context.alertBox("error", "Only SUPERADMIN can delete a vendor.");
      return;
    }

    setIsLoading(true);
    deleteDataCommon(`/api/vendor/${selectedVendorId}`)
      .then((res) => {
        if (res.error) {
          context.alertBox("error", res.message);
        } else {
          context.alertBox("success", "Vendor deleted successfully");
          getVendors(page, rowsPerPage);
        }
        handleDeleteDialogClose();
        setIsLoading(false);
      })
      .catch((error) => {
        context.alertBox("error", "Failed to delete vendor");
        console.error("Delete vendor error:", error);
        handleDeleteDialogClose();
        setIsLoading(false);
      });
  };

  const updateVendorStatus = () => {
    if (context?.userData?.role !== "SUPERADMIN") {
      context.alertBox(
        "error",
        "Only SUPERADMIN can Change status of a vendor."
      );
      return;
    }
    setIsLoading(true);
    patchDataLatest(`/api/vendor/status/${selectedVendorId}`)
      .then((res) => {
        if (res.error) {
          context.alertBox("error", res.message);
        } else {
          context.alertBox("success", res.message);
          getVendors(page, rowsPerPage);
        }
        handleStatusDialogClose();
        setIsLoading(false);
      })
      .catch((error) => {
        context.alertBox("error", "Failed to update vendor status");
        console.error("Update status error:", error);
        handleStatusDialogClose();
        setIsLoading(false);
      });
  };

  return (
    <div className="card my-2 pt-5 shadow-md sm:rounded-lg bg-white">
      <div className="flex items-center w-full px-5 pb-4 justify-between">
        <div className="col w-[40%]">
          <h2 className="text-[18px] font-[600]">Unverified Vendors List</h2>
        </div>
        <div className="col w-[40%] ml-auto flex items-center gap-3">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox {...label} size="small" />
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <span className="whitespace-nowrap">{column.label}</span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="flex items-center justify-center w-full min-h-[400px]">
                    <CircularProgress color="inherit" />
                  </div>
                </TableCell>
              </TableRow>
            ) : vendorData?.vendors?.length > 0 ? (
              vendorData.vendors.map((vendor, index) => (
                <TableRow key={vendor._id}>
                  <TableCell>
                    <Checkbox {...label} size="small" />
                  </TableCell>
                  <TableCell style={{ minWidth: columns[0].minWidth }}>
                    <span className="font-[600]">
                      {page * rowsPerPage + index + 1}
                    </span>
                  </TableCell>
                  <TableCell style={{ minWidth: columns[1].minWidth }}>
                    <div className="flex items-center gap-4 w-[300px]">
                      <div className="img w-[45px] h-[45px] rounded-md overflow-hidden group">
                        <img
                          src={vendor?.storeLogo || "/default-vendor.jpg"}
                          className="w-full group-hover:scale-105 transition-all"
                          alt={vendor.storeName}
                        />
                      </div>
                      <div className="info flex flex-col gap-1">
                        <span className="font-[500]">{vendor.storeName}</span>
                        <div className="flex items-center gap-1">
                          <span className="flex items-center gap-2 w-[200px]">
                            <MdOutlineMarkEmailRead size={15} />
                            {vendor.emailAddress.substr(0, 5) + "***"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell style={{ minWidth: columns[2].minWidth }}>
                    <span className="flex items-center gap-2">
                      <MdLocalPhone />
                      {vendor.phoneNumber || "NONE"}
                    </span>
                  </TableCell>
                  <TableCell style={{ minWidth: columns[3].minWidth }}>
                    <div className="flex flex-wrap gap-1">
                      {vendor.serviceZone ? (
                        vendor.serviceZone.split(',').map((zone, index) => (
                          <Chip 
                            key={index} 
                            label={zone.trim()} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontSize: '10px', height: '20px' }}
                          />
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">All zones</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell style={{ minWidth: columns[4].minWidth }}>
                    <span className="inline-block py-1 px-4 rounded-full text-[11px] capitalize bg-red-500 text-white font-[500]">
                      Not Verified
                    </span>
                  </TableCell>
                  <TableCell style={{ minWidth: columns[5].minWidth }}>
                    <span
                      className="inline-block py-1 px-4 rounded-full text-[11px] capitalize font-[500] text-white"
                      style={{
                        backgroundColor: vendor.status ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {vendor.status ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell style={{ minWidth: columns[6].minWidth }}>
                    <span className="flex items-center gap-2">
                      <SlCalender />
                      {vendor.createdAt.split("T")[0]}
                    </span>
                  </TableCell>
                  <TableCell style={{ minWidth: columns[7].minWidth }}>
                    <div className="flex items-center gap-1">
                      <Button
                        className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]"
                        onClick={() => handleEditClick(vendor._id)}
                        disabled={isLoading}
                        title="Edit Vendor"
                      >
                        <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                      </Button>
                      <Button
                        onClick={() => handleVerifyClick(vendor)}
                        variant="outlined"
                        color="success"
                        size="small"
                      >
                        Verify
                      </Button>
                      <Button
                        className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]"
                        onClick={() =>
                          handleStatusClick(vendor._id, vendor.status)
                        }
                        disabled={isLoading}
                        title={
                          vendor.status
                            ? "Deactivate Vendor"
                            : "Activate Vendor"
                        }
                      >
                        <MdOutlinePowerSettingsNew className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                      </Button>
                      <Button
                        className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]"
                        onClick={() => handleDeleteClick(vendor._id)}
                        disabled={isLoading}
                        title="Delete Vendor"
                      >
                        <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>No unverified vendors found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={vendorData?.totalVendorsCount || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={openVerifyDialog}
        onClose={handleVerifyDialogClose}
        aria-labelledby="verify-dialog-title"
        aria-describedby="verify-dialog-description"
      >
        <DialogTitle id="verify-dialog-title">Confirm Verification</DialogTitle>
        <DialogContent>
          <DialogContentText id="verify-dialog-description">
            Are you sure you want to verify this vendor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVerifyDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={verifyVendor} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Commission Rate Dialog */}
      <Dialog
        open={openCommissionDialog}
        onClose={handleCommissionDialogClose}
        aria-labelledby="commission-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="commission-dialog-title">
          Vendor Verification - Set Commission Rate
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {selectedVendor && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Vendor Information:
                </Typography>
                <Typography><strong>Store Name:</strong> {selectedVendor.storeName}</Typography>
                <Typography><strong>Owner:</strong> {selectedVendor.ownerName}</Typography>
                <Typography><strong>Email:</strong> {selectedVendor.emailAddress}</Typography>
                <Typography><strong>Phone:</strong> {selectedVendor.phoneNumber}</Typography>
                
                {selectedVendor.serviceZone && (
                  <Box sx={{ mt: 2 }}>
                    <Typography><strong>Service Zones:</strong></Typography>
                    <Box sx={{ mt: 1 }}>
                      {selectedVendor.serviceZone.split(',').map((zone, index) => (
                        <Chip key={index} label={zone.trim()} sx={{ mr: 1, mb: 1 }} />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
            
            <FormControl fullWidth>
              <TextField
                label="Commission Rate (%)"
                type="number"
                value={commissionRate}
                onChange={(e) => {
                  setCommissionRate(e.target.value);
                  setCommissionError("");
                }}
                error={!!commissionError}
                helperText={commissionError || "Enter commission rate between 0 and 100"}
                inputProps={{ min: 0, max: 100, step: 0.1 }}
                variant="outlined"
                fullWidth
              />
            </FormControl>
            
            <DialogContentText sx={{ mt: 2 }}>
              Setting a commission rate will verify and activate this vendor account. 
              All vendor products will be updated with their selected service zones.
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCommissionDialogClose} 
            color="secondary"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => verifyVendor(false)} 
            color="error"
            disabled={isLoading}
          >
            Reject
          </Button>
          <Button 
            onClick={() => verifyVendor(true)} 
            color="primary" 
            variant="contained"
            disabled={isLoading || !commissionRate}
          >
            {isLoading ? <CircularProgress size={20} /> : "Approve & Verify"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this vendor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteVendor} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openStatusDialog}
        onClose={handleStatusDialogClose}
        aria-labelledby="status-dialog-title"
        aria-describedby="status-dialog-description"
      >
        <DialogTitle id="status-dialog-title">
          {selectedVendorStatus ? "Deactivate Vendor" : "Activate Vendor"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="status-dialog-description">
            {selectedVendorStatus
              ? "Are you sure you want to deactivate this vendor?"
              : "Are you sure you want to activate this vendor?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateVendorStatus} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UnverifiedVendors;
