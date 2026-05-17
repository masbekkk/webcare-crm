import { Link, useForm } from '@inertiajs/react';
import { Plus, Save, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    index as clientsIndex,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/ClientController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ClientUserForm = {
    id?: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    is_active: boolean;
};

export type ClientPayload = {
    id: number;
    company_name: string;
    display_name: string | null;
    pic_name: string | null;
    pic_position: string | null;
    pic_email: string | null;
    pic_phone: string | null;
    pic_whatsapp: string | null;
    company_email: string | null;
    company_phone: string | null;
    address: string | null;
    city: string | null;
    province: string | null;
    status: string;
    notes: string | null;
    users: Array<{
        id: number;
        name: string;
        email: string;
        phone: string | null;
        is_active: boolean;
    }>;
};

type ClientFormData = {
    company_name: string;
    display_name: string;
    pic_name: string;
    pic_position: string;
    pic_email: string;
    pic_phone: string;
    pic_whatsapp: string;
    company_email: string;
    company_phone: string;
    address: string;
    city: string;
    province: string;
    status: string;
    notes: string;
    users: ClientUserForm[];
};

const statuses = ['active', 'inactive', 'prospect', 'suspended'];

function emptyUser(): ClientUserForm {
    return {
        name: '',
        email: '',
        password: '',
        phone: '',
        is_active: true,
    };
}

function formData(client?: ClientPayload | null): ClientFormData {
    if (!client) {
        return {
            company_name: '',
            display_name: '',
            pic_name: '',
            pic_position: '',
            pic_email: '',
            pic_phone: '',
            pic_whatsapp: '',
            company_email: '',
            company_phone: '',
            address: '',
            city: '',
            province: '',
            status: 'active',
            notes: '',
            users: [],
        };
    }

    return {
        company_name: client.company_name,
        display_name: client.display_name ?? '',
        pic_name: client.pic_name ?? '',
        pic_position: client.pic_position ?? '',
        pic_email: client.pic_email ?? '',
        pic_phone: client.pic_phone ?? '',
        pic_whatsapp: client.pic_whatsapp ?? '',
        company_email: client.company_email ?? '',
        company_phone: client.company_phone ?? '',
        address: client.address ?? '',
        city: client.city ?? '',
        province: client.province ?? '',
        status: client.status,
        notes: client.notes ?? '',
        users: client.users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            password: '',
            phone: user.phone ?? '',
            is_active: Boolean(user.is_active),
        })),
    };
}

export default function ClientForm({
    client = null,
}: {
    client?: ClientPayload | null;
}) {
    const isEditing = client !== null;
    const { data, setData, post, put, processing, errors } =
        useForm<ClientFormData>(formData(client));

    const error = (key: string): string | undefined =>
        errors[key as keyof typeof errors];

    const updateUser = (index: number, value: Partial<ClientUserForm>) => {
        setData('users', patchRow(data.users, index, value));
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isEditing) {
            put(update.url(client.id), { preserveScroll: true });

            return;
        }

        post(store.url(), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
                <h2 className="text-base font-semibold text-[#101828]">
                    Perusahaan
                </h2>
                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                    <Field label="Name perusahaan" error={error('company_name')}>
                        <Input
                            value={data.company_name}
                            onChange={(event) =>
                                setData('company_name', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Name tampilan" error={error('display_name')}>
                        <Input
                            value={data.display_name}
                            onChange={(event) =>
                                setData('display_name', event.target.value)
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
                    <Field label="Email perusahaan" error={error('company_email')}>
                        <Input
                            type="email"
                            value={data.company_email}
                            onChange={(event) =>
                                setData('company_email', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Telepon perusahaan" error={error('company_phone')}>
                        <Input
                            value={data.company_phone}
                            onChange={(event) =>
                                setData('company_phone', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Kota" error={error('city')}>
                        <Input
                            value={data.city}
                            onChange={(event) =>
                                setData('city', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Provinsi" error={error('province')}>
                        <Input
                            value={data.province}
                            onChange={(event) =>
                                setData('province', event.target.value)
                            }
                        />
                    </Field>
                </div>
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <Field label="Alamat" error={error('address')}>
                        <textarea
                            value={data.address}
                            onChange={(event) =>
                                setData('address', event.target.value)
                            }
                            className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                    </Field>
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

            <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
                <h2 className="text-base font-semibold text-[#101828]">PIC</h2>
                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                    <Field label="Name PIC" error={error('pic_name')}>
                        <Input
                            value={data.pic_name}
                            onChange={(event) =>
                                setData('pic_name', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Jabatan PIC" error={error('pic_position')}>
                        <Input
                            value={data.pic_position}
                            onChange={(event) =>
                                setData('pic_position', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Email PIC" error={error('pic_email')}>
                        <Input
                            type="email"
                            value={data.pic_email}
                            onChange={(event) =>
                                setData('pic_email', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Telepon PIC" error={error('pic_phone')}>
                        <Input
                            value={data.pic_phone}
                            onChange={(event) =>
                                setData('pic_phone', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="PIC WhatsApp" error={error('pic_whatsapp')}>
                        <Input
                            value={data.pic_whatsapp}
                            onChange={(event) =>
                                setData('pic_whatsapp', event.target.value)
                            }
                        />
                    </Field>
                </div>
            </section>

            <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-base font-semibold text-[#101828]">
                        User klien
                    </h2>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setData('users', [...data.users, emptyUser()])
                        }
                    >
                        <Plus className="size-4" />
                        Add user
                    </Button>
                </div>

                {data.users.length === 0 && (
                    <p className="mt-4 text-sm text-[#667085]">
                        Tidak client user added.
                    </p>
                )}

                <div className="mt-4 flex flex-col">
                    {data.users.map((user, index) => (
                        <div
                            key={user.id ?? index}
                            className="grid gap-4 border-t border-[#E4E7EC] py-4 first:border-t-0 lg:grid-cols-6"
                        >
                            <Field
                                label="Name"
                                error={error(`users.${index}.name`)}
                            >
                                <Input
                                    value={user.name}
                                    onChange={(event) =>
                                        updateUser(index, {
                                            name: event.target.value,
                                        })
                                    }
                                />
                            </Field>
                            <Field
                                label="Email"
                                error={error(`users.${index}.email`)}
                            >
                                <Input
                                    type="email"
                                    value={user.email}
                                    onChange={(event) =>
                                        updateUser(index, {
                                            email: event.target.value,
                                        })
                                    }
                                />
                            </Field>
                            <Field
                                label={user.id ? 'Password baru' : 'Password'}
                                error={error(`users.${index}.password`)}
                            >
                                <Input
                                    type="password"
                                    value={user.password}
                                    onChange={(event) =>
                                        updateUser(index, {
                                            password: event.target.value,
                                        })
                                    }
                                />
                            </Field>
                            <Field label="Telepon">
                                <Input
                                    value={user.phone}
                                    onChange={(event) =>
                                        updateUser(index, {
                                            phone: event.target.value,
                                        })
                                    }
                                />
                            </Field>
                            <label className="flex items-center gap-2 pt-7 text-sm">
                                <input
                                    type="checkbox"
                                    checked={user.is_active}
                                    onChange={(event) =>
                                        updateUser(index, {
                                            is_active: event.target.checked,
                                        })
                                    }
                                />
                                Active
                            </label>
                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setData(
                                            'users',
                                            data.users.filter(
                                                (_, rowIndex) =>
                                                    rowIndex !== index,
                                            ),
                                        )
                                    }
                                    className="w-full text-red-600"
                                >
                                    <Trash2 className="size-4" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-[#E4E7EC] bg-[#F9FAFB]/95 py-4 backdrop-blur">
                <Button variant="outline" asChild>
                    <Link href={clientsIndex()}>Batal</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    <Save className="size-4" />
                    {processing ? 'Menyimpan...' : 'Simpan klien'}
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

function patchRow<T>(rows: T[], index: number, value: Partial<T>): T[] {
    return rows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...value } : row,
    );
}
