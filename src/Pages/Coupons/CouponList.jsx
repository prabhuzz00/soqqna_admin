import { useState, useEffect } from "react";
import { deleteData, fetchDataFromApi, postData2 } from "../../utils/api";

export default function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    expiryDate: "",
    usageLimit: "",
  });
  const [formError, setFormError] = useState("");
  const [editingCouponId, setEditingCouponId] = useState(null);

  const fetchCoupons = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchDataFromApi(
        `/api/coupons?page=${page}&limit=10&isActive=true`
      );
      setCoupons(response.coupons || []);
      setTotalPages(response.pages || 1);
    } catch (err) {
      setError(err?.error || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const url = editingCouponId
      ? `/api/coupons/${editingCouponId}`
      : "/api/coupons/create";

    const method = editingCouponId ? "PUT" : "POST";

    try {
      const response = await postData2(url, formData, method);
      if (response.error) {
        setFormError(response.error);
      } else {
        closeModal();
        fetchCoupons(); // Refresh the coupon list
      }
    } catch (err) {
      setFormError("Failed to submit coupon");
    }
  };

  const handleEditCoupon = (coupon) => {
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscountAmount: coupon.maxDiscountAmount,
      expiryDate: coupon.expiryDate.split("T")[0],
      usageLimit: coupon.usageLimit,
    });
    setEditingCouponId(coupon._id);
    setIsModalOpen(true);
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteData(`/api/coupons/${couponId}`);
      fetchCoupons(); // refresh list
    } catch (err) {
      alert("Failed to delete coupon");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError("");
    setEditingCouponId(null);
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxDiscountAmount: "",
      expiryDate: "",
      usageLimit: "",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Coupon Codes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Coupon
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Code</th>
              <th className="py-2 px-4 border-b text-left">Discount</th>
              <th className="py-2 px-4 border-b text-left">Min Order</th>
              <th className="py-2 px-4 border-b text-left">Max Discount</th>
              <th className="py-2 px-4 border-b text-left">Expiry Date</th>
              <th className="py-2 px-4 border-b text-left">Usage</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && !loading ? (
              <tr>
                <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                  No coupons found
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{coupon.code}</td>
                  <td className="py-2 px-4 border-b">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `$${coupon.discountValue}`}
                  </td>
                  <td className="py-2 px-4 border-b">
                    ${coupon.minOrderAmount}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {coupon.maxDiscountAmount
                      ? `$${coupon.maxDiscountAmount}`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {coupon.usedCount}/{coupon.usageLimit || "∞"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        coupon.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => handleEditCoupon(coupon)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingCouponId ? "Edit Coupon" : "Create Coupon"}
            </h2>
            {formError && <p className="text-red-500 mb-4">{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Coupon Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Discount Value
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Minimum Order Amount
                </label>
                <input
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Maximum Discount Amount
                </label>
                <input
                  type="number"
                  name="maxDiscountAmount"
                  value={formData.maxDiscountAmount}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Usage Limit</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  min="1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editingCouponId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
