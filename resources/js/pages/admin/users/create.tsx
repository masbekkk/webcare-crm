import { Head } from '@inertiajs/react';
import UserForm from './user-form';
import type { UserPayload } from './user-form';

type ClientOption = {
    id: number;
    company_name: string;
};

export default function UsersCreate({
    user,
    clients,
}: {
    user: UserPayload | null;
    clients: ClientOption[];
}) {
    return (
        <>
            <Head title="Create user" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Create user
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Create an admin or client portal account.
                    </p>
                </div>
                <UserForm user={user} clients={clients} />
            </div>
        </>
    );
}
