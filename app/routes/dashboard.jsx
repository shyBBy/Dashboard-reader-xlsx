import { DashboardPage } from "../pages/Dashboard/DashboardPage";

export function meta() {
  return [
    { title: "Dashboard - Dashboard Reader XLSX" },
    { name: "description", content: "Dashboard do analizy plików Excel" },
  ];
}

export default function Dashboard() {
  return <DashboardPage />;
}