import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import {
    create,
    destroy,
    edit,
} from '@/actions/App/Http/Controllers/Admin/HostingAssetController';
import { Button } from '@/components/ui/button';

type HostingAssetRow = {
    id: number;
    provider: string;
    service_name: string | null;
    panel_url: string | null;
    server_ip: string | null;
    start_date: string | null;
    expired_at: string | null;
    client: { company_name: string };
    project: { name: string } | null;
};

type PaginatedHostingAssets = {
    data: HostingAssetRow[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

export default function HostingAssetsIndex({
    hostingAssets,
}: {
    hostingAssets: PaginatedHostingAssets;
}) {
    const deleteHostingAsset = (hostingAsset: HostingAssetRow) => {
        if (!window.confirm(`Delete hosting "${hostingAsset.provider}"?`)) {
            return;
        }

        router.delete(destroy.url(hostingAsset.id), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Hosting assets" />
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#101828]">
                            Hosting assets
                        </h1>
                        <p className="mt-1 text-sm text-[#667085]">
                            Manage hosting providers, panels, servers, and
                            renewals.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus className="size-4" />
                            New hosting
                        </Link>
                    </Button>
                </div>

                <div className="mt-6 overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px] text-left text-sm">
                            <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#667085] uppercase">
                                <tr>
                                    <th className="px-5 py-3">Hosting</th>
                                    <th className="px-5 py-3">Client</th>
                                    <th className="px-5 py-3">Project</th>
                                    <th className="px-5 py-3">Access</th>
                                    <th className="px-5 py-3">Dates</th>
                                    <th className="px-5 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E7EC]">
                                {hostingAssets.data.map((hostingAsset) => (
                                    <tr key={hostingAsset.id}>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-[#101828]">
                                                {hostingAsset.provider}
                                            </div>
                                            <div className="text-xs text-[#667085]">
                                                {hostingAsset.service_name ??
                                                    '-'}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {hostingAsset.client.company_name}
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {hostingAsset.project?.name ?? '-'}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            {hostingAsset.panel_url ?? '-'}
                                            <br />
                                            {hostingAsset.server_ip ?? '-'}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            Start:{' '}
                                            {hostingAsset.start_date ?? '-'}
                                            <br />
                                            Expires:{' '}
                                            {hostingAsset.expired_at ?? '-'}
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
                                                            hostingAsset.id,
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
                                                        deleteHostingAsset(
                                                            hostingAsset,
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

                    {hostingAssets.data.length === 0 && (
                        <div className="px-5 py-12 text-center text-sm text-[#667085]">
                            No hosting assets found.
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 border-t border-[#E4E7EC] px-5 py-4">
                        {hostingAssets.links.map((link) => (
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
