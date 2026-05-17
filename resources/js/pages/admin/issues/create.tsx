import { Head } from '@inertiajs/react';
import IssueForm from './issue-form';
import type { IssuePayload } from './issue-form';

type Option = {
    id: number;
    client_id?: number;
    name?: string;
    email?: string;
    company_name?: string;
};

export default function IssuesCreate({
    clients,
    projects,
    users,
}: {
    clients: Option[];
    projects: Option[];
    users: Option[];
    issue: IssuePayload | null;
}) {
    return (
        <>
            <Head title="Buat masalah" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Buat masalah
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Daftar issue, owner, due date, and resolution flow.
                    </p>
                </div>
                <IssueForm
                    clients={clients}
                    projects={projects}
                    users={users}
                />
            </div>
        </>
    );
}
