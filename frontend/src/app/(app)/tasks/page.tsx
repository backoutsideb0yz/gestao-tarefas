"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ClipboardList, Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { toCreatePayload, toUpdatePayload } from "@/lib/utils";
import type { Priority, Task, TaskFormValues } from "@/types";
import { TaskStats } from "@/components/task-stats";
import { TaskForm } from "@/components/task-form";
import {
  TaskFilters,
  type PriorityFilter,
  type SortBy,
  type StatusFilter,
} from "@/components/task-filters";
import { TaskItem } from "@/components/task-item";
import { EditTaskModal } from "@/components/edit-task-modal";
import { ConfirmDialog } from "@/components/confirm-dialog";

const priorityOrder: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

function errorMessage(err: unknown, fallback: string) {
  if (err instanceof ApiError) {
    const fieldMessages = err.errors ? Object.values(err.errors).flat() : [];
    return fieldMessages[0] ?? err.message;
  }
  return fallback;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("recent");

  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setTasks(await api<Task[]>("/tasks"));
      } catch {
        toast.error("Não foi possível carregar as tarefas");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const visibleTasks = useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = tasks.filter((t) => {
      if (status === "pending" && t.done) return false;
      if (status === "done" && !t.done) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      if (
        term &&
        !t.title.toLowerCase().includes(term) &&
        !(t.description ?? "").toLowerCase().includes(term)
      )
        return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "priority") return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortBy === "due") {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, search, status, priority, sortBy]);

  async function handleCreate(values: TaskFormValues) {
    try {
      const created = await api<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify(toCreatePayload(values)),
      });
      setTasks((prev) => [created, ...prev]);
      toast.success("Tarefa criada");
    } catch (err) {
      toast.error(errorMessage(err, "Erro ao criar tarefa"));
      throw err; // avisa o formulário para não limpar os campos
    }
  }

  async function handleToggle(task: Task) {
    try {
      const updated = await api<Task>(`/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ done: !task.done }),
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      toast.error(errorMessage(err, "Erro ao atualizar tarefa"));
    }
  }

  async function handleSave(id: string, values: TaskFormValues) {
    try {
      const updated = await api<Task>(`/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(toUpdatePayload(values)),
      });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success("Tarefa atualizada");
    } catch (err) {
      toast.error(errorMessage(err, "Erro ao editar tarefa"));
      throw err; // mantém o modal aberto
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    const id = deleting.id;
    setDeleting(null);

    try {
      await api(`/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Tarefa excluída");
    } catch (err) {
      toast.error(errorMessage(err, "Erro ao excluir tarefa"));
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskStats tasks={tasks} />
      <TaskForm onSubmit={handleCreate} />

      <TaskFilters
        search={search}
        status={status}
        priority={priority}
        sortBy={sortBy}
        onSearch={setSearch}
        onStatus={setStatus}
        onPriority={setPriority}
        onSortBy={setSortBy}
      />

      {visibleTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ClipboardList size={40} className="mx-auto mb-3 text-gray-300" />
          {tasks.length === 0
            ? "Nenhuma tarefa ainda. Crie a primeira acima."
            : "Nenhuma tarefa encontrada com esses filtros."}
        </div>
      ) : (
        <ul className="space-y-2">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          ))}
        </ul>
      )}

      {editing && (
        <EditTaskModal
          key={editing.id}
          task={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Excluir tarefa?"
          message={`"${deleting.title}" será excluída permanentemente.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}