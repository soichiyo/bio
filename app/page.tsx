import { LegacyBioPage } from "../components/pages/LegacyBioPage";
import { TelemetryBioPage } from "../components/pages/TelemetryBioPage";
import { parseBioDesignVariant } from "../lib/design-variant";

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
    return <TelemetryBioPage />;
  }

  return <LegacyBioPage />;
}
