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

export default function IssuesEdit({
    clients,
    projects,
    users,
    issue,
}: {
    clients: Option[];
    projects: Option[];
    users: Option[];
    issue: IssuePayload;
}) {
    return (
        <>
            <Head title={`Edit ${issue.title}`} />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Edit issue
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Update issue status, assignment, notes, and resolution.
                    </p>
                </div>
                <IssueForm
                    clients={clients}
                    projects={projects}
                    users={users}
                    issue={issue}
                />
            </div>
        </>
    );
}
