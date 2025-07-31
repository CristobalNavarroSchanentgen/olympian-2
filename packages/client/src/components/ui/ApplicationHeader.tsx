import { Settings, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ApplicationHeaderProps {
  title: string;
}

export function ApplicationHeader({ title }: ApplicationHeaderProps) {
  return (
    <header className="h-14 bg-panel border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-primary">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Link 
          to="/config"
          className="p-2 text-muted hover:text-primary hover:bg-accent/20 rounded-lg transition-all duration-200"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
