import { Button } from "@repo/ui/button";
import { PrismaClient } from "@repo/db/client";
export default function Page() {
  return (
    <div>
      <div className="bg-red-500">Hello</div>
      <Button appName="docs">Open alert</Button>
    </div>
  );
}
