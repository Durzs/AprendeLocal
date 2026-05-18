import { useState } from "react";
import SchoolSelector from "./components/SchoolSelector";
import SchoolDashboard from "./components/SchoolDashboard";
import type { School } from "./types";
import "./App.css";

export default function App() {
  const [school, setSchool] = useState<School | null>(null);

  // Si no hay escuela seleccionada, mostrar selector
  if (!school) {
    return <SchoolSelector onSelectSchool={setSchool} />;
  }

  // Si hay escuela, mostrar dashboard
  return (
    <SchoolDashboard
      school={school}
      onChangeSchool={() => setSchool(null)}
    />
  );
}
