interface DataCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  noPadding?: boolean;
  className?: string;
}

const DataCard = ({ title, description, children, action, noPadding, className = '' }: DataCardProps) => (
  <div className={`rounded-2xl bg-white ring-1 ring-black/[0.04] ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
        <div>
          {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
    )}
    <div className={noPadding ? '' : 'p-6'}>{children}</div>
  </div>
);

export default DataCard;
