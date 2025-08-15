import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const BarcodeScanner = ({ open, onClose, onScan }) => {
  const [scannedBarcode, setScannedBarcode] = useState(null);

  useEffect(() => {
    if (open) setScannedBarcode(null);
  }, [open]);

  const handleUpdate = (err, result) => {
    if (result && result.text && result.text !== scannedBarcode) {
      setScannedBarcode(result.text);
      if (onScan) {
        onScan(result.text);
      }
      setTimeout(onClose, 400);
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
        <div style={{ position: "relative", width: 250, height: 180 }}>
          <BarcodeScannerComponent
            width={250}
            height={180}
            onUpdate={handleUpdate}
          />
          {/* Camera frame guide overlay */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "180px",
              height: "40px",
              transform: "translate(-50%, -50%)",
              border: "2px dashed #1976d2",
              borderRadius: "8px",
              pointerEvents: "none",
              boxSizing: "border-box",
              zIndex: 2,
            }}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <span>Place the barcode inside the frame.</span>
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
