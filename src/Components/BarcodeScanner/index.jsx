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
  const [scanned, setScanned] = useState(false);

  // Reset scanned flag each time dialog is opened
  useEffect(() => {
    if (open) setScanned(false);
  }, [open]);

  // BarcodeScannerComponent calls onUpdate for every frame
  const handleUpdate = (err, result) => {
    if (result && result.text && !scanned) {
      setScanned(true);
      onScan(result.text); // Pass barcode back to parent
      setTimeout(() => onClose(), 500); // Close scanner after short delay
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Scan Barcode</DialogTitle>
      <DialogContent>
        <BarcodeScannerComponent
          width={400}
          height={300}
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
