export default async function PostPageLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="pt-16 pb-8 bg-gray-100 overflow-y-scroll scrollbar-hidden min-h-screen">
            {children}
        </div>
    )
}