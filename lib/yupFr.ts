import * as yup from "yup";
import { fr } from "yup-locales";
import { ar } from "yup-locales";

// Appliquer la locale française
yup.setLocale(fr);

// Réexporter tout yup avec la locale appliquée
export * from "yup";
export default yup;
