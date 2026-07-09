// Boshqaruv paneliga kirish — owner login/paroli bilan.
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Lock, ShieldCheck } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import { qk } from "@/shared/lib/query/keys";
import Input from "@/shared/components/ui/input/Input";
import Button from "@/shared/components/ui/button/Button";
import { boshqaruvAuthAPI } from "../api/auth.api";

const BoshqaruvLoginPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state, setField } = useObjectState({ username: "", password: "" });

  const loginMutation = useMutation({
    mutationFn: () => boshqaruvAuthAPI.login(state).then((r) => r.data.data),
    onSuccess: (data) => {
      queryClient.setQueryData(qk.boshqaruv.me(), data);
      toast.success("Xush kelibsiz!");
      navigate("/boshqaruv", { replace: true });
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Kirib bo'lmadi — server ishlayotganini tekshiring"),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!state.username || !state.password) return toast.error("Login va parolni kiriting");
    loginMutation.mutate();
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#05070b] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-400">
            <ShieldCheck className="size-6" />
          </span>
          <h1 className="text-lg font-bold text-white">Boshqaruv paneli</h1>
          <p className="text-xs text-white/50">Sozlamalar va ma'lumotlarni boshqarish uchun owner hisobi bilan kiring</p>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-1.5 text-xs font-medium text-white/55">Login</p>
            <Input
              value={state.username}
              onChange={(e) => setField("username", e.target.value)}
              placeholder="owner"
              autoFocus
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-white/55">Parol</p>
            <Input
              type="password"
              value={state.password}
              onChange={(e) => setField("password", e.target.value)}
              placeholder="••••••••"
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <Button type="submit" disabled={loginMutation.isPending} className="mt-2 w-full">
            <Lock className="size-4" /> {loginMutation.isPending ? "Tekshirilmoqda…" : "Kirish"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BoshqaruvLoginPage;
