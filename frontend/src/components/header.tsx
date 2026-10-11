"use client";

import { useRouter } from "next/navigation";
import { CheckSquare, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  function handleLogout() {
    signOut();
    router.replace("/login");
  }

  return (
    <header className="bg-white border-b">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <CheckSquare className="text-blue-600" size={20} />
          Gestão de Tarefas
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block text-sm text-gray-700">
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}