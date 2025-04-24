import { Link, useLoaderData } from "@remix-run/react";
import { loader } from "./route";

export default function Page() {
  const { departmentQueues } = useLoaderData<typeof loader>();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Sistem Antrian Rumah Sakit</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold">Dashboard Antrian</h2>
          <div className="mt-4">
            {Object.entries(departmentQueues).map(([dept, queue]) => (
              <div key={dept} className="mb-4">
                <h3 className="text-lg font-medium capitalize">{dept}</h3>
                <div className="mt-2">
                  <div className="text-sm text-gray-600">
                    Total Antrian: {queue.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Menunggu:{" "}
                    {queue.filter((item) => item.status === "WAITING").length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold">Menu Navigasi</h2>
          <div className="mt-4 space-y-2">
            <Link
              to="/patient/check-in"
              className="block p-2 bg-blue-100 hover:bg-blue-200 rounded"
            >
              Check-in Pasien Baru
            </Link>
            <Link
              to="/patient/status"
              className="block p-2 bg-green-100 hover:bg-green-200 rounded"
            >
              Cek Status Antrian
            </Link>
            <Link
              to="/display"
              className="block p-2 bg-yellow-100 hover:bg-yellow-200 rounded"
            >
              Tampilan Display Antrian
            </Link>
            <Link
              to="/admin/dashboard"
              className="block p-2 bg-purple-100 hover:bg-purple-200 rounded"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
