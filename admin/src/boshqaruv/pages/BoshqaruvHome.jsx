// Boshqaruv bosh sahifasi — owner to'liq xarita editorini, mansabdor ko'rsatkichlarga yo'naltiriladi.
import { Navigate } from "react-router-dom";

import { useBoshqaruvMe } from "../hooks/useBoshqaruvMe";
import BoshqaruvXaritaPage from "./BoshqaruvXaritaPage";

const BoshqaruvHome = () => {
  const { data: me } = useBoshqaruvMe();
  if (me && me.role !== "owner") return <Navigate to="/boshqaruv/malumot" replace />;
  return <BoshqaruvXaritaPage />;
};

export default BoshqaruvHome;
