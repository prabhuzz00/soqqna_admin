import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

/**
 * Props:
 * - open: boolean (show/hide modal)
 * - onClose: function (called when modal is closed)
 * - onScan: function(barcode: string) (called with barcode on successful scan)
 */
const BarcodeScanner = ({ open, onClose, onScan }) => {
  const [scannedBarcode, setScannedBarcode] = useState(null);

  // Reset scannedBarcode each time dialog is opened
  useEffect(() => {
    if (open) setScannedBarcode(null);
  }, [open]);

  // BarcodeScannerComponent calls onUpdate for every frame
  const handleUpdate = (err, result) => {
    // Only call onScan if a result is found and it's different from the previous one
    if (result && result.text && result.text !== scannedBarcode) {
      setScannedBarcode(result.text);
      // Clear previous query first, then set new value
      if (onScan) {
        onScan(result.text);
      }
      setTimeout(onClose, 400); // Close scanner after short delay
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Scan Barcode</DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <BarcodeScannerComponent
          width={250} // smaller scanner area
          height={100}
          onUpdate={handleUpdate}
        />
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <span>Point your camera at a barcode.</span>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BarcodeScanner;
