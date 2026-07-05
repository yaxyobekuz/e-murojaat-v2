// Kamera qo'shish formasi — IP, port, login, parol, kanal, joylashuv.
// Yuborilganda kamera avtomatik go2rtc'ga ulanadi va gridda jonli ko'rinadi.
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import { cn } from "@/shared/utils/cn";
import { useAddCamera } from "../hooks/useCameras";

const LOCATIONS = ["Mahalla kirishi", "IIB post", "Ko'cha", "Maktab", "FVV", "Jamoat", "Umumiy"];
const inputCls = "w-full rounded-lg border border-[rgb(var(--card-border))] bg-card/40 px-3 py-2 text-sm outline-none focus:border-brand-cyan/60";

const AddCameraForm = () => {
  const { name, ip, port, username, password, channel, location, setField, resetState } = useObjectState({
    name: "", ip: "", port: "554", username: "", password: "", channel: "102", location: "Mahalla kirishi",
  });
  const [error, setError] = useState("");
  const add = useAddCamera();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await add.mutateAsync({ name, ip, port: Number(port), username, password, channel, location });
      resetState();
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Kamera qo'shilmadi");
    }
  };

  return (
    <form onSubmit={submit} className="surface p-5">
      <h3 className="text-sm font-semibold">Yangi kamera qo'shish</h3>
      <p className="mt-0.5 text-xs text-foreground/45">Hikvision IP kamera — kiritilgach avtomatik ulanadi va jonli ko'rinadi</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs font-medium text-foreground/60">Nomi
          <input className={cn(inputCls, "mt-1")} value={name} onChange={(e) => setField("name", e.target.value)} placeholder="Masalan: Maktab-12 darvoza" required />
        </label>
        <label className="text-xs font-medium text-foreground/60">IP manzil
          <input className={cn(inputCls, "mt-1")} value={ip} onChange={(e) => setField("ip", e.target.value)} placeholder="192.168.1.64" required />
        </label>
        <label className="text-xs font-medium text-foreground/60">Port
          <input className={cn(inputCls, "mt-1")} value={port} onChange={(e) => setField("port", e.target.value)} placeholder="554" />
        </label>
        <label className="text-xs font-medium text-foreground/60">Foydalanuvchi
          <input className={cn(inputCls, "mt-1")} value={username} onChange={(e) => setField("username", e.target.value)} placeholder="admin" required />
        </label>
        <label className="text-xs font-medium text-foreground/60">Parol
          <input type="password" className={cn(inputCls, "mt-1")} value={password} onChange={(e) => setField("password", e.target.value)} placeholder="••••••••" required />
        </label>
        <label className="text-xs font-medium text-foreground/60">Kanal (oqim)
          <select className={cn(inputCls, "mt-1")} value={channel} onChange={(e) => setField("channel", e.target.value)}>
            <option value="102">102 — sub oqim (panel uchun)</option>
            <option value="101">101 — asosiy oqim (HD)</option>
          </select>
        </label>
        <label className="text-xs font-medium text-foreground/60">Joylashuv
          <select className={cn(inputCls, "mt-1")} value={location} onChange={(e) => setField("location", e.target.value)}>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
      </div>

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      <button type="submit" disabled={add.isPending} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-cyan/15 px-4 py-2 text-sm font-medium text-brand-cyan transition-colors hover:bg-brand-cyan/25 disabled:opacity-60">
        {add.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        {add.isPending ? "Ulanmoqda…" : "Kamera qo'shish"}
      </button>
    </form>
  );
};

export default AddCameraForm;
