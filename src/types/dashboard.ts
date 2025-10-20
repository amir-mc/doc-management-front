export interface User {
  id: number;
  nationalCode: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  profileImage?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface ReportCard {
  id: number;
  userId: number;
  title: string;
  filePath: string;
  description?: string;
  uploadedAt: string;
  uploadedBy: number;
  user?: {
    firstName: string;
    lastName: string;
    nationalCode: string;
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalReportCards: number;
  recentUsers: User[];
  recentReportCards: ReportCard[];
}