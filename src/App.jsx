import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Content from "./pages/Content";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/content" element={<Content />} />
      </Routes>
    </>
  );
}

export default App;
