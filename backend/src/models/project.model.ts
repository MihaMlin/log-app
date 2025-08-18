import mongoose from "mongoose";

export interface ProjectDocument
  extends mongoose.Document<mongoose.Types.ObjectId> {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  status: "active" | "archived" | "completed";
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema<ProjectDocument>(
  {
    userId: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: false },
    status: {
      type: String,
      enum: ["active", "archived", "completed"],
      required: true,
      default: "active",
    },
    tags: {
      type: [String],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ProjectModel = mongoose.model<ProjectDocument>("Project", projectSchema);
export default ProjectModel;
