import React, { useState, useEffect } from "react";
import { fetchDataFromApi } from "../../utils/api";

const CouponSummary = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchDataFromApi("/api/coupons/summary");
      console.log("CouponSummary - Response:", response);
      setSummary(response.data || []);
    } catch (err) {
      console.error("CouponSummary - Error:", err);
      setError(err?.error || "Failed to fetch coupon summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Coupon Usage Summary</h1>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Coupon Code</th>
              <th className="py-2 px-4 border-b text-left">Unique Users</th>
              <th className="py-2 px-4 border-b text-left">Total Usages</th>
              <th className="py-2 px-4 border-b text-left">
                Total Purchase Value
              </th>
              <th className="py-2 px-4 border-b text-left">Total Discount</th>
              <th className="py-2 px-4 border-b text-left">Order Count</th>
            </tr>
          </thead>
          <tbody>
            {summary.length === 0 && !loading ? (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                  No coupon usage data found
                </td>
              </tr>
            ) : (
              summary.map((item) => (
                <tr key={item.code} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{item.code}</td>
                  <td className="py-2 px-4 border-b">{item.uniqueUsers}</td>
                  <td className="py-2 px-4 border-b">{item.totalUsages}</td>
                  <td className="py-2 px-4 border-b">
                    $
                    {item.totalPurchaseValue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-4 border-b">
                    $
                    {item.totalDiscountValue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-4 border-b">{item.orderCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponSummary;
