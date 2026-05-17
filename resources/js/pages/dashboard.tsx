import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    CalendarClock,
    Globe2,
    MonitorCheck,
    MoreHorizontal,
    Server,
    ShieldAlert,
    User,
    Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { dashboard } from '@/routes';
import { index as clientsIndex } from '@/routes/admin/clients';
import { index as domainsIndex } from '@/routes/admin/domain-assets';
import { index as hostingIndex } from '@/routes/admin/hosting-assets';
import { index as issuesIndex } from '@/routes/admin/issues';
import { index as monitorsIndex } from '@/routes/admin/monitors';
import { index as paymentTimelinesIndex } from '@/routes/admin/payment-timelines';
import { index as projectsIndex } from '@/routes/admin/projects';
import { index as incidentsIndex } from '@/routes/admin/website-incidents';

type Summary = {
    clients: number;
    projects: number;
    active_projects: number;
    open_issues: number;
    monitors_down: number;
};

type Finance = {
    payment_items: number;
    planned_amount: string;
    paid_amount: string;
    remaining_amount: string;
    overdue_count: number;
};

type Pemantauan = {
    monitors: number;
    active_monitors: number;
    monitors_up: number;
    monitors_down: number;
    ongoing_incidents: number;
};

type ProjectStatus = {
    status: string;
    count: number;
};

type Relation = {
    name?: string;
    company_name?: string;
};

type IssueRow = {
    id: number;
    title: string;
    priority: string;
    status: string;
    due_date: string | null;
    client: Relation;
    project: Relation;
};

type PembayaranRow = {
    id: number;
    title: string;
    planned_amount: string;
    paid_amount: string;
    remaining_amount: string;
    due_date: string | null;
    status: string;
    client: Relation;
    project: Relation;
};

type AssetRow = {
    id: number;
    type: 'domain' | 'hosting';
    name: string;
    provider: string | null;
    expired_at: string | null;
    client: Relation;
    project: Relation | null;
};

type MaintenanceRow = {
    id: number;
    title: string;
    status: string;
    scheduled_at: string | null;
    project: Relation;
    handler: Relation | null;
};

function money(value: string): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function displayDate(value: string | null): string {
    if (!value) {
        return '-';
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(parsed);
}

function percent(value: number, total: number): number {
    if (total === 0) {
        return 0;
    }

    return Math.round((value / total) * 100);
}

function clampPercent(value: number): number {
    return Math.max(0, Math.min(value, 100));
}

function statusTone(status: string): string {
    if (['paid', 'resolved', 'up', 'completed', 'active'].includes(status)) {
        return 'bg-success-50 text-success-600';
    }

    if (['down', 'overdue', 'urgent', 'high', 'ongoing'].includes(status)) {
        return 'bg-error-50 text-error-600';
    }

    if (['waiting', 'planned', 'in_progress'].includes(status)) {
        return 'bg-[#FFFAEB] text-[#DC6803]';
    }

    return 'bg-brand-50 text-brand-500';
}

function Badge({ value }: { value: string }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(value)}`}
        >
            {value.replaceAll('_', ' ')}
        </span>
    );
}

function Card({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section
            className={`rounded-2xl border border-[#E4E7EC] bg-white ${className}`}
        >
            {children}
        </section>
    );
}

function CardHeader({
    title,
    subtitle,
    href,
}: {
    title: string;
    subtitle?: string;
    href?: string;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h2 className="text-xl font-semibold text-[#101828]">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-1 text-sm text-[#475467]">{subtitle}</p>
                )}
            </div>
            {href ? (
                <Link
                    href={href}
                    className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-brand-500 hover:bg-brand-50"
                >
                    View
                    <ArrowRight className="size-4" />
                </Link>
            ) : (
                <button
                    type="button"
                    className="flex size-9 items-center justify-center rounded-lg text-[#98A2B3] hover:bg-[#F9FAFB] hover:text-[#667085]"
                    aria-label={`${title} options`}
                >
                    <MoreHorizontal className="size-5" />
                </button>
            )}
        </div>
    );
}

function MetricCard({
    title,
    value,
    subtitle,
    href,
    icon: Icon,
    trend,
    trendTone,
}: {
    title: string;
    value: string;
    subtitle: string;
    href: string;
    icon: LucideIcon;
    trend: string;
    trendTone: 'up' | 'down';
}) {
    const TrendIcon = trendTone === 'up' ? ArrowUpRight : ArrowDownRight;
    const trendClass =
        trendTone === 'up'
            ? 'bg-success-50 text-success-600'
            : 'bg-error-50 text-error-600';

    return (
        <Link
            href={href}
            className="rounded-2xl border border-[#E4E7EC] bg-white p-6 transition hover:border-brand-200 hover:shadow-xs"
        >
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#F2F4F7] text-[#344054]">
                <Icon className="size-6" strokeWidth={1.8} />
            </div>
            <p className="mt-8 text-sm font-medium text-[#475467]">{title}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-3xl font-bold text-[#101828]">{value}</p>
                <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold ${trendClass}`}
                >
                    <TrendIcon className="size-4" />
                    {trend}
                </span>
            </div>
            <p className="mt-2 text-sm text-[#667085]">{subtitle}</p>
        </Link>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="rounded-xl border border-dashed border-[#D0D5DD] px-5 py-8 text-sm text-[#667085]">
            {text}
        </div>
    );
}

export default function Dasbor({
    summary,
    finance,
    monitoring,
    projectStatus,
    recentIssues,
    upcomingPayments,
    expiringAssets,
    maintenanceSchedule,
}: {
    summary: Summary;
    finance: Finance;
    monitoring: Pemantauan;
    projectStatus: ProjectStatus[];
    recentIssues: IssueRow[];
    upcomingPayments: PembayaranRow[];
    expiringAssets: AssetRow[];
    maintenanceSchedule: MaintenanceRow[];
}) {
    const monitorRisk = monitoring.monitors_down + monitoring.ongoing_incidents;
    const paymentProgress = clampPercent(
        percent(Number(finance.paid_amount), Number(finance.planned_amount)),
    );
    const activeProjectPercent = clampPercent(
        percent(summary.active_projects, summary.projects),
    );

    return (
        <>
            <Head title="Dasbor" />
            <div className="space-y-6 p-4 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-[#101828]">
                            Dasbor
                        </h1>
                        <p className="mt-2 text-sm text-[#475467]">
                            Snapshot projects, payments, monitoring, issues,
                            and renewals.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#E4E7EC] bg-white px-4 py-2 text-sm font-medium text-[#344054]">
                        <span className="size-2 rounded-full bg-success-500" />
                        {summary.active_projects} active of {summary.projects}{' '}
                        projects
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        title="Client"
                        value={`${summary.clients}`}
                        subtitle="Total klien dikelola"
                        href={clientsIndex.url()}
                        icon={User}
                        trend={`${summary.clients}`}
                        trendTone="up"
                    />
                    <MetricCard
                        title="Project aktif"
                        value={`${summary.active_projects}`}
                        subtitle={`${activeProjectPercent}% of total projects`}
                        href={projectsIndex.url()}
                        icon={Activity}
                        trend={`${activeProjectPercent}%`}
                        trendTone="up"
                    />
                    <MetricCard
                        title="Issue terbuka"
                        value={`${summary.open_issues}`}
                        subtitle="Perlu tindak lanjut"
                        href={issuesIndex.url()}
                        icon={AlertTriangle}
                        trend={`${summary.open_issues}`}
                        trendTone={summary.open_issues > 0 ? 'down' : 'up'}
                    />
                    <MetricCard
                        title="Risiko monitor"
                        value={`${monitorRisk}`}
                        subtitle={`${monitoring.monitors_down} down, ${monitoring.ongoing_incidents} incidents`}
                        href={monitorsIndex.url()}
                        icon={ShieldAlert}
                        trend={`${monitorRisk}`}
                        trendTone={monitorRisk > 0 ? 'down' : 'up'}
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-7">
                        <PembayaranHealthCard
                            finance={finance}
                            paymentProgress={paymentProgress}
                        />
                        <ProjectStatusCard
                            projectStatus={projectStatus}
                            total={summary.projects}
                        />
                    </div>

                    <div className="space-y-6 xl:col-span-5">
                        <PembayaranTargetCard
                            finance={finance}
                            paymentProgress={paymentProgress}
                        />
                        <MonitorHealthCard monitoring={monitoring} />
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <IssueList issues={recentIssues} />
                    <PembayaranList payments={upcomingPayments} />
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <AssetList assets={expiringAssets} />
                    <MaintenanceList maintenanceSchedule={maintenanceSchedule} />
                </div>
            </div>
        </>
    );
}

function PembayaranHealthCard({
    finance,
    paymentProgress,
}: {
    finance: Finance;
    paymentProgress: number;
}) {
    return (
        <Card className="p-6">
            <CardHeader
                title="Kesehatan Pembayaran"
                subtitle="Rencana, terbayar, dan sisa tagihan"
                href={paymentTimelinesIndex.url()}
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <MiniStat label="Direncanakan" value={money(finance.planned_amount)} />
                <MiniStat label="Terbayar" value={money(finance.paid_amount)} />
                <MiniStat
                    label="Sisa"
                    value={money(finance.remaining_amount)}
                />
            </div>
            <div className="mt-8">
                <div className="flex items-center justify-between text-sm font-medium text-[#475467]">
                    <span>Progres penagihan</span>
                    <span>{paymentProgress}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#F2F4F7]">
                    <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${paymentProgress}%` }}
                    />
                </div>
            </div>
        </Card>
    );
}

function PembayaranTargetCard({
    finance,
    paymentProgress,
}: {
    finance: Finance;
    paymentProgress: number;
}) {
    const strokeDasharray = `${paymentProgress}, 100`;

    return (
        <Card className="overflow-hidden">
            <div className="p-7 pb-8">
                <CardHeader
                    title="Target Bulanan"
                    subtitle="Progres target penagihan"
                />
                <div className="relative mx-auto mt-8 h-44 max-w-[360px]">
                    <svg
                        viewBox="0 0 200 120"
                        className="h-full w-full"
                        aria-label={`Progres pembayaran ${paymentProgress}%`}
                    >
                        <path
                            d="M 24 100 A 76 76 0 0 1 176 100"
                            fill="none"
                            pathLength="100"
                            stroke="#F2F4F7"
                            strokeLinecap="round"
                            strokeWidth="14"
                        />
                        <path
                            d="M 24 100 A 76 76 0 0 1 176 100"
                            fill="none"
                            pathLength="100"
                            stroke="#465FFF"
                            strokeDasharray={strokeDasharray}
                            strokeLinecap="round"
                            strokeWidth="14"
                        />
                    </svg>
                    <div className="absolute inset-x-0 bottom-2 text-center">
                        <p className="text-4xl font-bold text-[#101828]">
                            {paymentProgress}%
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-600">
                            <ArrowRight className="size-3.5" />
                            Sesuai target
                        </span>
                    </div>
                </div>
                <p className="mx-auto mt-6 max-w-sm text-center text-sm text-[#475467]">
                    {finance.payment_items} payment items tracked, with{' '}
                    {finance.overdue_count} overdue items.
                </p>
            </div>
            <div className="grid grid-cols-3 bg-[#F2F4F7] px-4 py-6">
                <TargetSummary label="Target" value={money(finance.planned_amount)} />
                <TargetSummary label="Pendapatan" value={money(finance.paid_amount)} />
                <TargetSummary
                    label="Tertunda"
                    value={money(finance.remaining_amount)}
                />
            </div>
        </Card>
    );
}

function ProjectStatusCard({
    projectStatus,
    total,
}: {
    projectStatus: ProjectStatus[];
    total: number;
}) {
    return (
        <Card className="p-6">
            <CardHeader
                title="Status Project"
                subtitle="Distribusi alur kerja proyek"
                href={projectsIndex.url()}
            />
            {projectStatus.length === 0 ? (
                <div className="mt-6">
                    <EmptyState text="Belum ada proyek." />
                </div>
            ) : (
                <div className="mt-8 space-y-5">
                    {projectStatus.map((item) => {
                        const itemPercent = clampPercent(
                            percent(item.count, total),
                        );

                        return (
                            <div key={item.status}>
                                <div className="flex items-center justify-between gap-4">
                                    <Badge value={item.status} />
                                    <span className="text-sm font-semibold text-[#101828]">
                                        {item.count}
                                    </span>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F2F4F7]">
                                    <div
                                        className="h-full rounded-full bg-brand-500"
                                        style={{ width: `${itemPercent}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}

function MonitorHealthCard({ monitoring }: { monitoring: Pemantauan }) {
    return (
        <Card className="p-6">
            <CardHeader
                title="Kesehatan Monitor"
                subtitle="Ringkasan ketersediaan dan insiden"
                href={incidentsIndex.url()}
            />
            <div className="mt-6 grid grid-cols-2 gap-4">
                <MonitorStat
                    label="Active"
                    value={monitoring.active_monitors}
                    total={monitoring.monitors}
                    icon={MonitorCheck}
                />
                <MonitorStat
                    label="Tidakrmal"
                    value={monitoring.monitors_up}
                    total={monitoring.monitors}
                    icon={Activity}
                />
                <MonitorStat
                    label="Down"
                    value={monitoring.monitors_down}
                    total={monitoring.monitors}
                    icon={ShieldAlert}
                />
                <MonitorStat
                    label="Incident"
                    value={monitoring.ongoing_incidents}
                    total={monitoring.monitors}
                    icon={AlertTriangle}
                />
            </div>
        </Card>
    );
}

function IssueList({ issues = [] }: { issues?: IssueRow[] }) {
    return (
        <Card className="p-6">
            <CardHeader
                title="Issue Terbaru"
                subtitle="Pekerjaan klien terbaru yang belum selesai"
                href={issuesIndex.url()}
            />
            <div className="mt-6">
                {issues.length === 0 ? (
                    <EmptyState text="Tidak ada masalah terbuka." />
                ) : (
                    <div className="divide-y divide-[#E4E7EC]">
                        {issues.map((issue) => (
                            <ListRow key={issue.id}>
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-[#101828]">
                                        {issue.title}
                                    </p>
                                    <p className="mt-1 text-sm text-[#667085]">
                                        {issue.client.company_name} /{' '}
                                        {issue.project.name}
                                    </p>
                                    <p className="mt-1 text-xs text-[#667085]">
                                        Due {displayDate(issue.due_date)}
                                    </p>
                                </div>
                                <div className="flex shrink-0 flex-col items-end gap-2">
                                    <Badge value={issue.priority} />
                                    <Badge value={issue.status} />
                                </div>
                            </ListRow>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}

function PembayaranList({ payments = [] }: { payments?: PembayaranRow[] }) {
    return (
        <Card className="p-6">
            <CardHeader
                title="Tidakrmalcoming Pembayaran"
                subtitle="Item jadwal yang belum dibayar"
                href={paymentTimelinesIndex.url()}
            />
            <div className="mt-6">
                {payments.length === 0 ? (
                    <EmptyState text="Tidak ada item pembayaran yang belum dibayar." />
                ) : (
                    <div className="divide-y divide-[#E4E7EC]">
                        {payments.map((payment) => (
                            <ListRow key={payment.id}>
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-[#101828]">
                                        {payment.title}
                                    </p>
                                    <p className="mt-1 text-sm text-[#667085]">
                                        {payment.client.company_name} /{' '}
                                        {payment.project.name}
                                    </p>
                                    <p className="mt-1 text-xs text-[#667085]">
                                        Due {displayDate(payment.due_date)}
                                    </p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className="text-sm font-semibold text-[#101828]">
                                        {money(payment.remaining_amount)}
                                    </p>
                                    <div className="mt-2">
                                        <Badge value={payment.status} />
                                    </div>
                                </div>
                            </ListRow>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}

function AssetList({ assets = [] }: { assets?: AssetRow[] }) {
    return (
        <Card className="p-6">
            <CardHeader title="Aset Akan Berakhir" subtitle="Domain dan hosting" />
            <div className="mt-6">
                {assets.length === 0 ? (
                    <EmptyState text="Tidak ada perpanjangan domain atau hosting dalam 45 hari." />
                ) : (
                    <div className="divide-y divide-[#E4E7EC]">
                        {assets.map((asset) => {
                            const Icon = asset.type === 'domain' ? Globe2 : Server;
                            const href =
                                asset.type === 'domain'
                                    ? domainsIndex.url()
                                    : hostingIndex.url();

                            return (
                                <Link
                                    key={`${asset.type}-${asset.id}`}
                                    href={href}
                                    className="flex items-start gap-3 py-4 hover:bg-[#F9FAFB]"
                                >
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#F2F4F7] text-[#344054]">
                                        <Icon className="size-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-[#101828]">
                                            {asset.name}
                                        </p>
                                        <p className="mt-1 text-sm text-[#667085]">
                                            {asset.client.company_name} /{' '}
                                            {asset.project?.name ?? '-'}
                                        </p>
                                        <p className="mt-1 text-xs text-[#667085]">
                                            Expires{' '}
                                            {displayDate(asset.expired_at)}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </Card>
    );
}

function MaintenanceList({
    maintenanceSchedule = [],
}: {
    maintenanceSchedule?: MaintenanceRow[];
}) {
    return (
        <Card className="p-6">
            <CardHeader
                title="Jadwal Pemeliharaan"
                subtitle="Direncanakan operation work"
            />
            <div className="mt-6">
                {maintenanceSchedule.length === 0 ? (
                    <EmptyState text="Tidak ada pemeliharaan terencana." />
                ) : (
                    <div className="divide-y divide-[#E4E7EC]">
                        {maintenanceSchedule.map((log) => (
                            <ListRow key={log.id}>
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                                        <Wrench className="size-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-[#101828]">
                                            {log.title}
                                        </p>
                                        <p className="mt-1 text-sm text-[#667085]">
                                            {log.project.name} /{' '}
                                            {log.handler?.name ?? 'Belum ditugaskan'}
                                        </p>
                                        <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#667085]">
                                            <CalendarClock className="size-3.5" />
                                            {displayDate(log.scheduled_at)}
                                        </p>
                                    </div>
                                </div>
                                <Badge value={log.status} />
                            </ListRow>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}

function MiniStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-[#E4E7EC] bg-[#FCFCFD] p-4">
            <p className="text-sm font-medium text-[#667085]">{label}</p>
            <p className="mt-3 text-lg font-bold text-[#101828]">{value}</p>
        </div>
    );
}

function TargetSummary({ label, value }: { label: string; value: string }) {
    return (
        <div className="border-l border-[#E4E7EC] px-3 text-center first:border-l-0">
            <p className="text-sm font-medium text-[#475467]">{label}</p>
            <p className="mt-2 text-lg font-bold text-[#101828]">{value}</p>
        </div>
    );
}

function MonitorStat({
    label,
    value,
    total,
    icon: Icon,
}: {
    label: string;
    value: number;
    total: number;
    icon: LucideIcon;
}) {
    return (
        <div className="rounded-xl border border-[#E4E7EC] p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[#667085]">{label}</p>
                <Icon className="size-5 text-[#667085]" />
            </div>
            <p className="mt-4 text-2xl font-bold text-[#101828]">{value}</p>
            <p className="mt-1 text-xs text-[#667085]">
                {percent(value, total)}% of monitors
            </p>
        </div>
    );
}

function ListRow({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start justify-between gap-4 py-4">
            {children}
        </div>
    );
}

Dasbor.layout = {
    breadcrumbs: [
        {
            title: 'Dasbor',
            href: dashboard(),
        },
    ],
};
