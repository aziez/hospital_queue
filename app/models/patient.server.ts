import { Patient } from "generated/prisma";
import { prisma } from "~/utils/db.server";

export async function createPatient(patientData: Patient) {
  return prisma;
}
