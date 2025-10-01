import InfoPage from "../pages/InfoPageNew";

export function meta() {
  return [
    { title: "Info - Dashboard Reader XLSX" },
    { name: "description", content: "Informacje o blokerze DZZWD" },
  ];
}

export default function Info() {
  return <InfoPage />;
}