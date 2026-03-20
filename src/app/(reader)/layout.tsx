export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {children}
    </div>
  );
}
