import { Link } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import type { ReactNode } from 'react';
import type { QueryParams } from '@/wayfinder';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export type Option = {
    id: number;
    company_name?: string;
    client_id?: number;
    project_id?: number;
    name?: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export function cleanQuery<T extends Record<string, string>>(
    filters: T,
): QueryParams {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ''),
    ) as QueryParams;
}

export function Field({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            {children}
        </div>
    );
}

export function NativeSelect({
    value,
    onChange,
    children,
}: {
    value: string;
    onChange: (value: string) => void;
    children: ReactNode;
}) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
            {children}
        </select>
    );
}

export function FilterActions({
    summary,
    onReset,
}: {
    summary: string;
    onReset: () => void;
}) {
    return (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#667085]">{summary}</p>
            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onReset}>
                    <X className="size-4" />
                    Reset
                </Button>
                <Button type="submit">
                    <Search className="size-4" />
                    Apply filters
                </Button>
            </div>
        </div>
    );
}

export function Pagination({ links }: { links: PaginationLink[] }) {
    return (
        <div className="flex flex-wrap gap-2 border-t border-[#E4E7EC] px-5 py-4">
            {links.map((link) => (
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
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )}
                </Button>
            ))}
        </div>
    );
}

export function Stat({ title, value }: { title: string; value: string }) {
    return (
        <div className="rounded-lg border border-[#E4E7EC] bg-white p-4">
            <p className="text-xs font-medium text-[#667085]">{title}</p>
            <p className="mt-2 text-lg font-semibold text-[#101828]">{value}</p>
        </div>
    );
}

export function StatusBadge({
    value,
    tone = 'neutral',
}: {
    value: string;
    tone?: 'neutral' | 'good' | 'bad' | 'warn';
}) {
    const toneClass = {
        neutral: 'bg-brand-50 text-brand-500',
        good: 'bg-emerald-50 text-emerald-700',
        bad: 'bg-red-50 text-red-700',
        warn: 'bg-amber-50 text-amber-700',
    }[tone];

    return (
        <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass}`}
        >
            {value}
        </span>
    );
}

export function formatDuration(seconds: number | null): string {
    if (seconds === null) {
        return '-';
    }

    if (seconds < 60) {
        return `${seconds}s`;
    }

    if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
}
