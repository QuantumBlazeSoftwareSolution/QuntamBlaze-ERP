"use client";

import { useReducer, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ProposalPageHeader } from "@/components/dashboard/projects/proposal/ProposalPageHeader";
import { ProposalSectionNav } from "@/components/dashboard/projects/proposal/ProposalSectionNav";
import { ProposalEditor } from "@/components/dashboard/projects/proposal/ProposalEditor";
import { ESignatureTracker } from "@/components/dashboard/projects/proposal/ESignatureTracker";
import { Proposal, ProposalSection } from "@/types/proposal";
import { useInterval } from "@/hooks/useInterval";

const INITIAL_SECTIONS: ProposalSection[] = [
  {
    id: "sec-1",
    type: "executive_summary",
    title: "Executive Summary",
    content:
      "<p>This proposal outlines the strategy and execution plan for migrating legacy on-premise infrastructure to a highly available, multi-region cloud architecture.</p>",
  },
  {
    id: "sec-2",
    type: "scope",
    title: "Scope of Work",
    content:
      "<ul><li>Comprehensive audit of existing database schemas.</li><li>Design of IaC templates.</li></ul>",
  },
  {
    id: "sec-3",
    type: "deliverables",
    title: "Deliverables",
    content: "<p>Architecture Design Document, Terraform Modules, Migration Scripts.</p>",
  },
  {
    id: "sec-4",
    type: "timeline",
    title: "Timeline",
    content: "<p>Phased rollout over 12 weeks.</p>",
  },
  {
    id: "sec-5",
    type: "pricing",
    title: "Pricing",
    content: "<p>Fixed-fee engagement with milestone-based billing.</p>",
  },
  {
    id: "sec-6",
    type: "team",
    title: "Team",
    content: "<p>Assigned Cloud Architects and DevOps Engineers.</p>",
  },
  {
    id: "sec-7",
    type: "terms",
    title: "Terms",
    content: "<p>Standard master services agreement terms apply.</p>",
  },
];

type Action =
  | { type: "REORDER"; sections: ProposalSection[] }
  | { type: "UPDATE_CONTENT"; id: string; content: string }
  | { type: "UPDATE_TITLE"; title: string };

function proposalReducer(state: Proposal, action: Action): Proposal {
  switch (action.type) {
    case "REORDER":
      return { ...state, sections: action.sections };
    case "UPDATE_CONTENT":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.id ? { ...s, content: action.content } : s
        ),
      };
    case "UPDATE_TITLE":
      return { ...state, title: action.title };
    default:
      return state;
  }
}

export default function ProposalPage() {
  const { prjId } = useParams();
  const [proposal, dispatch] = useReducer(proposalReducer, {
    id: `PRO-${prjId}-01`,
    projectId: prjId as string,
    clientId: "CLI-GOOG-26-001",
    title: "Cloud Infrastructure Migration Phase II",
    status: { state: "Pending", reference: `ESIG-PRO-${prjId}-01` },
    sections: INITIAL_SECTIONS,
  });

  const [activeSectionId, setActiveSectionId] = useState(INITIAL_SECTIONS[0].id);

  const handleSectionClick = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAutoSave = useCallback(() => {
    console.log("Auto-saving proposal...", new Date().toLocaleTimeString());
    localStorage.setItem(`proposal_${proposal.id}`, JSON.stringify(proposal));
  }, [proposal]);

  useInterval(handleAutoSave, 30000); // Auto-save every 30s

  return (
    <div className="h-screen flex flex-col bg-[#050505] overflow-hidden -m-8">
      {/* Header */}
      <ProposalPageHeader
        proposalId={proposal.id}
        projectId={proposal.projectId}
        clientId={proposal.clientId}
        title={proposal.title}
        status={proposal.status}
        onTitleChange={(title) => dispatch({ type: "UPDATE_TITLE", title })}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <ProposalSectionNav
          sections={proposal.sections}
          activeSectionId={activeSectionId}
          onSectionClick={handleSectionClick}
          onReorder={(sections) => dispatch({ type: "REORDER", sections })}
        />

        {/* Main Editor Canvas */}
        <ProposalEditor
          sections={proposal.sections}
          onSectionContentChange={(id, content) =>
            dispatch({ type: "UPDATE_CONTENT", id, content })
          }
        />
      </div>

      {/* Footer Step Tracker */}
      <ESignatureTracker />
    </div>
  );
}
