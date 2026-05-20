import { Head, Link, router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import { index as projectLinksIndex } from '@/actions/App/Http/Controllers/Admin/ProjectLinkController';
import { edit as editProject } from '@/actions/App/Http/Controllers/Admin/ProjectController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    cleanQuery,
    Field,
    FilterAksi,
    Pagination,
    Stat,
    type PaginationLink,
} from '@/pages/admin/monitoring-index-components';

type Filters = {
    search: string | null;
    sort: string | null;
    direction: string | null;
};

type ProjectLinkRow = {
    id: number;
    type: string;
    label: string;
    url: string;
    username: string | null;
    notes: string | null;
    is_primary: boolean;
    is_active: boolean;
    project: {
        id: number;
        name: string;
        slug: string;
        client: {
            company_name: string;
        };
    };
};

type PaginatedProjectLinks = {
    data: ProjectLinkRow[];
    from: number | null;
    links: PaginationLink[];
};

type Stats = {
    total_count: number;
    active_count: number;
    primary_count: number;
    inactive_count: number;
};

export default function ProjectLinksIndex({
    projectLinks,
    filters,
    stats,
}: {
    projectLinks: PaginatedProjectLinks;
    filters: Filters;
    stats: Stats;
}) {
    const [form, setForm] = useState({
        search: filters.search ?? '',
        sort: filters.sort ?? '',
        direction: filters.direction ?? '',
    });

    const visit = (nextForm: typeof form) => {
        router.get(
            projectLinksIndex.url({ query: cleanQuery(nextForm) }),
            {},
            { preserveScroll: true },
        );
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        visit(form);
    };

    const reset = () => {
        router.get(projectLinksIndex.url(), {}, { preserveScroll: true });
    };

    const sortBy = (sort: 'project' | 'client') => {
        const direction =
            form.sort === sort && form.direction === 'asc' ? 'desc' : 'asc';
        const nextForm = { ...form, sort, direction };

        setForm(nextForm);
        visit(nextForm);
    };

    return (
        <>
            <Head title="Tautan proyek" />
            <div className="p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Tautan proyek
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        View production, staging, repository, documentation, and
                        other project URLs.
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Stat
                        title="Link terfilter"
                        value={`${stats.total_count}`}
                    />
                    <Stat title="Active" value={`${stats.active_count}`} />
                    <Stat title="Utama" value={`${stats.primary_count}`} />
                    <Stat title="Tidak aktif" value={`${stats.inactive_count}`} />
                </div>

                <form
                    onSubmit={submit}
                    className="mt-6 rounded-lg border border-[#E4E7EC] bg-white p-5"
                >
                    <div className="grid gap-4 lg:grid-cols-3">
                        <Field label="Cari">
                            <Input
                                value={form.search}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        search: event.target.value,
                                    }))
                                }
                            />
                        </Field>
                    </div>
                    <FilterAksi
                        summary={`${stats.total_count} project links match current filters.`}
                        onReset={reset}
                    />
                </form>

                <div className="mt-6 overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-left text-sm">
                            <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#667085] uppercase">
                                <tr>
                                    <th className="w-20 px-5 py-3">Tidak</th>
                                    <th className="px-5 py-3">Link</th>
                                    <th className="px-5 py-3">
                                        <SortButton
                                            active={form.sort === 'project'}
                                            direction={form.direction}
                                            onClick={() => sortBy('project')}
                                        >
                                            Project
                                        </SortButton>
                                    </th>
                                    <th className="px-5 py-3">
                                        <SortButton
                                            active={form.sort === 'client'}
                                            direction={form.direction}
                                            onClick={() => sortBy('client')}
                                        >
                                            Client
                                        </SortButton>
                                    </th>
                                    <th className="px-5 py-3">Akses</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3 text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E7EC]">
                                {projectLinks.data.map((projectLink, index) => (
                                    <tr key={projectLink.id}>
                                        <td className="px-5 py-4 text-[#667085]">
                                            {(projectLinks.from ?? 1) + index}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-[#101828]">
                                                {projectLink.label}
                                            </div>
                                            <div className="mt-1 max-w-[360px] truncate text-xs text-[#667085]">
                                                {projectLink.url}
                                            </div>
                                            {projectLink.notes && (
                                                <div className="mt-1 max-w-[360px] truncate text-xs text-[#667085]">
                                                    {projectLink.notes}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Link
                                                href={editProject(
                                                    projectLink.project.id,
                                                )}
                                                className="font-medium text-brand-500"
                                            >
                                                {projectLink.project.name}
                                            </Link>
                                            <div className="text-xs text-[#667085]">
                                                {projectLink.project.slug}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {
                                                projectLink.project.client
                                                    .company_name
                                            }
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            Tipe: {projectLink.type}
                                            <br />
                                            Username:{' '}
                                            {projectLink.username ?? '-'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {projectLink.is_primary && (
                                                    <Badge>Utama</Badge>
                                                )}
                                                <Badge>
                                                    {projectLink.is_active
                                                        ? 'Active'
                                                        : 'Tidak aktif'}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={projectLink.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <ExternalLink className="size-4" />
                                                        Terbuka
                                                    </a>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {projectLinks.data.length === 0 && (
                        <div className="px-5 py-12 text-center text-sm text-[#667085]">
                            Tidak project links found.
                        </div>
                    )}

                    <Pagination links={projectLinks.links} />
                </div>
            </div>
        </>
    );
}

function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-500">
            {children}
        </span>
    );
}

function SortButton({
    active,
    direction,
    onClick,
    children,
}: {
    active: boolean;
    direction: string;
    onClick: () => void;
    children: ReactNode;
}) {
    const Icon = !active
        ? ArrowUpDown
        : direction === 'desc'
          ? ArrowDown
          : ArrowUp;

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-1 font-semibold uppercase"
        >
            {children}
            <Icon className="size-3.5" />
        </button>
    );
}
