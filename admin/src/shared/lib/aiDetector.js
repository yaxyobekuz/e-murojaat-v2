// Brauzerda ishlaydigan obyekt aniqlash modeli — TensorFlow.js COCO-SSD.
// Model bir marta yuklanadi (singleton) va barcha kameralar shu bittasidan foydalanadi.
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

let modelPromise = null;

export function loadDetector() {
  if (!modelPromise) {
    modelPromise = (async () => {
      try {
        await tf.setBackend("webgl"); // GPU (tez); bo'lmasa CPU'ga o'tadi
      } catch {
        /* webgl yo'q — CPU backend ishlatiladi */
      }
      await tf.ready();
      // lite_mobilenet_v2 — yengil va tez (real-time uchun mos)
      return cocoSsd.load({ base: "lite_mobilenet_v2" });
    })();
  }
  return modelPromise;
}
