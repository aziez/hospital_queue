import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import { useState } from "react";
import { QueueStatus } from "@prisma/client";

export default function Page() {
  const { queueData } = useLoaderData<typeof loader>();
  const [currentQueue, setCurrentQueue] = useState(queueData);

  // Uncomment untuk implementasi socket.io
  // useEffect(() => {
  //   const socket = io();
  //
  //   socket.on("queueUpdate", (updatedQueue) => {
  //     setCurrentQueue(updatedQueue);
  //   });
  //
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Informasi Antrian Rumah Sakit
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(currentQueue).map(([dept, queue]) => {
          const processing = queue.filter(
            (item) => item.status === QueueStatus.PROCESSING
          );
          const waiting = queue.filter(
            (item) => item.status === QueueStatus.WAITING
          );

          return (
            <div key={dept} className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold capitalize mb-4">{dept}</h2>

              <div className="bg-yellow-100 p-3 rounded-md mb-4">
                <h3 className="font-medium">Sedang Dilayani:</h3>
                {processing.length > 0 ? (
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {processing.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-2 rounded border text-center"
                      >
                        <span className="text-lg font-bold">
                          {item.ticketNumber}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    Tidak ada pasien yang sedang dilayani
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-medium">Antrian Menunggu:</h3>
                {waiting.length > 0 ? (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {waiting.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-100 p-2 rounded border text-center"
                      >
                        <span>{item.ticketNumber}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    Tidak ada pasien yang menunggu
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
