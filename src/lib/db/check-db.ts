import { db } from "./index";
import { projects } from "./schema";

async function checkDb() {
  console.log("Checking projects in DB...");
  const allProjects = await db.select().from(projects);
  console.log("Total projects:", allProjects.length);
  console.log("Project IDs:", allProjects.map(p => p.id));
  
  const target = allProjects.find(p => p.id === "PRJ-GOOG-26-001");
  console.log("Target project found:", !!target);
  if (target) console.log("Target details:", target);
}

checkDb().catch(console.error);
