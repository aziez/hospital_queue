import { json } from "@remix-run/react";
import { getTodayQueueByDepartment } from "~/models/queue.server";
import Page from "./page";

export async function loader() {
  const departmentQueues = {
    emergency: await getTodayQueueByDepartment("emergency"),
    outpatient: await getTodayQueueByDepartment("outpatient"),
    laboratory: await getTodayQueueByDepartment("laboratory"),
    radiology: await getTodayQueueByDepartment("radiology"),
  };

  return json({ departmentQueues });
}

export default function () {
  return <Page />;
}
