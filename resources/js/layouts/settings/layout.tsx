import DashboardLayout from '@/layouts/customer/dashboard-layout';
import { type PropsWithChildren } from 'react';

export default function SettingsLayout({ children }: PropsWithChildren) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
