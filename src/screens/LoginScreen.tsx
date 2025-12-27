import Login from "@/components/Login";

export default function LoginScreen() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex gap-6 p-4 lg:p-6">
        <main className="flex-1 space-y-4">
          <Login />
        </main>
      </div>
    </div>
  );
}
