import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("dashboard", "routes/dashboard.jsx"),
  route("upload", "routes/upload.jsx"),
  route("info", "routes/info.jsx"),
  route("charts", "routes/charts.jsx"),
  route("analytics", "routes/analytics.jsx"),
  route("sklep/:storeId", "routes/store.jsx"),
];