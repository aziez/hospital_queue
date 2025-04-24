import { json } from "@remix-run/react";
import { getTodayQueueByDepartment } from "~/models/queue.server";
import Page from "./page";

export async function loader() {
  const queueData = {
    emergency: await getTodayQueueByDepartment("emergency"),
    outpatient: await getTodayQueueByDepartment("outpatient"),
    laboratory: await getTodayQueueByDepartment("laboratory"),
    radiology: await getTodayQueueByDepartment("radiology"),
  };

  return json({ queueData });
}

export default function () {
  return <Page />;
}
