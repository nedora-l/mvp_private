"use client"

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Star, Trash2, Edit, Share, Download, Folder, File } from 'lucide-react';
import { FilesFilters } from './files.filters';

const mockFiles = [
    { id: '1', type: 'folder', name: 'Project Alpha', owner: 'You', lastModified: 'May 15, 2025', size: '2.3 GB' },
    { id: '2', type: 'file', name: 'Q2 Financials.pdf', owner: 'Jane Smith', lastModified: 'May 12, 2025', size: '5.1 MB' },
    { id: '3', type: 'file', name: 'Marketing Campaign.pptx', owner: 'You', lastModified: 'May 10, 2025', size: '12.8 MB' },
    { id: '4', type: 'folder', name: 'Client Onboarding', owner: 'Peter Jones', lastModified: 'May 8, 2025', size: '500 MB' },
    { id: '5', type: 'file', name: 'Website Redesign Mockup.fig', owner: 'You', lastModified: 'May 5, 2025', size: '34 MB' },
];

const FileIcon = ({ type }) => {
    if (type === 'folder') {
        return <Folder className="h-6 w-6 text-blue-500" />;
    }
    return <File className="h-6 w-6 text-gray-500" />;
};

export function FilesList({ dictionary, locale }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFiles = mockFiles.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex-1 max-w-md">
                    <Input
                        placeholder="Search files & folders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-10"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <FilesFilters dictionary={dictionary} locale={locale} />
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 font-semibold text-sm text-gray-600 dark:text-gray-300">
                    <div className="col-span-5">Name</div>
                    <div className="col-span-2">Owner</div>
                    <div className="col-span-2">Last Modified</div>
                    <div className="col-span-2">File Size</div>
                    <div className="col-span-1"></div>
                </div>

                {filteredFiles.map(file => (
                    <div key={file.id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                        <div className="col-span-5 flex items-center space-x-3">
                            <FileIcon type={file.type} />
                            <span className="font-medium text-gray-800 dark:text-gray-100">{file.name}</span>
                        </div>
                        <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">{file.owner}</div>
                        <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">{file.lastModified}</div>
                        <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">{file.size}</div>
                        <div className="col-span-1 flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Download</DropdownMenuItem>
                                    <DropdownMenuItem><Share className="mr-2 h-4 w-4" /> Share</DropdownMenuItem>
                                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Rename</DropdownMenuItem>
                                    <DropdownMenuItem><Star className="mr-2 h-4 w-4" /> Add to starred</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
