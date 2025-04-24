// / Langkah 5: Buat model Queue di app/models/queue.server.ts
import { prisma } from "~/utils/db.server";
import type { QueueItem, QueueStatus, Department } from "~/types";

export type CreateQueueItemInput = {
  patientId: string;
  department: Department;
  priority?: number;
};

export async function createQueueItem({
  patientId,
  department,
  priority = 0,
}: CreateQueueItemInput): Promise<QueueItem> {
  // Generate ticket number (e.g., DEP-001)
  const departmentCode = department.substring(0, 3).toUpperCase();
  const todayItems = await getTodayQueueByDepartment(department);
  const ticketNumber = `${departmentCode}-${String(
    todayItems.length + 1
  ).padStart(3, "0")}`;

  const result = await prisma.queueItem.create({
    data: {
      ticketNumber,
      department,
      patientId,
      priority,
      status: "WAITING",
    },
    include: {
      patient: true,
    },
  });

  return result as QueueItem;
}

export async function getTodayQueueByDepartment(
  department: Department
): Promise<QueueItem[]> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const result = await prisma.queueItem.findMany({
    where: {
      department,
      createdAt: {
        gte: startOfDay,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      patient: true,
    },
  });

  return result as QueueItem[];
}

export async function getQueueItemById(id: string): Promise<QueueItem | null> {
  const result = await prisma.queueItem.findUnique({
    where: { id },
    include: {
      patient: true,
    },
  });

  return result as QueueItem | null;
}

export async function getQueueItemByTicketNumber(
  ticketNumber: string
): Promise<QueueItem | null> {
  const result = await prisma.queueItem.findFirst({
    where: { ticketNumber },
    include: {
      patient: true,
    },
  });

  return result as QueueItem | null;
}

export async function getNextPatientInQueue(
  department: Department
): Promise<QueueItem | null> {
  const result = await prisma.queueItem.findFirst({
    where: {
      department,
      status: "WAITING",
    },
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    include: {
      patient: true,
    },
  });

  return result as QueueItem | null;
}

export async function updateQueueItemStatus(
  id: string,
  status: QueueStatus
): Promise<QueueItem> {
  const updates: Record<string, any> = {
    status: status as QueueStatus,
  };

  if (status === "PROCESSING") {
    updates.calledAt = new Date();
  } else if (status === "COMPLETED") {
    updates.completedAt = new Date();
  }

  const result = await prisma.queueItem.update({
    where: { id },
    data: updates,
    include: {
      patient: true,
    },
  });

  return result as QueueItem;
}

export async function getAllActiveQueues(): Promise<
  Record<Department, QueueItem[]>
> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const departments: Department[] = [
    "emergency",
    "outpatient",
    "laboratory",
    "radiology",
  ];
  const result: Partial<Record<Department, QueueItem[]>> = {};

  for (const dept of departments) {
    const queueItems = await prisma.queueItem.findMany({
      where: {
        department: dept,
        createdAt: {
          gte: startOfDay,
        },
        status: {
          in: ["WAITING", "PROCESSING"],
        },
      },
      orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "asc" }],
      include: {
        patient: true,
      },
    });

    result[dept] = queueItems as QueueItem[];
  }

  return result as Record<Department, QueueItem[]>;
}
