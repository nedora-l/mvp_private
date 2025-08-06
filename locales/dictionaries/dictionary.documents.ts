export interface DictionaryDocuments {
    overview: string;
    versions: string;
    commentsLabel: string;
    chatLabel: string;
    derivatives: string;
    title: string;
    documentCenter: string;
    allFiles: string;
    recentFiles: string;
    sharedFiles: string;
    starredFiles: string;
    upload: string;
    newFolder: string;
    newFile: string;
    filter: string;
    filters: string;
    category: string;
    categories: string;
    type: string;
    types: string;
    folder: string;
    folders: string;
    file: string;
    files: string;
    updated: string;
    modified: string;
    selected: string;
    selectAll: string;
    deselectAll: string;
    
    // File properties
    size: string;
    owner: string;
    uploaded: string;
    noFileSelected: string;
    previewUnavailable: string;
    noPreviewAvailable: string;
    
    search: {
        placeholder: string;
    };
    
    datatable : {
        folder: string;
        name: string;
        type: string;
        size: string;
        modified: string;
        actions: string;
        author: string;
    };
    
    actions: {
        download: string;
        select: string;
        share: string;
        edit: string;
        delete: string;
        rename: string;
        move: string;
        details: string;
    };
    
    shared: {
        noSharedFiles: string;
        shareButton: string;
        title: string;
        description: string;
        sharedWithMe: string;
        sharedByMe: string;
        sharedLink: string;
        shareLink: string;
        shareWith: string;
        unshareButton: string;
    };
    
    // Comments functionality
    comments: {
        title: string;
        addPlaceholder: string;
        empty: string;
        emptyHint: string;
        replyPlaceholder: string;
    };
    
    // Chat functionality
    chat: {
        title: string;
        analyzing: string;
        confidence: string;
        thinking: string;
        placeholder: string;
        summarize: string;
        questions: string;
        insights: string;
    };
    
    // Access and Sharing functionality
    accessSharing: {
        title: string;
        description: string;
        shareDocument: string;
        shareWith: string;
        shareDescription: string;
        globalAccess: string;
        individualUsers: string;
        departmentAccess: string;
        teamAccess: string;
    };
    
    // Important Notes functionality
    notes: {
        title: string;
        description: string;
        addNote: string;
        addNewNote: string;
        addDescription: string;
        pinnedNotes: string;
        allNotes: string;
        noNotes: string;
        noNotesDescription: string;
        types: {
            leader: string;
            aiAgent: string;
            system: string;
            user: string;
        };
    };
    
    // Folder operations
    no_folders: string;
    deleteFolder: string;
    deleteFolderConfirmation: string;
    delete: string;
    downloadFolder: string;
    downloadConfirmation: string;
    download: string;
    moveFolder: string;
    move: string;
    renameFolder: string;
    newFolderName: string;
    rename: string;
    shareFolder: string;
    share: string;
}