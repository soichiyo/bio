type ChipProps = {
  text: string;
  icon?: string;
  style?: string;
};

export function Chip({ text, icon, style }: ChipProps) {
  const baseStyle =
    "whitespace-nowrap border transition-all duration-200 hover:scale-105 hover:shadow-md h-auto px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2";
  const defaultStyle =
    "bg-secondary hover:bg-accent text-secondary-foreground border-border";

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
          className="w-5 h-5"
          src={icon}
        />
      );
    }

    // それ以外の場合は絵文字と判断
    return <span className="text-2xl">{icon}</span>;
  };

  return (
    <div className={`${baseStyle} ${style || defaultStyle}`}>
      {renderIcon()}
      <span>{text}</span>
    </div>
  );
}
