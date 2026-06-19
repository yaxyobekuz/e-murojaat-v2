import { useNavigate } from "react-router-dom";
import { Home, MapPin, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useMyProperties } from "../hooks/useMyProperties";
import StatusBadge from "../components/StatusBadge";
import {
  PROPERTY_TYPE_LABELS,
  PROPERTY_TYPE_ICON_TONE,
} from "../constants/yer.ui";

const MyPropertiesPage = () => {
  const navigate = useNavigate();
  const { data: items, isLoading } = useMyProperties();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-1 text-xl font-semibold tracking-tight">Mening mulklarim</h1>
      <p className="mb-5 text-sm text-zinc-500">
        JSHSHIRingizga biriktirilgan ko'chmas mulk obyektlari
      </p>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Yuklanmoqda...</p>
      ) : !items?.length ? (
        <div className="rounded-[2px] border bg-white p-8 text-center text-sm text-zinc-400">
          Sizga biriktirilgan mulk topilmadi
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((p) => (
            <button
              key={p._id}
              onClick={() => navigate(`/owner/yer/mulk/${p._id}`)}
              className="flex w-full items-center gap-4 rounded-[2px] border bg-white p-4 text-left transition active:scale-[0.99] hover:border-emerald-200"
            >
              <div
                className={cn(
                  "flex size-12 flex-shrink-0 items-center justify-center rounded-[2px] bg-gradient-to-br text-white",
                  PROPERTY_TYPE_ICON_TONE[p.type] || "from-zinc-300 to-zinc-500",
                )}
              >
                <Home className="size-6" strokeWidth={1.5} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-zinc-900">
                    {PROPERTY_TYPE_LABELS[p.type] || p.type}
                  </h3>
                  <StatusBadge status={p.status} kind="property" />
                </div>
                <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-zinc-500">
                  <MapPin className="size-3.5" /> {p.region}, {p.district}
                </p>
                <p className="mt-0.5 text-xs tabular-nums text-zinc-400">
                  {p.cadastreNumber} · {p.areaM2} m² · {formatMoney(p.valueUzs)}
                </p>
              </div>

              <ChevronRight className="size-5 flex-shrink-0 text-zinc-300" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPropertiesPage;
