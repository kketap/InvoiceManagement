import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import TopNavbar
  from "./components/layout/TopNavbar";

import InvoicesPage
  from "./pages/InvoicesPage";

import InvoiceDetailPage
  from "./pages/InvoiceDetailPage";

import ReportsPage
  from "./pages/ReportsPage";

import ImportPage
  from "./pages/ImportPage";

import DashboardPage
  from "./pages/DashboardPage";

function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div
      className="
        min-h-screen
        bg-[#f8fafc]
      "
    >
      <main
        className="
          mx-auto
          max-w-[1600px]
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >
        <h1
          className="
            text-2xl
            font-semibold
            text-slate-900
          "
        >
          {title}
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
          "
        >
          Este módulo se
          implementará en las
          siguientes etapas.
        </p>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <>
      <TopNavbar />

      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="/invoices"
          element={
            <InvoicesPage />
          }
        />

        <Route
          path="/credit-notes"
          element={
            <PlaceholderPage
              title="Notas de crédito"
            />
          }
        />

        <Route
          path="/reports"
          element={
            <ReportsPage />
          }
        />

        <Route
          path="/customers"
          element={
            <PlaceholderPage
              title="Clientes"
            />
          }
        />

        <Route
          path="/settings"
          element={
            <PlaceholderPage
              title="Configuración"
            />
          }
        />

        <Route
          path="/api-info"
          element={
            <PlaceholderPage
              title="API / Swagger"
            />
          }
        />

        <Route
          path="/invoices/:id"
          element={
            <InvoiceDetailPage />
          }
        />

        <Route
          path="/import"
          element={
            <ImportPage />
          }
        />

        <Route
          path="/dashboard"
          element={
            <DashboardPage />
          }
        />
      </Routes>
    </>
  );
}