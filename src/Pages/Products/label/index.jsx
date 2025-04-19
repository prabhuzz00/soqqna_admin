import React, { useState, useContext, useEffect } from 'react';
import { Button } from '@mui/material';
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../../App';
import { fetchDataFromApi, deleteDataCommon } from '../../../utils/api';
import { useNavigate } from 'react-router-dom';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const columns = [
    { id: "index", label: "INDEX", minWidth: 80 },
    { id: "name", label: "NAME", minWidth: 100 },
    { id: "createdAt", label: "CREATED AT", minWidth: 150 },
    { id: "status", label: "STATUS", minWidth: 100 },
    { id: "action", label: "ACTION", minWidth: 120 },
];

const Labels = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(MyContext);
    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        setIsLoading(true);
        fetchDataFromApi("/api/labels/").then((res) => {
            if (res?.error === false) {
                setData(res?.data || []);
                console.log('Fetched labels:', res?.data);
            } else {
                console.error('Failed to fetch labels:', res?.message);
            }
            setIsLoading(false);
        }).catch((error) => {
            console.error('Error fetching labels:', error);
            setIsLoading(false);
        });
    };

    const deleteItem = (id) => {
        setIsLoading(true);
        console.log('Deleting label with ID:', id);
        deleteDataCommon(`/api/labels/${id}`).then((res) => {
            console.log('Delete response:', res);
            if (res && res.error === false) {
                context.alertBox("success", res?.message || "Label deleted successfully");
                setData(prevData => prevData.filter(item => item._id !== id));
            } else {
                console.warn('Unexpected response format or error:', res);
                context.alertBox("error", res?.message || "Failed to delete label");
                getData();
            }
            setIsLoading(false);
        }).catch((error) => {
            console.error('Error deleting label:', error);
            context.alertBox("error", "Network error: Failed to delete label");
            setIsLoading(false);
            getData();
        });
    };

    const editItem = (id) => {
        navigate(`/product/label/addLabel?edit=${id}`); // Redirect to AddLabel with edit ID
    };

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0 mt-3">
                <h2 className="text-[18px] font-[600]">
                    Labels
                </h2>
                <div className="col w-[75%] ml-auto flex items-center justify-end gap-3">
                    <Button 
                        className="btn-blue !text-white btn-sm"
                        onClick={() => navigate('/product/label/addLabel')}
                    >
                        Add Label
                    </Button>
                </div>
            </div>

            <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <div className="flex items-center justify-center w-full min-h-[400px]">
                                            <CircularProgress color="inherit" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data?.length > 0 ? (
                                data.map((item, index) => (
                                    <TableRow key={item._id}>
                                        <TableCell style={{ minWidth: columns[0].minWidth }}>
                                            <span className="font-[600]">{index+1}</span>
                                        </TableCell>
                                        <TableCell style={{ minWidth: columns[1].minWidth }}>
                                            <span className="font-[600]">{item?.name}</span>
                                        </TableCell>
                                        <TableCell style={{ minWidth: columns[2].minWidth }}>
                                            <span className="font-[600]">{new Date(item?.createdAt).toLocaleString()}</span>
                                        </TableCell>
                                        <TableCell style={{ minWidth: columns[3].minWidth }}>
                                            <span className="font-[600]">{item?.status}</span>
                                        </TableCell>
                                        <TableCell style={{ minWidth: columns[4].minWidth }}>
                                            <div className="flex items-center gap-1">
                                                <Button 
                                                    className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]" 
                                                    onClick={() => editItem(item._id)}
                                                    disabled={isLoading}
                                                >
                                                    <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                                                </Button>
                                                <Button 
                                                    className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]" 
                                                    onClick={() => deleteItem(item._id)}
                                                    disabled={isLoading}
                                                >
                                                    <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <div className="flex items-center justify-center w-full min-h-[400px]">
                                            No labels found
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};

export default Labels;