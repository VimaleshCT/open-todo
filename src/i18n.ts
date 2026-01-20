import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        title: "To Do List",
        placeholder: "Add a task",
        add: "Add",
        edit: "Edit",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        completed: "Completed",
        uncompleted: "Uncompleted",
        empty: "No tasks available",
      },
    },
    ta: {
      translation: {
        title: "பணி பட்டியல்",
        placeholder: "ஒரு பணியை சேர்க்கவும்",
        add: "சேர்க்க",
        edit: "திருத்து",
        save: "சேமி",
        cancel: "ரத்து",
        delete: "அழி",
        completed: "முடிந்தது",
        uncompleted: "முடியவில்லை",
        empty: "பணிகள் எதுவும் இல்லை",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
