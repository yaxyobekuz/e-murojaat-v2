// Loads the Google Maps bootstrap once (alpha channel), then resolves maps3d for
// the obodonlashtirish 3D map. Global bootstrap — boshqa modullar bilan to'qnashmaydi.
let bootstrapPromise = null;

const injectBootstrap = (apiKey) => {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = new Promise((resolve, reject) => {
    if (!apiKey || apiKey === "your_google_maps_api_key_here") {
      reject(new Error("VITE_MAPS_API_KEY topilmadi"));
      return;
    }
    ((g) => {
      let h;
      let a;
      const p = "The Google Maps JavaScript API";
      const c = "google";
      const l = "importLibrary";
      const q = "__ib__";
      const m = document;
      let b = window;
      b = b[c] || (b[c] = {});
      const d = b.maps || (b.maps = {});
      const r = new Set();
      const e = new URLSearchParams();
      const u = () =>
        h ||
        (h = new Promise((res, rej) => {
          a = m.createElement("script");
          e.set("libraries", [...r] + "");
          for (const k in g) e.set(k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()), g[k]);
          e.set("callback", c + ".maps." + q);
          a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
          d[q] = res;
          a.onerror = () => (h = rej(Error(p + " could not load.")));
          a.nonce = m.querySelector("script[nonce]")?.nonce || "";
          m.head.append(a);
        }));
      d[l] ? console.warn(p + " only loads once. Ignoring:", g) : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
    })({ key: apiKey, v: "alpha" });

    resolve(window.google);
  });

  return bootstrapPromise;
};

export const loadMaps3d = async (apiKey) => {
  await injectBootstrap(apiKey);
  const maps3d = await window.google.maps.importLibrary("maps3d");
  return { ...maps3d };
};
