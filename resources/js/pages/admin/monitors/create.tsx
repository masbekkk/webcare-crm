import { Head } from '@inertiajs/react';
import MonitorForm from './monitor-form';
import type { WebsiteMonitorPayload } from './monitor-form';

type Option = {
    id: number;
    client_id?: number;
    project_id?: number;
    company_name?: string;
    name?: string;
    label?: string;
    url?: string;
};

export default function MonitorsCreate({
    clients,
    projects,
    projectLinks,
}: {
    clients: Option[];
    projects: Option[];
    projectLinks: Option[];
    monitor: WebsiteMonitorPayload | null;
}) {
    return (
        <>
            <Head title="Buat monitor website" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#101828]">
                        Buat monitor website
                    </h1>
                    <p className="mt-1 text-sm text-[#667085]">
                        Configure uptime checks, status expectations, and
                        monitoring state.
                    </p>
                </div>
                <MonitorForm
                    clients={clients}
                    projects={projects}
                    projectLinks={projectLinks}
                />
            </div>
        </>
    );
}
