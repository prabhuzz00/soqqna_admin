import React, { useState, useContext, useEffect } from 'react';
import { Button } from '@mui/material';
import { FaCloudUploadAlt } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../../../App';
import { fetchDataFromApi, postData, editDataCommon } from '../../../../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';

const AddTag = () => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('active');
    const [isLoading, setIsLoading] = useState(false);
    const [editId, setEditId] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const context = useContext(MyContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const editIdFromQuery = query.get('edit');
        if (editIdFromQuery) {
            fetchDataFromApi(`/api/tags/`).then((res) => {
                if (res?.error === false) {
                    const tagToEdit = res.data.find(item => item._id === editIdFromQuery);
                    if (tagToEdit) {
                        setName(tagToEdit.name || '');
                        setStatus(tagToEdit.status || 'active');
                        setEditId(tagToEdit._id || editIdFromQuery);
                    }
                }
            }).catch((error) => {
                console.error('Error fetching tag for edit:', error);
            });
        }
    }, [location.search]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (name === "") {
            context.alertBox("error", "Please enter tag name");
            setIsLoading(false);
            return false;
        }

        const tagData = {
            name: name,
            status: status
        };

        if (editId === "") {
            console.log('Creating tag with data:', tagData);
            postData(`/api/tags/create`, tagData).then((res) => {
                console.log('Create response:', res);
                if (res?.error === false) {
                    setShowSuccessPopup(true);
                    setIsLoading(false);
                    setName('');
                    setStatus('active');
                } else {
                    context.alertBox("error", res?.message || "Failed to create tag");
                    setIsLoading(false);
                }
            }).catch((error) => {
                console.error('Error creating tag:', error);
                setIsLoading(false);
                context.alertBox("error", "Failed to create tag");
            });
        } else {
            console.log('Updating tag with ID:', editId, 'and data:', tagData);
            editDataCommon(`/api/tags/${editId}`, tagData).then((res) => {
                console.log('Update response:', res);
                if (res?.error === false) {
                    setShowSuccessPopup(true);
                    setIsLoading(false);
                    setName('');
                    setStatus('active');
                    // setEditId('');
                } else {
                    context.alertBox("error", res?.message || "Failed to update tag");
                    setIsLoading(false);
                }
            }).catch((error) => {
                console.error('Error updating tag:', error);
                setIsLoading(false);
                context.alertBox("error", "Failed to update tag");
            });
        }
    };

    const handlePopupConfirm = () => {
        setShowSuccessPopup(false);
        navigate('/product/tags'); // Redirect to Tags page
    };

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0 mt-3">
                <h2 className="text-[18px] font-[600]">
                    Add Tag
                </h2>
            </div>

            <div className="card my-4 pt-5 pb-5 shadow-md sm:rounded-lg bg-white w-[100%] sm:w-[100%] lg:w-[65%]">
                <form className='form py-3 p-6' onSubmit={handleSubmit}>
                    <div className='col mb-4'>
                        <h3 className='text-[14px] font-[500] mb-1 text-black'>TAG NAME</h3>
                        <input 
                            type="text" 
                            className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm' 
                            name="name" 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                        />
                    </div>

                    <div className='col mb-4'>
                        <h3 className='text-[14px] font-[500] mb-1 text-black'>STATUS</h3>
                        <select 
                            className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">
                        {isLoading ? <CircularProgress color="inherit" /> :
                            <>
                                <FaCloudUploadAlt className='text-[25px] text-white' />
                                Publish and View
                            </>
                        }
                    </Button>
                </form>
            </div>

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold">Success</h3>
                        <p>Tag {editId ? 'updated' : 'added'} successfully!</p>
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

export default AddTag;