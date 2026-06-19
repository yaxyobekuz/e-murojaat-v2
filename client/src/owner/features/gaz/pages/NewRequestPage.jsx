import { useNavigate } from "react-router-dom";
import useObjectState from "@/shared/hooks/useObjectState";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import Select from "@/shared/components/ui/select/Select";
import { useMyAccount } from "../hooks/useGazAccount";
import { useCreateRequest } from "../hooks/useGazMutations";
import { SERVICE_TYPE_OPTIONS } from "../constants/gaz.ui";

const NewRequestPage = () => {
  const navigate = useNavigate();
  const { data } = useMyAccount();
  const create = useCreateRequest();

  const { serviceType, setField } = useObjectState({ serviceType: "" });

  const submit = () => {
    if (!serviceType) return;
    const body = { serviceType };
    const sub = data?.subscriber;
    if (sub) {
      body.subscriberId = sub._id;
      body.region = sub.region;
    }
    create.mutate(body, {
      onSuccess: () => navigate("/owner/gaz/arizalarim"),
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-1 text-xl font-semibold tracking-tight">Xizmatga ariza</h1>
      <p className="mb-5 text-sm text-zinc-500">
        Gaz xizmati uchun onlayn ariza topshiring
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
