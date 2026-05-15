import { Link } from '@inertiajs/react';
import {
    Bot,
    Box,
    BriefcaseBusiness,
    Calendar,
    ChevronDown,
    Grid2X2,
    ShoppingCart,
} from 'lucide-react';
import { useState } from 'react';
import AppLogo from '@/components/app-logo';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';

type SidebarGroup = {
    title: string;
    icon: typeof Grid2X2;
    badge?: boolean;
    items: { title: string; badge?: boolean }[];
};

const sidebarGroups: SidebarGroup[] = [
    {
        title: 'Dashboard',
        icon: Grid2X2,
        items: [
            { title: 'Ecommerce' },
            { title: 'Analytics' },
            { title: 'Marketing' },
            { title: 'CRM' },
            { title: 'Stocks' },
            { title: 'SaaS' },
            { title: 'Logistics' },
            { title: 'AI', badge: true },
            { title: 'Sales', badge: true },
            { title: 'Finance', badge: true },
        ],
    },
    {
        title: 'AI Assistant',
        icon: Bot,
        badge: true,
        items: [
            { title: 'Chatbot' },
            { title: 'Prompts' },
            { title: 'Knowledge Base' },
        ],
    },
    {
        title: 'E-commerce',
        icon: ShoppingCart,
        items: [
            { title: 'Products' },
            { title: 'Orders' },
            { title: 'Customers' },
        ],
    },
    {
        title: 'Calendar',
        icon: Calendar,
        items: [
            { title: 'Schedule' },
            { title: 'Appointments' },
            { title: 'Reminders' },
        ],
    },
    {
        title: 'Projects',
        icon: BriefcaseBusiness,
        items: [
            { title: 'Kanban' },
            { title: 'Tasks' },
            { title: 'Reports' },
        ],
    },
];

function NewBadge() {
    return (
        <span className="rounded-full bg-success-50 px-3 py-0.5 text-xs font-semibold text-success-600">
            NEW
        </span>
    );
}

export function AppSidebar() {
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        Dashboard: true,
    });

    const toggleGroup = (title: string) => {
        setOpenGroups((current) => ({
            ...current,
            [title]: !current[title],
        }));
    };

    return (
        <aside className="fixed inset-y-0 left-0 hidden w-[280px] overflow-y-auto border-r border-[#E4E7EC] bg-white lg:block">
            <div className="flex h-full flex-col px-5 py-6">
                <Link href={dashboard()} prefetch className="flex items-center">
                    <AppLogo />
                </Link>

                <nav className="mt-11">
                    <p className="mb-4 text-xs font-medium text-[#98A2B3]">
                        MENU
                    </p>

                    <div className="flex flex-col gap-1">
                        {sidebarGroups.map((group) => {
                            const isOpen = openGroups[group.title] ?? false;
                            const isDashboard = group.title === 'Dashboard';

                            return (
                                <div key={group.title}>
                                    <button
                                        type="button"
                                        aria-expanded={isOpen}
                                        aria-controls={`sidebar-group-${group.title}`}
                                        onClick={() => toggleGroup(group.title)}
                                        className={cn(
                                            'flex h-12 w-full items-center gap-3 rounded-lg px-4 text-left text-sm font-semibold text-[#101828] hover:bg-[#F2F4F7]',
                                            isOpen &&
                                                'bg-brand-50 text-brand-500',
                                        )}
                                    >
                                        <group.icon
                                            className={cn(
                                                'size-6 text-[#667085]',
                                                isOpen && 'text-brand-500',
                                            )}
                                            strokeWidth={1.8}
                                        />
                                        <span className="flex-1">
                                            {group.title}
                                        </span>
                                        {group.badge && <NewBadge />}
                                        <ChevronDown
                                            className={cn(
                                                'size-5 text-[#344054] transition-transform duration-200',
                                                isOpen &&
                                                    'rotate-180 text-brand-500',
                                            )}
                                            strokeWidth={2}
                                        />
                                    </button>

                                    <div
                                        id={`sidebar-group-${group.title}`}
                                        className={cn(
                                            'grid transition-all duration-200 ease-out',
                                            isOpen
                                                ? 'grid-rows-[1fr] opacity-100'
                                                : 'grid-rows-[0fr] opacity-0',
                                        )}
                                    >
                                        <div className="overflow-hidden">
                                            <div
                                                className={cn(
                                                    'mt-2 mb-2 ml-11 flex flex-col gap-1',
                                                    !isDashboard && 'mb-3',
                                                )}
                                            >
                                                {group.items.map(
                                                    (item, index) => (
                                                        <Link
                                                            key={item.title}
                                                            href={dashboard()}
                                                            prefetch
                                                            className={cn(
                                                                'flex h-10 items-center justify-between rounded-lg px-3 text-sm font-medium text-[#101828] hover:bg-[#F2F4F7]',
                                                                isDashboard &&
                                                                    index ===
                                                                        0 &&
                                                                    'bg-brand-50 text-brand-500',
                                                            )}
                                                        >
                                                            <span>
                                                                {item.title}
                                                            </span>
                                                            {item.badge && (
                                                                <NewBadge />
                                                            )}
                                                        </Link>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 rounded-2xl border border-[#E4E7EC] bg-[#F9FAFB] p-4">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-white text-brand-500">
                            <Box className="size-5" strokeWidth={1.8} />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-[#101828]">
                            Webcare CRM
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#667085]">
                            Operasional klien, tiket, dan penjualan dalam satu
                            dashboard.
                        </p>
                    </div>
                </nav>
            </div>
        </aside>
    );
}
