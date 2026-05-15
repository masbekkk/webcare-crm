import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" />
            <rect x="11" y="20" width="4" height="10" rx="2" fill="white" />
            <rect x="18" y="12" width="4" height="18" rx="2" fill="white" />
            <rect x="25" y="16" width="4" height="14" rx="2" fill="white" />
        </svg>
    );
}
