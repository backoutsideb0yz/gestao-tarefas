import { Calendar, Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/types";
import { formatDate, isOverdue, priorityConfig } from "@/lib/utils";

type Props = {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
  const priority = priorityConfig[task.priority];
  const overdue = isOverdue(task);

  return (
    <li className="bg-white rounded-lg border p-4 flex items-start gap-3">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task)}
        className="mt-1 h-4 w-4 cursor-pointer"
      />

      <div className="flex-1 min-w-0">
        <p className={`font-medium break-words ${task.done ? "line-through text-gray-400" : ""}`}>
          {task.title}
        </p>

        {task.description && (
          <p className="text-sm text-gray-500 mt-0.5 break-words">{task.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${priority.className}`}>
            {priority.label}
          </span>

          {task.dueDate && (
            <span
              className={`flex items-center gap-1 text-xs ${
                overdue ? "text-red-600 font-medium" : "text-gray-500"
              }`}
            >
              <Calendar size={12} />
              {overdue ? "Atrasada · " : ""}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-gray-400 hover:text-blue-600 rounded"
          aria-label="Editar"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-2 text-gray-400 hover:text-red-600 rounded"
          aria-label="Excluir"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}