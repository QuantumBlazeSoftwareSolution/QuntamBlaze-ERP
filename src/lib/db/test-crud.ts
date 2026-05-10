import { projectsCrud } from "./crud/projects";

async function testCrud() {
  const id = "PRJ-GOOG-26-001";
  console.log("Testing getById for:", id);
  try {
    const data = await projectsCrud.getById(id);
    console.log("Data received:", !!data);
    if (data) {
      console.log("Project Name:", data.name);
      console.log("Client:", data.client?.name);
      console.log("Milestones count:", data.milestones?.length);
      console.log("Team count:", data.team?.length);
    }
  } catch (err) {
    console.error("Error in getById:", err);
  }
}

testCrud().catch(console.error);
