export interface Patient {
  id: string;
  name: string;
  mrn: string;
  phone?: string | null;
  email?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueueItem {
  id: string;
  ticketNumber: string;
  department: string;
  patientId: string;
  patient: Patient;
  status: QueueStatus;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  calledAt?: Date | null;
  completedAt?: Date | null;
}

export type QueueStatus = "WAITING" | "PROCESSING" | "COMPLETED" | "HIDDEN";

export interface User {
  id: string;
  username: string;
  password: string; // Hashed password (tidak pernah ditampilkan di client)
  role: UserRole;
  department?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = "admin" | "staff" | "receptionist";

export type Department =
  | "emergency"
  | "outpatient"
  | "laboratory"
  | "radiology";

export interface QueueData {
  [key: string]: QueueItem[];
}
