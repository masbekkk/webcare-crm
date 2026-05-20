import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({ children }: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent
                variant="sidebar"
                className="flex min-h-[100dvh] flex-col bg-[#F9FAFB] lg:pl-[280px]"
            >
                <AppSidebarHeader />
                <div className="min-w-0 flex-1">{children}</div>
            </AppContent>
        </AppShell>
    );
}
