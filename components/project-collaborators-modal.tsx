
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

// Define the types for collaborators and project
type Collaborator = {
  name: string;
  allocation: number;
  avatarUrl: string;
};

type Project = {
  name: string;
  collaborators: Collaborator[];
};

interface ProjectCollaboratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export function ProjectCollaboratorsModal({
  isOpen,
  onClose,
  project,
}: ProjectCollaboratorsModalProps) {
  if (!project) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Collaborateurs du Projet</DialogTitle>
          <DialogDescription>
            Liste des collaborateurs pour le projet {project.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Collaborateur</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project.collaborators.map((collaborator, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={collaborator.avatarUrl}
                          alt={collaborator.name}
                        />
                        <AvatarFallback>
                          {collaborator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{collaborator.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {collaborator.allocation}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
