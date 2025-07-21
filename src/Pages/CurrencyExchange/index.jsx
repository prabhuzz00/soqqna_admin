// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@mui/material";
// import toast from 'react-hot-toast';
// import { editDataCommon, fetchDataFromApi } from "../../utils/api";

// const CurrencyExchangeForm = () => {
//     const [loading, setLoading] = useState(false);
//     const [initialLoading, setInitialLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Predefined currencies
//     const predefinedCurrencies = [
//         { name: "Saudi Arabia (SAR)", key: "saudi" },
//         { name: "UAE (AED)", key: "uae" },
//         { name: "Qatar (QAR)", key: "qatar" },
//         { name: "Bahrain (BHD)", key: "bahrain" },
//         { name: "Kuwait (KWD)", key: "kuwait" },
//         { name: "Euro (EUR)", key: "euro" },
//         { name: "Dollar (USD)", key: "dollar" },
//         { name: "Syrian Pounds (SYP)", key: "syrian" }
//     ];

//     const [currencyRates, setCurrencyRates] = useState(
//         predefinedCurrencies.reduce((acc, curr) => ({
//             ...acc,
//             [curr.key]: ""
//         }), {})
//     );

//     useEffect(() => {
//         fetchDataFromApi(`/api/currency-rates`).then((res) => {
//             setInitialLoading(true);
//             if (res.success && res.data) {
//                 // Merge fetched data with predefined structure
//                 const updatedRates = { ...currencyRates };
//                 res.data.forEach(rate => {
//                     if (updatedRates.hasOwnProperty(rate.currencyKey)) {
//                         updatedRates[rate.currencyKey] = rate.rate.toString();
//                     }
//                 });
//                 setCurrencyRates(updatedRates);
//             }
//             setInitialLoading(false);
//         })
//         .catch((err) => {
//             setError("Failed to fetch currency rates");
//             console.error("Error fetching currency rates:", err);
//             setInitialLoading(false);
//         });
//     }, []);

//     const handleInputChange = (key, value) => {
//         setCurrencyRates(prev => ({
//             ...prev,
//             [key]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         try {
//             // Convert currencyRates object to array format for API
//             const currencyData = predefinedCurrencies.map(currency => ({
//                 currencyKey: currency.key,
//                 currencyName: currency.name,
//                 rate: parseFloat(currencyRates[currency.key]) || 0
//             }));

//             const response = await editDataCommon(`/api/currency-rates`, { currencies: currencyData });
            
//             if (!response.success) {
//                 setError(response.message || "Failed to save currency rates");
//                 toast.error(response.message || "Failed to save currency rates");
//             } else {
//                 toast.success("Currency rates saved successfully");
//             }

//         } catch (err) {
//             setError("Server error while saving");
//             toast.error("Server error while saving");
//             console.error("Error saving currency rates:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (initialLoading) return <div className="p-5 text-center">Loading...</div>;

//     return (
//         <div className="p-5 w-full mx-auto bg-white dark:bg-themeDark rounded-lg shadow-md">
//             <div className="flex items-center justify-between mb-4">
//                 <h1 className="text-[20px] font-[600]">Currency Exchange Rates</h1>
//                 {/* TODO: Add New Currency Button - Currently Commented */}
//                 {/* <Button variant="outlined" className="btn-outline">
//                     + Add Currency
//                 </Button> */}
//             </div>

//             {error && (
//                 <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
//                     {error}
//                 </div>
//             )}

//             <form onSubmit={handleSubmit}>
//                 <div className="card dark:bg-themeDark p-5 dark:border-[rgba(255,255,255,0.1)]">
//                     <h2 className="text-[18px] font-[600] mb-4">Exchange Rates</h2>
//                     <p className="text-gray-600 text-[14px] mb-6">
//                         Set exchange rates for different currencies. Enter the rate value relative to your base currency.
//                     </p>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {predefinedCurrencies.map((currency) => (
//                             <div className="mb-4" key={currency.key}>
//                                 <label className="block font-[500] text-gray-600 text-[14px] mb-1">
//                                     {currency.name}
//                                 </label>
//                                 <input
//                                     type="number"
//                                     step="0.001"
//                                     min="0"
//                                     value={currencyRates[currency.key]}
//                                     onChange={(e) => handleInputChange(currency.key, e.target.value)}
//                                     placeholder="Enter exchange rate"
//                                     className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
//                                 />
//                             </div>
//                         ))}
//                     </div>

//                     <div className="flex gap-3 mt-6">
//                         <Button type="submit" variant="contained" className="btn-dark" disabled={loading}>
//                             {loading ? "Saving..." : "Save Exchange Rates"}
//                         </Button>
//                         <Button 
//                             type="button" 
//                             variant="outlined" 
//                             className="btn-outline"
//                             onClick={() => {
//                                 setCurrencyRates(predefinedCurrencies.reduce((acc, curr) => ({
//                                     ...acc,
//                                     [curr.key]: ""
//                                 }), {}));
//                             }}
//                         >
//                             Reset
//                         </Button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default CurrencyExchangeForm;


"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import toast from 'react-hot-toast';
import { editDataCommon, fetchDataFromApi } from "../../utils/api";

const CurrencyExchangeForm = () => {
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    // Predefined currencies
    const predefinedCurrencies = [
        { name: "Saudi Arabia (SAR)", key: "saudi" },
        { name: "UAE (AED)", key: "uae" },
        { name: "Qatar (QAR)", key: "qatar" },
        { name: "Bahrain (BHD)", key: "bahrain" },
        { name: "Kuwait (KWD)", key: "kuwait" },
        { name: "Euro (EUR)", key: "euro" },
        { name: "Dollar (USD)", key: "dollar" },
        { name: "Syrian Pounds (SYP)", key: "syrian" }
    ];

    const [currencyRates, setCurrencyRates] = useState(
        predefinedCurrencies.reduce((acc, curr) => ({
            ...acc,
            [curr.key]: ""
        }), {})
    );

    useEffect(() => {
        // Fetch admin format data (without format=client parameter)
        fetchDataFromApi(`/api/currency-rates`).then((res) => {
            setInitialLoading(true);
            if (res.success && res.data) {
                // Merge fetched data with predefined structure
                const updatedRates = { ...currencyRates };
                res.data.forEach(rate => {
                    if (updatedRates.hasOwnProperty(rate.currencyKey)) {
                        updatedRates[rate.currencyKey] = rate.rate.toString();
                    }
                });
                setCurrencyRates(updatedRates);
            }
            setInitialLoading(false);
        })
            .catch((err) => {
                setError("Failed to fetch currency rates");
                console.error("Error fetching currency rates:", err);
                setInitialLoading(false);
            });
    }, []);

    const handleInputChange = (key, value) => {
        setCurrencyRates(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Convert currencyRates object to array format for API
            const currencyData = predefinedCurrencies.map(currency => ({
                currencyKey: currency.key,
                currencyName: currency.name,
                rate: parseFloat(currencyRates[currency.key]) || 0
            }));

            const response = await editDataCommon(`/api/currency-rates`, { currencies: currencyData });

            if (!response.success) {
                setError(response.message || "Failed to save currency rates");
                toast.error(response.message || "Failed to save currency rates");
            } else {
                toast.success("Currency rates saved successfully");
            }

        } catch (err) {
            setError("Server error while saving");
            toast.error("Server error while saving");
            console.error("Error saving currency rates:", err);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="p-5 text-center">Loading...</div>;

    return (
        <div className="p-5 w-full mx-auto bg-white dark:bg-themeDark rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-[20px] font-[600]">Currency Exchange Rates</h1>
                {/* TODO: Add New Currency Button - Currently Commented */}
                {/* <Button variant="outlined" className="btn-outline">
                    + Add Currency
                </Button> */}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="card dark:bg-themeDark p-5 dark:border-[rgba(255,255,255,0.1)]">
                    <h2 className="text-[18px] font-[600] mb-4">Exchange Rates</h2>
                    <p className="text-gray-600 text-[14px] mb-6">
                        Set exchange rates for different currencies. Enter the rate value relative to your base currency.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {predefinedCurrencies.map((currency) => (
                            <div className="mb-4" key={currency.key}>
                                <label className="block font-[500] text-gray-600 text-[14px] mb-1">
                                    {currency.name}
                                </label>
                                <input
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    value={currencyRates[currency.key]}
                                    onChange={(e) => handleInputChange(currency.key, e.target.value)}
                                    placeholder="Enter exchange rate"
                                    className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] px-3 rounded-md bg-gray-100 outline-none focus:border-[rgba(0,0,0,0.5)]"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Button type="submit" variant="contained" className="btn-dark" disabled={loading}>
                            {loading ? "Saving..." : "Save Exchange Rates"}
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            className="btn-outline"
                            onClick={() => {
                                setCurrencyRates(predefinedCurrencies.reduce((acc, curr) => ({
                                    ...acc,
                                    [curr.key]: ""
                                }), {}));
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CurrencyExchangeForm;