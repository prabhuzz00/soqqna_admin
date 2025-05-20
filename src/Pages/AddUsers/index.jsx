import React, { useState, useContext } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { FaCloudUploadAlt } from "react-icons/fa";
// import { FaCloudUploadAlt } from "react-icons/fa";

const AddUsers = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !password || !phone) {
      context.alertBox("error", "Please fill in all fields");
      setIsLoading(false);
      return;
    }

    const userData = { name, email, password, phone };

    try {
      const res = await postData(`/api/admin/register`, userData);
      if (res?.error === false) {
        setShowSuccessPopup(true);
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
      } else {
        context.alertBox("error", res?.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      context.alertBox("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopupConfirm = () => {
    setShowSuccessPopup(false);
    navigate("/users"); // Redirect to users list or appropriate page
  };

  return (
    <>
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[18px] font-[600]">Add User</h2>
      </div>

      <div className="card my-4 pt-5 pb-5 shadow-md sm:rounded-lg bg-white w-full lg:w-[65%]">
        <form className="form py-3 p-6" onSubmit={handleSubmit}>
          <div className="col mb-4">
            <h3 className="text-[14px] font-[500] mb-1 text-black">Name</h3>
            <input
              type="text"
              className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="col mb-4">
            <h3 className="text-[14px] font-[500] mb-1 text-black">Email</h3>
            <input
              type="email"
              className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="col mb-4">
            <h3 className="text-[14px] font-[500] mb-1 text-black">Password</h3>
            <input
              type="password"
              className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="col mb-4">
            <h3 className="text-[14px] font-[500] mb-1 text-black">Phone</h3>
            <input
              type="tel"
              className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">
            {isLoading ? (
              <CircularProgress color="inherit" />
            ) : (
              <>
                <FaCloudUploadAlt className="text-[25px] text-white" />
                Submit
              </>
            )}
          </Button>
        </form>
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Success</h3>
            <p>User added successfully!</p>
            <Button
              className="btn-blue !text-white btn-sm mt-4"
              onClick={handlePopupConfirm}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUsers;
