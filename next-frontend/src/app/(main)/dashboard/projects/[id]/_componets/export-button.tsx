"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ExcelJS from "exceljs";
import useLogs from "@/hooks/use-logs";
import { LogType } from "@/types";
import { Long_Cang } from "next/font/google";

interface ExportLogsButtonProps {
  projectId: string;
  totalRows: number;
}

const ExportLogsButton = ({ projectId, totalRows }: ExportLogsButtonProps) => {
  const { logs, refetch } = useLogs({
    projectId,
    params: { currentPage: 0, pageSize: totalRows },
  });

  const handleExport = async () => {
    await refetch();
    if (!logs || logs.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("ProjectLogs");

    // Add headers
    sheet.columns = [
      { header: "ID", key: "id", width: 30 },
      { header: "Message", key: "message", width: 40 },
      { header: "Source", key: "source", width: 20 },
      { header: "Severity", key: "severity", width: 10 },
      { header: "Metadata", key: "metadata", width: 60 },
      { header: "CreatedAt", key: "createdAt", width: 30 },
      { header: "UpdatedAt", key: "updatedAt", width: 30 },
    ];

    // Add rows
    logs.forEach((log: LogType) => {
      sheet.addRow({
        id: log._id,
        message: log.message,
        source: log.source,
        severity: log.severity,
        metadata: JSON.stringify(log.metadata || {}),
        createdAt: log.createdAt,
        updatedAt: log.updatedAt,
      });
    });

    // Generate file and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `project-${projectId}-logs.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport} variant="default" className="w-[100px]">
      <Download className="mr-2 h-4 w-4" />
      Export
    </Button>
  );
};

export default ExportLogsButton;
