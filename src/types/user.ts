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
  reportCards?: ReportCard[];
}

export type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'reportCards'>;
export type UpdateUserRequest = Partial<CreateUserRequest>;

export interface CreateReportCardRequest {
  userId: number;
  title: string;
  description?: string;
  uploadedBy: number;
}
