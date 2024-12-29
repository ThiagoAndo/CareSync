import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { useTesseract } from "./hooks/useTesseract";

function App() {
  const [image, setImage] = useState(null);
  const { recognize, result, error, isRecognizing } = useTesseract();
  const webcamRef = useRef(null);

  // Define the dimensions of the cropping square
  const squareSize = 200; // Size of the square
  const videoWidth = 640; // Webcam width
  const videoHeight = 480; // Webcam height

  // Capture a photo and crop to the square
  const capturePhoto = async () => {
    const screenshot = webcamRef.current.getScreenshot();

    if (screenshot) {
      // Create an off-screen canvas to crop the image
      const img = new Image();
      img.src = screenshot;

      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size to the square size
        canvas.width = squareSize;
        canvas.height = squareSize;

        // Calculate the square's position (centered)
        const offsetX = (videoWidth - squareSize) / 2;
        const offsetY = (videoHeight - squareSize) / 2;

        // Draw the cropped area onto the canvas
        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          squareSize,
          squareSize, // Source dimensions
          0,
          0,
          squareSize,
          squareSize // Target dimensions
        );

        // Get the cropped image as a base64 string
        const croppedImage = canvas.toDataURL("image/jpeg");
        setImage(croppedImage);

        // Pass the cropped image to the OCR function
        try {
          await recognize(croppedImage);
        } catch (err) {
          console.error("Recognition failed:", err);
        }
      };
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Tesseract.js OCR with Webcam</h1>
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Webcam Component */}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={videoWidth}
          height={videoHeight}
          style={{ border: "2px solid #000" }}
        />

        {/* Square Overlay */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: `${squareSize}px`,
            height: `${squareSize}px`,
            border: "2px solid red",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none", // Prevent interaction with the overlay
          }}
        ></div>
      </div>

      {/* Capture Button */}
      <button onClick={capturePhoto} style={{ marginTop: "20px" }}>
        Capture Photo & Recognize
      </button>

      {/* Display Cropped Image */}
      {image && (
        <div style={{ marginTop: "20px" }}>
          <h3>Cropped Image:</h3>
          <img
            src={image}
            alt="Cropped"
            style={{ maxWidth: "100%", maxHeight: "300px" }}
          />
        </div>
      )}

      {/* Status Messages */}
      {isRecognizing && <p>Processing image... Please wait.</p>}
      {result && (
        <div>
          <h3>Extracted Text:</h3>
          <p>{result}</p>
        </div>
      )}
      {error && (
        <div style={{ color: "red" }}>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
