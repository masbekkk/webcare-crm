import { Head } from '@inertiajs/react';
import ClientForm from './client-form';
import type { ClientPayload } from './client-form';

export default function ClientEdit({ client }: { client: ClientPayload }) {
    return (
        <>
            <Head title={`Edit ${client.company_name}`} />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Edit klien
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Tidakrmaldate company profile and sync related portal users.
                    </p>
                </div>
                <ClientForm client={client} />
            </div>
        </>
    );
}
