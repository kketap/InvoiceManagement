import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import {
  App as AntApp,
  ConfigProvider,
} from "antd";

import esES from "antd/locale/es_ES";

import App from "./App";

import "./index.css";

createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <ConfigProvider
      locale={esES}
      theme={{
        token: {
          colorPrimary: "#0f5f7a",
          colorInfo: "#0f5f7a",

          colorBgLayout: "#f8fafc",
          colorBgContainer: "#ffffff",

          colorText: "#1e293b",
          colorTextSecondary: "#64748b",

          colorBorder: "#e2e8f0",
          colorBorderSecondary: "#eef2f6",

          borderRadius: 10,
          borderRadiusLG: 14,

          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

          boxShadowSecondary:
            "0 8px 24px rgba(15, 23, 42, 0.06)",
        },

        components: {
          Card: {
            paddingLG: 20,
          },

          Button: {
            borderRadius: 9,
            controlHeight: 38,
          },

          Input: {
            borderRadius: 9,
          },

          InputNumber: {
            borderRadius: 9,
          },

          Select: {
            borderRadius: 9,
          },

          Table: {
            headerBg: "#f8fafc",
            headerColor: "#475569",
            borderColor: "#eef2f6",
          },
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  </StrictMode>
);