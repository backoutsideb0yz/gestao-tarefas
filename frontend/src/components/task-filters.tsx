import { Search } from "lucide-react";
import type { Priority } from "@/types";

export type StatusFilter = "all" | "pending" | "done";
export type PriorityFilter = "all" | Priority;
export type SortBy = "recent" | "due" | "priority";

type Props = {
  search: string;
  status: StatusFilter;
  priority: PriorityFilter;
  sortBy: SortBy;
  onSearch: (v: string) => void;
  onStatus: (v: StatusFilter) => void;
  onPriority: (v: PriorityFilter) => void;
  onSortBy: (v: SortBy) => void;
};

const statusTabs: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendentes" },
  { value: "done", label: "Concluídas" },
];

export function TaskFilters(props: Props) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
        <input
          className="w-full border rounded-lg p-2.5 pl-9 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Buscar tarefas..."
          value={props.search}
          onChange={(e) => props.onSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex bg-gray-200 rounded-lg p-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => props.onStatus(tab.value)}
              className={`px-3 py-1 rounded-md text-sm ${
                props.status === tab.value
                  ? "bg-white shadow font-medium"
                  : "text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          className="border rounded-lg p-2 bg-white text-sm"
          value={props.priority}
          onChange={(e) => props.onPriority(e.target.value as PriorityFilter)}
        >
          <option value="all">Todas as prioridades</option>
          <option value="HIGH">Alta</option>
          <option value="MEDIUM">Média</option>
          <option value="LOW">Baixa</option>
        </select>

        <select
          className="border rounded-lg p-2 bg-white text-sm sm:ml-auto"
          value={props.sortBy}
          onChange={(e) => props.onSortBy(e.target.value as SortBy)}
        >
          <option value="recent">Mais recentes</option>
          <option value="due">Por vencimento</option>
          <option value="priority">Por prioridade</option>
        </select>
      </div>
    </div>
  );
}