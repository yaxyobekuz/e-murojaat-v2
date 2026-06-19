import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, FilePlus2 } from "lucide-react";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import { useProperty } from "../hooks/useMyProperties";
import StatusBadge from "../components/StatusBadge";
import {
  PROPERTY_TYPE_LABELS,
  OWNERSHIP_TYPE_LABELS,
} from "../constants/yer.ui";

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-2.5 text-sm">
    <span className="text-zinc-500">{label}</span>
    <span className="text-right font-medium text-zinc-900">{value}</span>
  </div>
);

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: p, isLoading } = useProperty(id);

  if (isLoading) return <div className="p-6 text-sm text-zinc-400">Yuklanmoqda...</div>;
  if (!p) return <div className="p-6 text-sm text-zinc-400">Mulk topilmadi</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="size-4" /> Orqaga
      </button>

      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-xl font-semibold tracking-tight">
          {PROPERTY_TYPE_LABELS[p.type] || p.type}
        </h1>
        <StatusBadge status={p.status} kind="property" />
      </div>

      <Card>
        <div className="divide-y">
          <Row label="Kadastr raqami" value={p.cadastreNumber} />
          <Row label="Manzil" value={p.address} />
          <Row label="Viloyat / tuman" value={`${p.region}, ${p.district}`} />
          <Row label="Maydon" value={`${p.areaM2} m²`} />
          <Row label="Qiymat" value={formatMoney(p.valueUzs)} />
          <Row label="Egalik turi" value={OWNERSHIP_TYPE_LABELS[p.ownershipType] || p.ownershipType} />
          <Row label="Ro'yxatga olingan" value={formatDateUz(p.registeredAt)} />
        </div>
      </Card>

      {/* Map placeholder (mock) */}
      <Card className="mt-4">
        <div className="flex h-40 items-center justify-center gap-2 rounded-[2px] bg-gradient-to-br from-emerald-50 to-zinc-50 text-sm text-zinc-400">
          <MapPin className="size-4" /> Xaritadagi joylashuv (demo)
        </div>
      </Card>

      <Link to={`/owner/yer/ariza?propertyId=${p._id}`} className="mt-4 block">
        <Button className="w-full">
          <FilePlus2 className="size-4" /> Shu mulk bo'yicha ariza berish
        </Button>
      </Link>
    </div>
  );
};

export default PropertyDetailPage;
