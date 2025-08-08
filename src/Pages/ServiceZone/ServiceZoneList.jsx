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
  FormControlLabel,
  Checkbox,
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
  const [areaInputs, setAreaInputs] = useState([{ name: "", doorStep: false }]);

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

    if (zone && Array.isArray(zone.areas)) {
      setAreaInputs(
        zone.areas.map((a) => ({
          name: a.name || "",
          doorStep: a.doorStep || false,
        }))
      );
    } else {
      setAreaInputs([{ name: "", doorStep: false }]);
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingZone(null);
    setCity("");
    setAreaInputs([{ name: "", doorStep: false }]);
  };

  const addArea = () => {
    setAreaInputs([...areaInputs, { name: "", doorStep: false }]);
  };

  const removeArea = (index) => {
    const updated = [...areaInputs];
    updated.splice(index, 1);
    setAreaInputs(updated);
  };

  const handleAreaChange = (index, field, value) => {
    const updated = [...areaInputs];
    updated[index][field] = value;
    setAreaInputs(updated);
  };

  const handleSave = async () => {
    const cleanedAreas = areaInputs
      .filter((a) => a.name.trim() !== "")
      .map((a) => ({
        name: a.name.trim(),
        doorStep: a.doorStep,
      }));

    const payload = {
      city: city.trim(),
      areas: cleanedAreas,
    };

    try {
      if (editingZone) {
        // Update existing zone
        await editDataCommon(`/api/service-zones/${editingZone._id}`, payload);
      } else {
        // Create new zone
        await postData("/api/service-zones", payload);
      }

      fetchZones(); // Refresh list
      handleClose(); // Close modal
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
              <TableCell>
                <ul style={{ paddingLeft: 16 }}>
                  {zone.areas.map((a, i) => (
                    <li key={i}>
                      {a.name} {a.doorStep ? "(🚚 Doorstep)" : ""}
                    </li>
                  ))}
                </ul>
              </TableCell>

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
          {areaInputs.map((area, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <TextField
                label={`Area ${index + 1}`}
                value={area.name}
                onChange={(e) =>
                  handleAreaChange(index, "name", e.target.value)
                }
                style={{ flex: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={area.doorStep}
                    onChange={(e) =>
                      handleAreaChange(index, "doorStep", e.target.checked)
                    }
                    color="primary"
                  />
                }
                label="Doorstep"
              />
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => removeArea(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button onClick={addArea} variant="outlined" color="primary">
            + Add Area
          </Button>
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
