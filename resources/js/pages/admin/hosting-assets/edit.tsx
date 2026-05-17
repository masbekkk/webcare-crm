import { Head } from '@inertiajs/react';
import HostingAssetForm from './hosting-asset-form';
import type { HostingAssetPayload } from './hosting-asset-form';

type Option = {
    id: number;
    company_name?: string;
    client_id?: number;
    name?: string;
};

export default function HostingAssetsEdit({
    clients,
    projects,
    hostingAsset,
}: {
    clients: Option[];
    projects: Option[];
    hostingAsset: HostingAssetPayload;
}) {
    return (
        <>
            <Head title={`Edit ${hostingAsset.provider}`} />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Edit aset hosting
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Tidakrmaldate hosting provider and renewal information.
                    </p>
                </div>
                <HostingAssetForm
                    clients={clients}
                    projects={projects}
                    hostingAsset={hostingAsset}
                />
            </div>
        </>
    );
}
