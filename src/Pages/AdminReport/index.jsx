"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
} from "@mui/material";
import { fetchDataFromApi } from "../../utils/api"; // adjust path as needed

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const StatCard = ({ label, value }) => (
  <Card elevation={3} sx={{ height: 120 }}>
    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={600}>
        {value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
      </Typography>
    </CardContent>
  </Card>
);

/**
 * AdminReport.jsx — professional dashboard component
 * Shows:
 *   • Stat cards — gross totals
 *   • BarChart — Monthly gross sales ($)
 *   • LineChart — Monthly user on-boarding
 *   • StackedBarChart — Vendor vs Admin sales per month
 *   • BarChart — Commission earned per month
 *   • PieChart — Order-status distribution (aggregate)
 */
const AdminReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReport = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchDataFromApi("/api/report/summary");
      setReport(res.data);
    } catch (err) {
      console.error("AdminReport - Error:", err);
      setError(err?.error || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  /* ————— STATE RENDERS ————— */
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={8}>
        {error}
      </Typography>
    );
  }

  if (!report) return null;

  /* ————— DATA MASSAGE ————— */
  const salesMonthly = report.sales.monthly.map((m) => ({
    name: m.month,
    total: m.totalAmount,
  }));

  const usersMonthly = report.users.monthly.map((m) => ({
    name: m.month,
    users: m.totalUsers,
  }));

  const vendorAdminMonthly = report.sales.monthly.map((m) => ({
    name: m.month,
    vendor: m.vendorSales,
    admin: m.adminSales,
  }));

  const commissionMonthly = report.sales.monthly.map((m) => ({
    name: m.month,
    commission: m.commission,
  }));

  const aggregate = report.sales.yearly.reduce(
    (acc, y) => ({
      gross: acc.gross + y.totalAmount,
      vendor: acc.vendor + y.vendorSales,
      admin: acc.admin + y.adminSales,
      commission: acc.commission + y.commission,
    }),
    { gross: 0, vendor: 0, admin: 0, commission: 0 }
  );

  const orderStatusAggregate = report.sales.monthly.reduce(
    (acc, m) => ({
      pending: acc.pending + m.pendingOrders,
      delivered: acc.delivered + m.deliveredOrders,
      returned: acc.returned + m.returnedOrders,
    }),
    { pending: 0, delivered: 0, returned: 0 }
  );

  const statusData = [
    { name: "Pending", value: orderStatusAggregate.pending },
    { name: "Delivered", value: orderStatusAggregate.delivered },
    { name: "Returned", value: orderStatusAggregate.returned },
  ];

  /* ————— RENDER ————— */
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Dashboard Reports
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Gross Sales ($)" value={aggregate.gross} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Seller Sales ($)" value={aggregate.vendor} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Admin Sales ($)" value={aggregate.admin} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Commission Earned ($)"
            value={aggregate.commission}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Bar — Monthly Gross Sales */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: 400 }}>
            <CardHeader title="Monthly Gross Sales ($)" sx={{ pb: 0 }} />
            <CardContent sx={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesMonthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(v) => v.toLocaleString()} />
                  <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Line — Monthly User On-boarding */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: 400 }}>
            <CardHeader title="Monthly User On-boarding" sx={{ pb: 0 }} />
            <CardContent sx={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usersMonthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#82ca9d"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Stacked Bar — Vendor vs Admin */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: 400 }}>
            <CardHeader title="Seller vs Admin Sales ($)" sx={{ pb: 0 }} />
            <CardContent sx={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vendorAdminMonthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(v) => v.toLocaleString()} />
                  <Legend />
                  <Bar
                    dataKey="vendor"
                    stackId="a"
                    fill="#8884d8"
                    name="Vendor"
                  />
                  <Bar
                    dataKey="admin"
                    stackId="a"
                    fill="#82ca9d"
                    name="Admin"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar — Commission Earned */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: 400 }}>
            <CardHeader title="Commission Earned ($)" sx={{ pb: 0 }} />
            <CardContent sx={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commissionMonthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(v) => v.toLocaleString()} />
                  <Bar dataKey="commission" fill="#ffc658" name="Commission" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie — Order Status */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: 400 }}>
            <CardHeader title="Order Status Distribution" sx={{ pb: 0 }} />
            <CardContent sx={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminReport;
