import MainNav from './components/MainNav';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#fbf7ef]">
      <MainNav />

      <div className="pb-20 md:pb-0">{children}</div>
    </div>
  );
}