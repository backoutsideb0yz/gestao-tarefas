"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { Task, User } from "@/types";

export default function TasksPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  function logout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  useEffect(() => {
    async function load() {
      try {
        const me = await api<User>("/auth/me");
        const list = await api<Task[]>("/tasks");
        setUser(me);
        setTasks(list);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }
        setError("Não foi possível carregar suas tarefas");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const created = await api<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          ...(description.trim() ? { description } : {}),
        }),
      });
      setTasks((prev) => [created, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldMessages = err.errors ? Object.values(err.errors).flat() : [];
        setError(fieldMessages[0] ?? err.message);
      } else {
        setError("Erro ao criar tarefa");
      }
    }
  }

  async function toggleDone(task: Task) {
    try {
      const updated = await api<Task>(`/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ done: !task.done }),
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch {
      setError("Erro ao atualizar tarefa");
    }
  }

  async function saveEdit(task: Task) {
    try {
      const updated = await api<Task>(`/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: editTitle }),
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      setEditingId(null);
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldMessages = err.errors ? Object.values(err.errors).flat() : [];
        setError(fieldMessages[0] ?? err.message);
      } else {
        setError("Erro ao editar tarefa");
      }
    }
  }

  async function handleDelete(id: string) {
    try {
      await api(`/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Erro ao excluir tarefa");
    }
  }

  if (loading) {
    return <main className="p-6">Carregando...</main>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Minhas tarefas</h1>
            <p className="text-sm text-gray-600">Olá, {user?.name}</p>
          </div>
          <button onClick={logout} className="text-sm text-red-600 underline">
            Sair
          </button>
        </header>

        <form
          onSubmit={handleCreate}
          className="bg-white p-4 rounded-lg shadow space-y-3"
        >
          <input
            className="w-full border rounded p-2"
            placeholder="Título da tarefa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full border rounded p-2"
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="bg-blue-600 text-white rounded px-4 py-2">
            Adicionar
          </button>
        </form>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">
            Nenhuma tarefa ainda. Crie a primeira acima.
          </p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-white p-3 rounded-lg shadow flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task)}
                />

                <div className="flex-1">
                  {editingId === task.id ? (
                    <input
                      className="w-full border rounded p-1"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <>
                      <p className={task.done ? "line-through text-gray-400" : ""}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-500">{task.description}</p>
                      )}
                    </>
                  )}
                </div>

                {editingId === task.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(task)}
                      className="text-sm text-blue-600"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-sm text-gray-500"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(task.id);
                        setEditTitle(task.title);
                      }}
                      className="text-sm text-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-sm text-red-600"
                    >
                      Excluir
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}