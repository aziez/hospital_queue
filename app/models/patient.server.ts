import { Patient } from "~/types";
import { prisma } from "../utils/db.server";

export type CreatePatientInput = {
  name: string;
  mrn: string;
  phone?: string;
  email?: string;
};

export async function createPatient(
  patientData: CreatePatientInput
): Promise<Patient> {
  return await prisma.patient.create({
    data: patientData,
  });
}

export async function getPatientByMrn(mrn: string): Promise<Patient | null> {
  return await prisma.patient.findUnique({
    where: { mrn },
  });
}

export async function getPatientById(id: string): Promise<Patient | null> {
  return prisma.patient.findUnique({
    where: { id },
  });
}

export async function updatePatient(
  id: string,
  data: Partial<CreatePatientInput>
): Promise<Patient> {
  return prisma.patient.update({
    where: { id },
    data,
  });
}
