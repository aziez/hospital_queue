
import { useState, useEffect } from "react";
import { Department, QueueItem } from "~/types";

interface DepartmentInfo {
  id: Department;
  label: string;
}

interface PageProps {
  activeQueues: Record<Department, QueueItem[]>;
  departments: DepartmentInfo[];
  timestamp: string;
}

export default function Page({ activeQueues, departments, timestamp }: PageProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Get currently processing patients for each department
  const processingPatients: Record<Department, QueueItem[]> = {};
  // Get next patients in line for each department
  const nextPatients: Record<Department, QueueItem[]> = {};
  
  departments.forEach(dept => {
    const deptId = dept.id as Department;
    const departmentQueue = activeQueues[deptId] || [];
    
    // Get all processing patients for this department
    processingPatients[deptId] = departmentQueue.filter(
      item => item.status === "PROCESSING"
    );
    
    // Get next 3 waiting patients for this department, ordered by priority and creation time
    nextPatients[deptId] = departmentQueue
      .filter(item => item.status === "WAITING")
      .sort((a, b) => {
        // First sort by priority (higher first)
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        // Then by creation time (earlier first)
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      })
      .slice(0, 3);
  });
  
  return (
    <div className="min-h-screen bg-blue-900 text-white p-4 overflow-y-auto">
      {/* Header with time and date */}
      <div className="flex justify-between items-center mb-8 bg-blue-800 p-4 rounded-lg">
        <h1 className="text-4xl font-bold tracking-wide">ANTRIAN RUMAH SAKIT</h1>
        <div className="text-3xl">
          <div>{currentTime.toLocaleTimeString()}</div>
          <div className="text-xl text-right">{currentTime.toLocaleDateString()}</div>
        </div>
      </div>
      
      {/* Main content with department queues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {departments.map(dept => (
          <div key={dept.id} className="bg-blue-800 p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-4 tracking-wide border-b border-blue-600 pb-2">
              {dept.label}
            </h2>
            
            {/* Currently being served */}
            <div className="mb-6">
              <h3 className="text-2xl mb-2 text-yellow-300">SEDANG DILAYANI</h3>
              {processingPatients[dept.id as Department].length > 0 ? (
                <div className="grid gap-4">
                  {processingPatients[dept.id as Department].map(item => (
                    <div key={item.id} className="bg-yellow-500 text-black p-4 rounded-lg flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold">{item.ticketNumber}</span>
                        <span className="text-lg">{item.patient.name}</span>
                      </div>
                      <div className="text-7xl font-bold px-4 py-2 bg-white rounded-lg">
                        {item.ticketNumber.split('-')[1]}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-blue-700 p-6 rounded-lg text-xl text-center">
                  Tidak ada pasien yang sedang dilayani
                </div>
              )}
            </div>
            
            {/* Next in line */}
            <div>
              <h3 className="text-2xl mb-2 text-blue-300">ANTRIAN BERIKUTNYA</h3>
              {nextPatients[dept.id as Department].length > 0 ? (
                <div className="grid gap-2">
                  {nextPatients[dept.id as Department].map((item, index) => (
                    <div 
                      key={item.id}
                      className={`bg-blue-700 p-3 rounded-lg flex justify-between items-center ${
                        index === 0 ? 'border-l-4 border-green-500' : ''
                      }`}
                    >
                      <span className="text-xl font-medium">{item.ticketNumber}</span>
                      <div className="flex items-center">
                        {item.priority > 0 && (
                          <span className="mr-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                            Prioritas
                          </span>
                        )}
                        <span className="text-3xl font-bold">{item.ticketNumber.split('-')[1]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-blue-700 p-4 rounded-lg text-center">
                  Tidak ada antrian menunggu
                </div>
              )}
            </div>
            
            {/* Department stats */}
            <div className="mt-4 flex justify-between text-sm text-blue-300 border-t border-blue-700 pt-2">
              <span>Total Menunggu: {activeQueues[dept.id as Department]?.filter(q => q.status === "WAITING").length || 0}</span>
              <span>Total Dilayani: {activeQueues[dept.id as Department]?.filter(q => q.status === "COMPLETED").length || 0}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer with auto-refresh message */}
      <div className="mt-8 text-center text-blue-300 text-sm">
        Tampilan akan diperbarui secara otomatis. Pembaruan terakhir: {new Date(timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}

