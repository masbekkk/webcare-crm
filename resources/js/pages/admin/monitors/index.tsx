import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import {
    create,
    destroy,
    edit,
    index as monitorsIndex,
    show,
} from '@/actions/App/Http/Controllers/Admin/WebsiteMonitorController';
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
    status: string | null;
    is_active: string | null;
};

type MonitorRow = {
    id: number;
    name: string;
    url: string;
    method: string;
    expected_status_code: number;
    timeout_seconds: number;
    check_interval_seconds: number;
    is_active: boolean;
    current_status: string;
    last_status_code: number | null;
    last_response_time_ms: number | null;
    last_checked_at: string | null;
    consecutive_failures: number;
    consecutive_successes: number;
    check_logs_count: number;
    incidents_count: number;
    project: {
        name: string;
        client: { company_name: string };
    };
    project_link: { label: string; url: string } | null;
};

type Stats = {
    total_count: number;
    active_count: number;
    up_count: number;
    down_count: number;
};

const statuses = ['unknown', 'up', 'down', 'degraded'];

function normalize(filters: Filters): Record<keyof Filters, string> {
    return {
        search: filters.search ?? '',
        client_id: filters.client_id ?? '',
        project_id: filters.project_id ?? '',
        status: filters.status ?? '',
        is_active: filters.is_active ?? '',
    };
}

export default function MonitorsIndex({
    monitors,
    filters,
    stats,
    clients,
    projects,
}: {
    monitors: { data: MonitorRow[]; links: PaginationLink[] };
    filters: Filters;
    stats: Stats;
    clients: Option[];
    projects: Option[];
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
            monitorsIndex.url({ query: cleanQuery(form) }),
            {},
            { preserveScroll: true },
        );
    };

    const reset = () => {
        router.get(monitorsIndex.url(), {}, { preserveScroll: true });
    };

    const deleteMonitor = (monitor: MonitorRow) => {
        if (!window.confirm(`Delete monitor "${monitor.name}"?`)) {
            return;
        }

        router.delete(destroy.url(monitor.id), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Website monitors" />
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#101828]">
                            Website monitors
                        </h1>
                        <p className="mt-1 text-sm text-[#667085]">
                            Watch uptime, response time, and recent monitor
                            health.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus className="size-4" />
                            New monitor
                        </Link>
                    </Button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Stat
                        title="Filtered monitors"
                        value={`${stats.total_count}`}
                    />
                    <Stat title="Active" value={`${stats.active_count}`} />
                    <Stat title="Up" value={`${stats.up_count}`} />
                    <Stat title="Down" value={`${stats.down_count}`} />
                </div>

                <form
                    onSubmit={submit}
                    className="mt-6 rounded-lg border border-[#E4E7EC] bg-white p-5"
                >
                    <div className="grid gap-4 lg:grid-cols-5">
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
                        <Field label="Active">
                            <NativeSelect
                                value={form.is_active}
                                onChange={(value) =>
                                    setFilter('is_active', value)
                                }
                            >
                                <option value="">All</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </NativeSelect>
                        </Field>
                    </div>
                    <FilterActions
                        summary={`${stats.total_count} monitors match current filters.`}
                        onReset={reset}
                    />
                </form>

                <div className="mt-6 overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-left text-sm">
                            <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#667085] uppercase">
                                <tr>
                                    <th className="px-5 py-3">Monitor</th>
                                    <th className="px-5 py-3">Project</th>
                                    <th className="px-5 py-3">Check</th>
                                    <th className="px-5 py-3">Last result</th>
                                    <th className="px-5 py-3">Streak</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E7EC]">
                                {monitors.data.map((monitor) => (
                                    <tr key={monitor.id}>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-[#101828]">
                                                {monitor.name}
                                            </div>
                                            <div className="max-w-[340px] truncate text-xs text-[#667085]">
                                                {monitor.url}
                                            </div>
                                            <div className="mt-1 text-xs text-[#667085]">
                                                {monitor.project_link?.label ??
                                                    '-'}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            <div className="font-medium text-[#344054]">
                                                {monitor.project.name}
                                            </div>
                                            {
                                                monitor.project.client
                                                    .company_name
                                            }
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            {monitor.method} expects{' '}
                                            {monitor.expected_status_code}
                                            <br />
                                            Every{' '}
                                            {monitor.check_interval_seconds}s,
                                            timeout {monitor.timeout_seconds}s
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            HTTP{' '}
                                            {monitor.last_status_code ?? '-'}
                                            <br />
                                            {monitor.last_response_time_ms ??
                                                '-'}{' '}
                                            ms
                                            <br />
                                            {monitor.last_checked_at ?? '-'}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            Failures:{' '}
                                            {monitor.consecutive_failures}
                                            <br />
                                            Successes:{' '}
                                            {monitor.consecutive_successes}
                                            <br />
                                            Logs: {monitor.check_logs_count},
                                            incidents: {monitor.incidents_count}
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge
                                                value={monitor.current_status}
                                                tone={
                                                    monitor.current_status ===
                                                    'up'
                                                        ? 'good'
                                                        : monitor.current_status ===
                                                            'down'
                                                          ? 'bad'
                                                          : 'neutral'
                                                }
                                            />
                                            <div className="mt-2 text-xs text-[#667085]">
                                                {monitor.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={show(monitor.id)}
                                                    >
                                                        <Eye className="size-4" />
                                                        View
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit(monitor.id)}
                                                    >
                                                        <Edit className="size-4" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600"
                                                    onClick={() =>
                                                        deleteMonitor(monitor)
                                                    }
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

                    {monitors.data.length === 0 && (
                        <div className="px-5 py-12 text-center text-sm text-[#667085]">
                            No monitors found.
                        </div>
                    )}

                    <Pagination links={monitors.links} />
                </div>
            </div>
        </>
    );
}
