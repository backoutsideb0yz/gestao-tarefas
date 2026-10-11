"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Priority, Task, TaskFormValues } from "@/types";
import { toInputDate } from "@/lib/utils";

type Props = {
  task: Task;
  onClose: () => void;
  onSave: (id: string, values: TaskFormValues) => Promise<void>;
};

export function EditTaskModal({ task, onClose, onSave }: Props) {
  const [values, setValues] = useState<TaskFormValues>({
    title: task.title,
    description: task.description ?? "",
    priority: task.priority,
    dueDate: toInputDate(task.dueDate),
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(task.id, values);
      onClose();
    } catch {
      // erro já mostrado em toast
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-md p-5 space-y-3"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Editar tarefa</h2>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <X size={20} className="text-gray-400 hover:text-gray-700" />
          </button>
        </div>

        <input
          className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          autoFocus
        />
        <textarea
          className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          placeholder="Descrição"
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
        />

        <div className="flex gap-3">
          <select
            className="flex-1 border rounded-lg p-2.5 bg-white"
            value={values.priority}
            onChange={(e) =>
              setValues({ ...values, priority: e.target.value as Priority })
            }
          >
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
          </select>
          <input
            type="date"
            className="flex-1 border rounded-lg p-2.5"
            value={values.dueDate}
            onChange={(e) => setValues({ ...values, dueDate: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            disabled={saving || !values.title.trim()}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}