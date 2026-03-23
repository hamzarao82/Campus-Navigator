export interface StudentCourseData {
  id: string;
  code: string;
  name: string;
  instructor: string;
  schedule: string;
  location: string;
  capacity: number;
  enrolled: number;
  status: string;
  enrolledStudents?: string[];
}
