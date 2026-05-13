import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppWrapper } from '@/components/common/PageMeta';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import TailAdminLayout from '@/layout/AppLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const tailAdminPages = [
    'Dashboard/Home',
    'Calendar',
    'UserProfiles',
    'Forms/FormElements',
    'Tables/BasicTables',
    'Blank',
    'OtherPage/NotFound',
    'Charts/LineChart',
    'Charts/BarChart',
    'UiElements/Alerts',
    'UiElements/Avatars',
    'UiElements/Badges',
    'UiElements/Buttons',
    'UiElements/Images',
    'UiElements/Videos',
];

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('AuthPages/'):
                return null;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            case tailAdminPages.includes(name):
                return TailAdminLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <AppWrapper>
                <TooltipProvider delayDuration={0}>
                    {app}
                    <Toaster />
                </TooltipProvider>
            </AppWrapper>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
