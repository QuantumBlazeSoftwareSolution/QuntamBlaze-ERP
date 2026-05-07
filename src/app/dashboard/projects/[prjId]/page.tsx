import { notFound } from "next/navigation";
import { getProjectDetail } from "@/lib/mockData/projectDetails";
import { ProjectDetailClient } from "@/components/projects/detail/ProjectDetailClient";

interface ProjectDetailPageProps {
  params: Promise<{ prjId: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { prjId } = await params;

  // Decode URL-encoded IDs (e.g., PRJ-GOOG-26-001 might be URL-encoded)
  const decodedId = decodeURIComponent(prjId);
  const project = getProjectDetail(decodedId);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}

export async function generateStaticParams() {
  return [
    { prjId: "PRJ-GOOG-26-001" },
    { prjId: "PRJ-MSFT-26-002" },
  ];
}
