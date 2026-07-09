// go2rtc'dan WebRTC orqali MediaStream olish.
// AI (piksel o'qish) uchun stream'ni O'ZIMIZNING <video> ga ulashimiz kerak —
// iframe'da (cross-origin) piksellarni o'qib bo'lmaydi. Shuning uchun go2rtc'ning
// WebSocket signaling protokoli orqali to'g'ridan-to'g'ri MediaStream olamiz.
import { useEffect, useRef, useState } from "react";

export function openGo2rtcStream(wsUrl, { onStream, onError } = {}) {
  const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
  const media = new MediaStream();
  pc.addTransceiver("video", { direction: "recvonly" });
  pc.addTransceiver("audio", { direction: "recvonly" });
  pc.addEventListener("track", (e) => {
    media.addTrack(e.track);
    onStream?.(media);
  });

  const ws = new WebSocket(wsUrl);
  ws.addEventListener("open", async () => {
    pc.onicecandidate = (e) => {
      if (e.candidate) ws.send(JSON.stringify({ type: "webrtc/candidate", value: e.candidate.candidate }));
    };
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    ws.send(JSON.stringify({ type: "webrtc/offer", value: offer.sdp }));
  });
  ws.addEventListener("message", async (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      if (msg.type === "webrtc/answer") await pc.setRemoteDescription({ type: "answer", sdp: msg.value });
      else if (msg.type === "webrtc/candidate" && msg.value) await pc.addIceCandidate({ candidate: msg.value, sdpMid: "0" });
    } catch (e) {
      onError?.(e);
    }
  });
  ws.addEventListener("error", (e) => onError?.(e));

  // Tozalash funksiyasi
  return () => {
    try { ws.close(); } catch { /* ignore */ }
    try { pc.close(); } catch { /* ignore */ }
    media.getTracks().forEach((t) => t.stop());
  };
}

// React hook — wsUrl bo'yicha MediaStream qaytaradi (lifecycle boshqaradi).
export function useGo2rtcStream(wsUrl) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(false);
  const closeRef = useRef(null);
  useEffect(() => {
    if (!wsUrl) return;
    setStream(null);
    setError(false);
    closeRef.current = openGo2rtcStream(wsUrl, {
      onStream: (ms) => setStream(ms),
      onError: () => setError(true),
    });
    return () => closeRef.current?.();
  }, [wsUrl]);
  return { stream, error };
}
