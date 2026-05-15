import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronDown,
    Command,
    Menu,
    Moon,
    Search,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { dashboard } from '@/routes';

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
                    aria-label="Open menu"
                >
                    <Menu className="size-5" strokeWidth={1.8} />
                </Link>

                <button
                    type="button"
                    className="hidden size-11 items-center justify-center rounded-[10px] border border-[#E4E7EC] text-[#667085] hover:bg-[#F9FAFB] lg:flex"
                    aria-label="Collapse sidebar"
                >
                    <Menu className="size-5" strokeWidth={1.8} />
                </button>

                <label className="hidden h-11 w-full max-w-[540px] items-center rounded-[10px] border border-[#E4E7EC] bg-white px-4 text-sm text-[#667085] shadow-[0_1px_2px_rgba(16,24,40,0.04)] md:flex">
                    <Search className="mr-3 size-5 text-[#667085]" />
                    <input
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98A2B3]"
                        placeholder="Search or type command..."
                    />
                    <span className="ml-3 inline-flex h-8 items-center gap-1 rounded-lg border border-[#E4E7EC] px-2 text-xs text-[#667085]">
                        <Command className="size-3.5" />
                        K
                    </span>
                </label>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="flex size-11 items-center justify-center rounded-full border border-[#E4E7EC] text-[#667085] hover:bg-[#F9FAFB]"
                    aria-label="Toggle dark mode"
                >
                    <Moon className="size-5" strokeWidth={1.8} />
                </button>

                <button
                    type="button"
                    className="relative flex size-11 items-center justify-center rounded-full border border-[#E4E7EC] text-[#667085] hover:bg-[#F9FAFB]"
                    aria-label="Notifications"
                >
                    <Bell className="size-5" strokeWidth={1.8} />
                    <span className="absolute top-2 right-2 size-2 rounded-full bg-[#FD853A]" />
                </button>

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
