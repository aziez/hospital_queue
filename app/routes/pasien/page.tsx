import { Form, useActionData } from "@remix-run/react";
import { action } from "./route";

export default function Page() {
  const actionData = useActionData<typeof action>();

  console.log(actionData?.error, "Errror");

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Check-in Pasien</h1>

      {actionData?.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {actionData.error}
        </div>
      )}

      <Form method="post" className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="mrn"
            className="block text-sm font-medium text-gray-700"
          >
            Nomor Rekam Medis (MRN)
          </label>
          <input
            type="text"
            id="mrn"
            name="mrn"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Nomor Telepon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Departemen
          </label>
          <select
            id="department"
            name="department"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Pilih Departemen</option>
            <option value="emergency">UGD</option>
            <option value="outpatient">Rawat Jalan</option>
            <option value="laboratory">Laboratorium</option>
            <option value="radiology">Radiologi</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Daftar Antrian
        </button>
      </Form>
    </div>
  );
}
