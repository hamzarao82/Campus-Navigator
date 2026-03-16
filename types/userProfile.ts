export interface UserProfileData {
  id: string;
  fullName: string;
  email: string;
  role: "student" | "faculty" | "admin";
  phone?: string;
  address?: string;
  
  // Admin fields
  adminId?: string;
  department?: string;
  position?: string;
  responsibilities?: string;

  // Faculty fields
  facultyId?: string;
  officeHours?: string;
  college?: string;

  // Student fields
  studentId?: string;
  major?: string;
  year?: string;
  
  // Any other dynamic fields
  [key: string]: any;
}
