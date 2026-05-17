import { Link, useForm } from '@inertiajs/react';
import { Plus, Save, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    index as projectsIndex,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/ProjectController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Option = {
    id: number;
    name?: string;
    email?: string;
    company_name?: string;
};

type ProjectLinkForm = {
    type: string;
    label: string;
    url: string;
    username: string;
    notes: string;
    is_primary: boolean;
    is_active: boolean;
};

type ProjectMemberForm = {
    user_id: string;
    role: string;
    assigned_at: string;
};

type PaymentTimelineForm = {
    type: string;
    title: string;
    description: string;
    sequence_order: number;
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
    proof_file: string;
    reminder_days_before: string;
    is_additional_charge: boolean;
    admin_notes: string;
    client_notes: string;
};

export type ProjectFormData = {
    client_id: string;
    name: string;
    slug: string;
    description: string;
    project_type: string;
    contract_value: string;
    payment_model: string;
    status: string;
    start_date: string;
    target_finish_date: string;
    live_date: string;
    tech_stack: string;
    internal_notes: string;
    links: ProjectLinkForm[];
    members: ProjectMemberForm[];
    payment_timelines: PaymentTimelineForm[];
};

export type ProjectPayload = {
    id: number;
    client_id: number;
    name: string;
    slug: string;
    description: string | null;
    project_type: string;
    contract_value: string;
    payment_model: string;
    status: string;
    start_date: string | null;
    target_finish_date: string | null;
    live_date: string | null;
    tech_stack: string | null;
    internal_notes: string | null;
    links: Array<Partial<ProjectLinkForm>>;
    members: Array<{
        user_id: number;
        role: string | null;
        assigned_at: string | null;
    }>;
    payment_timelines: Array<Partial<PaymentTimelineForm>>;
};

type Props = {
    clients: Option[];
    users: Option[];
    project?: ProjectPayload | null;
};

const projectTypes = [
    'Company Profile',
    'E-Commerce',
    'ERP',
    'CRM',
    'POS',
    'Rental System',
    'Booking System',
    'LMS',
    'Marketplace',
    'Landing Page',
    'Custom Web App',
];

const projectStatuses = [
    'draft',
    'planning',
    'development',
    'testing',
    'live',
    'maintenance',
    'paused',
    'completed',
    'cancelled',
];

const paymentModels = ['one_time', 'subscription', 'custom'];
const linkTypes = [
    'production',
    'staging',
    'repository',
    'admin_panel',
    'api',
    'database_panel',
    'hosting_panel',
    'figma',
    'documentation',
    'other',
];
const paymentTypes = [
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
const paymentStatuses = [
    'planned',
    'waiting',
    'partially_paid',
    'paid',
    'overdue',
    'cancelled',
];
const paymentMethods = [
    '',
    'bank_transfer',
    'cash',
    'e_wallet',
    'payment_gateway',
    'other',
];

function emptyLink(): ProjectLinkForm {
    return {
        type: 'production',
        label: '',
        url: '',
        username: '',
        notes: '',
        is_primary: false,
        is_active: true,
    };
}

function emptyMember(): ProjectMemberForm {
    return {
        user_id: '',
        role: '',
        assigned_at: '',
    };
}

function emptyPayment(): PaymentTimelineForm {
    return {
        type: 'dp',
        title: '',
        description: '',
        sequence_order: 1,
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
        proof_file: '',
        reminder_days_before: '',
        is_additional_charge: false,
        admin_notes: '',
        client_notes: '',
    };
}

function formData(project?: ProjectPayload | null): ProjectFormData {
    if (!project) {
        return {
            client_id: '',
            name: '',
            slug: '',
            description: '',
            project_type: 'Company Profile',
            contract_value: '0',
            payment_model: 'custom',
            status: 'draft',
            start_date: '',
            target_finish_date: '',
            live_date: '',
            tech_stack: '',
            internal_notes: '',
            links: [],
            members: [],
            payment_timelines: [],
        };
    }

    return {
        client_id: String(project.client_id),
        name: project.name,
        slug: project.slug,
        description: project.description ?? '',
        project_type: project.project_type,
        contract_value: project.contract_value,
        payment_model: project.payment_model,
        status: project.status,
        start_date: project.start_date ?? '',
        target_finish_date: project.target_finish_date ?? '',
        live_date: project.live_date ?? '',
        tech_stack: project.tech_stack ?? '',
        internal_notes: project.internal_notes ?? '',
        links: project.links.length
            ? project.links.map((link) => ({
                  ...emptyLink(),
                  ...link,
                  username: link.username ?? '',
                  notes: link.notes ?? '',
                  is_primary: Boolean(link.is_primary),
                  is_active: link.is_active !== false,
              }))
            : [],
        members: project.members.map((member) => ({
            user_id: String(member.user_id),
            role: member.role ?? '',
            assigned_at: member.assigned_at ?? '',
        })),
        payment_timelines: project.payment_timelines.length
            ? project.payment_timelines.map((payment, index) => ({
                  ...emptyPayment(),
                  ...payment,
                  sequence_order: Number(payment.sequence_order ?? index + 1),
                  percentage: String(payment.percentage ?? ''),
                  planned_amount: String(payment.planned_amount ?? '0'),
                  paid_amount: String(payment.paid_amount ?? '0'),
                  description: payment.description ?? '',
                  due_date: payment.due_date ?? '',
                  paid_at: payment.paid_at ?? '',
                  billing_period_start: payment.billing_period_start ?? '',
                  billing_period_end: payment.billing_period_end ?? '',
                  payment_method: payment.payment_method ?? '',
                  reference_number: payment.reference_number ?? '',
                  proof_file: payment.proof_file ?? '',
                  reminder_days_before: String(
                      payment.reminder_days_before ?? '',
                  ),
                  is_additional_charge: Boolean(payment.is_additional_charge),
                  admin_notes: payment.admin_notes ?? '',
                  client_notes: payment.client_notes ?? '',
              }))
            : [],
    };
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            {children}
            <InputError message={error} />
        </div>
    );
}

function SelectField({
    value,
    onChange,
    options,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
}) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
                <option key={option} value={option}>
                    {option.replaceAll('_', ' ')}
                </option>
            ))}
        </select>
    );
}

export default function ProjectForm({ clients, users, project = null }: Props) {
    const isEditing = project !== null;
    const { data, setData, post, put, processing, errors } =
        useForm<ProjectFormData>(formData(project));

    const error = (key: string): string | undefined =>
        errors[key as keyof typeof errors];

    const updateLink = (index: number, value: Partial<ProjectLinkForm>) => {
        setData('links', patchRow(data.links, index, value));
    };

    const updateMember = (index: number, value: Partial<ProjectMemberForm>) => {
        setData('members', patchRow(data.members, index, value));
    };

    const updatePayment = (
        index: number,
        value: Partial<PaymentTimelineForm>,
    ) => {
        setData(
            'payment_timelines',
            patchRow(data.payment_timelines, index, value),
        );
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isEditing) {
            put(update.url(project.id), { preserveScroll: true });

            return;
        }

        post(store.url(), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="rounded-lg border border-[#E4E7EC] bg-white p-6">
                <div className="grid gap-5 lg:grid-cols-3">
                    <Field label="Client" error={error('client_id')}>
                        <select
                            value={data.client_id}
                            onChange={(event) =>
                                setData('client_id', event.target.value)
                            }
                            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                            <option value="">Select client</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.company_name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Project name" error={error('name')}>
                        <Input
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                        />
                    </Field>

                    <Field label="Slug" error={error('slug')}>
                        <Input
                            value={data.slug}
                            onChange={(event) =>
                                setData('slug', event.target.value)
                            }
                        />
                    </Field>

                    <Field
                        label="Project type"
                        error={error('project_type')}
                    >
                        <SelectField
                            value={data.project_type}
                            onChange={(value) => setData('project_type', value)}
                            options={projectTypes}
                        />
                    </Field>

                    <Field
                        label="Payment model"
                        error={error('payment_model')}
                    >
                        <SelectField
                            value={data.payment_model}
                            onChange={(value) =>
                                setData('payment_model', value)
                            }
                            options={paymentModels}
                        />
                    </Field>

                    <Field label="Status" error={error('status')}>
                        <SelectField
                            value={data.status}
                            onChange={(value) => setData('status', value)}
                            options={projectStatuses}
                        />
                    </Field>

                    <Field
                        label="Contract value"
                        error={error('contract_value')}
                    >
                        <Input
                            type="number"
                            min="0"
                            value={data.contract_value}
                            onChange={(event) =>
                                setData('contract_value', event.target.value)
                            }
                        />
                    </Field>

                    <Field label="Start date" error={error('start_date')}>
                        <Input
                            type="date"
                            value={data.start_date}
                            onChange={(event) =>
                                setData('start_date', event.target.value)
                            }
                        />
                    </Field>

                    <Field
                        label="Target finish"
                        error={error('target_finish_date')}
                    >
                        <Input
                            type="date"
                            value={data.target_finish_date}
                            onChange={(event) =>
                                setData(
                                    'target_finish_date',
                                    event.target.value,
                                )
                            }
                        />
                    </Field>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <Field label="Description" error={error('description')}>
                        <textarea
                            value={data.description}
                            onChange={(event) =>
                                setData('description', event.target.value)
                            }
                            className="border-input bg-background min-h-28 rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                    </Field>

                    <Field label="Internal notes" error={error('internal_notes')}>
                        <textarea
                            value={data.internal_notes}
                            onChange={(event) =>
                                setData('internal_notes', event.target.value)
                            }
                            className="border-input bg-background min-h-28 rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                    </Field>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <Field label="Tech stack" error={error('tech_stack')}>
                        <Input
                            value={data.tech_stack}
                            onChange={(event) =>
                                setData('tech_stack', event.target.value)
                            }
                        />
                    </Field>

                    <Field label="Live date" error={error('live_date')}>
                        <Input
                            type="date"
                            value={data.live_date}
                            onChange={(event) =>
                                setData('live_date', event.target.value)
                            }
                        />
                    </Field>
                </div>
            </div>

            <RelationSection
                title="Project links"
                onAdd={() => setData('links', [...data.links, emptyLink()])}
            >
                {data.links.length === 0 && (
                    <p className="py-4 text-sm text-[#667085]">
                        No project link added.
                    </p>
                )}
                {data.links.map((link, index) => (
                    <div
                        key={index}
                        className="grid gap-4 border-t border-[#E4E7EC] py-4 first:border-t-0 lg:grid-cols-6"
                    >
                        <Field
                            label="Type"
                            error={error(`links.${index}.type`)}
                        >
                            <SelectField
                                value={link.type}
                                onChange={(value) =>
                                    updateLink(index, { type: value })
                                }
                                options={linkTypes}
                            />
                        </Field>
                        <Field
                            label="Label"
                            error={error(`links.${index}.label`)}
                        >
                            <Input
                                value={link.label}
                                onChange={(event) =>
                                    updateLink(index, {
                                        label: event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <Field label="URL" error={error(`links.${index}.url`)}>
                            <Input
                                value={link.url}
                                onChange={(event) =>
                                    updateLink(index, {
                                        url: event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <Field label="Username">
                            <Input
                                value={link.username}
                                onChange={(event) =>
                                    updateLink(index, {
                                        username: event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <label className="flex items-center gap-2 pt-7 text-sm">
                            <input
                                type="checkbox"
                                checked={link.is_primary}
                                onChange={(event) =>
                                    updateLink(index, {
                                        is_primary: event.target.checked,
                                    })
                                }
                            />
                            Primary
                        </label>
                        <RemoveButton
                            onClick={() =>
                                setData(
                                    'links',
                                    data.links.filter((_, i) => i !== index),
                                )
                            }
                        />
                    </div>
                ))}
            </RelationSection>

            <RelationSection
                title="Project members"
                onAdd={() => setData('members', [...data.members, emptyMember()])}
            >
                {data.members.length === 0 && (
                    <p className="py-4 text-sm text-[#667085]">
                        No member assigned.
                    </p>
                )}
                {data.members.map((member, index) => (
                    <div
                        key={index}
                        className="grid gap-4 border-t border-[#E4E7EC] py-4 first:border-t-0 lg:grid-cols-4"
                    >
                        <Field
                            label="User"
                            error={error(`members.${index}.user_id`)}
                        >
                            <select
                                value={member.user_id}
                                onChange={(event) =>
                                    updateMember(index, {
                                        user_id: event.target.value,
                                    })
                                }
                                className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">Select user</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Role">
                            <Input
                                value={member.role}
                                onChange={(event) =>
                                    updateMember(index, {
                                        role: event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <Field label="Assigned at">
                            <Input
                                type="datetime-local"
                                value={member.assigned_at}
                                onChange={(event) =>
                                    updateMember(index, {
                                        assigned_at: event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <RemoveButton
                            onClick={() =>
                                setData(
                                    'members',
                                    data.members.filter((_, i) => i !== index),
                                )
                            }
                        />
                    </div>
                ))}
            </RelationSection>

            <RelationSection
                title="Payment timelines"
                onAdd={() =>
                    setData('payment_timelines', [
                        ...data.payment_timelines,
                        {
                            ...emptyPayment(),
                            sequence_order: data.payment_timelines.length + 1,
                        },
                    ])
                }
            >
                {data.payment_timelines.length === 0 && (
                    <p className="py-4 text-sm text-[#667085]">
                        No payment timeline added.
                    </p>
                )}
                {data.payment_timelines.map((payment, index) => (
                    <div
                        key={index}
                        className="grid gap-4 border-t border-[#E4E7EC] py-4 first:border-t-0 lg:grid-cols-6"
                    >
                        <Field
                            label="Type"
                            error={error(`payment_timelines.${index}.type`)}
                        >
                            <SelectField
                                value={payment.type}
                                onChange={(value) =>
                                    updatePayment(index, { type: value })
                                }
                                options={paymentTypes}
                            />
                        </Field>
                        <Field
                            label="Title"
                            error={error(`payment_timelines.${index}.title`)}
                        >
                            <Input
                                value={payment.title}
                                onChange={(event) =>
                                    updatePayment(index, {
                                        title: event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <Field label="Planned amount">
                            <Input
                                type="number"
                                min="0"
                                value={payment.planned_amount}
                                onChange={(event) =>
                                    updatePayment(index, {
                                        planned_amount: event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <Field label="Paid amount">
                            <Input
                                type="number"
                                min="0"
                                value={payment.paid_amount}
                                onChange={(event) =>
                                    updatePayment(index, {
                                        paid_amount: event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <Field label="Due date">
                            <Input
                                type="date"
                                value={payment.due_date}
                                onChange={(event) =>
                                    updatePayment(index, {
                                        due_date: event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <RemoveButton
                            onClick={() =>
                                setData(
                                    'payment_timelines',
                                    data.payment_timelines.filter(
                                        (_, i) => i !== index,
                                    ),
                                )
                            }
                        />
                        <Field label="Status">
                            <SelectField
                                value={payment.status}
                                onChange={(value) =>
                                    updatePayment(index, { status: value })
                                }
                                options={paymentStatuses}
                            />
                        </Field>
                        <Field label="Payment method">
                            <SelectField
                                value={payment.payment_method}
                                onChange={(value) =>
                                    updatePayment(index, {
                                        payment_method: value,
                                    })
                                }
                                options={paymentMethods}
                            />
                        </Field>
                        <Field label="Percentage">
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={payment.percentage}
                                onChange={(event) =>
                                    updatePayment(index, {
                                        percentage: event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <Field label="Reminder days">
                            <Input
                                type="number"
                                min="0"
                                value={payment.reminder_days_before}
                                onChange={(event) =>
                                    updatePayment(index, {
                                        reminder_days_before:
                                            event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <Field label="Reference">
                            <Input
                                value={payment.reference_number}
                                onChange={(event) =>
                                    updatePayment(index, {
                                        reference_number: event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <label className="flex items-center gap-2 pt-7 text-sm">
                            <input
                                type="checkbox"
                                checked={payment.is_additional_charge}
                                onChange={(event) =>
                                    updatePayment(index, {
                                        is_additional_charge:
                                            event.target.checked,
                                    })
                                }
                            />
                            Additional
                        </label>
                    </div>
                ))}
            </RelationSection>

            <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-[#E4E7EC] bg-[#F9FAFB]/95 py-4 backdrop-blur">
                <Button variant="outline" asChild>
                    <Link href={projectsIndex()}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    <Save className="size-4" />
                    {processing ? 'Saving...' : 'Save project'}
                </Button>
            </div>
        </form>
    );
}

function RelationSection({
    title,
    onAdd,
    children,
}: {
    title: string;
    onAdd: () => void;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold text-[#101828]">
                    {title}
                </h2>
                <Button type="button" variant="outline" size="sm" onClick={onAdd}>
                    <Plus className="size-4" />
                    Add
                </Button>
            </div>
            <div className="mt-4">{children}</div>
        </section>
    );
}

function RemoveButton({
    onClick,
    disabled = false,
}: {
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <div className="flex items-end">
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClick}
                disabled={disabled}
                className={cn('w-full text-red-600', disabled && 'opacity-40')}
            >
                <Trash2 className="size-4" />
                Remove
            </Button>
        </div>
    );
}

function patchRow<T>(
    rows: T[],
    index: number,
    value: Partial<T>,
): T[] {
    return rows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...value } : row,
    );
}
