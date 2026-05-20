import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    index as monitorsIndex,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/WebsiteMonitorController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Option = {
    id: number;
    client_id?: number;
    project_id?: number;
    company_name?: string;
    name?: string;
    label?: string;
    url?: string;
};

export type WebsiteMonitorPayload = {
    id: number;
    project_id: number;
    project_link_id: number | null;
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
};

type WebsiteMonitorFormData = {
    client_id: string;
    project_id: string;
    project_link_id: string;
    name: string;
    url: string;
    method: string;
    expected_status_code: string;
    timeout_seconds: string;
    check_interval_seconds: string;
    is_active: boolean;
    current_status: string;
    last_status_code: string;
    last_response_time_ms: string;
    last_checked_at: string;
    last_down_at: string;
    last_recovered_at: string;
    consecutive_failures: string;
    consecutive_successes: string;
};

type Props = {
    clients: Option[];
    projects: Option[];
    projectLinks: Option[];
    monitor?: WebsiteMonitorPayload | null;
};

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];
const statuses = ['unknown', 'up', 'down', 'degraded'];

function dateTimeInput(value: string | null): string {
    return value ? value.slice(0, 16) : '';
}

function formData(monitor?: WebsiteMonitorPayload | null): WebsiteMonitorFormData {
    return {
        client_id: '',
        project_id: monitor ? String(monitor.project_id) : '',
        project_link_id: monitor?.project_link_id
            ? String(monitor.project_link_id)
            : '',
        name: monitor?.name ?? '',
        url: monitor?.url ?? '',
        method: monitor?.method ?? 'GET',
        expected_status_code: String(monitor?.expected_status_code ?? 200),
        timeout_seconds: String(monitor?.timeout_seconds ?? 10),
        check_interval_seconds: String(
            monitor?.check_interval_seconds ?? 60,
        ),
        is_active: monitor?.is_active ?? true,
        current_status: monitor?.current_status ?? 'unknown',
        last_status_code: monitor?.last_status_code
            ? String(monitor.last_status_code)
            : '',
        last_response_time_ms: monitor?.last_response_time_ms
            ? String(monitor.last_response_time_ms)
            : '',
        last_checked_at: dateTimeInput(monitor?.last_checked_at ?? null),
        last_down_at: dateTimeInput(monitor?.last_down_at ?? null),
        last_recovered_at: dateTimeInput(monitor?.last_recovered_at ?? null),
        consecutive_failures: String(monitor?.consecutive_failures ?? 0),
        consecutive_successes: String(monitor?.consecutive_successes ?? 0),
    };
}

export default function MonitorForm({
    clients,
    projects,
    projectLinks,
    monitor = null,
}: Props) {
    const isEditing = monitor !== null;
    const { data, setData, post, put, processing, errors } =
        useForm<WebsiteMonitorFormData>(formData(monitor));
    const selectedProject = projects.find(
        (project) => String(project.id) === data.project_id,
    );
    const selectedClientId = data.client_id || String(selectedProject?.client_id ?? '');
    const filteredProject = projects.filter(
        (project) =>
            !selectedClientId || String(project.client_id) === selectedClientId,
    );
    const filteredProjectLinks = projectLinks.filter(
        (projectLink) =>
            !data.project_id ||
            String(projectLink.project_id) === data.project_id,
    );
    const error = (key: string): string | undefined =>
        errors[key as keyof typeof errors];

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isEditing) {
            put(update.url(monitor.id), { preserveScroll: true });

            return;
        }

        post(store.url(), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
                <div className="mb-5">
                    <h2 className="text-base font-semibold text-[#101828]">
                        Required monitor data
                    </h2>
                    <p className="mt-1 text-sm text-[#667085]">
                        Fill these fields to create the monitor target.
                    </p>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                    <Field label="Klien" required>
                        <select
                            value={selectedClientId}
                            onChange={(event) =>
                                setData((current) => ({
                                    ...current,
                                    client_id: event.target.value,
                                    project_id: '',
                                    project_link_id: '',
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

                    <Field
                        label="Proyek"
                        error={error('project_id')}
                        required
                    >
                        <select
                            value={data.project_id}
                            onChange={(event) =>
                                setData((current) => ({
                                    ...current,
                                    project_id: event.target.value,
                                    project_link_id: '',
                                }))
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

                    <Field label="Name" error={error('name')} required>
                        <Input
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                        />
                    </Field>

                    <Field label="URL" error={error('url')} required>
                        <Input
                            value={data.url}
                            onChange={(event) =>
                                setData('url', event.target.value)
                            }
                        />
                    </Field>
                </div>
            </section>

            <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
                <div className="mb-5">
                    <h2 className="text-base font-semibold text-[#101828]">
                        Optional setup
                    </h2>
                    <p className="mt-1 text-sm text-[#667085]">
                        These can use defaults or be filled when the monitor
                        needs a specific target or check behavior.
                    </p>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                    <Field
                        label="Project link"
                        error={error('project_link_id')}
                        hint="Optional. Selecting one copies its URL."
                    >
                        <select
                            value={data.project_link_id}
                            onChange={(event) => {
                                const projectLink = projectLinks.find(
                                    (link) =>
                                        String(link.id) === event.target.value,
                                );

                                setData((current) => ({
                                    ...current,
                                    project_link_id: event.target.value,
                                    url: projectLink?.url ?? current.url,
                                }));
                            }}
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                            <option value="">Tidak linked project URL</option>
                            {filteredProjectLinks.map((projectLink) => (
                                <option
                                    key={projectLink.id}
                                    value={projectLink.id}
                                >
                                    {projectLink.label} ({projectLink.url})
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Metode" error={error('method')}>
                        <SelectField
                            value={data.method}
                            options={methods}
                            onChange={(value) => setData('method', value)}
                        />
                    </Field>
                    <Field
                        label="Kode status yang diharapkan"
                        error={error('expected_status_code')}
                    >
                        <Input
                            type="number"
                            min="100"
                            max="599"
                            value={data.expected_status_code}
                            onChange={(event) =>
                                setData(
                                    'expected_status_code',
                                    event.target.value,
                                )
                            }
                        />
                    </Field>
                    <Field
                        label="Timeout detik"
                        error={error('timeout_seconds')}
                    >
                        <Input
                            type="number"
                            min="1"
                            value={data.timeout_seconds}
                            onChange={(event) =>
                                setData('timeout_seconds', event.target.value)
                            }
                        />
                    </Field>
                    <Field
                        label="Check interval seconds"
                        error={error('check_interval_seconds')}
                    >
                        <Input
                            type="number"
                            min="30"
                            value={data.check_interval_seconds}
                            onChange={(event) =>
                                setData(
                                    'check_interval_seconds',
                                    event.target.value,
                                )
                            }
                        />
                    </Field>
                </div>

                <label className="mt-5 flex items-center gap-2 text-sm text-[#344054]">
                    <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(event) =>
                            setData('is_active', event.target.checked)
                        }
                    />
                    Active
                </label>
            </section>

            {isEditing && (
                <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
                    <div className="mb-5">
                        <h2 className="text-base font-semibold text-[#101828]">
                            Runtime status
                        </h2>
                        <p className="mt-1 text-sm text-[#667085]">
                            Biasanya diisi oleh pemeriksaan. Edit manual hanya jika
                            correcting monitor state.
                        </p>
                    </div>
                    <div className="grid gap-5 lg:grid-cols-4">
                    <Field
                        label="Current status"
                        error={error('current_status')}
                    >
                        <SelectField
                            value={data.current_status}
                            options={statuses}
                            onChange={(value) =>
                                setData('current_status', value)
                            }
                        />
                    </Field>
                        <Field
                            label="Last status code"
                            error={error('last_status_code')}
                        >
                        <Input
                            type="number"
                            min="100"
                            max="599"
                            value={data.last_status_code}
                            onChange={(event) =>
                                setData('last_status_code', event.target.value)
                            }
                        />
                    </Field>
                        <Field
                            label="Last response ms"
                            error={error('last_response_time_ms')}
                        >
                        <Input
                            type="number"
                            min="0"
                            value={data.last_response_time_ms}
                            onChange={(event) =>
                                setData(
                                    'last_response_time_ms',
                                    event.target.value,
                                )
                            }
                        />
                    </Field>
                        <Field
                            label="Gagal beruntun"
                            error={error('consecutive_failures')}
                        >
                        <Input
                            type="number"
                            min="0"
                            value={data.consecutive_failures}
                            onChange={(event) =>
                                setData(
                                    'consecutive_failures',
                                    event.target.value,
                                )
                            }
                        />
                    </Field>
                        <Field
                            label="Berhasil beruntun"
                            error={error('consecutive_successes')}
                        >
                        <Input
                            type="number"
                            min="0"
                            value={data.consecutive_successes}
                            onChange={(event) =>
                                setData(
                                    'consecutive_successes',
                                    event.target.value,
                                )
                            }
                        />
                    </Field>
                    </div>

                    <div className="mt-5 grid gap-5 lg:grid-cols-3">
                        <Field
                            label="Terakhir diperiksa"
                            error={error('last_checked_at')}
                        >
                        <Input
                            type="datetime-local"
                            value={data.last_checked_at}
                            onChange={(event) =>
                                setData('last_checked_at', event.target.value)
                            }
                        />
                    </Field>
                        <Field label="Terakhir down" error={error('last_down_at')}>
                        <Input
                            type="datetime-local"
                            value={data.last_down_at}
                            onChange={(event) =>
                                setData('last_down_at', event.target.value)
                            }
                        />
                    </Field>
                        <Field
                            label="Terakhir pulih"
                            error={error('last_recovered_at')}
                        >
                        <Input
                            type="datetime-local"
                            value={data.last_recovered_at}
                            onChange={(event) =>
                                setData(
                                    'last_recovered_at',
                                    event.target.value,
                                )
                            }
                        />
                    </Field>
                    </div>
                </section>
            )}

            <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-[#E4E7EC] bg-[#F9FAFB]/95 py-4 backdrop-blur">
                <Button variant="outline" asChild>
                    <Link href={monitorsIndex()}>Batal</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    <Save className="size-4" />
                    {processing ? 'Menyimpan...' : 'Simpan monitor'}
                </Button>
            </div>
        </form>
    );
}

function Field({
    label,
    error,
    required = false,
    hint,
    children,
}: {
    label: string;
    error?: string;
    required?: boolean;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2">
                {label}
                {required ? (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">
                        Required
                    </span>
                ) : (
                    <span className="rounded-full bg-[#F2F4F7] px-2 py-0.5 text-[11px] font-semibold text-[#667085]">
                        Optional
                    </span>
                )}
            </Label>
            {children}
            {hint && <p className="text-xs text-[#667085]">{hint}</p>}
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
