import { Link } from "react-router-dom";
import { Gauge, Wallet, LineChart, Zap } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import { useMyAccount } from "../hooks/useMyAccount";
import StatusBadge from "../components/StatusBadge";
import { METER_TYPE_LABELS } from "../constants/svet.ui";

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-2.5 text-sm">
    <span className="text-zinc-500">{label}</span>
    <span className="text-right font-medium text-zinc-900">{value}</span>
  </div>
);

const SocialNorm = ({ usage = [], norm = 0 }) => {
  const last = usage[usage.length - 1];
  const used = last?.usageKwh || 0;
  const pct = norm > 0 ? Math.round((used / norm) * 100) : 0;
  const over = pct > 100;
  return (
    <Card>
      <div className="mb-2 flex items-center gap-2">
        <Zap className="size-4 text-amber-500" />
        <h3 className="font-semibold">Ijtimoiy norma</h3>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className={cn("h-full rounded-full", over ? "bg-rose-500" : "bg-amber-500")}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-zinc-600">
        Bu oyda normangizning{" "}
        <span className={cn("font-semibold", over && "text-rose-600")}>{pct}%</span>{" "}
        ini ishlatdingiz ({used} / {norm} kVt·soat)
      </p>
    </Card>
  );
};

const MyAccountPage = () => {
  const { data, isLoading } = useMyAccount();

  if (isLoading) {
    return <div className="p-6 text-sm text-zinc-400">Yuklanmoqda...</div>;
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="mb-5 text-xl font-semibold tracking-tight">
          Mening elektr hisobim
        </h1>
        <div className="rounded-[2px] border bg-white p-8 text-center text-sm text-zinc-400">
          Sizga elektr hisobi biriktirilmagan
        </div>
      </div>
    );
  }

  const { subscriber: s, usage } = data;

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Mening elektr hisobim</h1>
        <StatusBadge status={s.status} kind="subscriber" />
      </div>

      <Card>
        <div className="divide-y">
          <Row
            label="Shaxsiy hisob"
            value={<span className="tabular-nums">{s.accountNumber}</span>}
          />
          <Row label="F.I.Sh." value={s.fullName} />
          <Row label="Viloyat / tuman" value={`${s.region}, ${s.district}`} />
          <Row label="Manzil" value={s.address} />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-zinc-500">Balans</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-zinc-900">
            {formatMoney(s.balanceUzs)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Qarzdorlik</p>
          <p
            className={cn(
              "mt-1 text-lg font-semibold tabular-nums",
              s.debtUzs > 0 ? "text-rose-600" : "text-zinc-900",
            )}
          >
            {formatMoney(s.debtUzs)}
          </p>
        </Card>
      </div>

      <SocialNorm usage={usage} norm={s.socialNormKwh} />

      <Card>
        <div className="mb-2 flex items-center gap-2">
          <Gauge className="size-4 text-amber-500" />
          <h3 className="font-semibold">Hisoblagich</h3>
        </div>
        <div className="divide-y">
          <Row label="Seriya raqami" value={s.meter?.serialNumber} />
          <Row label="Turi" value={METER_TYPE_LABELS[s.meter?.type] || s.meter?.type} />
          <Row
            label="Keyingi qiyoslash"
            value={formatDateUz(s.meter?.calibrationDue)}
          />
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/owner/elektr/tolov">
          <Button className="w-full">
            <Wallet className="size-4" /> To'lov qilish
          </Button>
        </Link>
        <Link to="/owner/elektr/sarf">
          <Button variant="outline" className="w-full">
            <LineChart className="size-4" /> Sarf monitoringi
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MyAccountPage;
