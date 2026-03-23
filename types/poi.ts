export interface ManagePOI {
  id: string;
  name: string;
  image: string;
  description: string;
  location: string;
  hours: string;
  capacity: number;
  currentOccupancy: number;
  status: string;
  latitude?: number;
  longitude?: number;
}
