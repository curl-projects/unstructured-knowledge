import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "../app/styles/app.css";

import ExperimentSelector from "~/components/ExperimentSelector/ExperimentSelector"

export function links() {
  return [{rel: "stylesheet", href: styles}];
}

export const meta = () => ({
  charset: "utf-8",
  title: "Unstructured Knowledge",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ExperimentSelector />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
