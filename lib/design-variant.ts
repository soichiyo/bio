export const BIO_DESIGN_VARIANTS = ["legacy", "telemetry"] as const;

export type BioDesignVariant = (typeof BIO_DESIGN_VARIANTS)[number];

const configuredDefaultDesign = process.env.BIO_DESIGN_VARIANT;

export const DEFAULT_BIO_DESIGN: BioDesignVariant =
  configuredDefaultDesign === "legacy" ? "legacy" : "telemetry";

export function parseBioDesignVariant(
  value: string | string[] | undefined,
): BioDesignVariant {
  const variant = Array.isArray(value) ? value[0] : value;

  if (variant === "telemetry" || variant === "personal-os") {
    return "telemetry";
  }

  if (variant === "legacy" || variant === "classic") {
    return "legacy";
  }

  return DEFAULT_BIO_DESIGN;
}
