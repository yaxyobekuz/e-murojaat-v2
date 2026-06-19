import { Inbox } from "lucide-react";

const EmptyState = ({ text = "Ma'lumot yo'q", icon: Icon = Inbox }) => (
  <div className="flex flex-col items-center justify-center py-14 border rounded-[2px] bg-white text-center">
    <Icon className="size-9 text-zinc-300" strokeWidth={1.5} />
    <p className="mt-2 text-sm text-zinc-500">{text}</p>
  </div>
);

export default EmptyState;
