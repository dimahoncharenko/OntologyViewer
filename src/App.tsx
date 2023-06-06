// Imports libraries
import { Routes, Route } from "react-router-dom";

// Imports canvas elements
import { Scene } from "./canvas/Scene";
import { DetailedOntology } from "./pages/DetailedOntology";
import { Individual } from "./pages/Individual";
import { AddForm } from "./pages/AddForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Scene />} />
      <Route path="/add" element={<AddForm />} />
      <Route path="/:label" element={<DetailedOntology />} />
      <Route path="/individual/:name" element={<Individual />} />
    </Routes>
  );
}

export default App;
