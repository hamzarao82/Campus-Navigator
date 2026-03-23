import { Timestamp } from "firebase/firestore";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  recipients: "all" | "student" | "faculty";
  createdAt: Timestamp;
  createdBy: string;
  time?: string;
}
