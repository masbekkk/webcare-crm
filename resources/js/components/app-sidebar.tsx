import { Link } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import {
    Activity,
    Bell,
    BriefcaseBusiness,
    Bug,
    ChevronDown,
    CircleDollarSign,
    Globe2,
    LayoutDashboard,
    Link2,
    MonitorCheck,
    Server,
    Settings,
    ShieldCheck,
    Siren,
    UserCog,
    UserRound,
    UsersRound,
    Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import AppLogo from '@/components/app-logo';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';

type SidebarGroup = {
    type: 'group';
    title: string;
    icon: LucideIcon;
    items: SidebarItem[];
};

type SidebarItem = {
    type?: 'item';
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon: LucideIcon;
};

type SidebarNavEntry = SidebarGroup | SidebarItem;

const sidebarNavEntries: SidebarNavEntry[] = [
    {
        type: 'item',
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        type: 'item',
        title: 'Clients',
        href: '/admin/clients',
        icon: UsersRound,
    },
    {
        type: 'item',
        title: 'Users',
        href: '/admin/users',
        icon: UserCog,
    },
    {
        type: 'group',
        title: 'Projects',
        icon: BriefcaseBusiness,
        items: [
            {
                title: 'Projects',
                href: '/admin/projects',
                icon: BriefcaseBusiness,
            },
            {
                title: 'Project Links',
                href: '/admin/project-links',
                icon: Link2,
            },
        ],
    },
    {
        type: 'item',
        title: 'Payment Timelines',
        href: '/admin/payment-timelines',
        icon: CircleDollarSign,
    },
    {
        type: 'group',
        title: 'Monitoring',
        icon: Activity,
        items: [
            { title: 'Issue List', href: '/admin/issues', icon: Bug },
            {
                title: 'Website Monitors',
                href: '/admin/monitors',
                icon: MonitorCheck,
            },
            {
                title: 'Check Logs',
                href: '/admin/website-check-logs',
                icon: Activity,
            },
            {
                title: 'Incidents',
                href: '/admin/website-incidents',
                icon: Siren,
            },
        ],
    },
    {
        type: 'group',
        title: 'Operations',
        icon: Wrench,
        items: [
            {
                title: 'Maintenance Logs',
                href: '/admin/maintenance-logs',
                icon: Wrench,
            },
            {
                title: 'Domain Assets',
                href: '/admin/domain-assets',
                icon: Globe2,
            },
            {
                title: 'Hosting Assets',
                href: '/admin/hosting-assets',
                icon: Server,
            },
            {
                title: 'Notifications',
                href: '/admin/notifications',
                icon: Bell,
            },
        ],
    },
    {
        type: 'group',
        title: 'Settings',
        icon: Settings,
        items: [
            { title: 'Profile', href: '/settings/profile', icon: UserRound },
            {
                title: 'Security',
                href: '/settings/security',
                icon: ShieldCheck,
            },
            {
                title: 'Appearance',
                href: '/settings/appearance',
                icon: Settings,
            },
        ],
    },
];

export function AppSidebar() {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        Projects: true,
    });

    const toggleGroup = (title: string) => {
        setOpenGroups((current) => ({
            ...current,
            [title]: !current[title],
        }));
    };

    const groupIsActive = (group: SidebarGroup): boolean =>
        group.items.some((item) => isCurrentOrParentUrl(item.href));

    return (
        <aside className="fixed inset-y-0 left-0 hidden w-[280px] overflow-y-auto border-r border-[#E4E7EC] bg-white lg:block">
            <div className="flex h-full flex-col px-5 py-6">
                <Link href={dashboard()} prefetch className="flex items-center">
                    <AppLogo />
                </Link>

                <nav className="mt-10">
                    <p className="mb-4 text-xs font-medium text-[#98A2B3]">
                        MENU
                    </p>

                    <div className="flex flex-col gap-1">
                        {sidebarNavEntries.map((entry) => {
                            if (entry.type !== 'group') {
                                const itemIsActive = isCurrentOrParentUrl(
                                    entry.href,
                                );

                                return (
                                    <Link
                                        key={entry.title}
                                        href={entry.href}
                                        prefetch
                                        className={cn(
                                            'flex h-12 w-full items-center gap-3 rounded-lg px-4 text-left text-sm font-semibold text-[#101828] hover:bg-[#F2F4F7]',
                                            itemIsActive &&
                                                'bg-brand-50 text-brand-500',
                                        )}
                                    >
                                        <entry.icon
                                            className={cn(
                                                'size-6 text-[#667085]',
                                                itemIsActive &&
                                                    'text-brand-500',
                                            )}
                                            strokeWidth={1.8}
                                        />
                                        <span className="flex-1">
                                            {entry.title}
                                        </span>
                                    </Link>
                                );
                            }

                            const group = entry;
                            const isActive = groupIsActive(group);
                            const isOpen =
                                openGroups[group.title] ?? isActive ?? false;

                            return (
                                <div key={group.title}>
                                    <button
                                        type="button"
                                        aria-expanded={isOpen}
                                        aria-controls={`sidebar-group-${group.title}`}
                                        onClick={() => toggleGroup(group.title)}
                                        className={cn(
                                            'flex h-12 w-full items-center gap-3 rounded-lg px-4 text-left text-sm font-semibold text-[#101828] hover:bg-[#F2F4F7]',
                                            (isOpen || isActive) &&
                                                'bg-brand-50 text-brand-500',
                                        )}
                                    >
                                        <group.icon
                                            className={cn(
                                                'size-6 text-[#667085]',
                                                (isOpen || isActive) &&
                                                    'text-brand-500',
                                            )}
                                            strokeWidth={1.8}
                                        />
                                        <span className="flex-1">
                                            {group.title}
                                        </span>
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
                                            <div className="mt-2 mb-3 ml-4 flex flex-col gap-1 border-l border-[#E4E7EC] pl-4">
                                                {group.items.map((item) => {
                                                    const itemIsActive =
                                                        isCurrentOrParentUrl(
                                                            item.href,
                                                        );

                                                    return (
                                                        <Link
                                                            key={item.title}
                                                            href={item.href}
                                                            prefetch
                                                            className={cn(
                                                                'flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#344054] hover:bg-[#F2F4F7] hover:text-[#101828]',
                                                                itemIsActive &&
                                                                    'bg-brand-50 text-brand-500',
                                                            )}
                                                        >
                                                            <item.icon
                                                                className={cn(
                                                                    'size-4 text-[#667085]',
                                                                    itemIsActive &&
                                                                        'text-brand-500',
                                                                )}
                                                                strokeWidth={
                                                                    1.9
                                                                }
                                                            />
                                                            <span className="truncate">
                                                                {item.title}
                                                            </span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] p-4">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-white text-brand-500">
                            <MonitorCheck
                                className="size-5"
                                strokeWidth={1.8}
                            />
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
