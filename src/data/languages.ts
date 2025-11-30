export const languages = ["English", "Sinhala", "Tamil"] as const;

export type Language = (typeof languages)[number];
