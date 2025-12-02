import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";

    const filePath = path.join(process.cwd(), "drugs_index.csv");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const lines = fileContent.split("\n").slice(1); // Skip header
    const drugs = lines
      .filter((line) => line.trim())
      .map((line) => {
        const [name, url] = line.split(",");
        return { name: name?.trim(), url: url?.trim() };
      })
      .filter((drug) => drug.name && drug.name.toLowerCase().includes(query))
      .slice(0, 10); // Limit to 10 suggestions

    return NextResponse.json(drugs);
  } catch (error) {
    console.error("Error reading drugs index:", error);
    return NextResponse.json(
      { error: "Failed to load drugs" },
      { status: 500 }
    );
  }
}
