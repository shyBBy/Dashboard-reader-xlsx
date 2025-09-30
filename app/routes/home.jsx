import { App } from "../App";

export function meta() {
  return [
    { title: "Dashboard Reader XLSX" },
    { name: "description", content: "Dashboard do czytania plików Excel" },
  ];
}

export default function Home() {
  return <App />;
}