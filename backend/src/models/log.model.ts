import mongoose from "mongoose";
import { LogSeverityType } from "../constants/logSeverityType";
import { oneDayAgo, oneHourAge } from "../utils/date";

export interface LogModel extends mongoose.Model<LogDocument> {
  getProjectStats(projectId: string): Promise<{
    last24Hours: number;
    lastHour: number;
    bySeverity: Record<string, number>;
  }>;
}

export interface LogDocument
  extends mongoose.Document<mongoose.Types.ObjectId> {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  message: string;
  severity: LogSeverityType;
  source: string;
  metadata?: mongoose.Types.Map<any>;
  createdAt: Date;
  updatedAt: Date;
}

const logSchema = new mongoose.Schema<LogDocument>(
  {
    userId: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    projectId: {
      ref: "Project",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      required: true,
      index: true,
    },
    source: {
      type: String,
      required: true,
      description:
        "Identifier of the log source (e.g., server name, application component)",
    },
    metadata: {
      type: mongoose.Schema.Types.Map,
      required: false,
      description: "Additional unstructured data associated with the log",
    },
  },
  {
    timestamps: true,
  }
);

// Enable text search
logSchema.index({ message: "text", source: "text" });

// Method to get project stats
logSchema.statics.getProjectStats = async function (projectId: string) {
  const last24Hours = oneDayAgo();
  const lastHour = oneHourAge();

  const [total24h, total1h, bySeverity] = await Promise.all([
    this.countDocuments({ projectId, createdAt: { $gte: last24Hours } }),
    this.countDocuments({ projectId, createdAt: { $gte: lastHour } }),
    this.aggregate([
      { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
      { $group: { _id: "$severity", count: { $sum: 1 } } },
    ]),
  ]);

  const severityCounts: Record<string, number> = {};
  bySeverity.forEach(({ _id, count }) => {
    severityCounts[_id ?? "unknown"] = count;
  });

  return {
    last24Hours: total24h,
    lastHour: total1h,
    bySeverity: severityCounts,
  };
};

export const LogModel = mongoose.model<LogDocument, LogModel>("Log", logSchema);
export default LogModel;
