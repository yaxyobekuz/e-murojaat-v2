import { useSearchParams, useNavigate } from "react-router-dom";
import useObjectState from "@/shared/hooks/useObjectState";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import Select from "@/shared/components/ui/select/Select";
import { useMyProperties } from "../hooks/useMyProperties";
import { useCreateRequest } from "../hooks/useCreateRequest";
import {
  SERVICE_TYPE_OPTIONS,
  PROPERTY_TYPE_LABELS,
} from "../constants/yer.ui";

const NewRequestPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: properties } = useMyProperties();
  const create = useCreateRequest();

  const { serviceType, propertyId, setField } = useObjectState({
    serviceType: "",
    propertyId: searchParams.get("propertyId") || "",
  });

  const propertyOptions = [
    { value: "", label: "Tanlanmagan (umumiy)" },
    ...(properties || []).map((p) => ({
      value: p._id,
      label: `${PROPERTY_TYPE_LABELS[p.type] || p.type} — ${p.cadastreNumber}`,
    })),
  ];

  const submit = () => {
    if (!serviceType) return;
    const body = { serviceType };
    if (propertyId) body.propertyId = propertyId;
    const prop = properties?.find((p) => p._id === propertyId);
    if (prop) body.region = prop.region;
    create.mutate(body, {
      onSuccess: () => navigate("/owner/yer/arizalarim"),
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-1 text-xl font-semibold tracking-tight">Yangi ariza</h1>
      <p className="mb-5 text-sm text-zinc-500">
        Kadastr xizmati uchun onlayn ariza topshiring
      </p>

      <Card>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Xizmat turi</label>
            <Select
              value={serviceType}
              onChange={(v) => setField("serviceType", v)}
              placeholder="Xizmatni tanlang"
              options={SERVICE_TYPE_OPTIONS}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Mulk obyekti</label>
            <Select
              value={propertyId}
              onChange={(v) => setField("propertyId", v)}
              placeholder="Obyektni tanlang"
              options={propertyOptions}
            />
          </div>

          <Button
            onClick={submit}
            disabled={!serviceType || create.isPending}
            className="w-full"
          >
            {create.isPending ? "Yuborilmoqda..." : "Arizani yuborish"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NewRequestPage;
