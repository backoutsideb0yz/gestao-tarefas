"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Task, type Priority, type TaskFormValues } from "@/types";

const emptyForm: TaskFormValues = {
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
};

export function TaskForm({
  onSubmit,
}: {
  onSubmit: (values: TaskFormValues) => Promise<void>;
}) {
    const [ values, setValues ] = useState<TaskFormValues>(emptyForm);
    const [ saving, setSaving] = useState(false);

      async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            await onSubmit(values);
            setValues(emptyForm);
        } catch {

        } finally {
            setSaving(false);
        }
    }

    return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-4 space-y-3">
      <input
        className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="O que precisa ser feito?"
        value={values.title}
        onChange={(e) => setValues({ ...values, title: e.target.value })}
      />
      <textarea
        className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Descrição (opcional)"
        rows={2}
        value={values.description}
        onChange={(e) => setValues({ ...values, description: e.target.value })}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          className="border rounded-lg p-2.5 bg-white"
          value={values.priority}
          onChange={(e) =>
            setValues({ ...values, priority: e.target.value as Priority })
          }
        >
          <option value="LOW">Prioridade baixa</option>
          <option value="MEDIUM">Prioridade média</option>
          <option value="HIGH">Prioridade alta</option>
        </select>

        <input
          type="date"
          className="border rounded-lg p-2.5"
          value={values.dueDate}
          onChange={(e) => setValues({ ...values, dueDate: e.target.value })}
        />

        <button
          disabled={saving || !values.title.trim()}
          className="sm:ml-auto flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2.5 hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Adicionar
        </button>
      </div>
    </form>
    ) 
}