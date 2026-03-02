interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  last?: boolean;
}

const InfoRow = ({ label, value, last = false }: InfoRowProps) => (
  <div className={`flex items-center justify-between py-3 ${!last ? 'border-b border-border/40' : ''}`}>
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

export default InfoRow;
