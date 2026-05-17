import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowDown, Plus, Search, X } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import {
    index as paymentTimelinesIndex,
    store,
} from '@/actions/App/Http/Controllers/Admin/PaymentTimelineController';
import { edit as editProject } from '@/actions/App/Http/Controllers/Admin/ProjectController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { QueryParams } from '@/wayfinder';

type Option = {
    id: number;
    company_name?: string;
    client_id?: number;
    name?: string;
};

type Filters = {
    search: string | null;
    client_id: string | null;
    project_id: string | null;
    type: string | null;
    status: string | null;
    payment_method: string | null;
    due_from: string | null;
    due_to: string | null;
    paid_from: string | null;
    paid_to: string | null;
    billing_from: string | null;
    billing_to: string | null;
    is_additional_charge: string | null;
    sort: SortKey | null;
    direction: SortDirection | null;
};

type SortKey = 'client' | 'due_date' | 'planned_amount';
type SortDirection = 'asc' | 'desc';

type PaymentTimelineRow = {
    id: number;
    type: string;
    title: string;
    planned_amount: string;
    paid_amount: string;
    remaining_amount: string;
    due_date: string | null;
    paid_at: string | null;
    billing_period_start: string | null;
    billing_period_end: string | null;
    status: string;
    payment_method: string | null;
    is_additional_charge: boolean;
    client: { company_name: string };
    project: { id: number; name: string; slug: string };
};

type PaginatedPaymentTimelines = {
    data: PaymentTimelineRow[];
    from: number | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type Stats = {
    total_count: number;
    total_planned_amount: string;
    total_paid_amount: string;
    total_remaining_amount: string;
    paid_count: number;
    overdue_count: number;
};

type PaymentTimelineFormData = {
    client_id: string;
    project_id: string;
    type: string;
    title: string;
    description: string;
    sequence_order: string;
    percentage: string;
    planned_amount: string;
    paid_amount: string;
    due_date: string;
    paid_at: string;
    billing_period_start: string;
    billing_period_end: string;
    status: string;
    payment_method: string;
    reference_number: string;
    reminder_days_before: string;
    is_additional_charge: boolean;
    admin_notes: string;
    client_notes: string;
};

const types = [
    'dp',
    'installment',
    'final_payment',
    'monthly_subscription',
    'yearly_subscription',
    'trial',
    'maintenance_fee',
    'domain_fee',
    'hosting_fee',
    'server_fee',
    'revision_fee',
    'feature_addition_fee',
    'custom',
];
const statuses = [
    'planned',
    'waiting',
    'partially_paid',
    'paid',
    'overdue',
    'cancelled',
];
const paymentMetodes = [
    'bank_transfer',
    'cash',
    'e_wallet',
    'payment_gateway',
    'other',
];

function emptyPaymentTimeline(): PaymentTimelineFormData {
    return {
        client_id: '',
        project_id: '',
        type: 'dp',
        title: '',
        description: '',
        sequence_order: '1',
        percentage: '',
        planned_amount: '0',
        paid_amount: '0',
        due_date: '',
        paid_at: '',
        billing_period_start: '',
        billing_period_end: '',
        status: 'planned',
        payment_method: '',
        reference_number: '',
        reminder_days_before: '',
        is_additional_charge: false,
        admin_notes: '',
        client_notes: '',
    };
}

function normalize(filters: Filters): Record<keyof Filters, string> {
    return {
        search: filters.search ?? '',
        client_id: filters.client_id ?? '',
        project_id: filters.project_id ?? '',
        type: filters.type ?? '',
        status: filters.status ?? '',
        payment_method: filters.payment_method ?? '',
        due_from: filters.due_from ?? '',
        due_to: filters.due_to ?? '',
        paid_from: filters.paid_from ?? '',
        paid_to: filters.paid_to ?? '',
        billing_from: filters.billing_from ?? '',
        billing_to: filters.billing_to ?? '',
        is_additional_charge: filters.is_additional_charge ?? '',
        sort: filters.sort ?? 'due_date',
        direction: filters.direction ?? 'desc',
    };
}

function cleanQuery(filters: Record<keyof Filters, string>): QueryParams {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ''),
    ) as QueryParams;
}

function money(value: string): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function date(value: string | null): string {
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

export default function PaymentTimelinesIndex({
    paymentTimelines,
    filters,
    overallStats,
    filteredStats,
    clients,
    projects,
}: {
    paymentTimelines: PaginatedPaymentTimelines;
    filters: Filters;
    overallStats: Stats;
    filteredStats: Stats;
    clients: Option[];
    projects: Option[];
}) {
    const [form, setForm] = useState(normalize(filters));
    const filteredProject = projects.filter(
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
            paymentTimelinesIndex.url({ query: cleanQuery(form) }),
            {},
            { preserveScroll: true },
        );
    };

    const reset = () => {
        router.get(paymentTimelinesIndex.url(), {}, { preserveScroll: true });
    };

    const sortBy = (sort: SortKey) => {
        const direction =
            form.sort === sort && form.direction === 'asc' ? 'desc' : 'asc';
        const query = cleanQuery({
            ...form,
            sort,
            direction,
        });

        router.get(
            paymentTimelinesIndex.url({ query }),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Jadwal pembayaran" />
            <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#101828]">
                            Jadwal pembayaran
                        </h1>
                        <p className="mt-1 text-sm text-[#667085]">
                            Monitor all planned, due, overdue, and paid project
                            payments.
                        </p>
                    </div>
                    <CreatePaymentTimelineModal
                        clients={clients}
                        projects={projects}
                    />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                    <Stat
                        title="All items"
                        value={overallStats.total_count.toString()}
                    />
                    <Stat
                        title="Direncanakan"
                        value={money(overallStats.total_planned_amount)}
                    />
                    <Stat
                        title="Terbayar"
                        value={money(overallStats.total_paid_amount)}
                    />
                    <Stat
                        title="Sisa"
                        value={money(overallStats.total_remaining_amount)}
                    />
                    <Stat
                        title="Terbayar count"
                        value={overallStats.paid_count.toString()}
                    />
                    <Stat
                        title="Overdue count"
                        value={overallStats.overdue_count.toString()}
                    />
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
                            <select
                                value={form.client_id}
                                onChange={(event) =>
                                    setFilter('client_id', event.target.value)
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">All klien</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.company_name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Proyek">
                            <select
                                value={form.project_id}
                                onChange={(event) =>
                                    setFilter('project_id', event.target.value)
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">All proyek</option>
                                {filteredProject.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Status">
                            <select
                                value={form.status}
                                onChange={(event) =>
                                    setFilter('status', event.target.value)
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">All status</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Tipe">
                            <select
                                value={form.type}
                                onChange={(event) =>
                                    setFilter('type', event.target.value)
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">All tipe</option>
                                {types.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Metode pembayaran">
                            <select
                                value={form.payment_method}
                                onChange={(event) =>
                                    setFilter(
                                        'payment_method',
                                        event.target.value,
                                    )
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">All metode</option>
                                {paymentMetodes.map((method) => (
                                    <option key={method} value={method}>
                                        {method}
                                    </option>
                                ))}
                            </select>
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
                        <Field label="Terbayar from">
                            <Input
                                type="date"
                                value={form.paid_from}
                                onChange={(event) =>
                                    setFilter('paid_from', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="Terbayar to">
                            <Input
                                type="date"
                                value={form.paid_to}
                                onChange={(event) =>
                                    setFilter('paid_to', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="Billing from">
                            <Input
                                type="date"
                                value={form.billing_from}
                                onChange={(event) =>
                                    setFilter(
                                        'billing_from',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Billing to">
                            <Input
                                type="date"
                                value={form.billing_to}
                                onChange={(event) =>
                                    setFilter('billing_to', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="Biaya tambahan">
                            <select
                                value={form.is_additional_charge}
                                onChange={(event) =>
                                    setFilter(
                                        'is_additional_charge',
                                        event.target.value,
                                    )
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">Semua</option>
                                <option value="1">Ya</option>
                                <option value="0">Tidak</option>
                            </select>
                        </Field>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-[#667085]">
                            Terfilter: {filteredStats.total_count} item,{' '}
                            {money(filteredStats.total_remaining_amount)}{' '}
                            remaining.
                        </p>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={reset}
                            >
                                <X className="size-4" />
                                Reset
                            </Button>
                            <Button type="submit">
                                <Search className="size-4" />
                                Apply filters
                            </Button>
                        </div>
                    </div>
                </form>

                <div className="mt-6 overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1160px] text-left text-sm">
                            <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#667085] uppercase">
                                <tr>
                                    <th className="w-16 px-5 py-3">Tidak</th>
                                    <th className="px-5 py-3">Pembayaran</th>
                                    <th className="px-5 py-3">
                                        <SortButton
                                            label="Klien"
                                            sort="client"
                                            activeSort={form.sort as SortKey}
                                            direction={
                                                form.direction as SortDirection
                                            }
                                            onSort={sortBy}
                                        />
                                    </th>
                                    <th className="px-5 py-3">
                                        <SortButton
                                            label="Nominal"
                                            sort="planned_amount"
                                            activeSort={form.sort as SortKey}
                                            direction={
                                                form.direction as SortDirection
                                            }
                                            onSort={sortBy}
                                        />
                                    </th>
                                    <th className="px-5 py-3">
                                        <SortButton
                                            label="Date"
                                            sort="due_date"
                                            activeSort={form.sort as SortKey}
                                            direction={
                                                form.direction as SortDirection
                                            }
                                            onSort={sortBy}
                                        />
                                    </th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Metode</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E7EC]">
                                {paymentTimelines.data.map(
                                    (timeline, index) => (
                                        <tr key={timeline.id}>
                                            <td className="px-5 py-4 text-[#667085]">
                                                {(paymentTimelines.from ?? 1) +
                                                    index}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-semibold text-[#101828]">
                                                    {timeline.title}
                                                </div>
                                                <Link
                                                    href={editProject(
                                                        timeline.project.id,
                                                    )}
                                                    className="text-xs text-brand-500"
                                                >
                                                    {timeline.project.name}
                                                </Link>
                                                <div className="text-xs text-[#667085]">
                                                    {timeline.type}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-[#344054]">
                                                {timeline.client.company_name}
                                            </td>
                                            <td className="px-5 py-4 text-xs text-[#667085]">
                                                Direncanakan:{' '}
                                                {money(timeline.planned_amount)}
                                                <br />
                                                Terbayar:{' '}
                                                {money(timeline.paid_amount)}
                                                <br />
                                                Sisa:{' '}
                                                {money(
                                                    timeline.remaining_amount,
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-xs text-[#667085]">
                                                Due: {date(timeline.due_date)}
                                                <br />
                                                Terbayar: {date(timeline.paid_at)}
                                                <br />
                                                Billing:{' '}
                                                {date(
                                                    timeline.billing_period_start,
                                                )}{' '}
                                                -{' '}
                                                {date(
                                                    timeline.billing_period_end,
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-500">
                                                    {timeline.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-xs text-[#667085]">
                                                {timeline.payment_method ?? '-'}
                                                {timeline.is_additional_charge && (
                                                    <div className="mt-1 font-semibold text-[#101828]">
                                                        Additional
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>

                    {paymentTimelines.data.length === 0 && (
                        <div className="px-5 py-12 text-center text-sm text-[#667085]">
                            Tidak payment timelines found.
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 border-t border-[#E4E7EC] px-5 py-4">
                        {paymentTimelines.links.map((link) => (
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

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            {children}
            {error && <InputError message={error} />}
        </div>
    );
}

function Stat({ title, value }: { title: string; value: string }) {
    return (
        <div className="rounded-lg border border-[#E4E7EC] bg-white p-4">
            <p className="text-xs font-medium text-[#667085]">{title}</p>
            <p className="mt-2 text-lg font-semibold text-[#101828]">{value}</p>
        </div>
    );
}

function SortButton({
    label,
    sort,
    activeSort,
    direction,
    onSort,
}: {
    label: string;
    sort: SortKey;
    activeSort: string;
    direction: string;
    onSort: (sort: SortKey) => void;
}) {
    const isActive = activeSort === sort;

    return (
        <button
            type="button"
            onClick={() => onSort(sort)}
            className="inline-flex items-center gap-1 font-semibold text-[#667085] hover:text-[#101828]"
        >
            {label}
            <ArrowDown className="size-3.5" />
            {isActive && (
                <span className="text-[10px]">
                    {direction === 'asc' ? 'ASC' : 'DESC'}
                </span>
            )}
        </button>
    );
}

function CreatePaymentTimelineModal({
    clients,
    projects,
}: {
    clients: Option[];
    projects: Option[];
}) {
    const [open, setTerbuka] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<PaymentTimelineFormData>(emptyPaymentTimeline());
    const filteredProject = projects.filter(
        (project) =>
            !data.client_id || String(project.client_id) === data.client_id,
    );
    const error = (key: keyof PaymentTimelineFormData): string | undefined =>
        errors[key];

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                setTerbuka(false);
            },
            onError: () => setTerbuka(true),
        });
    };

    const close = () => {
        reset();
        clearErrors();
        setTerbuka(false);
    };

    return (
        <Dialog open={open} onOpenChange={setTerbuka}>
            <DialogTrigger asChild>
                <Button type="button">
                    <Plus className="size-4" />
                    Buat pembayaran
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Buat pembayaran timeline</DialogTitle>
                    <DialogDescription>
                        Add a planned or paid project payment item.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Klien" error={error('client_id')}>
                            <select
                                value={data.client_id}
                                onChange={(event) =>
                                    setData((current) => ({
                                        ...current,
                                        client_id: event.target.value,
                                        project_id: '',
                                    }))
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">Select klien</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.company_name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Proyek" error={error('project_id')}>
                            <select
                                value={data.project_id}
                                onChange={(event) =>
                                    setData('project_id', event.target.value)
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">Select proyek</option>
                                {filteredProject.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Judul" error={error('title')}>
                            <Input
                                value={data.title}
                                onChange={(event) =>
                                    setData('title', event.target.value)
                                }
                            />
                        </Field>

                        <Field label="Tipe" error={error('type')}>
                            <select
                                value={data.type}
                                onChange={(event) =>
                                    setData('type', event.target.value)
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                {types.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field
                            label="Sequence order"
                            error={error('sequence_order')}
                        >
                            <Input
                                type="number"
                                min="1"
                                value={data.sequence_order}
                                onChange={(event) =>
                                    setData(
                                        'sequence_order',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>

                        <Field label="Percentage" error={error('percentage')}>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={data.percentage}
                                onChange={(event) =>
                                    setData('percentage', event.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="Direncanakan amount"
                            error={error('planned_amount')}
                        >
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.planned_amount}
                                onChange={(event) =>
                                    setData(
                                        'planned_amount',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>

                        <Field label="Terbayar amount" error={error('paid_amount')}>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.paid_amount}
                                onChange={(event) =>
                                    setData('paid_amount', event.target.value)
                                }
                            />
                        </Field>

                        <Field label="Status" error={error('status')}>
                            <select
                                value={data.status}
                                onChange={(event) =>
                                    setData('status', event.target.value)
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field
                            label="Metode pembayaran"
                            error={error('payment_method')}
                        >
                            <select
                                value={data.payment_method}
                                onChange={(event) =>
                                    setData(
                                        'payment_method',
                                        event.target.value,
                                    )
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">Tidak method</option>
                                {paymentMetodes.map((method) => (
                                    <option key={method} value={method}>
                                        {method}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Tanggal jatuh tempo" error={error('due_date')}>
                            <Input
                                type="date"
                                value={data.due_date}
                                onChange={(event) =>
                                    setData('due_date', event.target.value)
                                }
                            />
                        </Field>

                        <Field label="Terbayar at" error={error('paid_at')}>
                            <Input
                                type="date"
                                value={data.paid_at}
                                onChange={(event) =>
                                    setData('paid_at', event.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="Billing start"
                            error={error('billing_period_start')}
                        >
                            <Input
                                type="date"
                                value={data.billing_period_start}
                                onChange={(event) =>
                                    setData(
                                        'billing_period_start',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>

                        <Field
                            label="Billing end"
                            error={error('billing_period_end')}
                        >
                            <Input
                                type="date"
                                value={data.billing_period_end}
                                onChange={(event) =>
                                    setData(
                                        'billing_period_end',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>

                        <Field
                            label="Reference number"
                            error={error('reference_number')}
                        >
                            <Input
                                value={data.reference_number}
                                onChange={(event) =>
                                    setData(
                                        'reference_number',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>

                        <Field
                            label="Reminder days before"
                            error={error('reminder_days_before')}
                        >
                            <Input
                                type="number"
                                min="0"
                                value={data.reminder_days_before}
                                onChange={(event) =>
                                    setData(
                                        'reminder_days_before',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Deskripsi" error={error('description')}>
                            <textarea
                                value={data.description}
                                onChange={(event) =>
                                    setData('description', event.target.value)
                                }
                                className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                        </Field>
                        <Field label="Notes admin" error={error('admin_notes')}>
                            <textarea
                                value={data.admin_notes}
                                onChange={(event) =>
                                    setData('admin_notes', event.target.value)
                                }
                                className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                        </Field>
                    </div>

                    <Field label="Catatan klien" error={error('client_notes')}>
                        <textarea
                            value={data.client_notes}
                            onChange={(event) =>
                                setData('client_notes', event.target.value)
                            }
                            className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                    </Field>

                    <label className="flex items-center gap-2 text-sm text-[#344054]">
                        <input
                            type="checkbox"
                            checked={data.is_additional_charge}
                            onChange={(event) =>
                                setData(
                                    'is_additional_charge',
                                    event.target.checked,
                                )
                            }
                        />
                        Biaya tambahan
                    </label>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={close}
                            >
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Membuat...' : 'Buat pembayaran'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
