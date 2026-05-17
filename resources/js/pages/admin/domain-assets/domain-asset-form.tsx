import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import {
    index as domainAssetsIndex,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/DomainAssetController';
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

export type DomainAssetPayload = {
    id: number;
    client_id: number;
    project_id: number | null;
    domain_name: string;
    registrar: string | null;
    registered_at: string | null;
    expired_at: string | null;
    auto_renew: boolean;
    notes: string | null;
};

type DomainAssetFormData = {
    client_id: string;
    project_id: string;
    domain_name: string;
    registrar: string;
    registered_at: string;
    expired_at: string;
    auto_renew: boolean;
    notes: string;
};

function formData(
    domainAsset?: DomainAssetPayload | null,
): DomainAssetFormData {
    return {
        client_id: domainAsset?.client_id?.toString() ?? '',
        project_id: domainAsset?.project_id?.toString() ?? '',
        domain_name: domainAsset?.domain_name ?? '',
        registrar: domainAsset?.registrar ?? '',
        registered_at: dateInputValue(domainAsset?.registered_at),
        expired_at: dateInputValue(domainAsset?.expired_at),
        auto_renew: Boolean(domainAsset?.auto_renew),
        notes: domainAsset?.notes ?? '',
    };
}

function dateInputValue(value?: string | null): string {
    return value ? value.slice(0, 10) : '';
}

export default function DomainAssetForm({
    clients,
    projects,
    domainAsset = null,
}: {
    clients: Option[];
    projects: Option[];
    domainAsset?: DomainAssetPayload | null;
}) {
    const isEditing = domainAsset !== null;
    const { data, setData, post, put, processing, errors } =
        useForm<DomainAssetFormData>(formData(domainAsset));
    const filteredProject = projects.filter(
        (project) =>
            !data.client_id || String(project.client_id) === data.client_id,
    );
    const error = (key: string): string | undefined =>
        errors[key as keyof typeof errors];

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isEditing) {
            put(update.url(domainAsset.id), { preserveScroll: true });

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
                    <Field label="Name domain" error={error('domain_name')}>
                        <Input
                            value={data.domain_name}
                            onChange={(event) =>
                                setData('domain_name', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Registrar" error={error('registrar')}>
                        <Input
                            value={data.registrar}
                            onChange={(event) =>
                                setData('registrar', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Terdaftar pada" error={error('registered_at')}>
                        <Input
                            type="date"
                            value={data.registered_at}
                            onChange={(event) =>
                                setData('registered_at', event.target.value)
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
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <Field label="Catatan" error={error('notes')}>
                        <textarea
                            value={data.notes}
                            onChange={(event) =>
                                setData('notes', event.target.value)
                            }
                            className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                    </Field>
                    <label className="flex items-center gap-2 pt-7 text-sm text-[#344054]">
                        <input
                            type="checkbox"
                            checked={data.auto_renew}
                            onChange={(event) =>
                                setData('auto_renew', event.target.checked)
                            }
                        />
                        Otomatis renew
                    </label>
                </div>
            </section>

            <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-[#E4E7EC] bg-[#F9FAFB]/95 py-4 backdrop-blur">
                <Button variant="outline" asChild>
                    <Link href={domainAssetsIndex()}>Batal</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    <Save className="size-4" />
                    {processing ? 'Menyimpan...' : 'Simpan domain'}
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
