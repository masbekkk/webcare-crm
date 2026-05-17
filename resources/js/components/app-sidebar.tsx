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
import { index as clientsIndex } from '@/actions/App/Http/Controllers/Admin/ClientController';
import { index as projectLinksIndex } from '@/actions/App/Http/Controllers/Admin/ProjectLinkController';
import { index as usersIndex } from '@/actions/App/Http/Controllers/Admin/UserController';
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
        title: 'Dasbor',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        type: 'group',
        title: 'Klien & Pengguna',
        icon: UserRound,
        items: [
            {
                title: 'Klien',
                href: clientsIndex(),
                icon: UserRound,
            },
            {
                title: 'Pengguna',
                href: usersIndex(),
                icon: UserCog,
            },
        ],
    },
    {
        type: 'group',
        title: 'Proyek',
        icon: BriefcaseBusiness,
        items: [
            {
                title: 'Proyek',
                href: '/admin/projects',
                icon: BriefcaseBusiness,
            },
            {
                title: 'Link Project',
                href: projectLinksIndex(),
                icon: Link2,
            },
        ],
    },
    {
        type: 'item',
        title: 'Jadwal Pembayaran',
        href: '/admin/payment-timelines',
        icon: CircleDollarSign,
    },
    {
        type: 'group',
        title: 'Pemantauan',
        icon: Activity,
        items: [
            { title: 'Daftar Issue', href: '/admin/issues', icon: Bug },
            {
                title: 'Monitor Website',
                href: '/admin/monitors',
                icon: MonitorCheck,
            },
            {
                title: 'Log Pemeriksaan',
                href: '/admin/website-check-logs',
                icon: Activity,
            },
            {
                title: 'Incident',
                href: '/admin/website-incidents',
                icon: Siren,
            },
        ],
    },
    {
        type: 'group',
        title: 'Operasional',
        icon: Wrench,
        items: [
            {
                title: 'Log Pemeliharaan',
                href: '/admin/maintenance-logs',
                icon: Wrench,
            },
            {
                title: 'Aset Domain',
                href: '/admin/domain-assets',
                icon: Globe2,
            },
            {
                title: 'Aset Hosting',
                href: '/admin/hosting-assets',
                icon: Server,
            },
            {
                title: 'Tidaktifikasi',
                href: '/admin/notifications',
                icon: Bell,
            },
        ],
    },
    {
        type: 'group',
        title: 'Pengaturan',
        icon: Settings,
        items: [
            { title: 'Profil', href: '/settings/profile', icon: UserRound },
            {
                title: 'Security',
                href: '/settings/security',
                icon: ShieldCheck,
            },
            {
                title: 'Tampilan',
                href: '/settings/appearance',
                icon: Settings,
            },
        ],
    },
];

export function AppSidebar() {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        'Client & User': true,
        Project: true,
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
                </nav>
            </div>
        </aside>
    );
}
