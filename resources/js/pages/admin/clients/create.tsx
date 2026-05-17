import { Head } from '@inertiajs/react';
import ClientForm from './client-form';
import type { ClientPayload } from './client-form';

export default function ClientCreate({
    client,
}: {
    client: ClientPayload | null;
}) {
    return (
        <>
            <Head title="Buat klien" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Buat klien
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Buat profil perusahaan dan akun portal klien terkait.
                    </p>
                </div>
                <ClientForm client={client} />
            </div>
        </>
    );
}
