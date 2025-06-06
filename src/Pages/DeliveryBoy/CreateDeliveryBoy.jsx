// import React, { useState, useContext } from "react";
// import { Button, CircularProgress, TextField, MenuItem } from "@mui/material";
// import { MyContext } from "../../App";
// import { postData } from "../../utils/api";
// import { useNavigate } from "react-router-dom";

// const CreateDeliveryBoy = () => {
//   const context = useContext(MyContext);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     gender: "",
//     address: "",
//   });

//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (
//       !formData.name ||
//       !formData.email ||
//       !formData.phone ||
//       !formData.password ||
//       !formData.gender
//     ) {
//       context.alertBox("error", "Please fill all required fields!");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res = await postData("/api/deliveryboy/", formData);

//       if (res.success) {
//         context.alertBox("success", "Delivery boy created successfully!");
//         // navigate("/deliveryboys"); // Navigate to delivery boys list page (update if needed)
//       } else {
//         context.alertBox(
//           "error",
//           res.message || "Failed to create delivery boy"
//         );
//       }
//     } catch (error) {
//       console.error(error);
//       context.alertBox(
//         "error",
//         "An error occurred while creating delivery boy"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 max-w-[600px] bg-white shadow rounded">
//       <h2 className="text-xl font-semibold mb-4">Create Delivery Boy</h2>
//       <form onSubmit={handleSubmit} className="grid gap-4">
//         <TextField
//           label="Name"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           fullWidth
//           required
//           size="small"
//         />
//         <TextField
//           label="Email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           type="email"
//           fullWidth
//           required
//           size="small"
//         />
//         <TextField
//           label="Phone"
//           name="phone"
//           value={formData.phone}
//           onChange={handleChange}
//           fullWidth
//           required
//           size="small"
//         />
//         <TextField
//           label="Password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           type="password"
//           fullWidth
//           required
//           size="small"
//         />
//         <TextField
//           select
//           label="Gender"
//           name="gender"
//           value={formData.gender}
//           onChange={handleChange}
//           fullWidth
//           required
//           size="small"
//         >
//           <MenuItem value="">Select Gender</MenuItem>
//           <MenuItem value="Male">Male</MenuItem>
//           <MenuItem value="Female">Female</MenuItem>
//           <MenuItem value="Other">Other</MenuItem>
//         </TextField>
//         <TextField
//           label="Address"
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           multiline
//           rows={3}
//           fullWidth
//           size="small"
//         />

//         <div className="flex justify-end items-center gap-3">
//           {isLoading ? (
//             <CircularProgress size={24} />
//           ) : (
//             <Button variant="contained" color="primary" type="submit">
//               Create
//             </Button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateDeliveryBoy;

import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdToggleOn,
  MdToggleOff,
} from "react-icons/md";
// import dayjs from "dayjs";
import { MyContext } from "../../App";
import {
  fetchDataFromApi,
  postData,
  editDataCommon, // ← PUT / PATCH
  deleteDataCommon, // ← DELETE
} from "../../utils/api";

const defaultForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  gender: "",
  address: "",
};

const CreateDeliveryBoy = () => {
  const { alertBox } = useContext(MyContext);

  /* ───────── state ───────── */
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableError, setTableError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  /* ───────── fetch list ───────── */
  const loadDeliveryBoys = async () => {
    setLoading(true);
    setTableError("");
    try {
      const res = await fetchDataFromApi("/api/deliveryboy");
      if (res?.success) setRows(res.data);
      else setTableError(res?.message || "Failed to fetch delivery boys");
    } catch (err) {
      console.error(err);
      setTableError("Error fetching delivery boys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveryBoys();
  }, []);

  /* ───────── helpers ───────── */
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setModalOpen(true);
  };

  const openEditModal = (row) => {
    setEditingId(row._id);
    setFormData({ ...row, password: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData(defaultForm);
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ───── create / update submit ───── */
  const submitForm = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      (!editingId && !formData.password) ||
      !formData.gender
    ) {
      alertBox("error", "Please fill all required fields!");
      return;
    }

    setFormLoading(true);
    try {
      let res;
      if (editingId) {
        const body = { ...formData };
        if (!body.password) delete body.password; // keep old pwd if blank
        res = await editDataCommon(`/api/deliveryboy/${editingId}`, body);
      } else {
        res = await postData("/api/deliveryboy", formData);
      }

      if (res?.success) {
        alertBox(
          "success",
          editingId ? "Delivery boy updated!" : "Delivery boy created!"
        );
        closeModal();
        loadDeliveryBoys();
      } else {
        alertBox("error", res?.message || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      alertBox("error", "An error occurred, please try again");
    } finally {
      setFormLoading(false);
    }
  };

  /* ───── delete ───── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this delivery boy?")) return;
    try {
      const res = await deleteDataCommon(`/api/deliveryboy/${id}`);
      if (res?.success) {
        alertBox("success", "Deleted successfully");
        setRows((prev) => prev.filter((r) => r._id !== id));
      } else {
        alertBox("error", res?.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alertBox("error", "Delete failed");
    }
  };

  /* ───── toggle active ───── */
  const toggleActive = async (row) => {
    try {
      const res = await editDataCommon(`/api/deliveryboy/${row._id}`, {
        isActive: !row.isActive,
      });
      if (res?.success) {
        alertBox("success", "Status updated");
        setRows((prev) =>
          prev.map((r) =>
            r._id === row._id ? { ...r, isActive: !r.isActive } : r
          )
        );
      } else alertBox("error", res?.message || "Status update failed");
    } catch (err) {
      console.error(err);
      alertBox("error", "Status update failed");
    }
  };

  /* ───────── render ───────── */
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* header */}
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" fontWeight={600}>
          Delivery Boys
        </Typography>
        <Button
          startIcon={<MdAdd size={20} />}
          variant="contained"
          onClick={openCreateModal}
        >
          Create Delivery Boy
        </Button>
      </div>

      {/* table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <CircularProgress />
        </div>
      ) : tableError ? (
        <Typography color="error">{tableError}</Typography>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f7f7f7" }}>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                {/* <TableCell>Created</TableCell> */}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No delivery boys found
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row._id} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.gender}</TableCell>
                    <TableCell sx={{ maxWidth: 160 }}>
                      <Typography noWrap title={row.address}>
                        {row.address}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {row.isActive ? "Active" : "Inactive"}
                    </TableCell>
                    {/* <TableCell>{dayjs(row.createdAt).format("DD-MMM-YYYY")}</TableCell> */}
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => openEditModal(row)}>
                          <MdEdit size={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={row.isActive ? "Deactivate" : "Activate"}>
                        <IconButton onClick={() => toggleActive(row)}>
                          {row.isActive ? (
                            <MdToggleOn size={22} />
                          ) : (
                            <MdToggleOff size={22} />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(row._id)}>
                          <MdDelete size={20} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* modal */}
      <Dialog open={modalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? "Edit Delivery Boy" : "Create Delivery Boy"}
        </DialogTitle>
        <DialogContent dividers>
          <form
            id="delivery-boy-form"
            onSubmit={submitForm}
            className="grid gap-4 py-2"
          >
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              type="email"
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              type="password"
              fullWidth
              size="small"
              required={!editingId}
            />
            <TextField
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleFormChange}
              fullWidth
              required
              size="small"
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
              size="small"
            />
          </form>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={closeModal} disabled={formLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="delivery-boy-form"
            variant="contained"
            disabled={formLoading}
          >
            {formLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateDeliveryBoy;
