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

        {/* Exemple d'utilisation */}
        <CanAccess
          action="read"
          resource="sites"
          fallback={<p>Accès refusé</p>}
        >
          <div>
            <h2>Gestion des articles</h2>
            <p>Vous pouvez lire les articles</p>
          </div>
        </CanAccess>

        <CanAccess
          action="create"
          resource="sites"
          fallback={<p>Pas de droit de création</p>}
        >
          <button>Créer un article</button>
        </CanAccess>

        <CanAccess
          action="manage"
          resource="users"
          fallback={<p>Admin uniquement</p>}
        >
          <div>
            <h2>Gestion des utilisateurs</h2>
            <p>Section réservée aux administrateurs</p>
          </div>
        </CanAccess>
      </div>
    </main>
  );
}
