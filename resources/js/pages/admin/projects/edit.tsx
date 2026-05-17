import { Head } from '@inertiajs/react';
import ProjectForm from './project-form';
import type { ProjectPayload } from './project-form';

type Option = {
    id: number;
    name?: string;
    email?: string;
    company_name?: string;
};

export default function ProjectsEdit({
    clients,
    users,
    project,
}: {
    clients: Option[];
    users: Option[];
    project: ProjectPayload;
}) {
    return (
        <>
            <Head title={`Edit ${project.name}`} />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Edit project
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Update project data and replace related links, members,
                        and payment timelines.
                    </p>
                </div>
                <ProjectForm
                    clients={clients}
                    users={users}
                    project={project}
                />
            </div>
        </>
    );
}
