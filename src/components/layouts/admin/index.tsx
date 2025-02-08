
import Sidebar from "@/components/ui/sidebar-admin";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
    className?: string;
}) {

    return (
        <div className="flex  flex-col lg:flex-row">
            <Sidebar className="md:h-screen h-16 lg:sticky lg:top-0 lg:left-0 lg:z-40" />

            <div className="flex flex-1 scrollbar-hide flex-col gap-4 md:p-12 p-4 ">{children}</div>
            {/* <div className="flex flex-1 scrollbar-hide flex-col gap-4 md">{children}</div> */}
        </div>
    );
}
