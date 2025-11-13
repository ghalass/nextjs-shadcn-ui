import { CanAccess } from "@/components/CanAccess";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <main>
      <h1>Welcome home page</h1>
      <div className="flex gap-2">
        <CanAccess action="read" resource="sites">
          <Button variant={"default"}>Read un site</Button>
        </CanAccess>

        <CanAccess action="create" resource="sites">
          <Button variant={"default"}>create un site</Button>
        </CanAccess>

        <CanAccess action="delete" resource="sites">
          <Button variant={"default"}>delete un site</Button>
        </CanAccess>

        <CanAccess action="update" resource="sites">
          <Button variant={"default"}>update un site</Button>
        </CanAccess>
      </div>
    </main>
  );
}
