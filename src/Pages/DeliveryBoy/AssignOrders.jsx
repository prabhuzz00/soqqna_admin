import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";
import { MdRefresh, MdLocalShipping } from "react-icons/md";
// import dayjs from "dayjs";
import { SlCalender } from "react-icons/sl";
import { MyContext } from "../../App";
import { fetchDataFromApi, editDataCommon } from "../../utils/api";

/* ---------- tweak here if your endpoint is different ---------- */
const PENDING_ORDERS_URL = "/api/order/recived-order-list";

const AssignOrders = () => {
  const { alertBox } = useContext(MyContext);

  /* ───────── state ───────── */
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");

  const [selectedOrders, setSelectedOrders] = useState([]); // order _ids
  const [selectedBoy, setSelectedBoy] = useState("");

  /* ───────── fetch both lists ───────── */
  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [orderRes, boyRes] = await Promise.all([
        fetchDataFromApi(PENDING_ORDERS_URL),
        fetchDataFromApi("/api/deliveryboy"),
      ]);

      if (!orderRes?.success || !boyRes?.success) {
        setError("Failed to load data");
      } else {
        setOrders(orderRes.data);
        setDeliveryBoys(boyRes.data.filter((b) => b.isActive)); // show only active boys
      }
    } catch (err) {
      console.error(err);
      setError("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ───────── selection handlers ───────── */
  const toggleAll = (e) => {
    setSelectedOrders(e.target.checked ? orders.map((o) => o._id) : []);
  };

  const toggleOne = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ───────── assign action ───────── */
  const handleAssign = async () => {
    if (!selectedBoy) {
      alertBox("warning", "Please select a delivery boy");
      return;
    }
    if (selectedOrders.length === 0) {
      alertBox("warning", "Please select at least one order");
      return;
    }

    setAssigning(true);
    try {
      const res = await editDataCommon("/api/deliveryboy/assign", {
        deliveryBoyId: selectedBoy,
        orderIds: selectedOrders,
      });

      if (res?.success) {
        alertBox("success", "Orders assigned successfully!");
        setSelectedOrders([]);
        setSelectedBoy("");
        loadData(); // refresh list (assigned orders disappear)
      } else {
        alertBox("error", res?.message || "Failed to assign orders");
      }
    } catch (err) {
      console.error(err);
      alertBox("error", "Failed to assign orders");
    } finally {
      setAssigning(false);
    }
  };

  /* ───────── render ───────── */
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* header */}
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <Typography variant="h5" fontWeight={600}>
          Assign Pending Orders
        </Typography>

        {/* delivery boy select */}
        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel>Select Delivery Boy</InputLabel>
          <Select
            label="Select Delivery Boy"
            value={selectedBoy}
            onChange={(e) => setSelectedBoy(e.target.value)}
          >
            {deliveryBoys.map((boy) => (
              <MenuItem key={boy._id} value={boy._id}>
                {boy.name} &nbsp;—&nbsp; {boy.phone}
              </MenuItem>
            ))}
            {deliveryBoys.length === 0 && (
              <MenuItem disabled>No active delivery boys</MenuItem>
            )}
          </Select>
        </FormControl>

        <div className="flex items-center gap-3">
          <Button
            startIcon={<MdLocalShipping size={20} />}
            variant="contained"
            disabled={assigning}
            onClick={handleAssign}
          >
            {assigning ? "Assigning…" : "Assign Selected"}
          </Button>
          <Tooltip title="Refresh">
            <IconButton onClick={loadData} disabled={loading || assigning}>
              <MdRefresh size={20} />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <CircularProgress />
        </div>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : orders.length === 0 ? (
        <Typography>No pending orders 🎉</Typography>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f7f7f7" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedOrders.length > 0 &&
                      selectedOrders.length < orders.length
                    }
                    checked={
                      orders.length > 0 &&
                      selectedOrders.length === orders.length
                    }
                    onChange={toggleAll}
                  />
                </TableCell>
                <TableCell>Order&nbsp;#</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Total&nbsp;($)</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o._id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedOrders.includes(o._id)}
                      onChange={() => toggleOne(o._id)}
                    />
                  </TableCell>
                  <TableCell>{o.orderNo || o._id.slice(-10)}</TableCell>
                  <TableCell>
                    {" "}
                    {o?.delivery_address?.address_line1 +
                      " " +
                      o?.delivery_address?.city +
                      " " +
                      o?.delivery_address?.landmark +
                      " " +
                      o?.delivery_address?.state}
                  </TableCell>
                  <TableCell>{o.totalAmt?.toLocaleString()}</TableCell>
                  {/* <TableCell>(o.createdAt).format("DD-MMM-YYYY")</TableCell> */}
                  <TableCell>{o.createdAt?.split("T")[0]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AssignOrders;
