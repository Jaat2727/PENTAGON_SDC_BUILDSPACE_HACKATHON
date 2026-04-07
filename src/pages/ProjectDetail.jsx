/*
  ProjectDetail.jsx  (page)
  -------------------------
  Route: /projects/:id
  Renders the full detail view component for a single project.
*/

import { useParams } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import ProjectDetailView from "../components/projects/ProjectDetail";

export default function ProjectDetailPage() {
  const { id } = useParams();

  return (
    <PageWrapper className="max-w-3xl">
      <ProjectDetailView projectId={id} />
    </PageWrapper>
  );
}
