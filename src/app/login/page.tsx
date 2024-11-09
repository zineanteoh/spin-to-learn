import { LoginForm } from "@/components/LoginForm";

export default function Page() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
        Slot Machine
      </h1>
      <LoginForm />
    </div>
  );
}
