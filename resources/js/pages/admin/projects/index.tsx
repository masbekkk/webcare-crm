import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import {
    create,
    destroy,
    edit,
} from '@/actions/App/Http/Controllers/Admin/ProjectController';
import { Button } from '@/components/ui/button';

type ProjectRow = {
    id: number;
    name: string;
    slug: string;
    project_type: string;
    payment_model: string;
    status: string;
    contract_value: string;
    client: { company_name: string };
    creator: { name: string } | null;
    links_count: number;
    members_count: number;
    payment_timelines_count: number;
};

type PaginatedProjects = {
    data: ProjectRow[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

export default function ProjectsIndex({
    projects,
}: {
    projects: PaginatedProjects;
}) {
    const deleteProject = (project: ProjectRow) => {
        if (!window.confirm(`Delete project "${project.name}"?`)) {
            return;
        }

        router.delete(destroy.url(project.id), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Projects" />
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#101828]">
                            Projects
                        </h1>
                        <p className="mt-1 text-sm text-[#667085]">
                            Manage client projects, links, members, and payment
                            timelines.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus className="size-4" />
                            New project
                        </Link>
                    </Button>
                </div>

                <div className="mt-6 overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[960px] text-left text-sm">
                            <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#667085] uppercase">
                                <tr>
                                    <th className="px-5 py-3">Project</th>
                                    <th className="px-5 py-3">Client</th>
                                    <th className="px-5 py-3">Type</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Payment</th>
                                    <th className="px-5 py-3">Relations</th>
                                    <th className="px-5 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E7EC]">
                                {projects.data.map((project) => (
                                    <tr key={project.id}>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-[#101828]">
                                                {project.name}
                                            </div>
                                            <div className="text-xs text-[#667085]">
                                                {project.slug}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {project.client.company_name}
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {project.project_type}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-500">
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-[#344054]">
                                            {project.payment_model}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#667085]">
                                            {project.links_count} links,{' '}
                                            {project.members_count} members,{' '}
                                            {
                                                project.payment_timelines_count
                                            }{' '}
                                            payments
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link href={edit(project.id)}>
                                                        <Edit className="size-4" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        deleteProject(project)
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

                    {projects.data.length === 0 && (
                        <div className="px-5 py-12 text-center text-sm text-[#667085]">
                            No projects found.
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 border-t border-[#E4E7EC] px-5 py-4">
                        {projects.links.map((link) => (
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
