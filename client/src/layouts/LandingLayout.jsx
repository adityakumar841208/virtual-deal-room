export default function DashboardLayout() {
    return (
        <>
            <div className="flex flex-col h-screen">
                <Navbar />
                <main className="flex-grow">
                    {/* Content goes here */}
                </main>
                <Footer />
            </div>
        </>
    );
}