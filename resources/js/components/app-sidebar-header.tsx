import { Link, usePage } from '@inertiajs/react';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { dashboard } from '@/routes';

const notifications = [
    {
        title: 'Proposal proyek disetujui',
        description: 'Proposal Webcare CRM dipindahkan ke proyek aktif.',
        time: '2 menit lalu',
    },
    {
        title: 'Pengingat invoice',
        description: 'Pembayaran retainer untuk Acme Studio jatuh tempo hari ini.',
        time: '1 jam lalu',
    },
    {
        title: 'Monitor pulih',
        description: 'Situs company profile kembali online.',
        time: '3 jam lalu',
    },
];

export function AppSidebarHeader() {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const userName = auth.user?.name ?? 'Musharof';

    return (
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#E4E7EC] bg-white px-4 lg:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-4">
                <Link
                    href={dashboard()}
                    prefetch
                    className="flex size-11 items-center justify-center rounded-[10px] border border-[#E4E7EC] text-[#667085] hover:bg-[#F9FAFB] lg:hidden"
                    aria-label="Buka menu"
                >
                    <Menu className="size-5" strokeWidth={1.8} />
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="relative flex size-11 items-center justify-center rounded-full border border-[#E4E7EC] text-[#667085] hover:bg-[#F9FAFB]"
                            aria-label="Tidaktifikasi"
                        >
                            <Bell className="size-5" strokeWidth={1.8} />
                            <span className="absolute top-2 right-2 size-2 rounded-full bg-[#FD853A]" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[320px] p-0" align="end">
                        <div className="border-b border-[#E4E7EC] px-4 py-3">
                            <p className="text-sm font-semibold text-[#101828]">
                                Tidaktifikasi
                            </p>
                            <p className="text-xs text-[#667085]">
                                Aktivitas akun terbaru.
                            </p>
                        </div>
                        <div className="max-h-[320px] overflow-y-auto">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.title}
                                    className="border-b border-[#F2F4F7] px-4 py-3 last:border-b-0"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="mt-1 size-2 rounded-full bg-brand-500" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-[#101828]">
                                                {notification.title}
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-[#667085]">
                                                {notification.description}
                                            </p>
                                            <p className="mt-2 text-xs text-[#98A2B3]">
                                                {notification.time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 rounded-full text-left">
                            <Avatar className="size-11">
                                <AvatarImage
                                    src={auth.user?.avatar}
                                    alt={userName}
                                />
                                <AvatarFallback className="bg-[#E4E7EC] text-sm font-semibold text-[#344054]">
                                    {getInitials(userName)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden text-sm font-semibold text-[#101828] md:block">
                                {userName}
                            </span>
                            <ChevronDown className="hidden size-5 text-[#344054] md:block" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        {auth.user && <UserMenuContent user={auth.user} />}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
