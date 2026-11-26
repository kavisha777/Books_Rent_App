
import MainNav from './components/MainNav';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#faf3e8]">
      <MainNav />

      <main className="min-h-screen pb-24 md:pb-0">
        {children}
      </main>
    </div>
  );
}
