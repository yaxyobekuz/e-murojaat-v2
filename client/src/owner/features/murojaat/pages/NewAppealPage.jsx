import { useNavigate } from "react-router-dom";
import useObjectState from "@/shared/hooks/useObjectState";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import Select from "@/shared/components/ui/select/Select";
import Input from "@/shared/components/ui/input/Input";
import { useCreateAppeal } from "../hooks/useCreateAppeal";
import { useOrganizations } from "../hooks/useOrganizations";
import { APPEAL_TYPE_OPTIONS, CATEGORY_OPTIONS } from "../constants/murojaat.ui";

const NewAppealPage = () => {
  const navigate = useNavigate();
  const { data: orgs } = useOrganizations();
  const create = useCreateAppeal();

  const { type, category, organizationId, subject, body, setField } = useObjectState({
    type: "",
    category: "",
    organizationId: "",
    subject: "",
    body: "",
  });

  const orgOptions = [
    { value: "", label: "Tanlanmagan (avtomatik yo'naltiriladi)" },
    ...(orgs || []).map((o) => ({ value: o._id, label: o.name })),
  ];

  const canSubmit = type && category && subject.trim().length >= 3 && body.trim().length >= 5;

  const submit = () => {
    if (!canSubmit) return;
    const payload = { type, category, subject: subject.trim(), body: body.trim() };
    if (organizationId) payload.organizationId = organizationId;
    create.mutate(payload, {
      onSuccess: () => navigate("/owner/murojaat/mening"),
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-1 text-xl font-semibold tracking-tight">Yangi murojaat</h1>
      <p className="mb-5 text-sm text-zinc-500">
        Ariza, shikoyat yoki taklifingizni onlayn yuboring
      </p>

      <Card>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Murojaat turi</label>
            <Select
              value={type}
              onChange={(v) => setField("type", v)}
              placeholder="Turini tanlang"
              options={APPEAL_TYPE_OPTIONS}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Soha</label>
            <Select
              value={category}
              onChange={(v) => setField("category", v)}
              placeholder="Sohani tanlang"
              options={CATEGORY_OPTIONS}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Tashkilot</label>
            <Select
              value={organizationId}
              onChange={(v) => setField("organizationId", v)}
              placeholder="Tashkilotni tanlang"
              options={orgOptions}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Mavzu</label>
            <Input
              value={subject}
              onChange={(e) => setField("subject", e.target.value)}
              placeholder="Murojaat mavzusi"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Murojaat matni</label>
            <Input
              type="textarea"
              value={body}
              onChange={(e) => setField("body", e.target.value)}
              placeholder="Murojaatingizni batafsil yozing"
            />
          </div>

          <Button onClick={submit} disabled={!canSubmit || create.isPending} className="w-full">
            {create.isPending ? "Yuborilmoqda..." : "Murojaatni yuborish"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NewAppealPage;
