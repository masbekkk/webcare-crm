import { Head } from '@inertiajs/react';
import UserForm from './user-form';
import type { UserPayload } from './user-form';

type ClientOption = {
    id: number;
    company_name: string;
};

export default function UserCreate({
    user,
    clients,
}: {
    user: UserPayload | null;
    clients: ClientOption[];
}) {
    return (
        <>
            <Head title="Buat pengguna" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Buat pengguna
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Buat akun admin atau portal klien.
                    </p>
                </div>
                <UserForm user={user} clients={clients} />
            </div>
        </>
    );
}
