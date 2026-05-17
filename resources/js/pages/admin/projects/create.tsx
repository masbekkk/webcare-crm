import { Head } from '@inertiajs/react';
import ProjectForm from './project-form';
import type { ProjectPayload } from './project-form';

type Option = {
    id: number;
    name?: string;
    email?: string;
    company_name?: string;
};

export default function ProjectCreate({
    clients,
    users,
}: {
    clients: Option[];
    users: Option[];
    project: ProjectPayload | null;
}) {
    return (
        <>
            <Head title="Buat proyek" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Buat proyek
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Buat proyek data together with links, members, and
                        payment timelines.
                    </p>
                </div>
                <ProjectForm clients={clients} users={users} />
            </div>
        </>
    );
}
