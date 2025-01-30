export type ValueKeys =
  | "us"
  | "fr"
  | "pt"
  | "de"
  | "it"
  | "es"
  | "cn"
  | "kr"
  | "jp"
  | "nl"
  | "ar";

export type LocaleKeys =
  | "en-US"
  | "fr-FR"
  | "pt-PT"
  | "de-DE"
  | "it-IT"
  | "es-ES"
  | "zh-CN"
  | "ko-KR"
  | "ja-JP"
  | "nl-NL"
  | "ar-SA";

type LangsType = {
  label: string;
  value: ValueKeys;
  locale: LocaleKeys;
  icon?: unknown;
};
const langs: LangsType[] = [
  {
    label: "English",
    value: "us",
    locale: "en-US",
  },
  {
    label: "Français",
    value: "fr",
    locale: "fr-FR",
  },
  {
    label: "Português",
    value: "pt",
    locale: "pt-PT",
  },
  {
    label: "Deutschland",
    value: "de",
    locale: "de-DE",
  },
  {
    label: "Italia",
    value: "it",
    locale: "it-IT",
  },
  {
    label: "España",
    value: "es",
    locale: "es-ES",
  },
  {
    label: "中文",
    value: "cn",
    locale: "zh-CN",
  },
  {
    label: "한국어",
    value: "kr",
    locale: "ko-KR",
  },
  {
    label: "日本語",
    value: "jp",
    locale: "ja-JP",
  },
  {
    label: "Nederlands",
    value: "nl",
    locale: "nl-NL",
  },
  {
    label: "العربية",
    value: "ar",
    locale: "ar-SA",
  },
];

export { langs };
