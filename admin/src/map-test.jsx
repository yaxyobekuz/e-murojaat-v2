// Vaqtinchalik test sahifa — MahallaMap'da dala tanlashni tekshirish. O'chiriladi.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import MahallaMap from "./owner/features/asosiy/components/MahallaMap";

const App = () => {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ height: "100vh" }}>
      <MahallaMap
        selectedId={selected?.id || null}
        activeFilter={null}
        onSelect={(el) => {
          setSelected(el);
          console.log("TEST onSelect:", JSON.stringify(el));
        }}
        onHover={() => {}}
      />
    </div>
  );
};

createRoot(document.getElementById("root")).render(<App />);
