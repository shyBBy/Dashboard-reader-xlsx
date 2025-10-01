import { UploadPage } from "../pages/Upload/UploadPage";

export function meta() {
  return [
    { title: "Upload - Dashboard Reader XLSX" },
    { name: "description", content: "Wgraj plik Excel do analizy" },
  ];
}

export default function Upload() {
  return <UploadPage />;
}