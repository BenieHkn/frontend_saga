// types/meeting.ts (Optionnel, pour le typage)
export interface MeetingTask {
  task: string;
  assignees: { name: string; avatar?: string }[];
  dueDate: string;
  status: 'pending' | 'completed' | 'in_progress';
}

const columns = [
  { key: 'task', label: 'NOM DE LA TÂCHE', sortable: true },
  { key: 'assignees', label: 'RESPONSABLES' },
  { key: 'dueDate', label: 'ÉCHÉANCE', sortable: true },
  { key: 'status', label: 'STATUT' },
  { key: 'actions', label: '' }
];