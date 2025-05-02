/* eslint-disable react/display-name */
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { 
  getTodayQueueByDepartment, 
  getNextPatientInQueue, 
  updateQueueItemStatus,
  getAllActiveQueues
} from "~/models/queue.server";
import { Department, QueueItem, QueueStatus } from "~/types";

export async function loader() {
  const activeQueues = await getAllActiveQueues();
  
  return json({ 
    activeQueues,
    departments: [
      { id: "emergency", label: "UGD" },
      { id: "outpatient", label: "Rawat Jalan" },
      { id: "laboratory", label: "Laboratorium" },
      { id: "radiology", label: "Radiologi" }
    ]
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("action") as string;
  const id = formData.get("id") as string;
  const department = formData.get("department") as Department;
  
  try {
    if (action === "call-next") {
      const nextPatient = await getNextPatientInQueue(department);
      if (nextPatient) {
        await updateQueueItemStatus(nextPatient.id, "PROCESSING");
        return json({ success: true, message: `Pasien ${nextPatient.patient.name} dengan nomor antrian ${nextPatient.ticketNumber} dipanggil` });
      } else {
        return json({ success: false, message: "Tidak ada pasien dalam antrian" });
      }
    } else if (action === "update-status") {
      const status = formData.get("status") as QueueStatus;
      await updateQueueItemStatus(id, status);
      return json({ success: true, message: `Status antrian berhasil diperbarui menjadi ${status}` });
    } else if (action === "update-priority") {
      const priority = parseInt(formData.get("priority") as string);
      const queueItem = await prisma.queueItem.update({
        where: { id },
        data: { priority },
        include: { patient: true }
      });
      return json({ 
        success: true, 
        message: `Prioritas untuk pasien ${queueItem.patient.name} diperbarui menjadi ${priority}` 
      });
    }
    
    return json({ success: false, message: "Aksi tidak valid" });
  } catch (error) {
    console.error("Error in action:", error);
    return json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export default function AdminDashboard() {
  const { activeQueues, departments } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [selectedDepartment, setSelectedDepartment] = useState<Department>("emergency");
  const [showNotification, setShowNotification] = useState(false);
  
  useEffect(() => {
    if (actionData?.success) {
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [actionData]);
  
  // Auto-refresh queue every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      submit({}, { method: "get", action: "/admin/dashboard" });
    }, 30000);
    
    return () => clearInterval(timer);
  }, [submit]);
  
  const handleCallNext = () => {
    submit(
      { action: "call-next", department: selectedDepartment },
      { method: "post" }
    );
  };
  
  const handleUpdateStatus = (id: string, status: QueueStatus) => {
    submit(
      { action: "update-status", id, status },
      { method: "post" }
    );
  };
  
  const handlePriorityChange = (id: string, priority: number) => {
    submit(
      { action: "update-priority", id, priority: priority.toString() },
      { method: "post" }
    );
  };

  const queueItems = activeQueues[selectedDepartment] || [];
  const isSubmitting = navigation.state === "submitting";
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manajemen Antrian Rumah Sakit</h1>
      
      {/* Notification */}
      {showNotification && actionData && (
        <div className={`p-4 mb-4 rounded-md ${actionData.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {actionData.message}
        </div>
      )}
      
      {/* Department Tabs */}
      <div className="bg-white shadow-md rounded-md mb-6">
        <div className="flex overflow-x-auto">
          {departments.map((dept) => (
            <button
              key={dept.id}
              className={`py-3 px-6 font-medium focus:outline-none ${
                selectedDepartment === dept.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setSelectedDepartment(dept.id as Department)}
            >
              {dept.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Queue Actions */}
      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Tindakan Antrian</h2>
        <div className="flex gap-4">
          <Form method="post" onSubmit={(e) => {
            e.preventDefault();
            handleCallNext();
          }}>
            <input type="hidden" name="department" value={selectedDepartment} />
            <input type="hidden" name="action" value="call-next" />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Memanggil...' : 'Panggil Pasien Berikutnya'}
            </button>
          </Form>
        </div>
      </div>
      
      {/* Queue Status */}
      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Daftar Antrian {departments.find(d => d.id === selectedDepartment)?.label}</h2>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Menunggu: {queueItems.filter(q => q.status === 'WAITING').length}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Diproses: {queueItems.filter(q => q.status === 'PROCESSING').length}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Selesai: {queueItems.filter(q => q.status === 'COMPLETED').length}
            </span>
          </div>
        </div>
        
        {queueItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Tidak ada antrian aktif untuk departemen ini
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Antrian
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pasien
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioritas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waktu
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {queueItems.map((item) => (
                  <tr key={item.id} className={item.status === 'PROCESSING' ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.ticketNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium">{item.patient.name}</div>
                      <div className="text-xs">MRN: {item.patient.mrn}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${item.status === 'WAITING' ? 'bg-blue-100 text-blue-800' : ''}
                        ${item.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${item.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                        ${item.status === 'HIDDEN' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {item.status === 'WAITING' && 'Menunggu'}
                        {item.status === 'PROCESSING' && 'Diproses'}
                        {item.status === 'COMPLETED' && 'Selesai'}
                        {item.status === 'HIDDEN' && 'Tersembunyi'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className="block w-24 pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={item.priority}
                        onChange={(e) => handlePriorityChange(item.id, parseInt(e.target.value))}
                        disabled={item.status === 'COMPLETED'}
                      >
                        <option value="0">Normal</option>
                        <option value="1">Penting</option>
                        <option value="2">Mendesak</option>
                        <option value="3">Kritis</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Dibuat: {new Date(item.createdAt).toLocaleTimeString()}</div>
                      {item.calledAt && (
                        <div className="text-xs">Dipanggil: {new Date(item.calledAt).toLocaleTimeString()}</div>
                      )}
                      {item.completedAt && (
                        <div className="text-xs">Selesai: {new Date(item.completedAt).toLocaleTimeString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2">
                        {item.status === 'WAITING' && (
                          <Form method="post" className="inline-block">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="action" value="update-status" />
                            <input type="hidden" name="status" value="PROCESSING" />
                            <button 
                              type="submit" 
                              className="text-blue-600 hover:text-blue-900 px-3 py-1 text-xs rounded-md bg-blue-50"
                            >
                              Panggil
                            </button>
                          </Form>
                        )}
                        
                        {item.status === 'PROCESSING' && (
                          <Form method="post" className="inline-block">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="action" value="update-status" />
                            <input type="hidden" name="status" value="COMPLETED" />
                            <button 
                              type="submit" 
                              className="text-green-600 hover:text-green-900 px-3 py-1 text-xs rounded-md bg-green-50"
                            >
                              Selesaikan
                            </button>
                          </Form>
                        )}
                        
                        {item.status !== 'HIDDEN' && (
                          <Form method="post" className="inline-block">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="action" value="update-status" />
                            <input type="hidden" name="status" value="HIDDEN" />
                            <button 
                              type="submit" 
                              className="text-gray-600 hover:text-gray-900 px-3 py-1 text-xs rounded-md bg-gray-50"
                            >
                              Sembunyikan
                            </button>
                          </Form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Queue Statistics */}
      <div className="bg-white shadow-md rounded-md p-4">
        <h2 className="text-xl font-semibold mb-4">Statistik Hari Ini</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {departments.map((dept) => {
            const deptItems = activeQueues[dept.id as Department] || [];
            const waiting = deptItems.filter(q => q.status === 'WAITING').length;
            const processing = deptItems.filter(q => q.status === 'PROCESSING').length;
            const completed = deptItems.filter(q => q.status === 'COMPLETED').length;
            const total = deptItems.length;
            
            return (
              <div key={dept.id} className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-700 mb-2">{dept.label}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total:</span>
                    <span className="text-sm font-medium">{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Menunggu:</span>
                    <span className="text-sm font-medium text-blue-600">{waiting}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Diproses:</span>
                    <span className="text-sm font-medium text-yellow-600">{processing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Selesai:</span>
                    <span className="text-sm font-medium text-green-600">{completed}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
