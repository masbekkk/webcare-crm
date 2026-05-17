import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import {
    index as hostingAssetsIndex,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/HostingAssetController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Option = {
    id: number;
    company_name?: string;
    client_id?: number;
    name?: string;
};

export type HostingAssetPayload = {
    id: number;
    client_id: number;
    project_id: number | null;
    provider: string;
    service_name: string | null;
    panel_url: string | null;
    server_ip: string | null;
    start_date: string | null;
    expired_at: string | null;
    notes: string | null;
};

type HostingAssetFormData = {
    client_id: string;
    project_id: string;
    provider: string;
    service_name: string;
    panel_url: string;
    server_ip: string;
    start_date: string;
    expired_at: string;
    notes: string;
};

function formData(
    hostingAsset?: HostingAssetPayload | null,
): HostingAssetFormData {
    return {
        client_id: hostingAsset?.client_id?.toString() ?? '',
        project_id: hostingAsset?.project_id?.toString() ?? '',
        provider: hostingAsset?.provider ?? '',
        service_name: hostingAsset?.service_name ?? '',
        panel_url: hostingAsset?.panel_url ?? '',
        server_ip: hostingAsset?.server_ip ?? '',
        start_date: hostingAsset?.start_date ?? '',
        expired_at: hostingAsset?.expired_at ?? '',
        notes: hostingAsset?.notes ?? '',
    };
}

export default function HostingAssetForm({
    clients,
    projects,
    hostingAsset = null,
}: {
    clients: Option[];
    projects: Option[];
    hostingAsset?: HostingAssetPayload | null;
}) {
    const isEditing = hostingAsset !== null;
    const { data, setData, post, put, processing, errors } =
        useForm<HostingAssetFormData>(formData(hostingAsset));
    const filteredProject = projects.filter(
        (project) =>
            !data.client_id || String(project.client_id) === data.client_id,
    );
    const error = (key: string): string | undefined =>
        errors[key as keyof typeof errors];

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isEditing) {
            put(update.url(hostingAsset.id), { preserveScroll: true });

            return;
        }

        post(store.url(), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
                <div className="grid gap-5 lg:grid-cols-3">
                    <Field label="Klien" error={error('client_id')}>
                        <select
                            value={data.client_id}
                            onChange={(event) => {
                                setData((current) => ({
                                    ...current,
                                    client_id: event.target.value,
                                    project_id: '',
                                }));
                            }}
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
                            <option value="">Tidak project</option>
                            {filteredProject.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Penyedia" error={error('provider')}>
                        <Input
                            value={data.provider}
                            onChange={(event) =>
                                setData('provider', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Name layanan" error={error('service_name')}>
                        <Input
                            value={data.service_name}
                            onChange={(event) =>
                                setData('service_name', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="URL panel" error={error('panel_url')}>
                        <Input
                            type="url"
                            value={data.panel_url}
                            onChange={(event) =>
                                setData('panel_url', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="IP server" error={error('server_ip')}>
                        <Input
                            value={data.server_ip}
                            onChange={(event) =>
                                setData('server_ip', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Date mulai" error={error('start_date')}>
                        <Input
                            type="date"
                            value={data.start_date}
                            onChange={(event) =>
                                setData('start_date', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Berakhir pada" error={error('expired_at')}>
                        <Input
                            type="date"
                            value={data.expired_at}
                            onChange={(event) =>
                                setData('expired_at', event.target.value)
                            }
                        />
                    </Field>
                </div>
                <div className="mt-5">
                    <Field label="Catatan" error={error('notes')}>
                        <textarea
                            value={data.notes}
                            onChange={(event) =>
                                setData('notes', event.target.value)
                            }
                            className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                    </Field>
                </div>
            </section>

            <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-[#E4E7EC] bg-[#F9FAFB]/95 py-4 backdrop-blur">
                <Button variant="outline" asChild>
                    <Link href={hostingAssetsIndex()}>Batal</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    <Save className="size-4" />
                    {processing ? 'Menyimpan...' : 'Simpan hosting'}
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
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            {children}
            <InputError message={error} />
        </div>
    );
}
