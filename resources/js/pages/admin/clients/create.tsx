import { Head } from '@inertiajs/react';
import ClientForm from './client-form';
import type { ClientPayload } from './client-form';

export default function ClientsCreate({
    client,
}: {
    client: ClientPayload | null;
}) {
    return (
        <>
            <Head title="Create client" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Create client
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Create company profile and related client portal users.
                    </p>
                </div>
                <ClientForm client={client} />
            </div>
        </>
    );
}
