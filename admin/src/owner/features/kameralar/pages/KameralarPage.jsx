// Kameralar — qo'shish bo'limi + jonli grid.
// Bu yerda qo'shilgan kameralar Markaz / FVV kabi barcha kamera joylarida ham paydo bo'ladi.
import { Video, ServerCrash } from "lucide-react";
import AddCameraForm from "../components/AddCameraForm";
import LiveCameraCard from "../components/LiveCameraCard";
import AiDemo from "../components/AiDemo";
import { useCamerasQuery } from "../hooks/useCameras";

const KameralarPage = () => {
  const { data: cameras, isLoading, isError } = useCamerasQuery();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kameralar</h1>
        <p className="mt-0.5 text-sm text-foreground/50">Hikvision IP kamera qo'shing — jonli tasvir + AI obyekt aniqlash (motion tracking) shu yerda va barcha kamera bo'limlarida ko'rinadi</p>
      </div>

      <AddCameraForm />

      <AiDemo />

      <div>
        <h2 className="mb-3 text-sm font-medium text-foreground/70">Jonli kameralar {cameras?.length ? `(${cameras.length})` : ""}</h2>

        {isError && (
          <div className="surface flex items-center gap-3 p-5 text-sm text-foreground/60">
            <ServerCrash className="size-5 text-red-400" />
            Kamera serveriga ulanib bo'lmadi. <code className="rounded bg-card/60 px-1.5">camera-system</code> (go2rtc + backend) ishga tushirilganini tekshiring.
          </div>
        )}

        {!isError && !isLoading && !cameras?.length && (
          <div className="surface flex flex-col items-center gap-2 p-10 text-center text-sm text-foreground/50">
            <Video className="size-8 text-foreground/30" />
            Hozircha kamera yo'q. Yuqoridagi formadan birinchi kamerani qo'shing.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {cameras?.map((cam) => <LiveCameraCard key={cam.id} cam={cam} />)}
        </div>
      </div>
    </div>
  );
};

export default KameralarPage;
