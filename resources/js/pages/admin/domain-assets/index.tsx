import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import {
    create,
    destroy,
    edit,
} from '@/actions/App/Http/Controllers/Admin/DomainAssetController';
import { Button } from '@/components/ui/button';

type DomainAssetRow = {
    id: number;
    domain_name: string;
    registrar: string | null;
    registered_at: string | null;
    expired_at: string | null;
    auto_renew: boolean;
    client: { company_name: string };
    project: { name: string } | null;
};

type PaginatedDomainAssets = {
    data: DomainAssetRow[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

export default function DomainAssetsIndex({
    domainAssets,
}: {
    domainAssets: PaginatedDomainAssets;
}) {
    const deleteDomainAsset = (domainAsset: DomainAssetRow) => {
        if (!window.confirm(`Delete domain "${domainAsset.domain_name}"?`)) {
            return;
        }

        router.delete(destroy.url(domainAsset.id), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Domain assets" />
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#101828]">
                            Domain assets
                        </h1>
                        <p className="mt-1 text-sm text-[#667085]">
                            Manage domain ownership, registrar, and renewals.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus className="size-4" />
                            New domain
                        </Link>
                    </Button>
                </div>

                <div className="mt-6 overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[920px] text-left text-sm">
                            <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#667085] uppercase">
                                <tr>
                                    <th className="px-5 py-3">Domain</th>
                                    <th className="px-5 py-3">Client</th>
                                    <th className="px-5 py-3">Project</th>
                                    <th className="px-5 py-3">Dates</th>
                                    <th className="px-5 py-3">Renewal</th>
                                    <th className="px-5 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E7EC]">
                                {domainAssets.data.map((domainAsset) => (
                                    <tr key={domainAsset.id}>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-[#101828]">
                                                {domainAsset.domain_name}
                                            </div>
                                            <div className="text-xs text-[#667085]">
                                                {domainAsset.registrar ?? '-'}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {domainAsset.client.company_name}
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {domainAsset.project?.name ?? '-'}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            Registered:{' '}
                                            {domainAsset.registered_at ?? '-'}
                                            <br />
                                            Expires:{' '}
                                            {domainAsset.expired_at ?? '-'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-500">
                                                {domainAsset.auto_renew
                                                    ? 'Auto'
                                                    : 'Manual'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit(
                                                            domainAsset.id,
                                                        )}
                                                    >
                                                        <Edit className="size-4" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        deleteDomainAsset(
                                                            domainAsset,
                                                        )
                                                    }
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="size-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {domainAssets.data.length === 0 && (
                        <div className="px-5 py-12 text-center text-sm text-[#667085]">
                            No domain assets found.
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 border-t border-[#E4E7EC] px-5 py-4">
                        {domainAssets.links.map((link) => (
                            <Button
                                key={`${link.label}-${link.url}`}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={Boolean(link.url)}
                            >
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
