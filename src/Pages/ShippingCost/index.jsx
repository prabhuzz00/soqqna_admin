"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import toast from "react-hot-toast";
import { editDataCommon, fetchDataFromApi } from "../../utils/api";

const ShippingCostForm = () => {
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        deliveryFee: 0,
        FreeDeliveryFee: 0,
    });

    useEffect(() => {
        fetchDataFromApi(`/api/shipping-cost`)
            .then((res) => {
                setInitialLoading(false);
                if (res.success && res.data) {
                    setForm((prev) => ({ ...prev, ...res.data }));
                }
            })
            .catch((err) => {
                setInitialLoading(false);
                setError("Failed to fetch shipping settings");
                console.error("Error fetching shipping settings:", err);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Allow empty string while typing
        if (value === "") {
            setForm({ ...form, [name]: "" });
        } else if (!isNaN(value)) {
            setForm({ ...form, [name]: value });
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, parseFloat(value) || 0);  // fallback to 0 if empty
            });

            const res = await editDataCommon(`/api/shipping-cost`, formData);
            setLoading(false);

            if (!res.success) {
                setError(res.message || "Failed to save shipping settings");
                toast.error(res.message || "Failed to save shipping settings");
            } else {
                toast.success("Shipping settings saved successfully");
                if (res.data) {
                    setForm({ ...form, ...res.data });
                }
            }
        } catch (err) {
            setError("Server error while saving");
            toast.error("Server error while saving");
            console.error("Error saving shipping settings:", err);
        } finally {
            setLoading(false);
        }
    };
    

    if (initialLoading) return <div className="p-5 text-center">Loading...</div>;

    return (
        <div className="p-5 w-full mx-auto bg-white dark:bg-themeDark rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-[20px] font-[600]">Shipping Settings</h1>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="card dark:bg-themeDark p-5 dark:border-[rgba(255,255,255,0.1)]">
                    {/* Delivery Fee */}
                    <div className="mb-4">
                        <label className="block font-[500] text-gray-600 text-[14px] mb-1">
                            Delivery Fee
                        </label>
                        <input
                            type="number"
                            name="deliveryFee"
                            value={form.deliveryFee === 0 ? 0 : form.deliveryFee} 
                            onChange={handleInputChange}
                            className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
                            required
                        />
                    </div>

                    {/* Free Delivery Threshold */}
                    <div className="mb-4">
                        <label className="block font-[500] text-gray-600 text-[14px] mb-1">
                            Free Delivery Above
                        </label>
                        <input
                            type="number"
                            name="FreeDeliveryFee"
                            value={form.FreeDeliveryFee === 0 ? 0 : form.FreeDeliveryFee}
                            onChange={handleInputChange}
                            className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
                            required
                        />
                    </div>

                    <div className="flex gap-3 mt-5">
                        <Button type="submit" variant="contained" className="btn-dark" disabled={loading}>
                            {loading ? "Saving..." : "Save Shipping Settings"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ShippingCostForm;
