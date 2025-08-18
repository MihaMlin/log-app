export type UserType = {
  email: string;
  role: "user" | "admin";
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectType = {
  _id: string;
  name: string;
  description: string;
  status: "active" | "archived" | "completed";
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type LogType = {
  _id: string;
  userId: string;
  projectId: string;
  message: string;
  severity:
    | "emerg"
    | "alert"
    | "crit"
    | "err"
    | "warning"
    | "notice"
    | "info"
    | "debug";
  source: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
};
