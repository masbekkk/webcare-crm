import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    index as issuesIndex,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/IssueController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Option = {
    id: number;
    client_id?: number;
    name?: string;
    email?: string;
    company_name?: string;
};

export type IssuePayload = {
    id: number;
    project_id: number;
    client_id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    reported_by: number | null;
    assigned_to: number | null;
    due_date: string | null;
    resolved_at: string | null;
    closed_at: string | null;
    resolution_notes: string | null;
    internal_notes: string | null;
};

type IssueFormData = {
    project_id: string;
    client_id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    assigned_to: string;
    due_date: string;
    resolved_at: string;
    closed_at: string;
    resolution_notes: string;
    internal_notes: string;
};

type Props = {
    clients: Option[];
    projects: Option[];
    users: Option[];
    issue?: IssuePayload | null;
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

function formData(issue?: IssuePayload | null): IssueFormData {
    return {
        project_id: issue ? String(issue.project_id) : '',
        client_id: issue ? String(issue.client_id) : '',
        title: issue?.title ?? '',
        description: issue?.description ?? '',
        priority: issue?.priority ?? 'medium',
        status: issue?.status ?? 'open',
        assigned_to: issue?.assigned_to ? String(issue.assigned_to) : '',
        due_date: issue?.due_date ?? '',
        resolved_at: issue?.resolved_at?.slice(0, 16) ?? '',
        closed_at: issue?.closed_at?.slice(0, 16) ?? '',
        resolution_notes: issue?.resolution_notes ?? '',
        internal_notes: issue?.internal_notes ?? '',
    };
}

export default function IssueForm({
    clients,
    projects,
    users,
    issue = null,
}: Props) {
    const isEditing = issue !== null;
    const { data, setData, post, put, processing, errors } =
        useForm<IssueFormData>(formData(issue));

    const filteredProjects = projects.filter(
        (project) =>
            !data.client_id || String(project.client_id) === data.client_id,
    );

    const error = (key: string): string | undefined =>
        errors[key as keyof typeof errors];

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isEditing) {
            put(update.url(issue.id), { preserveScroll: true });

            return;
        }

        post(store.url(), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
                <div className="grid gap-5 lg:grid-cols-2">
                    <Field label="Client" error={error('client_id')}>
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
                            <option value="">Select client</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.company_name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Project" error={error('project_id')}>
                        <select
                            value={data.project_id}
                            onChange={(event) =>
                                setData('project_id', event.target.value)
                            }
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                            <option value="">Select project</option>
                            {filteredProjects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Title" error={error('title')}>
                        <Input
                            value={data.title}
                            onChange={(event) =>
                                setData('title', event.target.value)
                            }
                        />
                    </Field>

                    <Field label="Assignee" error={error('assigned_to')}>
                        <select
                            value={data.assigned_to}
                            onChange={(event) =>
                                setData('assigned_to', event.target.value)
                            }
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                            <option value="">Unassigned</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} {user.email && `(${user.email})`}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-4">
                    <Field label="Priority" error={error('priority')}>
                        <SelectField
                            value={data.priority}
                            options={priorities}
                            onChange={(value) => setData('priority', value)}
                        />
                    </Field>
                    <Field label="Status" error={error('status')}>
                        <SelectField
                            value={data.status}
                            options={statuses}
                            onChange={(value) => setData('status', value)}
                        />
                    </Field>
                    <Field label="Due date" error={error('due_date')}>
                        <Input
                            type="date"
                            value={data.due_date}
                            onChange={(event) =>
                                setData('due_date', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Resolved at" error={error('resolved_at')}>
                        <Input
                            type="datetime-local"
                            value={data.resolved_at}
                            onChange={(event) =>
                                setData('resolved_at', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Closed at" error={error('closed_at')}>
                        <Input
                            type="datetime-local"
                            value={data.closed_at}
                            onChange={(event) =>
                                setData('closed_at', event.target.value)
                            }
                        />
                    </Field>
                </div>
            </section>

            <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
                <div className="grid gap-5 lg:grid-cols-2">
                    <Field label="Description" error={error('description')}>
                        <textarea
                            value={data.description}
                            onChange={(event) =>
                                setData('description', event.target.value)
                            }
                            className="min-h-36 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                    </Field>
                    <Field
                        label="Resolution notes"
                        error={error('resolution_notes')}
                    >
                        <textarea
                            value={data.resolution_notes}
                            onChange={(event) =>
                                setData(
                                    'resolution_notes',
                                    event.target.value,
                                )
                            }
                            className="min-h-36 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                    </Field>
                    <Field label="Internal notes" error={error('internal_notes')}>
                        <textarea
                            value={data.internal_notes}
                            onChange={(event) =>
                                setData('internal_notes', event.target.value)
                            }
                            className="min-h-36 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                    </Field>
                </div>
            </section>

            <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-[#E4E7EC] bg-[#F9FAFB]/95 py-4 backdrop-blur">
                <Button variant="outline" asChild>
                    <Link href={issuesIndex()}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    <Save className="size-4" />
                    {processing ? 'Saving...' : 'Save issue'}
                </Button>
            </div>
        </form>
    );
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
    options,
    onChange,
}: {
    value: string;
    options: string[];
    onChange: (value: string) => void;
}) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}
