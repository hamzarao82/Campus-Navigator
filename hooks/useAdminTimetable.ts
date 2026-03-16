import { useState } from 'react';

// For now, using static data as per the original file. 
// This can be easily swapped for a Firebase fetch later.
const TIMETABLE_DATA = [
  {
    id: 1,
    studentName: "Alice Johnson",
    studentId: "STU001",
    courses: [
      {
        code: "CS101",
        name: "Introduction to Computer Science",
        day: "Monday",
        time: "10:00 AM - 11:30 AM",
        room: "Room 201",
        instructor: "Dr. Sarah Johnson",
      },
      {
        code: "MATH201",
        name: "Advanced Calculus",
        day: "Tuesday",
        time: "2:00 PM - 3:30 PM",
        room: "Room 305",
        instructor: "Prof. Michael Smith",
      },
    ],
  },
  {
    id: 2,
    studentName: "Bob Wilson",
    studentId: "STU002",
    courses: [
      {
        code: "ENG102",
        name: "Academic Writing",
        day: "Wednesday",
        time: "1:00 PM - 2:30 PM",
        room: "Room 102",
        instructor: "Dr. Emily Brown",
      },
      {
        code: "PHYS101",
        name: "Physics Fundamentals",
        day: "Thursday",
        time: "11:00 AM - 12:30 PM",
        room: "Lab 203",
        instructor: "Dr. James Wilson",
      },
    ],
  },
];

export function useAdminTimetable() {
  const [timetableData, setTimetableData] = useState(TIMETABLE_DATA);
  const [loading, setLoading] = useState(false);

  return { timetableData, loading };
}
