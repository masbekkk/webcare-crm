import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import {
    destroy,
    edit,
    index as monitorsIndex,
} from '@/actions/App/Http/Controllers/Admin/WebsiteMonitorController';
import { edit as editProject } from '@/actions/App/Http/Controllers/Admin/ProjectController';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/pages/admin/monitoring-index-components';

type MonitorShowPayload = {
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
    last_down_at: string | null;
    last_recovered_at: string | null;
    consecutive_failures: number;
    consecutive_successes: number;
    check_logs_count: number;
    incidents_count: number;
    created_at: string;
    updated_at: string;
    project: {
        id: number;
        name: string;
        slug: string;
        client: { company_name: string };
    };
    project_link: {
        id: number;
        label: string;
        url: string;
    } | null;
};

function value(text: string | number | null): string {
    return text === null || text === '' ? '-' : String(text);
}

function dateTime(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

export default function MonitorsShow({
    monitor,
}: {
    monitor: MonitorShowPayload;
}) {
    const deleteMonitor = () => {
        if (!window.confirm(`Delete monitor "${monitor.name}"?`)) {
            return;
        }

        router.delete(destroy.url(monitor.id), { preserveScroll: true });
    };

    return (
        <>
            <Head title={monitor.name} />
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link
                            href={monitorsIndex()}
                            className="text-sm font-semibold text-brand-500"
                        >
                            Kembali ke monitor
                        </Link>
                        <h1 className="mt-3 text-2xl font-semibold text-[#101828]">
                            {monitor.name}
                        </h1>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <StatusBadge
                                value={monitor.current_status}
                                tone={
                                    monitor.current_status === 'up'
                                        ? 'good'
                                        : monitor.current_status === 'down'
                                          ? 'bad'
                                          : monitor.current_status ===
                                              'degraded'
                                            ? 'warn'
                                            : 'neutral'
                                }
                            />
                            <StatusBadge
                                value={monitor.is_active ? 'active' : 'inactive'}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={edit(monitor.id)}>
                                <Edit className="size-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="text-red-600"
                            onClick={deleteMonitor}
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Stat title="HTTP" value={value(monitor.last_status_code)} />
                    <Stat
                        title="Response"
                        value={
                            monitor.last_response_time_ms === null
                                ? '-'
                                : `${monitor.last_response_time_ms} ms`
                        }
                    />
                    <Stat
                        title="Check logs"
                        value={String(monitor.check_logs_count)}
                    />
                    <Stat
                        title="Incident"
                        value={String(monitor.incidents_count)}
                    />
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <Panel title="Monitor target">
                        <dl className="grid gap-4 text-sm">
                            <Detail label="URL" value={monitor.url} />
                            <Detail label="Metode" value={monitor.method} />
                            <Detail
                                label="Status yang diharapkan"
                                value={String(monitor.expected_status_code)}
                            />
                            <Detail
                                label="Timeout"
                                value={`${monitor.timeout_seconds}s`}
                            />
                            <Detail
                                label="Check interval"
                                value={`${monitor.check_interval_seconds}s`}
                            />
                        </dl>
                    </Panel>

                    <Panel title="Project">
                        <dl className="grid gap-4 text-sm">
                            <Detail
                                label="Klien"
                                value={monitor.project.client.company_name}
                            />
                            <div>
                                <dt className="text-xs font-medium text-[#667085]">
                                    Project
                                </dt>
                                <dd className="mt-1">
                                    <Link
                                        href={editProject(monitor.project.id)}
                                        className="font-semibold text-brand-500"
                                    >
                                        {monitor.project.name}
                                    </Link>
                                </dd>
                            </div>
                            <Detail
                                label="Project link"
                                value={monitor.project_link?.label ?? '-'}
                            />
                            <Detail
                                label="Project link URL"
                                value={monitor.project_link?.url ?? '-'}
                            />
                        </dl>
                    </Panel>

                    <Panel title="Hasil terakhir">
                        <dl className="grid gap-4 text-sm sm:grid-cols-2">
                            <Detail
                                label="Last checked"
                                value={dateTime(monitor.last_checked_at)}
                            />
                            <Detail
                                label="Last down"
                                value={dateTime(monitor.last_down_at)}
                            />
                            <Detail
                                label="Last recovered"
                                value={dateTime(monitor.last_recovered_at)}
                            />
                            <Detail
                                label="Gagal beruntun"
                                value={String(monitor.consecutive_failures)}
                            />
                            <Detail
                                label="Berhasil beruntun"
                                value={String(monitor.consecutive_successes)}
                            />
                        </dl>
                    </Panel>

                    <Panel title="Timestamps">
                        <dl className="grid gap-4 text-sm">
                            <Detail
                                label="Created"
                                value={dateTime(monitor.created_at)}
                            />
                            <Detail
                                label="Tidakrmaldated"
                                value={dateTime(monitor.updated_at)}
                            />
                        </dl>
                    </Panel>
                </div>
            </div>
        </>
    );
}

function Panel({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
            <h2 className="text-base font-semibold text-[#101828]">{title}</h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

function Detail({ label, value: detailValue }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs font-medium text-[#667085]">{label}</dt>
            <dd className="mt-1 break-words font-semibold text-[#101828]">
                {detailValue}
            </dd>
        </div>
    );
}

function Stat({ title, value: statValue }: { title: string; value: string }) {
    return (
        <div className="rounded-lg border border-[#E4E7EC] bg-white p-4">
            <p className="text-xs font-medium text-[#667085]">{title}</p>
            <p className="mt-2 text-lg font-semibold text-[#101828]">
                {statValue}
            </p>
        </div>
    );
}
