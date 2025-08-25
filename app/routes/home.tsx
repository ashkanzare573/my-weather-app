import type { Route } from "./+types/home";
import App from "../app";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Surf App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <App />;
}
