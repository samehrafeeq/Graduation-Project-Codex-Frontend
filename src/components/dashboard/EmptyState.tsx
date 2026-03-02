import { Loader2, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/30 px-6 py-16 text-center">
    {Icon && <div className="mb-4 text-muted-foreground/50"><Icon size={40} /></div>}
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    {description && (
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;

export const PageLoader = () => (
  <div className="flex items-center justify-center py-32">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-9 w-9 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">جاري التحميل...</span>
    </div>
  </div>
);
