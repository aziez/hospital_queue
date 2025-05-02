/* eslint-disable react/display-name */
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect } from "react";
import { getAllActiveQueues } from "~/models/queue.server";
import { Department, QueueItem } from "~/types";
import Page from "./page";

export async function loader() {
  const activeQueues = await getAllActiveQueues();
  
  const departments = [
    { id: "emergency", label: "UGD" },
    { id: "outpatient", label: "Rawat Jalan" },
    { id: "laboratory", label: "Laboratorium" },
    { id: "radiology", label: "Radiologi" }
  ];
  
  return json({ 
    activeQueues,
    departments,
    timestamp: new Date().toISOString()
  });
}

export default function DisplayRoute() {
  const { activeQueues, departments, timestamp } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  
  // Auto-refresh every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      submit({}, { method: "get", action: "/display" });
    }, 10000);
    
    return () => clearInterval(timer);
  }, [submit]);
  
  return <Page activeQueues={activeQueues} departments={departments} timestamp={timestamp} />;
}
