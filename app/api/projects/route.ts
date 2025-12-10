import { NextResponse } from "next/server";
import { getFeaturedProjects } from "../../../lib/services/projects";

export async function GET() {
  const projects = await getFeaturedProjects();
  return NextResponse.json(projects);
}
