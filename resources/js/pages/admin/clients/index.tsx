import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import {
    create,
    destroy,
    edit,
} from '@/actions/App/Http/Controllers/Admin/ClientController';
import { Button } from '@/components/ui/button';

type ClientRow = {
    id: number;
    company_name: string;
    display_name: string | null;
    pic_name: string | null;
    pic_email: string | null;
    company_email: string | null;
    city: string | null;
    province: string | null;
    status: string;
    users_count: number;
    projects_count: number;
};

type PaginatedClients = {
    data: ClientRow[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

export default function ClientsIndex({
    clients,
}: {
    clients: PaginatedClients;
}) {
    const deleteClient = (client: ClientRow) => {
        if (!window.confirm(`Delete client "${client.company_name}"?`)) {
            return;
        }

        router.delete(destroy.url(client.id), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Clients" />
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#101828]">
                            Clients
                        </h1>
                        <p className="mt-1 text-sm text-[#667085]">
                            Manage company profiles and portal user accounts.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus className="size-4" />
                            New client
                        </Link>
                    </Button>
                </div>

                <div className="mt-6 overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[920px] text-left text-sm">
                            <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#667085] uppercase">
                                <tr>
                                    <th className="px-5 py-3">Client</th>
                                    <th className="px-5 py-3">PIC</th>
                                    <th className="px-5 py-3">Location</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Relations</th>
                                    <th className="px-5 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E7EC]">
                                {clients.data.map((client) => (
                                    <tr key={client.id}>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-[#101828]">
                                                {client.company_name}
                                            </div>
                                            <div className="text-xs text-[#667085]">
                                                {client.company_email ??
                                                    client.display_name ??
                                                    '-'}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            <div>{client.pic_name ?? '-'}</div>
                                            <div className="text-xs text-[#667085]">
                                                {client.pic_email ?? '-'}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {[client.city, client.province]
                                                .filter(Boolean)
                                                .join(', ') || '-'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-500">
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            {client.users_count} users,{' '}
                                            {client.projects_count} projects
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link href={edit(client.id)}>
                                                        <Edit className="size-4" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        deleteClient(client)
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

                    {clients.data.length === 0 && (
                        <div className="px-5 py-12 text-center text-sm text-[#667085]">
                            No clients found.
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 border-t border-[#E4E7EC] px-5 py-4">
                        {clients.links.map((link) => (
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
