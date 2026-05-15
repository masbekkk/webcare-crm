import { Head } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    Box,
    CalendarDays,
    MoreVertical,
    Users,
} from 'lucide-react';
import { dashboard } from '@/routes';

const monthlySales = [
    { month: 'Jan', value: 156 },
    { month: 'Feb', value: 378 },
    { month: 'Mar', value: 191 },
    { month: 'Apr', value: 289 },
    { month: 'May', value: 174 },
    { month: 'Jun', value: 184 },
    { month: 'Jul', value: 281 },
    { month: 'Aug', value: 101 },
    { month: 'Sep', value: 205 },
    { month: 'Oct', value: 381 },
    { month: 'Nov', value: 269 },
    { month: 'Dec', value: 104 },
];

const statistics = [
    125, 220, 172, 255, 190, 310, 265, 355, 230, 420, 370, 460, 340, 520,
    410, 585, 430, 640, 510, 690,
];

function TrendBadge({ value, type }: { value: string; type: 'up' | 'down' }) {
    const Icon = type === 'up' ? ArrowUp : ArrowDown;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold ${
                type === 'up'
                    ? 'bg-success-50 text-success-600'
                    : 'bg-error-50 text-error-600'
            }`}
        >
            <Icon className="size-4" strokeWidth={2.4} />
            {value}
        </span>
    );
}

function MetricCard({
    title,
    value,
    trend,
    trendType,
    icon: Icon,
}: {
    title: string;
    value: string;
    trend: string;
    trendType: 'up' | 'down';
    icon: typeof Users;
}) {
    return (
        <section className="rounded-2xl border border-[#E4E7EC] bg-white p-6 lg:p-7">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#F2F4F7] text-[#344054]">
                <Icon className="size-6" strokeWidth={1.8} />
            </div>
            <p className="mt-8 text-sm font-medium text-[#475467]">{title}</p>
            <div className="mt-3 flex items-end justify-between gap-4">
                <h2 className="text-[32px] leading-9 font-bold tracking-[-0.02em] text-[#101828]">
                    {value}
                </h2>
                <TrendBadge value={trend} type={trendType} />
            </div>
        </section>
    );
}

function CardMenu() {
    return (
        <button
            type="button"
            className="rounded-lg p-1.5 text-[#98A2B3] hover:bg-[#F2F4F7] hover:text-[#667085]"
            aria-label="Card options"
        >
            <MoreVertical className="size-5" strokeWidth={2.2} />
        </button>
    );
}

function MonthlySalesChart() {
    return (
        <section className="rounded-2xl border border-[#E4E7EC] bg-white p-6 lg:p-7">
            <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold text-[#101828]">
                    Monthly Sales
                </h2>
                <CardMenu />
            </div>

            <div className="mt-8 overflow-x-auto">
                <div className="grid min-w-[680px] grid-cols-[40px_1fr] gap-4">
                    <div className="grid h-[170px] grid-rows-5 text-right text-sm text-[#344054]">
                        {[400, 300, 200, 100, 0].map((label) => (
                            <span key={label}>{label}</span>
                        ))}
                    </div>
                    <div>
                        <div className="relative h-[170px] border-b border-[#E4E7EC]">
                            {[0, 1, 2, 3].map((line) => (
                                <div
                                    key={line}
                                    className="absolute left-0 h-px w-full bg-[#F2F4F7]"
                                    style={{ top: `${line * 25}%` }}
                                />
                            ))}
                            <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-between px-3">
                                {monthlySales.map((item) => (
                                    <div
                                        key={item.month}
                                        className="w-5 rounded-t-md bg-brand-500"
                                        style={{
                                            height: `${(item.value / 420) * 100}%`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between px-2 text-sm font-medium text-[#101828]">
                            {monthlySales.map((item) => (
                                <span key={item.month}>{item.month}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function MonthlyTarget() {
    return (
        <section className="overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white">
            <div className="p-7 pb-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-[#101828]">
                            Monthly Target
                        </h2>
                        <p className="mt-2 text-sm font-medium text-[#475467]">
                            Target you've set for each month
                        </p>
                    </div>
                    <CardMenu />
                </div>

                <div className="relative mx-auto mt-7 h-[210px] max-w-[380px]">
                    <svg
                        viewBox="0 0 360 190"
                        className="h-full w-full"
                        aria-hidden="true"
                    >
                        <path
                            d="M45 150 A135 135 0 0 1 315 150"
                            fill="none"
                            stroke="#E4E7EC"
                            strokeLinecap="round"
                            strokeWidth="14"
                        />
                        <path
                            d="M45 150 A135 135 0 0 1 315 150"
                            fill="none"
                            stroke="#5867F9"
                            strokeDasharray="330 424"
                            strokeLinecap="round"
                            strokeWidth="14"
                        />
                    </svg>
                    <div className="absolute inset-x-0 top-[96px] text-center">
                        <p className="text-[40px] leading-none font-bold tracking-[-0.02em] text-[#101828]">
                            75.55%
                        </p>
                        <div className="mt-3 flex justify-center">
                            <TrendBadge value="+10%" type="up" />
                        </div>
                    </div>
                </div>

                <p className="mx-auto mt-2 max-w-[360px] text-center text-base leading-7 font-medium text-[#475467]">
                    You earn $3287 today, it's higher than last month. Keep up
                    your good work!
                </p>
            </div>

            <div className="grid grid-cols-3 bg-[#F2F4F7] px-6 py-6">
                {[
                    ['Target', '$20K', 'down'],
                    ['Revenue', '$20K', 'up'],
                    ['Today', '$20K', 'up'],
                ].map(([label, value, type], index) => {
                    const Icon = type === 'up' ? ArrowUp : ArrowDown;

                    return (
                        <div
                            key={label}
                            className={`text-center ${index > 0 ? 'border-l border-[#E4E7EC]' : ''}`}
                        >
                            <p className="text-sm font-medium text-[#475467]">
                                {label}
                            </p>
                            <div className="mt-2 flex items-center justify-center gap-1">
                                <span className="text-2xl font-bold text-[#101828]">
                                    {value}
                                </span>
                                <Icon
                                    className={`size-5 ${type === 'up' ? 'text-success-600' : 'text-error-600'}`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function StatisticsCard() {
    return (
        <section className="rounded-2xl border border-[#E4E7EC] bg-white p-6 lg:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-[#101828]">
                        Statistics
                    </h2>
                    <p className="mt-2 text-sm font-medium text-[#475467]">
                        Target you've set for each month
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="inline-flex h-11 rounded-[10px] bg-[#F2F4F7] p-1">
                        {['Monthly', 'Quarterly', 'Annually'].map(
                            (item, index) => (
                                <button
                                    key={item}
                                    type="button"
                                    className={`rounded-lg px-4 text-sm font-semibold ${
                                        index === 0
                                            ? 'bg-white text-[#101828] shadow-[0_1px_2px_rgba(16,24,40,0.05)]'
                                            : 'text-[#667085]'
                                    }`}
                                >
                                    {item}
                                </button>
                            ),
                        )}
                    </div>
                    <button
                        type="button"
                        className="inline-flex h-11 items-center gap-3 rounded-[10px] border border-[#E4E7EC] bg-white px-4 text-sm font-semibold text-[#344054] hover:bg-[#F9FAFB]"
                    >
                        <CalendarDays
                            className="size-5 text-[#667085]"
                            strokeWidth={1.8}
                        />
                        May 10 to May 16
                    </button>
                </div>
            </div>

            <div className="mt-8 overflow-x-auto">
                <div className="grid min-w-[900px] grid-cols-[42px_1fr] gap-5">
                    <div className="grid h-[260px] grid-rows-5 text-right text-sm text-[#344054]">
                        {[250, 200, 150, 100, 50].map((label) => (
                            <span key={label}>{label}</span>
                        ))}
                    </div>
                    <div className="relative h-[260px]">
                        {[0, 1, 2, 3, 4].map((line) => (
                            <div
                                key={line}
                                className="absolute left-0 h-px w-full bg-[#F2F4F7]"
                                style={{ top: `${line * 25}%` }}
                            />
                        ))}
                        <svg
                            viewBox="0 0 920 260"
                            className="absolute inset-0 h-full w-full"
                            preserveAspectRatio="none"
                        >
                            <path
                                d={`M 0 ${260 - statistics[0] / 3} ${statistics
                                    .map(
                                        (value, index) =>
                                            `L ${(index / (statistics.length - 1)) * 920} ${260 - value / 3}`,
                                    )
                                    .join(' ')}`}
                                fill="none"
                                stroke="#465FFF"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="4"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="p-4 lg:p-6">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)]">
                    <div className="grid gap-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <MetricCard
                                title="Customers"
                                value="3,782"
                                trend="11.01%"
                                trendType="up"
                                icon={Users}
                            />
                            <MetricCard
                                title="Orders"
                                value="5,359"
                                trend="9.05%"
                                trendType="down"
                                icon={Box}
                            />
                        </div>
                        <MonthlySalesChart />
                    </div>
                    <MonthlyTarget />
                </div>

                <div className="mt-6">
                    <StatisticsCard />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
