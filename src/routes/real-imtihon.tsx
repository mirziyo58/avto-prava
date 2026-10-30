import { createFileRoute } from "@tanstack/react-router";
import { Quiz } from "@/components/Quiz";
import { shuffle } from "@/lib/data";

export const Route = createFileRoute("/real-imtihon")({
  head: () => ({
    meta: [
      { title: "Real imtihon — AvtoPrava" },
      { name: "description", content: "20 ta savol, 25 daqiqa — haqiqiy imtihon ritmida sinov." },
      { property: "og:title", content: "Real imtihon — AvtoPrava" },
      { property: "og:description", content: "20 ta savol, 25 daqiqa — haqiqiy imtihon ritmida sinov." },
    ],
  }),
  component: () => <Quiz config={{ key: "real", title: "Real imtihon", minutes: 25, pick: (all) => shuffle(all).slice(0, 20) }} />,
});
