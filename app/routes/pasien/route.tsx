import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { createPatient, getPatientByMrn } from "~/models/patient.server";
import { createQueueItem } from "~/models/queue.server";
import { Department } from "~/types";
import Page from "./page";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const mrn = formData.get("mrn") as string;
  const phone = formData.get("phone") as string | undefined;
  const email = formData.get("email") as string | undefined;
  const department = formData.get("department") as string;

  if (!name || !mrn || !department) {
    return json(
      { error: "Nama, MRN, dan departemen harus diisi" },
      { status: 400 }
    );
  }

  try {
    // Cek apakah pasien sudah ada
    let patient = await getPatientByMrn(mrn);

    // Jika belum ada, buat data pasien baru
    if (!patient) {
      patient = await createPatient({
        name,
        mrn,
        phone,
        email,
      });
    }

    // Buat antrian baru
    // const queueItem = await createQueueItem({
    //   patientId: patient.id,
    //   department: department as Department,
    // });

    return redirect(`/display`);
  } catch (error) {
    console.error(error, "ERRR");
    return json(
      { error: "Terjadi kesalahan saat membuat antrian" },
      { status: 500 }
    );
  }
}

export default function () {
  return <Page />;
}
