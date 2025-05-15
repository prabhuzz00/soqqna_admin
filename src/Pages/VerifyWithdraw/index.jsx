import React, { useEffect, useState, useContext } from "react";
import { Select, MenuItem, Pagination } from "@mui/material";
import SearchBox from "../../Components/SearchBox";
import { fetchDataFromApi, editData } from "../../utils/api";
import { MyContext } from "../../App.jsx";

const Withdrawal = () => {
  const context = useContext(MyContext);
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const LIMIT = 10;

  const fetchWithdrawals = async () => {
    context?.setProgress(50);
    const res = await fetchDataFromApi(
      `/api/withdrawal/admin-withdrawals?page=${page}&limit=${LIMIT}`
    );
    if (res && res.success) {
      setWithdrawals(res.data);
      setFilteredData(res.data);
      setTotalPages(Math.ceil(res.count / LIMIT) || 1);
    }
    context?.setProgress(100);
  };

  const handleStatusChange = async (e, id) => {
    const newStatus = e.target.value;
    const res = await editData(`/api/withdrawal/withdraw-status/${id}`, {
      id,
      withdrawal_status: newStatus,
    });

    if (res && !res.error) {
      context.alertBox("success", res.message);
      fetchWithdrawals();
    } else {
      context.alertBox("error", res.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [page]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = withdrawals.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(withdrawals);
    }
  }, [searchQuery, withdrawals]);

  return (
    <div className="card my-4 shadow-md rounded-lg bg-white p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Withdrawals</h2>
        <SearchBox
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPageWithdraw={setPage}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-2">Transacrion ID</th>
              <th className="px-4 py-2">Vendor Name</th>
              <th className="px-4 py-2">Shop Name</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Bank Name</th>
              <th className="px-4 py-2">Account No</th>
              <th className="px-4 py-2">IFSC</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((withdrawal) => (
                <tr key={withdrawal._id} className="border-t">
                  <td className="px-4 py-2">{withdrawal._id}</td>
                  <td className="px-4 py-2">
                    {withdrawal.vendorId?.ownerName}
                  </td>
                  <td className="px-4 py-2">
                    {withdrawal.vendorId?.storeName}
                  </td>
                  <td className="px-4 py-2">{withdrawal.withdrawal_amt}</td>
                  <td className="px-4 py-2">
                    {withdrawal.bank_details?.bankname || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {withdrawal.bank_details?.accountNo || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {withdrawal.bank_details?.IFSC || "-"}
                  </td>
                  <td className="px-4 py-2">
                    <Select
                      value={withdrawal.withdrawal_status || "Pending"}
                      size="small"
                      onChange={(e) => handleStatusChange(e, withdrawal._id)}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No withdrawals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            showFirstButton
            showLastButton
          />
        </div>
      )}
    </div>
  );
};

export default Withdrawal;
