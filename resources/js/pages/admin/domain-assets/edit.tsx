import { Head } from '@inertiajs/react';
import DomainAssetForm from './domain-asset-form';
import type { DomainAssetPayload } from './domain-asset-form';

type Option = {
    id: number;
    company_name?: string;
    client_id?: number;
    name?: string;
};

export default function DomainAssetsEdit({
    clients,
    projects,
    domainAsset,
}: {
    clients: Option[];
    projects: Option[];
    domainAsset: DomainAssetPayload;
}) {
    return (
        <>
            <Head title={`Edit ${domainAsset.domain_name}`} />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Edit aset domain
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Tidakrmaldate domain ownership and renewal information.
                    </p>
                </div>
                <DomainAssetForm
                    clients={clients}
                    projects={projects}
                    domainAsset={domainAsset}
                />
            </div>
        </>
    );
}
