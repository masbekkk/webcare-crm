import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import {
    destroy,
    edit,
    index as issuesIndex,
} from '@/actions/App/Http/Controllers/Admin/IssueController';
import { edit as editProject } from '@/actions/App/Http/Controllers/Admin/ProjectController';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/pages/admin/monitoring-index-components';

type Person = {
    name: string;
    email?: string;
};

type IssueShowPayload = {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    due_date: string | null;
    resolved_at: string | null;
    closed_at: string | null;
    resolution_notes: string | null;
    internal_notes: string | null;
    created_at: string;
    updated_at: string;
    client: { company_name: string };
    project: { id: number; name: string; slug: string };
    reporter: Person | null;
    assignee: Person | null;
    attachments: Array<{
        id: number;
        file_name: string;
        file_path: string;
        file_type: string | null;
        file_size: number | null;
        uploader: Person;
        created_at: string;
    }>;
};

export default function IssuesShow({ issue }: { issue: IssueShowPayload }) {
    const deleteIssue = () => {
        if (!window.confirm(`Delete issue "${issue.title}"?`)) {
            return;
        }

        router.delete(destroy.url(issue.id), { preserveScroll: true });
    };

    return (
        <>
            <Head title={issue.title} />
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link
                            href={issuesIndex()}
                            className="text-sm font-semibold text-brand-500"
                        >
                            Kembali ke masalah
                        </Link>
                        <h1 className="mt-3 text-2xl font-semibold text-[#101828]">
                            {issue.title}
                        </h1>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <StatusBadge value={issue.status} />
                            <StatusBadge
                                value={issue.priority}
                                tone={
                                    issue.priority === 'urgent' ||
                                    issue.priority === 'high'
                                        ? 'bad'
                                        : 'neutral'
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={edit(issue.id)}>
                                <Edit className="size-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="text-red-600"
                            onClick={deleteIssue}
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="flex flex-col gap-6">
                        <Panel title="Description">
                            <p className="whitespace-pre-wrap text-sm leading-6 text-[#344054]">
                                {issue.description}
                            </p>
                        </Panel>

                        <Panel title="Notes penyelesaian">
                            <p className="whitespace-pre-wrap text-sm leading-6 text-[#344054]">
                                {issue.resolution_notes ?? '-'}
                            </p>
                        </Panel>

                        <Panel title="Notes internal">
                            <p className="whitespace-pre-wrap text-sm leading-6 text-[#344054]">
                                {issue.internal_notes ?? '-'}
                            </p>
                        </Panel>

                        <Panel title="Lampiran">
                            {issue.attachments.length === 0 ? (
                                <p className="text-sm text-[#667085]">
                                    Tidak attachments.
                                </p>
                            ) : (
                                <div className="divide-y divide-[#E4E7EC]">
                                    {issue.attachments.map((attachment) => (
                                        <div
                                            key={attachment.id}
                                            className="py-3 first:pt-0 last:pb-0"
                                        >
                                            <div className="font-semibold text-[#101828]">
                                                {attachment.file_name}
                                            </div>
                                            <div className="mt-1 text-xs text-[#667085]">
                                                Tidakrmalloaded by{' '}
                                                {attachment.uploader.name} /{' '}
                                                {attachment.file_type ?? '-'} /{' '}
                                                {attachment.file_size ?? 0}{' '}
                                                bytes
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Panel>
                    </div>

                    <Panel title="Issue details">
                        <dl className="grid gap-4 text-sm">
                            <Detail label="Klien" value={issue.client.company_name} />
                            <div>
                                <dt className="text-xs font-medium text-[#667085]">
                                    Project
                                </dt>
                                <dd className="mt-1">
                                    <Link
                                        href={editProject(issue.project.id)}
                                        className="font-semibold text-brand-500"
                                    >
                                        {issue.project.name}
                                    </Link>
                                </dd>
                            </div>
                            <Detail
                                label="Pelapor"
                                value={issue.reporter?.name ?? '-'}
                            />
                            <Detail
                                label="Penanggung jawab"
                                value={issue.assignee?.name ?? '-'}
                            />
                            <Detail label="Tanggal jatuh tempo" value={issue.due_date ?? '-'} />
                            <Detail
                                label="Diselesaikan pada"
                                value={issue.resolved_at ?? '-'}
                            />
                            <Detail label="Ditutup pada" value={issue.closed_at ?? '-'} />
                            <Detail label="Created" value={issue.created_at} />
                            <Detail label="Tidakrmaldated" value={issue.updated_at} />
                        </dl>
                    </Panel>
                </div>
            </div>
        </>
    );
}

function Panel({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
            <h2 className="text-base font-semibold text-[#101828]">{title}</h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs font-medium text-[#667085]">{label}</dt>
            <dd className="mt-1 font-semibold text-[#101828]">{value}</dd>
        </div>
    );
}
