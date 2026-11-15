import { handleLead } from "@/lib/lead-server";

export async function POST(request: Request) {
  return handleLead(request);
}
