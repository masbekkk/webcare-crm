import { Head, router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { index as incidentsIndex } from '@/actions/App/Http/Controllers/Admin/WebsiteIncidentController';
import { Input } from '@/components/ui/input';
import {
    cleanQuery,
    Field,
    FilterAksi,
    formatDuration,
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
    started_from: string | null;
    started_to: string | null;
};

type IncidentRow = {
    id: number;
    started_at: string;
    resolved_at: string | null;
    duration_seconds: number | null;
    status: string;
    reason: string | null;
    first_error_message: string | null;
    last_error_message: string | null;
    monitor: { name: string; url: string };
    project: {
        name: string;
        client: { company_name: string };
    };
};

type Stats = {
    total_count: number;
    ongoing_count: number;
    resolved_count: number;
};

const statuses = ['ongoing', 'resolved'];

function normalize(filters: Filters): Record<keyof Filters, string> {
    return {
        search: filters.search ?? '',
        client_id: filters.client_id ?? '',
        project_id: filters.project_id ?? '',
        monitor_id: filters.monitor_id ?? '',
        status: filters.status ?? '',
        started_from: filters.started_from ?? '',
        started_to: filters.started_to ?? '',
    };
}

export default function WebsiteIncidentIndex({
    incidents,
    filters,
    stats,
    clients,
    projects,
    monitors,
}: {
    incidents: { data: IncidentRow[]; links: PaginationLink[] };
    filters: Filters;
    stats: Stats;
    clients: Option[];
    projects: Option[];
    monitors: Option[];
}) {
    const [form, setForm] = useState(normalize(filters));
    const filteredProject = projects.filter(
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
            incidentsIndex.url({ query: cleanQuery(form) }),
            {},
            { preserveScroll: true },
        );
    };

    const reset = () => {
        router.get(incidentsIndex.url(), {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Incident website" />
            <div className="p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Incident
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Audit downtime windows, recovery time, and root signals.
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <Stat
                        title="Incident terfilter"
                        value={`${stats.total_count}`}
                    />
                    <Stat title="Berlangsung" value={`${stats.ongoing_count}`} />
                    <Stat title="Selesai" value={`${stats.resolved_count}`} />
                </div>

                <form
                    onSubmit={submit}
                    className="mt-6 rounded-lg border border-[#E4E7EC] bg-white p-5"
                >
                    <div className="grid gap-4 lg:grid-cols-4">
                        <Field label="Cari">
                            <Input
                                value={form.search}
                                onChange={(event) =>
                                    setFilter('search', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="Klien">
                            <NativeSelect
                                value={form.client_id}
                                onChange={(value) =>
                                    setFilter('client_id', value)
                                }
                            >
                                <option value="">All klien</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.company_name}
                                    </option>
                                ))}
                            </NativeSelect>
                        </Field>
                        <Field label="Proyek">
                            <NativeSelect
                                value={form.project_id}
                                onChange={(value) =>
                                    setFilter('project_id', value)
                                }
                            >
                                <option value="">All proyek</option>
                                {filteredProject.map((project) => (
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
                                <option value="">All monitor</option>
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
                                <option value="">All status</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </NativeSelect>
                        </Field>
                        <Field label="Mulai dari">
                            <Input
                                type="date"
                                value={form.started_from}
                                onChange={(event) =>
                                    setFilter(
                                        'started_from',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Started to">
                            <Input
                                type="date"
                                value={form.started_to}
                                onChange={(event) =>
                                    setFilter('started_to', event.target.value)
                                }
                            />
                        </Field>
                    </div>
                    <FilterAksi
                        summary={`${stats.total_count} incidents match current filters.`}
                        onReset={reset}
                    />
                </form>

                <div className="mt-6 overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-left text-sm">
                            <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#667085] uppercase">
                                <tr>
                                    <th className="px-5 py-3">Incident</th>
                                    <th className="px-5 py-3">Monitor</th>
                                    <th className="px-5 py-3">Proyek</th>
                                    <th className="px-5 py-3">Rentang</th>
                                    <th className="px-5 py-3">Error</th>
                                    <th className="px-5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E7EC]">
                                {incidents.data.map((incident) => (
                                    <tr key={incident.id}>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-[#101828]">
                                                {incident.reason ?? 'Incident'}
                                            </div>
                                            <div className="text-xs text-[#667085]">
                                                Duration:{' '}
                                                {formatDuration(
                                                    incident.duration_seconds,
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-[#101828]">
                                                {incident.monitor.name}
                                            </div>
                                            <div className="max-w-[280px] truncate text-xs text-[#667085]">
                                                {incident.monitor.url}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            <div className="font-medium text-[#344054]">
                                                {incident.project.name}
                                            </div>
                                            {
                                                incident.project.client
                                                    .company_name
                                            }
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            Started: {incident.started_at}
                                            <br />
                                            Selesai:{' '}
                                            {incident.resolved_at ?? '-'}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            <div className="max-w-[300px] truncate">
                                                {incident.first_error_message ??
                                                    '-'}
                                            </div>
                                            <div className="mt-1 max-w-[300px] truncate">
                                                {incident.last_error_message ??
                                                    '-'}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge
                                                value={incident.status}
                                                tone={
                                                    incident.status ===
                                                    'resolved'
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

                    {incidents.data.length === 0 && (
                        <div className="px-5 py-12 text-center text-sm text-[#667085]">
                            Tidak incidents found.
                        </div>
                    )}

                    <Pagination links={incidents.links} />
                </div>
            </div>
        </>
    );
}
