import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import {
    create,
    edit,
    index as issuesIndex,
    show,
} from '@/actions/App/Http/Controllers/Admin/IssueController';
import { edit as editProject } from '@/actions/App/Http/Controllers/Admin/ProjectController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    cleanQuery,
    Field,
    FilterActions,
    NativeSelect,
    Pagination,
    Stat,
    StatusBadge,
    type Option,
    type PaginationLink,
} from '@/pages/admin/monitoring-index-components';

type Filters = {
    search: string | null;
    client_id: string | null;
    project_id: string | null;
    priority: string | null;
    status: string | null;
    assigned_to: string | null;
    due_from: string | null;
    due_to: string | null;
};

type IssueRow = {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    due_date: string | null;
    resolved_at: string | null;
    closed_at: string | null;
    attachments_count: number;
    client: { company_name: string };
    project: { id: number; name: string; slug: string };
    reporter: { name: string } | null;
    assignee: { name: string } | null;
};

type Stats = {
    total_count: number;
    open_count: number;
    in_progress_count: number;
    high_priority_count: number;
};

const priorities = ['low', 'medium', 'high', 'urgent'];
const statuses = [
    'open',
    'in_progress',
    'waiting',
    'resolved',
    'closed',
    'cancelled',
];

function normalize(filters: Filters): Record<keyof Filters, string> {
    return {
        search: filters.search ?? '',
        client_id: filters.client_id ?? '',
        project_id: filters.project_id ?? '',
        priority: filters.priority ?? '',
        status: filters.status ?? '',
        assigned_to: filters.assigned_to ?? '',
        due_from: filters.due_from ?? '',
        due_to: filters.due_to ?? '',
    };
}

export default function IssuesIndex({
    issues,
    filters,
    stats,
    clients,
    projects,
    users,
}: {
    issues: { data: IssueRow[]; links: PaginationLink[] };
    filters: Filters;
    stats: Stats;
    clients: Option[];
    projects: Option[];
    users: Option[];
}) {
    const [form, setForm] = useState(normalize(filters));
    const filteredProjects = projects.filter(
        (project) =>
            !form.client_id || String(project.client_id) === form.client_id,
    );

    const setFilter = (key: keyof Filters, value: string) => {
        setForm((current) => ({
            ...current,
            [key]: value,
            ...(key === 'client_id' ? { project_id: '' } : {}),
        }));
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get(
            issuesIndex.url({ query: cleanQuery(form) }),
            {},
            { preserveScroll: true },
        );
    };

    const reset = () => {
        router.get(issuesIndex.url(), {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Issue list" />
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#101828]">
                            Issue list
                        </h1>
                        <p className="mt-1 text-sm text-[#667085]">
                            Track client issues, ownership, due dates, and
                            resolution status.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus className="size-4" />
                            New issue
                        </Link>
                    </Button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Stat
                        title="Filtered issues"
                        value={`${stats.total_count}`}
                    />
                    <Stat title="Open" value={`${stats.open_count}`} />
                    <Stat
                        title="In progress"
                        value={`${stats.in_progress_count}`}
                    />
                    <Stat
                        title="High priority"
                        value={`${stats.high_priority_count}`}
                    />
                </div>

                <form
                    onSubmit={submit}
                    className="mt-6 rounded-lg border border-[#E4E7EC] bg-white p-5"
                >
                    <div className="grid gap-4 lg:grid-cols-4">
                        <Field label="Search">
                            <Input
                                value={form.search}
                                onChange={(event) =>
                                    setFilter('search', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="Client">
                            <NativeSelect
                                value={form.client_id}
                                onChange={(value) =>
                                    setFilter('client_id', value)
                                }
                            >
                                <option value="">All clients</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.company_name}
                                    </option>
                                ))}
                            </NativeSelect>
                        </Field>
                        <Field label="Project">
                            <NativeSelect
                                value={form.project_id}
                                onChange={(value) =>
                                    setFilter('project_id', value)
                                }
                            >
                                <option value="">All projects</option>
                                {filteredProjects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </NativeSelect>
                        </Field>
                        <Field label="Status">
                            <NativeSelect
                                value={form.status}
                                onChange={(value) => setFilter('status', value)}
                            >
                                <option value="">All statuses</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </NativeSelect>
                        </Field>
                        <Field label="Priority">
                            <NativeSelect
                                value={form.priority}
                                onChange={(value) =>
                                    setFilter('priority', value)
                                }
                            >
                                <option value="">All priorities</option>
                                {priorities.map((priority) => (
                                    <option key={priority} value={priority}>
                                        {priority}
                                    </option>
                                ))}
                            </NativeSelect>
                        </Field>
                        <Field label="Assignee">
                            <NativeSelect
                                value={form.assigned_to}
                                onChange={(value) =>
                                    setFilter('assigned_to', value)
                                }
                            >
                                <option value="">All assignees</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </NativeSelect>
                        </Field>
                        <Field label="Due from">
                            <Input
                                type="date"
                                value={form.due_from}
                                onChange={(event) =>
                                    setFilter('due_from', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="Due to">
                            <Input
                                type="date"
                                value={form.due_to}
                                onChange={(event) =>
                                    setFilter('due_to', event.target.value)
                                }
                            />
                        </Field>
                    </div>
                    <FilterActions
                        summary={`${stats.total_count} issues match current filters.`}
                        onReset={reset}
                    />
                </form>

                <div className="mt-6 overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-left text-sm">
                            <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#667085] uppercase">
                                <tr>
                                    <th className="px-5 py-3">Issue</th>
                                    <th className="px-5 py-3">Client</th>
                                    <th className="px-5 py-3">Owner</th>
                                    <th className="px-5 py-3">Due</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Priority</th>
                                    <th className="px-5 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E7EC]">
                                {issues.data.map((issue) => (
                                    <tr key={issue.id}>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-[#101828]">
                                                {issue.title}
                                            </div>
                                            <Link
                                                href={editProject(
                                                    issue.project.id,
                                                )}
                                                className="text-xs text-brand-500"
                                            >
                                                {issue.project.name}
                                            </Link>
                                            <div className="mt-1 line-clamp-2 text-xs text-[#667085]">
                                                {issue.description}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {issue.client.company_name}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            Reporter:{' '}
                                            {issue.reporter?.name ?? '-'}
                                            <br />
                                            Assignee:{' '}
                                            {issue.assignee?.name ?? '-'}
                                            <br />
                                            Files: {issue.attachments_count}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            {issue.due_date ?? '-'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge value={issue.status} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge
                                                value={issue.priority}
                                                tone={
                                                    issue.priority ===
                                                        'urgent' ||
                                                    issue.priority === 'high'
                                                        ? 'bad'
                                                        : 'neutral'
                                                }
                                            />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link href={show(issue.id)}>
                                                        <Eye className="size-4" />
                                                        View
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link href={edit(issue.id)}>
                                                        <Edit className="size-4" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {issues.data.length === 0 && (
                        <div className="px-5 py-12 text-center text-sm text-[#667085]">
                            No issues found.
                        </div>
                    )}

                    <Pagination links={issues.links} />
                </div>
            </div>
        </>
    );
}
