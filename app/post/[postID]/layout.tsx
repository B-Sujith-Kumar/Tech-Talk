export default async function PostPageLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-white rounded-md p-4 prose prose prose-invert prose-lg">
            {children}
        </div>
    )
}