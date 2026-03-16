import { Timestamp } from "firebase/firestore";

export interface AdminMapData {
  id: string;
  name: string;
  description: string;
  status: string;
  type: string;
  image: string;
  createdAt?: Timestamp | any;
  updatedAt?: Timestamp | any;
  lastUpdated?: string;
}
