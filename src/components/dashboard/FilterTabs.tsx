import { type ReactNode } from 'react';

interface FilterTabsProps {
  tabs: { key: string; label: string; count?: number; icon?: ReactNode }[];
  active: string;
  onChange: (key: string) => void;
}

const FilterTabs = ({ tabs, active, onChange }: FilterTabsProps) => (
  <div className="flex items-center gap-1 rounded-xl bg-muted/50 p-1 overflow-x-auto">
    {tabs.map((tab) => {
      const isActive = active === tab.key;
      return (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            isActive
              ? 'bg-white text-foreground shadow-sm ring-1 ring-black/5'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={`min-w-[20px] rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default FilterTabs;
