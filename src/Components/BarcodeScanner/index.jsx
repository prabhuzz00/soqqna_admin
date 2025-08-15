// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import CircularProgress from "@mui/material/CircularProgress";

// export default function BarcodeScanner({ onComplete, onCancel }) {
//   const [scannerStarted, setScannerStarted] = useState(false);
//   const [scannerError, setScannerError] = useState("");
//   const html5QrCode = useRef(null);
//   const scannedRef = useRef(false);
//   const [containerId] = useState(
//     () => `scanner-container-${Date.now()}-${Math.random()}`
//   );

//   useEffect(() => {
//     let isMounted = true;
//     let timeoutId;

//     async function startScanner() {
//       setScannerError("");
//       setScannerStarted(false);
//       scannedRef.current = false;

//       // Cleanup previous scanner
//       if (html5QrCode.current) {
//         try {
//           await html5QrCode.current.stop();
//           await html5QrCode.current.clear();
//         } catch (err) {}
//         html5QrCode.current = null;
//       }

//       await new Promise((resolve) => setTimeout(resolve, 200));

//       if (isMounted) {
//         const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import(
//           "html5-qrcode"
//         );
//         html5QrCode.current = new Html5Qrcode(containerId);

//         const config = {
//           fps: 10,
//           qrbox: { width: 250, height: 100 },
//           formatsToSupport: [
//             Html5QrcodeSupportedFormats.CODE_128,
//             Html5QrcodeSupportedFormats.EAN_13,
//             Html5QrcodeSupportedFormats.EAN_8,
//             Html5QrcodeSupportedFormats.UPC_A,
//             Html5QrcodeSupportedFormats.UPC_E,
//             Html5QrcodeSupportedFormats.CODE_39,
//             Html5QrcodeSupportedFormats.CODE_93,
//           ],
//           rememberLastUsedCamera: true,
//           aspectRatio: 4 / 3,
//         };

//         const onScanSuccess = (decodedText) => {
//           if (scannedRef.current) return;
//           scannedRef.current = true;
//           if (onComplete) onComplete(decodedText);
//           handleClose();
//         };

//         try {
//           await html5QrCode.current.start(
//             { facingMode: "environment" },
//             config,
//             onScanSuccess,
//             (errorMessage) => {}
//           );
//           setScannerStarted(true);
//         } catch (err) {
//           setScannerError(
//             "Failed to start camera. Please check permissions and try again."
//           );
//           setScannerStarted(false);
//           if (html5QrCode.current) {
//             try {
//               await html5QrCode.current.clear();
//             } catch (err) {}
//             html5QrCode.current = null;
//           }
//         }

//         timeoutId = setTimeout(async () => {
//           if (!scannerStarted) {
//             setScannerError(
//               "Camera initialization timed out. Please close and try again."
//             );
//             if (html5QrCode.current) {
//               try {
//                 await html5QrCode.current.clear();
//               } catch (err) {}
//               html5QrCode.current = null;
//             }
//           }
//         }, 10000);
//       }
//     }

//     startScanner();

//     return () => {
//       isMounted = false;
//       clearTimeout(timeoutId);
//       if (html5QrCode.current) {
//         html5QrCode.current.stop().catch(() => {});
//         html5QrCode.current.clear().catch(() => {});
//         html5QrCode.current = null;
//       }
//       setScannerStarted(false);
//     };
//   }, []);

//   const handleClose = async () => {
//     if (html5QrCode.current) {
//       try {
//         await html5QrCode.current.stop();
//         await html5QrCode.current.clear();
//       } catch (err) {}
//       html5QrCode.current = null;
//     }
//     if (onCancel) onCancel();
//     setScannerError("");
//     setScannerStarted(false);
//   };

//   return (
//     <div className="fixed top-0 left-0 w-full h-full bg-[#000000dd] z-50 flex flex-col justify-center items-center">
//       <div className="bg-white rounded-lg p-4 shadow-lg max-w-md w-full mx-4">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">Scan Barcode</h3>
//           <Button
//             onClick={handleClose}
//             className="!min-w-[30px] !w-[30px] !h-[30px] !text-gray-600"
//           >
//             ✕
//           </Button>
//         </div>

//         {scannerError ? (
//           <div className="text-center p-4">
//             <div className="text-red-500 mb-4 text-sm">{scannerError}</div>
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={handleClose}
//               className="!text-gray-600 !border-gray-400"
//             >
//               Cancel
//             </Button>
//           </div>
//         ) : (
//           <div className="relative">
//             <div
//               id={containerId}
//               className="w-full bg-black rounded-lg overflow-hidden relative"
//               style={{
//                 position: "relative",
//                 width: "100%",
//                 height: "50vh",
//                 minHeight: "256px",
//                 maxHeight: "400px",
//               }}
//             >
//               {!scannerStarted && (
//                 <div className="absolute inset-0 flex items-center justify-center text-white z-10">
//                   <CircularProgress size={24} style={{ color: "white" }} />
//                   <span className="ml-2">Initializing camera...</span>
//                 </div>
//               )}
//             </div>
//             {scannerStarted && (
//               <div className="absolute inset-0 pointer-events-none z-20 flex justify-center items-center">
//                 <div className="w-[80%] max-w-[250px] h-20 border-2 border-green-500 bg-transparent rounded"></div>
//               </div>
//             )}
//             <p className="text-center mt-2 text-sm text-gray-600">
//               {scannerStarted
//                 ? "Position barcode in the frame"
//                 : "Initializing camera..."}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
