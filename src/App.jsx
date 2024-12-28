import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { useTesseract } from "./hooks/useTesseract";
function App() {
  // State to store the captured image
  const [image, setImage] = useState(null);

  // Destructure values from the useTesseract hook
  const { recognize, result, error, isRecognizing } = useTesseract();

  // Ref to control the Webcam component
  const webcamRef = useRef(null);

  // Function to capture a photo from the webcam
  const capturePhoto = async () => {
    // Get a screenshot (base64 format) from the webcam
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot); // Set the captured image in state for display

    // Use the Tesseract.js hook to recognize text in the image
    try {
      await recognize(screenshot); // OCR process on the captured image
    } catch (err) {
      console.error("Recognition failed:", err); // Handle any OCR errors
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Tesseract.js OCR with Webcam</h1>

      {/* Webcam Component */}
      {/* Displays the live webcam feed */}
      <Webcam
        audio={false} // Disable audio
        ref={webcamRef} // Reference to control the webcam
        screenshotFormat="image/jpeg" // Format of the captured image
        style={{ width: "100%", maxWidth: "500px" }} // Styling for the webcam view
      />

      {/* Button to capture a photo */}
      <button onClick={capturePhoto} style={{ marginTop: "20px" }}>
        Capture Photo & Recognize
      </button>

      {/* Display the captured image */}
      {image && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={image} // The captured image as a source
            alt="Captured"
            style={{ maxWidth: "100%", maxHeight: "300px" }} // Styling for the image
          />
        </div>
      )}

      {/* Status messages */}
      {/* Show a message while processing the OCR */}
      {isRecognizing && <p>Processing image... Please wait.</p>}

      {/* Display the extracted text if recognition is successful */}
      {result && (
        <div>
          <h3>Extracted Text:</h3>
          <p>{result}</p>
        </div>
      )}

      {/* Show an error message if OCR fails */}
      {error && (
        <div style={{ color: "red" }}>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
