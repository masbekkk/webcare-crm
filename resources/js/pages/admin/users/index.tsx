import { Head, Link, router } from '@inertiajs/react';
import { ArrowDown, Edit, Plus, Search, Trash2, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import {
    create,
    destroy,
    edit,
    index as usersIndex,
} from '@/actions/App/Http/Controllers/Admin/UserController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type UserRow = {
    id: number;
    name: string;
    email: string;
    role: string;
    phone: string | null;
    is_active: boolean;
    client: {
        id: number;
        company_name: string;
    } | null;
};

type PaginatedUser = {
    data: UserRow[];
    from: number | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type Filters = {
    search: string;
    sort: string;
    direction: string;
};

type Stats = {
    total_count: number;
    active_count: number;
    admin_count: number;
    client_count: number;
};

export default function UserIndex({
    users,
    filters,
    stats,
}: {
    users: PaginatedUser;
    filters: Filters;
    stats: Stats;
}) {
    const [search, setSearch] = useState(filters.search);

    const deleteUser = (user: UserRow) => {
        if (!window.confirm(`Delete user "${user.name}"?`)) {
            return;
        }

        router.delete(destroy.url(user.id), { preserveScroll: true });
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get(
            usersIndex.url({
                query: {
                    search,
                    sort: filters.sort,
                    direction: filters.direction,
                },
            }),
            {},
            { preserveScroll: true },
        );
    };

    const reset = () => {
        router.get(usersIndex.url(), {}, { preserveScroll: true });
    };

    const sortUrl = (sort: 'user' | 'client') => {
        const direction =
            filters.sort === sort && filters.direction === 'asc'
                ? 'desc'
                : 'asc';

        return usersIndex.url({
            query: {
                search: filters.search,
                sort,
                direction,
            },
        });
    };

    return (
        <>
            <Head title="User" />
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#101828]">
                            User
                        </h1>
                        <p className="mt-1 text-sm text-[#667085]">
                            Manage admin and client portal accounts.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus className="size-4" />
                            New user
                        </Link>
                    </Button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Stat title="Total pengguna" value={stats.total_count} />
                    <Stat title="Active" value={stats.active_count} />
                    <Stat title="Admin" value={stats.admin_count} />
                    <Stat title="User klien" value={stats.client_count} />
                </div>

                <form
                    onSubmit={submit}
                    className="mt-6 flex flex-col gap-3 rounded-lg border border-[#E4E7EC] bg-white p-4 sm:flex-row"
                >
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari pengguna atau klien..."
                        className="sm:max-w-sm"
                    />
                    <div className="flex gap-2">
                        <Button type="submit">
                            <Search className="size-4" />
                            Cari
                        </Button>
                        <Button type="button" variant="outline" onClick={reset}>
                            <X className="size-4" />
                            Reset
                        </Button>
                    </div>
                </form>

                <div className="mt-6 overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[920px] text-left text-sm">
                            <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#667085] uppercase">
                                <tr>
                                    <th className="px-5 py-3">Tidak.</th>
                                    <SortableHeader href={sortUrl('user')}>
                                        User
                                    </SortableHeader>
                                    <th className="px-5 py-3">Peran</th>
                                    <SortableHeader href={sortUrl('client')}>
                                        Client
                                    </SortableHeader>
                                    <th className="px-5 py-3">Telepon</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E7EC]">
                                {users.data.map((user, index) => (
                                    <tr key={user.id}>
                                        <td className="px-5 py-4 text-[#667085]">
                                            {(users.from ?? 1) + index}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-[#101828]">
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-[#667085]">
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-500">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {user.client?.company_name ?? '-'}
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {user.phone ?? '-'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={
                                                    user.is_active
                                                        ? 'rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700'
                                                        : 'rounded-full bg-[#F2F4F7] px-2.5 py-1 text-xs font-semibold text-[#667085]'
                                                }
                                            >
                                                {user.is_active
                                                    ? 'active'
                                                    : 'inactive'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link href={edit(user.id)}>
                                                        <Edit className="size-4" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        deleteUser(user)
                                                    }
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="size-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.data.length === 0 && (
                        <div className="px-5 py-12 text-center text-sm text-[#667085]">
                            Tidak users found.
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 border-t border-[#E4E7EC] px-5 py-4">
                        {users.links.map((link) => (
                            <Button
                                key={`${link.label}-${link.url}`}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={Boolean(link.url)}
                            >
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

function Stat({ title, value }: { title: string; value: number }) {
    return (
        <div className="rounded-lg border border-[#E4E7EC] bg-white p-4">
            <p className="text-xs font-medium text-[#667085]">{title}</p>
            <p className="mt-2 text-xl font-semibold text-[#101828]">
                {value}
            </p>
        </div>
    );
}

function SortableHeader({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <th className="px-5 py-3">
            <Link href={href} className="inline-flex items-center gap-1">
                {children}
                <ArrowDown className="size-3.5" />
            </Link>
        </th>
    );
}
