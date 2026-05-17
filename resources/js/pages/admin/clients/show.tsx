import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, FolderKanban, Users } from 'lucide-react';
import {
    edit,
    index,
} from '@/actions/App/Http/Controllers/Admin/ClientController';
import { edit as editProject } from '@/actions/App/Http/Controllers/Admin/ProjectController';
import { Button } from '@/components/ui/button';

type ClientUser = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    is_active: boolean;
    last_login_at: string | null;
};

type ProjectMember = {
    id: number;
    role: string | null;
    assigned_at: string | null;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
};

type ClientProject = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    project_type: string;
    contract_value: string;
    payment_model: string;
    status: string;
    start_date: string | null;
    target_finish_date: string | null;
    live_date: string | null;
    members_count: number;
    payment_timelines_count: number;
    issues_count: number;
    members: ProjectMember[];
};

type ClientPayload = {
    id: number;
    company_name: string;
    display_name: string | null;
    pic_name: string | null;
    pic_position: string | null;
    pic_email: string | null;
    pic_phone: string | null;
    pic_whatsapp: string | null;
    company_email: string | null;
    company_phone: string | null;
    address: string | null;
    city: string | null;
    province: string | null;
    status: string;
    notes: string | null;
    users_count: number;
    projects_count: number;
    users: ClientUser[];
    projects: ClientProject[];
};

function money(value: string): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function value(text: string | number | null): string {
    return text === null || text === '' ? '-' : String(text);
}

function date(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));
}

export default function ClientsShow({ client }: { client: ClientPayload }) {
    return (
        <>
            <Head title={client.company_name} />
            <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={index()}>
                                <ArrowLeft className="size-4" />
                                Back
                            </Link>
                        </Button>
                        <h1 className="mt-4 text-2xl font-semibold text-[#101828]">
                            {client.company_name}
                        </h1>
                        <p className="mt-1 text-sm text-[#667085]">
                            {client.display_name ?? 'Client profile'} ·{' '}
                            {client.status}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={edit(client.id)}>
                            <Edit className="size-4" />
                            Edit client
                        </Link>
                    </Button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Stat title="Users" value={client.users_count} />
                    <Stat title="Projects" value={client.projects_count} />
                    <Stat
                        title="Active users"
                        value={
                            client.users.filter((user) => user.is_active)
                                .length
                        }
                    />
                    <Stat
                        title="Live projects"
                        value={
                            client.projects.filter(
                                (project) => project.status === 'live',
                            ).length
                        }
                    />
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                    <section className="rounded-lg border border-[#E4E7EC] bg-white p-5">
                        <h2 className="text-base font-semibold text-[#101828]">
                            Client details
                        </h2>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <Detail label="Company" text={client.company_name} />
                            <Detail
                                label="Display name"
                                text={client.display_name}
                            />
                            <Detail label="PIC" text={client.pic_name} />
                            <Detail
                                label="PIC position"
                                text={client.pic_position}
                            />
                            <Detail label="PIC email" text={client.pic_email} />
                            <Detail label="PIC phone" text={client.pic_phone} />
                            <Detail
                                label="PIC WhatsApp"
                                text={client.pic_whatsapp}
                            />
                            <Detail
                                label="Company email"
                                text={client.company_email}
                            />
                            <Detail
                                label="Company phone"
                                text={client.company_phone}
                            />
                            <Detail label="City" text={client.city} />
                            <Detail label="Province" text={client.province} />
                            <Detail label="Status" text={client.status} />
                        </div>
                        <div className="mt-4 grid gap-4">
                            <Detail label="Address" text={client.address} />
                            <Detail label="Notes" text={client.notes} />
                        </div>
                    </section>

                    <section className="rounded-lg border border-[#E4E7EC] bg-white p-5">
                        <div className="flex items-center gap-2">
                            <Users className="size-5 text-brand-500" />
                            <h2 className="text-base font-semibold text-[#101828]">
                                Users
                            </h2>
                        </div>
                        <div className="mt-5 overflow-x-auto">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead className="text-xs font-semibold text-[#667085] uppercase">
                                    <tr>
                                        <th className="py-2 pr-4">User</th>
                                        <th className="py-2 pr-4">Phone</th>
                                        <th className="py-2 pr-4">Role</th>
                                        <th className="py-2 pr-4">Status</th>
                                        <th className="py-2">Last login</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E4E7EC]">
                                    {client.users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="py-3 pr-4">
                                                <div className="font-semibold text-[#101828]">
                                                    {user.name}
                                                </div>
                                                <div className="text-xs text-[#667085]">
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4 text-[#344054]">
                                                {value(user.phone)}
                                            </td>
                                            <td className="py-3 pr-4 text-[#344054]">
                                                {user.role}
                                            </td>
                                            <td className="py-3 pr-4">
                                                <Badge
                                                    tone={
                                                        user.is_active
                                                            ? 'green'
                                                            : 'gray'
                                                    }
                                                >
                                                    {user.is_active
                                                        ? 'active'
                                                        : 'inactive'}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-[#667085]">
                                                {date(user.last_login_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {client.users.length === 0 && (
                            <EmptyState text="No users for this client." />
                        )}
                    </section>
                </div>

                <section className="mt-6 rounded-lg border border-[#E4E7EC] bg-white p-5">
                    <div className="flex items-center gap-2">
                        <FolderKanban className="size-5 text-brand-500" />
                        <h2 className="text-base font-semibold text-[#101828]">
                            Projects
                        </h2>
                    </div>
                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                        {client.projects.map((project) => (
                            <article
                                key={project.id}
                                className="rounded-lg border border-[#E4E7EC] p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <Link
                                            href={editProject(project.id)}
                                            className="font-semibold text-[#101828] hover:text-brand-500"
                                        >
                                            {project.name}
                                        </Link>
                                        <p className="mt-1 text-xs text-[#667085]">
                                            {project.project_type} ·{' '}
                                            {project.payment_model}
                                        </p>
                                    </div>
                                    <Badge tone="blue">{project.status}</Badge>
                                </div>

                                <p className="mt-3 line-clamp-2 text-sm text-[#667085]">
                                    {project.description ?? 'No description.'}
                                </p>

                                <div className="mt-4 grid gap-3 text-xs text-[#667085] sm:grid-cols-3">
                                    <Metric
                                        label="Contract"
                                        value={money(project.contract_value)}
                                    />
                                    <Metric
                                        label="Payments"
                                        value={project.payment_timelines_count}
                                    />
                                    <Metric
                                        label="Issues"
                                        value={project.issues_count}
                                    />
                                </div>

                                <div className="mt-4 grid gap-2 text-xs text-[#667085] sm:grid-cols-3">
                                    <span>
                                        Start: {date(project.start_date)}
                                    </span>
                                    <span>
                                        Target:{' '}
                                        {date(project.target_finish_date)}
                                    </span>
                                    <span>Live: {date(project.live_date)}</span>
                                </div>

                                <div className="mt-4 border-t border-[#E4E7EC] pt-4">
                                    <p className="text-xs font-semibold text-[#667085] uppercase">
                                        Project users
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {project.members.map((member) => (
                                            <span
                                                key={member.id}
                                                className="rounded-full bg-[#F9FAFB] px-3 py-1 text-xs text-[#344054]"
                                            >
                                                {member.user.name}
                                                {member.role
                                                    ? ` · ${member.role}`
                                                    : ''}
                                            </span>
                                        ))}
                                    </div>
                                    {project.members.length === 0 && (
                                        <p className="mt-3 text-sm text-[#667085]">
                                            No project users assigned.
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                    {client.projects.length === 0 && (
                        <EmptyState text="No projects for this client." />
                    )}
                </section>
            </div>
        </>
    );
}

function Stat({ title, value }: { title: string; value: number }) {
    return (
        <div className="rounded-lg border border-[#E4E7EC] bg-white p-4">
            <p className="text-xs font-medium text-[#667085]">{title}</p>
            <p className="mt-2 text-lg font-semibold text-[#101828]">{value}</p>
        </div>
    );
}

function Detail({ label, text }: { label: string; text: string | null }) {
    return (
        <div>
            <p className="text-xs font-medium text-[#667085]">{label}</p>
            <p className="mt-1 text-sm font-medium text-[#101828]">
                {value(text)}
            </p>
        </div>
    );
}

function Metric({
    label,
    value: metricValue,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-md bg-[#F9FAFB] p-3">
            <p className="font-medium">{label}</p>
            <p className="mt-1 font-semibold text-[#101828]">
                {metricValue}
            </p>
        </div>
    );
}

function Badge({
    children,
    tone,
}: {
    children: React.ReactNode;
    tone: 'blue' | 'green' | 'gray';
}) {
    const tones = {
        blue: 'bg-brand-50 text-brand-500',
        green: 'bg-emerald-50 text-emerald-700',
        gray: 'bg-[#F2F4F7] text-[#344054]',
    };

    return (
        <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
        >
            {children}
        </span>
    );
}

function EmptyState({ text }: { text: string }) {
    return <div className="py-10 text-center text-sm text-[#667085]">{text}</div>;
}
