"use client";

import i18n from "i18next";
import jsCookie from "js-cookie";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { ValueKeys, langs } from "./config";
import { resources } from "./index";

export const initI18n = (initLang?: ValueKeys) =>
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      lng: "us",
      fallbackLng:
        langs.find((items) => items.value === initLang)?.value || "us",
      debug: true,
      load: "languageOnly",
      supportedLngs: langs.map((items) => items.value),
      maxRetries: 20,

      interpolation: {
        escapeValue: false,
      },

      resources: resources,
    });

export const getUsersBrowserLang = () => {
  const userLang = navigator.language;

  const langKey = langs.find((i) => i.locale.includes(userLang))?.value || "us";
  return langKey;
};

export const getLocalI18nProfile = () => {
  return (
    langs.find((i) =>
      i.value.includes(jsCookie.get("ELK-TOP-DISCOUNTS-LANG") || "")
    )?.value || getUsersBrowserLang()
  );
};

export const setLocalI18nProfile = (key: ValueKeys) => {
  jsCookie.set(
    "ELK-TOP-DISCOUNTS-LANG",
    langs.find((i) => i.value === key)?.value || "us",
    {
      domain: process.env.NODE_ENV === "development" ? "localhost" : "",
    }
  );
};
