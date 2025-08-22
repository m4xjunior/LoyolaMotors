import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/navigation/Sidebar';
import { TopBar } from '@/components/navigation/TopBar';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Top Navigation Bar */}
      <TopBar className="h-16 border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80" />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation */}
        <Sidebar className="w-64 border-r bg-white/60 backdrop-blur-sm dark:bg-gray-900/60" />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {/* <BreadcrumbNav className="mb-6" /> */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}