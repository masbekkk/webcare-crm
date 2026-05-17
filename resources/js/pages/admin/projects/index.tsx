import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Edit,
    Plus,
    Trash2,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import {
    create,
    destroy,
    edit,
    index as projectsIndex,
} from '@/actions/App/Http/Controllers/Admin/ProjectController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    cleanQuery,
    Field,
    FilterActions,
    Pagination,
    Stat,
    type PaginationLink,
} from '@/pages/admin/monitoring-index-components';

type Filters = {
    search: string | null;
    sort: string | null;
    direction: string | null;
};

type ProjectRow = {
    id: number;
    name: string;
    slug: string;
    project_type: string;
    payment_model: string;
    status: string;
    contract_value: string;
    client: { company_name: string };
    creator: { name: string } | null;
    links_count: number;
    members_count: number;
    payment_timelines_count: number;
};

type PaginatedProjects = {
    data: ProjectRow[];
    from: number | null;
    links: PaginationLink[];
};

type Stats = {
    total_count: number;
    live_count: number;
    in_progress_count: number;
    blocked_count: number;
};

export default function ProjectsIndex({
    projects,
    filters,
    stats,
}: {
    projects: PaginatedProjects;
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
            projectsIndex.url({ query: cleanQuery(nextForm) }),
            {},
            { preserveScroll: true },
        );
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        visit(form);
    };

    const reset = () => {
        router.get(projectsIndex.url(), {}, { preserveScroll: true });
    };

    const sortBy = (sort: 'project' | 'client') => {
        const direction =
            form.sort === sort && form.direction === 'asc' ? 'desc' : 'asc';
        const nextForm = { ...form, sort, direction };

        setForm(nextForm);
        visit(nextForm);
    };

    const deleteProject = (project: ProjectRow) => {
        if (!window.confirm(`Delete project "${project.name}"?`)) {
            return;
        }

        router.delete(destroy.url(project.id), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Projects" />
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#101828]">
                            Projects
                        </h1>
                        <p className="mt-1 text-sm text-[#667085]">
                            Manage client projects, links, members, and payment
                            timelines.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus className="size-4" />
                            New project
                        </Link>
                    </Button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Stat
                        title="Filtered projects"
                        value={`${stats.total_count}`}
                    />
                    <Stat title="Live" value={`${stats.live_count}`} />
                    <Stat
                        title="In progress"
                        value={`${stats.in_progress_count}`}
                    />
                    <Stat title="Blocked" value={`${stats.blocked_count}`} />
                </div>

                <form
                    onSubmit={submit}
                    className="mt-6 rounded-lg border border-[#E4E7EC] bg-white p-5"
                >
                    <div className="grid gap-4 lg:grid-cols-3">
                        <Field label="Search">
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
                    <FilterActions
                        summary={`${stats.total_count} projects match current filters.`}
                        onReset={reset}
                    />
                </form>

                <div className="mt-6 overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[960px] text-left text-sm">
                            <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#667085] uppercase">
                                <tr>
                                    <th className="w-20 px-5 py-3">No</th>
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
                                    <th className="px-5 py-3">Type</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Payment</th>
                                    <th className="px-5 py-3">Relations</th>
                                    <th className="px-5 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E7EC]">
                                {projects.data.map((project, index) => (
                                    <tr key={project.id}>
                                        <td className="px-5 py-4 text-[#667085]">
                                            {(projects.from ?? 1) + index}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-[#101828]">
                                                {project.name}
                                            </div>
                                            <div className="text-xs text-[#667085]">
                                                {project.slug}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {project.client.company_name}
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {project.project_type}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-500">
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {project.payment_model}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            {project.links_count} links,{' '}
                                            {project.members_count} members,{' '}
                                            {project.payment_timelines_count}{' '}
                                            payments
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit(project.id)}
                                                    >
                                                        <Edit className="size-4" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        deleteProject(project)
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

                    {projects.data.length === 0 && (
                        <div className="px-5 py-12 text-center text-sm text-[#667085]">
                            No projects found.
                        </div>
                    )}

                    <Pagination links={projects.links} />
                </div>
            </div>
        </>
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
