"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, FolderPlus, Upload } from 'lucide-react';

export function FilesHeader({ dictionary, locale }) {
    return (
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Files</h1>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="lg" className="flex items-center space-x-2">
                            <Plus className="h-5 w-5" />
                            <span>New</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem>
                            <FolderPlus className="mr-3 h-5 w-5" />
                            <span>New Folder</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Upload className="mr-3 h-5 w-5" />
                            <span>File Upload</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Upload className="mr-3 h-5 w-5" />
                            <span>Folder Upload</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
