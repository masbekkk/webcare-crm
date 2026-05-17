import { Head } from '@inertiajs/react';
import UserForm from './user-form';
import type { UserPayload } from './user-form';

type ClientOption = {
    id: number;
    company_name: string;
};

export default function UserEdit({
    user,
    clients,
}: {
    user: UserPayload;
    clients: ClientOption[];
}) {
    return (
        <>
            <Head title={`Edit ${user.name}`} />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Edit pengguna
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Tidakrmaldate account access, client link, and login status.
                    </p>
                </div>
                <UserForm user={user} clients={clients} />
            </div>
        </>
    );
}
