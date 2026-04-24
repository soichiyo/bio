type ChipProps = {
  text: string;
  icon?: string;
  style?: string;
};

export function Chip({ text, icon }: ChipProps) {
  const baseStyle =
    "group border border-border bg-card px-3 py-2 text-xs font-data uppercase tracking-[0.06em] text-muted-foreground transition-colors duration-200 hover:border-[var(--border-visible)] hover:text-foreground flex items-center gap-2";
  const defaultStyle =
    "rounded-md";

  const renderIcon = () => {
    if (!icon) return null;

    // iconが画像ファイルの拡張子で終わるか、'/'で始まる場合は画像パスと判断
    const isImagePath =
      /\.(svg|png|jpg|jpeg|gif)$/.test(icon) || icon.startsWith("/");

    if (isImagePath) {
      return (
        <img
          alt={`${text} icon`}
          loading="lazy"
          width="20"
          height="20"
          className="h-4 w-4 grayscale"
          src={icon}
        />
      );
    }

    return <span className="h-2 w-2 bg-muted-foreground transition-colors group-hover:bg-foreground" />;
  };

  return (
    <div className={`${baseStyle} ${defaultStyle}`}>
      {renderIcon()}
      <span>{text}</span>
    </div>
  );
}
