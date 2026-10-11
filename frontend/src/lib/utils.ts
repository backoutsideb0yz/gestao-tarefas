import type { Priority, Task, TaskFormValues } from "@/types";

export const priorityConfig: Record<Priority, { label: string; className: string }> = {
  LOW: { label: "Baixa", className: "bg-green-100 text-green-700" },
  MEDIUM: { label: "Média", className: "bg-yellow-100 text-yellow-700" },
  HIGH: { label: "Alta", className: "bg-red-100 text-red-700" },
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function toInputDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function toIso(date: string) {
  return date ? new Date(`${date}T00:00:00`).toISOString() : null;
}

export function toCreatePayload(v: TaskFormValues) {
  return {
    title: v.title,
    description: v.description.trim() || undefined,
    priority: v.priority,
    dueDate: toIso(v.dueDate),
  };
}

export function toUpdatePayload(v: TaskFormValues) {
  return {
    title: v.title,
    description: v.description.trim() || null,
    priority: v.priority,
    dueDate: toIso(v.dueDate),
  };
}

export function isOverdue(task: Task) {
  if (!task.dueDate || task.done) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate) < today;
}