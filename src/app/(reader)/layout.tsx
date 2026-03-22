export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black text-white" style={{ minHeight: "100dvh" }}>
      {children}
    </div>
  );
}
