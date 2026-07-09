// AI test/demo — real kamerasiz ham obyekt aniqlash + motion trackingni ko'rsatadi.
// Demo videolar (odamlar) + noutbuk kamerasi (webcam) orqali jonli aniqlash.
import { useEffect, useRef, useState } from "react";
import { Video, VideoOff } from "lucide-react";
import AiCameraFeed from "@/shared/components/ai/AiCameraFeed";

const vid = (id, f) => `https://videos.pexels.com/video-files/${id}/${f}.mp4`;
const DEMO_VIDEOS = [
  { name: "Ko'cha — piyodalar", src: vid(1721294, "1721294-sd_640_360_25fps") },
  { name: "Chorraha", src: vid(5921059, "5921059-sd_640_360_30fps") },
  { name: "O'tish yo'lagi", src: vid(2099536, "2099536-sd_640_360_30fps") },
];

function WebcamTile() {
  const [stream, setStream] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    let s;
    navigator.mediaDevices?.getUserMedia({ video: true })
      .then((ms) => { s = ms; setStream(ms); })
      .catch(() => setErr(true));
    return () => s?.getTracks().forEach((t) => t.stop());
  }, []);
  return (
    <div className="surface overflow-hidden p-0">
      <div className="relative aspect-video bg-black">
        {stream ? (
          <AiCameraFeed stream={stream} ai className="absolute inset-0 size-full" />
        ) : (
          <div className="absolute inset-0 grid place-items-center gap-2 text-center text-xs text-foreground/45">
            {err ? <><VideoOff className="mx-auto size-6 text-foreground/30" />Kamera ruxsati berilmadi</> : <><Video className="mx-auto size-6 text-foreground/30" />Kameraga ulanmoqda…</>}
          </div>
        )}
      </div>
      <div className="p-3 text-sm font-semibold">Webcam — real vaqt AI (o'zingizni sinang)</div>
    </div>
  );
}

const AiDemo = () => (
  <div>
    <h2 className="mb-1 text-sm font-medium text-foreground/70">AI test — jonli obyekt aniqlash + motion tracking</h2>
    <p className="mb-3 text-xs text-foreground/45">Real kamerasiz ham ishlaydi: har obyekt bounding box + nishon bilan belgilanadi, harakatlanayotgani belgilanadi (brauzerda TensorFlow.js)</p>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {DEMO_VIDEOS.map((d) => (
        <div key={d.name} className="surface overflow-hidden p-0">
          <div className="relative aspect-video bg-black">
            <AiCameraFeed src={d.src} ai className="absolute inset-0 size-full" />
          </div>
          <div className="p-3 text-sm font-semibold">{d.name} <span className="text-xs font-normal text-foreground/40">· demo</span></div>
        </div>
      ))}
      <WebcamTile />
    </div>
  </div>
);

export default AiDemo;
