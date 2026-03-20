import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">虚無</h1>
      <p className="text-muted-foreground">Lecteur de comics self-hosted</p>
      <Button>Commencer</Button>
    </main>
  );
}
