import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { transaction } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// Helper function to convert array of objects to CSV
function convertToCSV(data: any[], headers: string[]): string {
  if (data.length === 0) {
    return headers.join(",") + "\n";
  }

  // Create header row
  const csvRows = [headers.join(",")];

  // Create data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];

      // Handle null/undefined
      if (value === null || value === undefined) {
        return "";
      }

      // Handle objects/arrays - stringify them
      if (typeof value === "object") {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }

      // Handle strings - escape quotes and wrap in quotes if contains comma
      const stringValue = String(value);
      if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

export async function GET() {
  try {
    // Get the current session
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = sessionData.user.id;

    // Fetch all transactions
    const transactions = await db
      .select({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        balanceAfter: transaction.balanceAfter,
        description: transaction.description,
        relatedId: transaction.relatedId,
        metadata: transaction.metadata,
        createdAt: transaction.createdAt,
      })
      .from(transaction)
      .where(eq(transaction.userId, userId))
      .orderBy(desc(transaction.createdAt));

    // Convert transactions to CSV format
    const transactionsCSV = convertToCSV(
      transactions,
      ["id", "type", "amount", "balanceAfter", "description", "relatedId", "metadata", "createdAt"]
    );

    // Return CSV file
    return new NextResponse(transactionsCSV, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="transactions-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    // Log error type only to avoid leaking transaction data
    console.error("Error exporting transactions:", error instanceof Error ? error.constructor.name : "Unknown error");
    return NextResponse.json(
      { error: "Failed to export transactions" },
      { status: 500 }
    );
  }
}
