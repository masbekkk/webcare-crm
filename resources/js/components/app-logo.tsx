import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex size-10 items-center justify-center rounded-[10px] bg-brand-500 text-white">
                <AppLogoIcon className="size-10 fill-current text-brand-500" />
            </div>
            <div className="ml-3 grid flex-1 text-left">
                <span className="truncate text-[28px] leading-8 font-bold text-[#101828]">
                    TailAdmin
                </span>
            </div>
        </>
    );
}
