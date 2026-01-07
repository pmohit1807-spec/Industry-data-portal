import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Map, Tractor, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MadeWithDyad } from './made-with-dyad';
import { Button } from './ui/button';
import { useSession } from './SessionProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

const navItems = [
  { name: 'Executive Overview', path: '/', icon: LayoutDashboard },
  { name: 'Regional Analysis', path: '/regional', icon: Map },
  { name: 'Product Segment', path: '/segments', icon: Tractor },
  { name: 'Competitive Deep Dive', path: '/competitive', icon: BarChart3 },
  { name: 'Data Upload', path: '/upload', icon: Upload },
];

const Sidebar: React.FC = () => {
  const { user } = useSession();
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError("Failed to sign out.");
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="flex flex-col h-full border-r bg-sidebar text-sidebar-foreground p-4">
      <div className="text-2xl font-bold mb-8 text-sidebar-primary">
        Tractor Sales
      </div>
      <nav className="flex-grow space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-sidebar-border">
        <p className="text-sm mb-2 truncate">
          Logged in as: <span className="font-medium">{user?.email}</span>
        </p>
        <Button 
          onClick={handleSignOut} 
          variant="secondary" 
          className="w-full bg-sidebar-accent hover:bg-sidebar-accent-foreground hover:text-sidebar-accent"
        >
          Sign Out
        </Button>
        <MadeWithDyad />
      </div>
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 flex-shrink-0 hidden md:block">
        <Sidebar />
      </aside>
      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;