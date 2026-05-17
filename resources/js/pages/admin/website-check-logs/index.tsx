import { Head, router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { index as checkLogsIndex } from '@/actions/App/Http/Controllers/Admin/WebsiteCheckLogController';
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
    monitor_id: string | null;
    status: string | null;
    is_success: string | null;
    checked_from: string | null;
    checked_to: string | null;
};

type CheckLogRow = {
    id: number;
    checked_at: string;
    is_success: boolean;
    status: string;
    status_code: number | null;
    response_time_ms: number | null;
    error_type: string | null;
    error_message: string | null;
    monitor: { name: string; url: string };
    project: {
        name: string;
        client: { company_name: string };
    };
};

type Stats = {
    total_count: number;
    success_count: number;
    failure_count: number;
};

const statuses = ['up', 'down', 'timeout', 'error'];

function normalize(filters: Filters): Record<keyof Filters, string> {
    return {
        search: filters.search ?? '',
        client_id: filters.client_id ?? '',
        project_id: filters.project_id ?? '',
        monitor_id: filters.monitor_id ?? '',
        status: filters.status ?? '',
        is_success: filters.is_success ?? '',
        checked_from: filters.checked_from ?? '',
        checked_to: filters.checked_to ?? '',
    };
}

export default function WebsiteCheckLogsIndex({
    checkLogs,
    filters,
    stats,
    clients,
    projects,
    monitors,
}: {
    checkLogs: { data: CheckLogRow[]; links: PaginationLink[] };
    filters: Filters;
    stats: Stats;
    clients: Option[];
    projects: Option[];
    monitors: Option[];
}) {
    const [form, setForm] = useState(normalize(filters));
    const filteredProjects = projects.filter(
        (project) =>
            !form.client_id || String(project.client_id) === form.client_id,
    );
    const filteredMonitors = monitors.filter(
        (monitor) =>
            !form.project_id || String(monitor.project_id) === form.project_id,
    );

    const setFilter = (key: keyof Filters, value: string) => {
        setForm((current) => ({
            ...current,
            [key]: value,
            ...(key === 'client_id' ? { project_id: '', monitor_id: '' } : {}),
            ...(key === 'project_id' ? { monitor_id: '' } : {}),
        }));
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get(
            checkLogsIndex.url({ query: cleanQuery(form) }),
            {},
            { preserveScroll: true },
        );
    };

    const reset = () => {
        router.get(checkLogsIndex.url(), {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Website check logs" />
            <div className="p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Check logs
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Review every website check result and failure detail.
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <Stat
                        title="Filtered logs"
                        value={`${stats.total_count}`}
                    />
                    <Stat title="Successful" value={`${stats.success_count}`} />
                    <Stat title="Failed" value={`${stats.failure_count}`} />
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
                        <Field label="Monitor">
                            <NativeSelect
                                value={form.monitor_id}
                                onChange={(value) =>
                                    setFilter('monitor_id', value)
                                }
                            >
                                <option value="">All monitors</option>
                                {filteredMonitors.map((monitor) => (
                                    <option key={monitor.id} value={monitor.id}>
                                        {monitor.name}
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
                        <Field label="Result">
                            <NativeSelect
                                value={form.is_success}
                                onChange={(value) =>
                                    setFilter('is_success', value)
                                }
                            >
                                <option value="">All</option>
                                <option value="1">Success</option>
                                <option value="0">Failed</option>
                            </NativeSelect>
                        </Field>
                        <Field label="Checked from">
                            <Input
                                type="date"
                                value={form.checked_from}
                                onChange={(event) =>
                                    setFilter(
                                        'checked_from',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Checked to">
                            <Input
                                type="date"
                                value={form.checked_to}
                                onChange={(event) =>
                                    setFilter('checked_to', event.target.value)
                                }
                            />
                        </Field>
                    </div>
                    <FilterActions
                        summary={`${stats.total_count} logs match current filters.`}
                        onReset={reset}
                    />
                </form>

                <div className="mt-6 overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1050px] text-left text-sm">
                            <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#667085] uppercase">
                                <tr>
                                    <th className="px-5 py-3">Checked</th>
                                    <th className="px-5 py-3">Monitor</th>
                                    <th className="px-5 py-3">Project</th>
                                    <th className="px-5 py-3">Response</th>
                                    <th className="px-5 py-3">Error</th>
                                    <th className="px-5 py-3">Result</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E7EC]">
                                {checkLogs.data.map((log) => (
                                    <tr key={log.id}>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            {log.checked_at}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-[#101828]">
                                                {log.monitor.name}
                                            </div>
                                            <div className="max-w-[280px] truncate text-xs text-[#667085]">
                                                {log.monitor.url}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            <div className="font-medium text-[#344054]">
                                                {log.project.name}
                                            </div>
                                            {log.project.client.company_name}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            HTTP {log.status_code ?? '-'}
                                            <br />
                                            {log.response_time_ms ?? '-'} ms
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            {log.error_type ?? '-'}
                                            <div className="mt-1 max-w-[300px] truncate">
                                                {log.error_message ?? '-'}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge
                                                value={log.status}
                                                tone={
                                                    log.is_success
                                                        ? 'good'
                                                        : 'bad'
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {checkLogs.data.length === 0 && (
                        <div className="px-5 py-12 text-center text-sm text-[#667085]">
                            No check logs found.
                        </div>
                    )}

                    <Pagination links={checkLogs.links} />
                </div>
            </div>
        </>
    );
}
