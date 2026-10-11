import type { Task } from "@/types";
import { isOverdue } from "@/lib/utils";

export function TaskStats ({ tasks }: {tasks: Task[] }) {
    const done = tasks.filter((t) => t.done).length;
    const overdue = tasks.filter(isOverdue).length;

    const items = [
        { label: "Total", value: tasks.length, color: "text-gray-900" },
        { label: "Pendentes", value: tasks.length - done, color: "text-blue-600"},
        { label: "Concluidas", value: done, color: "text-green-600"},
        { label: "Atrasadas", value: overdue, color: "text-red-600"},
    ];

    return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => (
        <div key={item.label} className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
    );
}