export interface AdminUserData {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  role: "student" | "faculty" | "admin";
  createdAt: string;
}
