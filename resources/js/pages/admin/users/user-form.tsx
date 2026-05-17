import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    index as usersIndex,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/UserController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ClientOption = {
    id: number;
    company_name: string;
};

export type UserPayload = {
    id: number;
    client_id: number | null;
    name: string;
    email: string;
    role: string;
    phone: string | null;
    is_active: boolean;
    client: ClientOption | null;
};

type UserFormData = {
    client_id: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    phone: string;
    is_active: boolean;
};

function formData(user?: UserPayload | null): UserFormData {
    if (!user) {
        return {
            client_id: '',
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: 'admin',
            phone: '',
            is_active: true,
        };
    }

    return {
        client_id: user.client_id ? String(user.client_id) : '',
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
        phone: user.phone ?? '',
        is_active: Boolean(user.is_active),
    };
}

export default function UserForm({
    user = null,
    clients,
}: {
    user?: UserPayload | null;
    clients: ClientOption[];
}) {
    const isEditing = user !== null;
    const { data, setData, transform, post, put, processing, errors } =
        useForm<UserFormData>(formData(user));

    const error = (key: string): string | undefined =>
        errors[key as keyof typeof errors];

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        transform((values) => ({
            ...values,
            client_id: values.client_id || null,
        }));

        if (isEditing) {
            put(update.url(user.id), { preserveScroll: true });

            return;
        }

        post(store.url(), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
                <h2 className="text-base font-semibold text-[#101828]">
                    Account
                </h2>

                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                    <Field label="Name" error={error('name')}>
                        <Input
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                        />
                    </Field>

                    <Field label="Email" error={error('email')}>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(event) =>
                                setData('email', event.target.value)
                            }
                        />
                    </Field>

                    <Field label="Phone" error={error('phone')}>
                        <Input
                            value={data.phone}
                            onChange={(event) =>
                                setData('phone', event.target.value)
                            }
                        />
                    </Field>

                    <Field label="Role" error={error('role')}>
                        <select
                            value={data.role}
                            onChange={(event) => {
                                const role = event.target.value;

                                setData((values) => ({
                                    ...values,
                                    role,
                                    client_id:
                                        role === 'admin'
                                            ? ''
                                            : values.client_id,
                                }));
                            }}
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                            <option value="admin">admin</option>
                            <option value="client">client</option>
                        </select>
                    </Field>

                    <Field label="Client" error={error('client_id')}>
                        <select
                            value={data.client_id}
                            disabled={data.role === 'admin'}
                            onChange={(event) =>
                                setData('client_id', event.target.value)
                            }
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">No client</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.company_name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <label className="flex items-center gap-2 pt-7 text-sm">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(event) =>
                                setData('is_active', event.target.checked)
                            }
                        />
                        Active
                    </label>
                </div>
            </section>

            <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
                <h2 className="text-base font-semibold text-[#101828]">
                    Password
                </h2>

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <Field
                        label={isEditing ? 'New password' : 'Password'}
                        error={error('password')}
                    >
                        <Input
                            type="password"
                            value={data.password}
                            onChange={(event) =>
                                setData('password', event.target.value)
                            }
                        />
                    </Field>

                    <Field
                        label="Confirm password"
                        error={error('password_confirmation')}
                    >
                        <Input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(event) =>
                                setData(
                                    'password_confirmation',
                                    event.target.value,
                                )
                            }
                        />
                    </Field>
                </div>
            </section>

            <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-[#E4E7EC] bg-[#F9FAFB]/95 py-4 backdrop-blur">
                <Button variant="outline" asChild>
                    <Link href={usersIndex()}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    <Save className="size-4" />
                    {processing ? 'Saving...' : 'Save user'}
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
