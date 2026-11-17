import { LegacyBioPage } from "../components/pages/LegacyBioPage";
import { AIProfilePage } from "../components/pages/AIProfilePage";
import { parseBioDesignVariant } from "../lib/design-variant";
import { getUsage } from "../lib/usage/load";
import { tokyoDate } from "../lib/usage/dates";

type ProfilePageProps = {
  searchParams?: Promise<{
    design?: string | string[];
    view?: string | string[];
  }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = await searchParams;
  const design = parseBioDesignVariant(params?.design ?? params?.view);

  if (design === "telemetry") {
    const result = await getUsage();
    const now = new Date();
    return <AIProfilePage result={result} today={tokyoDate(now)} now={now} />;
  }

  return <LegacyBioPage />;
}
