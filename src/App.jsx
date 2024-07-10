import { useState, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import Loader from "./Loader";
import toast from "react-hot-toast";

function App() {
  const showToast = (message, isError = false) => {
    toast(message, {
      duration: 10000,
      style: {
        background: isError ? "#FF6F61" : "green",
        color: "white",
      },
      position: "top-center",
    });
  };

  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set the backend to WebGL
    tf.setBackend("webgl")
      .then(() => {
        showToast("WebGL backend set.", false);
      })
      .catch((err) => {
        showToast("Error setting WebGL backend:", true);
      });
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setImage(img);
      classifyImage(img);
    };
  };

  const classifyImage = async (img) => {
    try {
      setIsLoading(true);
      showToast("Loading MobileNet model...", false);
      const model = await mobilenet.load();
      showToast("Model loaded successfully.", false);

      showToast("Classifying image...", false);
      const predictions = await model.classify(img);

      setPredictions(predictions);
    } catch (error) {
      showToast("Error classifying image:", true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6">
      <h1 className="text-4xl font-bold mb-8">Image Predictor</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-6 p-2 border border-gray-300 rounded"
      />
      <div className="mb-6">
        {image && (
          <img src={image.src} alt="Uploaded" className="w-96 rounded shadow" />
        )}
      </div>
      <div className="text-center">
        {isLoading && <Loader />}
        {!isLoading && predictions.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Predictions:</h2>
            <ul className="list-disc list-inside text-left">
              {predictions.map((prediction, index) => (
                <li key={index} className="mb-2">
                  {prediction.className}: {prediction.probability.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <hr />
      <h1 className="text-2xl my-4">Like it?</h1>
      <a
        href=""
        className=" bg-black text-white p-4 cursor-pointer hover:bg-white hover:text-black my-4"
      >
        Clone this project here at my Git repo @Kisang 🚀🚀
      </a>
    </div>
  );
}

export default App;
