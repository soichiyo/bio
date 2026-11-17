import { LegacyBioPage } from "../components/pages/LegacyBioPage";
import { AIProfilePage } from "../components/pages/AIProfilePage";
import { parseBioDesignVariant } from "../lib/design-variant";
import { getWriting } from "../lib/writing/load";
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
    const [result, writing] = await Promise.all([getUsage(), getWriting()]);
    const now = new Date();
    return <AIProfilePage result={result} writing={writing} today={tokyoDate(now)} now={now} />;
  }

  return <LegacyBioPage />;
}
