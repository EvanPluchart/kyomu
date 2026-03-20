interface TagBadgeProps {
  name: string;
  color: string;
  onRemove?: () => void;
}

export function TagBadge({ name, color, onRemove }: TagBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 cursor-pointer hover:opacity-70"
        >
          ×
        </button>
      )}
    </span>
  );
}
