import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Strona główna (landing page)
  index("pages/LandingPage.jsx"),
  
  // Dashboard z danymi
  route("/dashboard", "pages/DashboardPage.jsx"),
  
  // Upload danych
  route("/upload", "pages/UploadPage.jsx"),
  
  // Strona informacyjna
  route("/info", "pages/InfoPage.jsx"),
] satisfies RouteConfig;