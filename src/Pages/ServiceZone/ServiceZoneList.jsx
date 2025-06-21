import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { AiOutlineEdit } from "react-icons/ai";

import { GoTrash } from "react-icons/go";

import {
  fetchDataFromApi,
  postData,
  editDataCommon,
  deleteDataCommon,
} from "../../utils/api";

const ServiceZoneList = () => {
  const [zones, setZones] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [city, setCity] = useState("");
  const [areas, setAreas] = useState("");

  const fetchZones = async () => {
    try {
      const res = await fetchDataFromApi("/api/service-zones?admin=true");
      setZones(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch service zones.");
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleOpen = (zone = null) => {
    setEditingZone(zone);
    setCity(zone ? zone.city : "");
    setAreas(zone ? zone.areas.map((a) => a.name).join(", ") : "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingZone(null);
    setCity("");
    setAreas("");
  };

  const handleSave = async () => {
    const areaList = areas.split(",").map((a) => ({ name: a.trim() }));
    const payload = { city, areas: areaList };

    try {
      if (editingZone) {
        // Update
        await editDataCommon(`/api/service-zones/${editingZone._id}`, payload);
      } else {
        // Create
        await postData("/api/service-zones", payload);
      }
      fetchZones();
      handleClose();
    } catch (error) {
      console.error(error);
      alert("Failed to save zone.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this zone?")) {
      try {
        await deleteDataCommon(`/api/service-zones/${id}`);
        fetchZones();
      } catch (error) {
        console.error(error);
        alert("Failed to delete zone.");
      }
    }
  };

  return (
    <div>
      <h2>Service Zones</h2>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Zone
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>City</TableCell>
            <TableCell>Areas</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {zones.map((zone) => (
            <TableRow key={zone._id}>
              <TableCell>{zone.city}</TableCell>
              <TableCell>{zone.areas.map((a) => a.name).join(", ")}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpen(zone)} color="primary">
                  <AiOutlineEdit size={20} />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(zone._id)}
                  color="secondary"
                >
                  <GoTrash size={20} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Popup Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingZone ? "Edit Zone" : "Add Zone"}</DialogTitle>
        <DialogContent>
          <TextField
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Areas (comma separated)"
            value={areas}
            onChange={(e) => setAreas(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingZone ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServiceZoneList;
