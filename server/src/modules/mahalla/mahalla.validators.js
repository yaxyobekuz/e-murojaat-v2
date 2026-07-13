import { z } from "zod";

// Domen ko'rsatkichlari — son/satr/bool qiymatlar (dashboard indikatorlari)
export const patchIndicatorSchema = z.record(z.union([z.number(), z.string(), z.boolean(), z.null()]));
