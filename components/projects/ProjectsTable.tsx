import React from "react";
import { useProjects } from "@/contexts/projects-context";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";

export default function ProjectsTable() {
  const { projects, deleteProject } = useProjects();
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const handleDelete = (index: number) => {
    deleteProject(index);
  };

  const handleView = (id: number) => {
    setSelectedId(id);
    // Afficher un modal ou une card détaillée (à ajouter)
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Liste des Projets</CardTitle>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Nouveau Projet
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow key={project.id ?? index}>
                <TableCell className="font-medium">{project.id ?? index + 1}</TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.type}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell className="text-center space-x-1">
                  <Button variant="ghost" size="icon" aria-label="Voir le projet" onClick={() => handleView(project.id ?? index)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Modifier le projet">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Supprimer le projet" className="text-destructive hover:text-destructive" onClick={() => handleDelete(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <CardDescription>
          Total de {projects.length} projets.
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
