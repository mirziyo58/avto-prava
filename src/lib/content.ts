import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ContentField = { key: string; label: string; default: string; long?: boolean };
export type ContentGroup = { title: string; fields: ContentField[] };

export const PAGES: { slug: string; title: string; subtitle: string; body: string }[] = [
  {
    slug: "darslik",
    title: "Darslik",
    subtitle: "Yo‘l harakati qoidalari bo‘yicha qisqa darslik",
    body: "Yo‘l harakati qoidalari (YHQ) — barcha yo‘l harakati qatnashchilari uchun majburiy qoidalar to‘plami.\n\n1. Umumiy qoidalar\nHaydovchi transport vositasini boshqarishda hushyor bo‘lishi, belgilar va svetofor ishoralariga amal qilishi shart.\n\n2. Yo‘l belgilari\nBelgilar ogohlantiruvchi, imtiyoz, taqiqlovchi, buyuruvchi, axborot-ishora va servis belgilariga bo‘linadi.\n\n3. Chorrahalardan o‘tish\nTartibga solinmagan teng ahamiyatli chorrahada o‘ng tomondan yaqinlashayotgan transportga yo‘l beriladi.",
  },
  {
    slug: "qollanma",
    title: "Qo‘llanma",
    subtitle: "Saytdan qanday foydalanish kerak",
    body: "1. «Test ishlash» bo‘limida savollar sonini tanlang va testni boshlang.\n\n2. «Variantlar» bo‘limida 20 talik tayyor variantlarni ishlang.\n\n3. «Xatolar ustida ishlash» orqali oldin xato qilgan savollaringizni qayta ishlang.\n\n4. «Natijalarim» bo‘limida barcha natijalaringiz saqlanadi.",
  },
  {
    slug: "prava-olish",
    title: "Prava olish",
    subtitle: "Tayyorgarlik va jarayon",
    body: "Haydovchilik guvohnomasini olish uchun avtomaktabda o‘qish, nazariy va amaliy imtihonlardan o‘tish kerak.\n\n1. Avtomaktabga yoziling.\n2. Tibbiy ma’lumotnoma oling.\n3. Nazariy imtihonni topshiring.\n4. Amaliy imtihonni topshiring.\n5. Guvohnomani oling.",
  },
  {
    slug: "avtoimtihon-2026",
    title: "Imtihon qoidalari",
    subtitle: "Savollar, vaqt va o‘tish bali",
    body: "Nazariy imtihonda 20 ta savol beriladi. Umumiy vaqt — 25 daqiqa.\n\nO‘tish uchun ko‘pi bilan 2 ta xatoga yo‘l qo‘yish mumkin.\n\nImtihon kompyuterda o‘tkaziladi.",
  },
  {
    slug: "e-avtomaktab",
    title: "E-avtomaktab",
    subtitle: "Mustaqil ta’lim",
    body: "Onlayn tarzda mustaqil tayyorlaning: savollar bankini o‘rganing, variantlarni ishlang va natijalaringizni kuzating.",
  },
];

export const CONTENT_GROUPS: ContentGroup[] = [
  {
    title: "Umumiy",
    fields: [
      { key: "brand_name", label: "Sayt nomi", default: "AvtoPrava" },
      { key: "brand_tagline", label: "Logo ostidagi yozuv", default: "Onlayn tayyorgarlik" },
      { key: "top_badge", label: "Yuqoridagi belgi", default: "O‘zbekcha · 2026" },
      { key: "telegram_label", label: "Telegram tugma matni", default: "Telegram kanal" },
      { key: "telegram_url", label: "Telegram havola", default: "https://t.me/Akbar_Islomxonov_Blog" },
      { key: "footer", label: "Pastki yozuv", default: "© 2026 AvtoPrava" },
    ],
  },
  {
    title: "Bosh sahifa",
    fields: [
      { key: "home_eyebrow", label: "Kichik sarlavha", default: "Sizning tayyorgarlik maydoningiz" },
      { key: "home_title", label: "Sarlavha", default: "AvtoPrava" },
      { key: "home_subtitle", label: "Izoh", default: "Yo‘lga bilim bilan. Bugun ham bir qadam oldinga." },
      { key: "home_badge", label: "O‘ng belgi", default: "YHQ · 2026" },
      { key: "stat_variants", label: "Bepul variantlar soni", default: "64" },
      { key: "hero_eyebrow", label: "Blok kichik sarlavhasi", default: "Boshlashga tayyormisiz?" },
      { key: "hero_title", label: "Blok sarlavhasi", default: "Keyingi manzil — haydovchilik guvohnomasi." },
      { key: "hero_text", label: "Blok matni", default: "Savollarni tanlang, bilimingizni sinang va natijangizni yaxshilang.", long: true },
      { key: "community_title", label: "Hamjamiyat sarlavhasi", default: "Telegram hamjamiyati" },
      { key: "community_text", label: "Hamjamiyat matni", default: "Yangiliklar, maslahatlar va yangi savollar — kanalimizda.", long: true },
    ],
  },
  ...PAGES.map((p) => ({
    title: `Sahifa: ${p.title}`,
    fields: [
      { key: `page:${p.slug}:title`, label: "Sarlavha", default: p.title },
      { key: `page:${p.slug}:subtitle`, label: "Izoh", default: p.subtitle },
      { key: `page:${p.slug}:body`, label: "Matn", default: p.body, long: true },
    ],
  })),
];

const DEFAULTS: Record<string, string> = Object.fromEntries(
  CONTENT_GROUPS.flatMap((g) => g.fields.map((f) => [f.key, f.default])),
);

export const useContentMap = () =>
  useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("key,value");
      const map: Record<string, string> = {};
      (data ?? []).forEach((r) => (map[r.key] = r.value));
      return map;
    },
    staleTime: 60_000,
  });

export function useContent() {
  const { data } = useContentMap();
  return (key: string) => {
    const v = data?.[key];
    return v !== undefined && v !== "" ? v : (DEFAULTS[key] ?? "");
  };
}
