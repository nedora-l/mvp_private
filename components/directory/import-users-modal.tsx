"use client"

import { useState, useCallback, useEffect, useRef } from "react";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, File, X, Play, Pause, CheckCircle, XCircle, Clock } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { directoryApiClient } from "@/lib/services/client/directory/directory.client.service";

// Type for raw file data with dynamic properties
type FileRowData = {
  [key: string]: any;
};

type ImportUser = {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  username: string;
  isCreated: boolean;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
  generatedAt: Date;
};

type UserRegistrationDto = {
  email: string;
  password: string;
  confirmPassword?: string;
  username: string;
  role?: string;
  locale?: string;
  firstName: string;
  lastName: string;
  title?: string;
  profilePictureUrl?: string;
  phone?: string;
  address?: string;
  roles?: string[];
  timeZone?: string;
  departmentId?: number;
  teamId?: number;
  countryId?: number;
  cityId?: number;
}

const registrationLabels:UserRegistrationDto = {
  username: "Username",
  email: "Email",
  password: "Password",
  locale: "Locale",
  firstName: "First Name",
  lastName: "Last Name",
  title: "Title",
  profilePictureUrl: "Profile Picture URL",
  phone: "Phone",
  address: "Address",
}

// Password generation function
const generateRandomPassword = (length = 12) => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}\\|;:'\",.<>/?";
  
  const allChars = upper + lower + numbers + symbols;
  
  let password = '';
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

export function ImportUsersModal() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FileRowData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<{ [key: string]: string }>({});

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const reset = () => {
    setStep(1);
    setData([]);
    setHeaders([]);
    setMapping({});
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1SelectFile setStep={setStep} setData={setData} setHeaders={setHeaders} />;
      case 2:
        return <Step2MapColumns headers={headers} data={data} handleBack={handleBack} handleNext={handleNext} mapping={mapping} setMapping={setMapping} />;
      case 3:
        return <Step3PreviewAndImport data={data} headers={headers} mapping={mapping} handleBack={handleBack} reset={reset} />;
      default:
        return <Step1SelectFile setStep={setStep} setData={setData} setHeaders={setHeaders} />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import Users
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[95vw] lg:max-w-[1200px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Import Users</DialogTitle>
          <DialogDescription>
            Follow the steps to import users from a file.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const Step1SelectFile = ({ setStep, setData, setHeaders }: { setStep: (step: number) => void, setData: (data: UserRegistrationDto[]) => void, setHeaders: (headers: string[]) => void }) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.oasis.opendocument.spreadsheet'];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a CSV, XLS, XLSX, or ODS file.",
        });
      }
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  const handleFileParse = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const binaryStr = e.target?.result;
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length > 0) {
            const fileHeaders = jsonData[0] as string[];
            const fileData = jsonData.slice(1).map((row: any) => {
              const rowData: FileRowData = {};
              fileHeaders.forEach((header, index) => {
                rowData[header] = row[index] || '';
              });
              return rowData;
            });
            setHeaders(fileHeaders);
            setData(fileData);
            setStep(2);
          } else {
             toast({
                variant: "destructive",
                title: "Empty File",
                description: "The selected file is empty or has no headers.",
              });
          }
        } catch (error) {
           toast({
            variant: "destructive",
            title: "File Parsing Error",
            description: "There was an error parsing the file. Please check the file format.",
          });
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Step 1: Select File</h3>
      <div {...getRootProps()} className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
        <input {...getInputProps()} accept=".csv, .xls, .xlsx, .ods" />
        <div className="flex flex-col items-center justify-center">
            <Upload className="w-12 h-12 text-gray-400" />
            {isDragActive ? (
              <p className="mt-2 text-blue-600">Drop the file here ...</p>
            ) : (
              <p className="mt-2 text-gray-500">Drag & drop a file here, or click to select a file</p>
            )}
            <p className="text-xs text-gray-400 mt-1">Supported formats: CSV, XLS, XLSX, ODS</p>
        </div>
      </div>
      {file && (
        <div className="mt-4 flex items-center justify-between p-2 bg-gray-100 rounded-md">
            <div className="flex items-center gap-2">
                <File className="h-5 w-5 text-gray-600"/>
                <span className="text-sm font-medium">{file.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                <X className="h-4 w-4" />
            </Button>
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleFileParse} disabled={!file}>
          Next
        </Button>
      </div>
    </div>
  );
};

const Step2MapColumns = ({ headers, data, handleBack, handleNext, mapping, setMapping }: { 
  headers: string[], 
  data: FileRowData[], 
  handleBack: () => void, 
  handleNext: () => void,
  mapping: { [key: string]: string },
  setMapping: (mapping: { [key: string]: string }) => void
}) => {
    const handleMappingChange = (field: string, value: string) => {
        setMapping({ ...mapping, [field]: value });
    };

    // Check if all required fields are mapped from UserRegistrationDto
    const requiredFields = ['firstName', 'lastName', 'email'];
    const dtoFields = Object.keys(registrationLabels as UserRegistrationDto) as (keyof UserRegistrationDto)[];

    const isMappingComplete = requiredFields.every(field => mapping[field]);

    return (
        <div>
        <h3 className="text-lg font-medium">Step 2: Map Columns</h3>
        <p className="text-sm text-muted-foreground">
            Match your file columns to the required user fields.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {dtoFields.map(field => (
            <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <Select onValueChange={(value) => handleMappingChange(field, value)} value={mapping[field]}>
                <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                    {headers.map(header => (
                    <SelectItem key={header} value={header}>{header}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            ))}
        </div>
        <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>Back</Button>
            <Button onClick={handleNext} disabled={!isMappingComplete}>Next</Button>
        </div>
        </div>
    );
};

const Step3PreviewAndImport = ({ 
  data, 
  headers, 
  mapping, 
  handleBack, 
  reset 
}: { 
  data: FileRowData[], 
  headers: string[], 
  mapping: { [key: string]: string },
  handleBack: () => void, 
  reset: () => void 
}) => {
  const [importUsers, setImportUsers] = useState<ImportUser[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize import users on component mount
  useEffect(() => {
    const users: ImportUser[] = data.map((row: FileRowData) => ({
      lastName: (mapping.lastName && row[mapping.lastName]) ? String(row[mapping.lastName]) : '',
      firstName: (mapping.firstName && row[mapping.firstName]) ? String(row[mapping.firstName]) : '',
      email: (mapping.email && row[mapping.email]) ? String(row[mapping.email]) : '',
      password: generateRandomPassword(),
      username: (mapping.email && row[mapping.email]) ? String(row[mapping.email]) : '',
      isCreated: false,
      status: 'pending',
      generatedAt: new Date()
    }));
    setImportUsers(users);
  }, [data, mapping]);

  const importUser = async (user: ImportUser, index: number) => {
    // Update status to processing
    setImportUsers(prev => prev.map((u, i) => 
      i === index ? { ...u, status: 'processing' } : u
    ));

    try {
      const userRegistrationData: UserRegistrationDto = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        password: user.password,
        confirmPassword: user.password,
      };

      const response = await directoryApiClient.addUser(userRegistrationData);
      
      if (response.status === 201) {
        // Update status to success
        setImportUsers(prev => prev.map((u, i) => 
          i === index ? { ...u, status: 'success', isCreated: true } : u
        ));
      } else {
        // Update status to error
        setImportUsers(prev => prev.map((u, i) => 
          i === index ? { ...u, status: 'error', error: response.message || 'Failed to create user' } : u
        ));
      }
    } catch (error: any) {
      // Update status to error
      setImportUsers(prev => prev.map((u, i) => 
        i === index ? { ...u, status: 'error', error: error.message || 'An unexpected error occurred' } : u
      ));
    }
  };

  const startImport = () => {
    setIsImporting(true);
    setIsPaused(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex;
        
        if (nextIndex >= importUsers.length) {
          // Import complete
          setIsImporting(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          toast({
            title: "Import Complete",
            description: `Successfully processed ${importUsers.length} users.`,
          });
          return nextIndex;
        }

        const currentUser = importUsers[nextIndex];
        if (currentUser && currentUser.status === 'pending') {
          importUser(currentUser, nextIndex);
        }

        return nextIndex + 1;
      });
    }, 1000); // Import one user per second
  };

  const pauseImport = () => {
    setIsPaused(true);
    setIsImporting(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Created</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const successCount = importUsers.filter(u => u.status === 'success').length;
  const errorCount = importUsers.filter(u => u.status === 'error').length;
  const pendingCount = importUsers.filter(u => u.status === 'pending').length;

  return (
    <div>
      <h3 className="text-lg font-medium">Step 3: Preview and Import</h3>
      <p className="text-sm text-muted-foreground">
        Review the data and start the import process.
      </p>
      
      {/* Progress Summary */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl md:text-2xl font-bold text-blue-600">{importUsers.length}</div>
          <div className="text-xs md:text-sm text-gray-500">Total</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl md:text-2xl font-bold text-green-600">{successCount}</div>
          <div className="text-xs md:text-sm text-gray-500">Created</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-xl md:text-2xl font-bold text-red-600">{errorCount}</div>
          <div className="text-xs md:text-sm text-gray-500">Errors</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-xl md:text-2xl font-bold text-gray-600">{pendingCount}</div>
          <div className="text-xs md:text-sm text-gray-500">Pending</div>
        </div>
      </div>

      {/* Import Controls */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        {!isImporting && !isPaused && (
          <Button onClick={startImport} disabled={importUsers.length === 0} className="w-full sm:w-auto">
            <Play className="h-4 w-4 mr-2" />
            Start Import
          </Button>
        )}
        {isImporting && (
          <Button onClick={pauseImport} variant="outline" className="w-full sm:w-auto">
            <Pause className="h-4 w-4 mr-2" />
            Pause Import
          </Button>
        )}
        {isPaused && (
          <Button onClick={startImport} className="w-full sm:w-auto">
            <Play className="h-4 w-4 mr-2" />
            Resume Import
          </Button>
        )}
      </div>

      {/* Data Table */}
      <div className="mt-6 border rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="min-w-[120px]">Status</TableHead>
                <TableHead className="min-w-[100px]">Last Name</TableHead>
                <TableHead className="min-w-[100px]">First Name</TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead className="min-w-[120px] hidden md:table-cell">Password</TableHead>
                <TableHead className="min-w-[80px]">Created</TableHead>
                <TableHead className="min-w-[120px] hidden lg:table-cell">Generated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {importUsers.map((user, index) => (
                <TableRow key={index} className={index === currentIndex && isImporting ? 'bg-blue-50' : ''}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.status)}
                        {getStatusBadge(user.status)}
                      </div>
                      {user.error && (
                        <div className="text-xs text-red-500 max-w-[150px] truncate" title={user.error}>
                          {user.error}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{user.lastName}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={user.email}>{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <code className="text-xs bg-gray-100 px-1 py-0.5 rounded block max-w-[100px] truncate" title={user.password}>
                      {user.password}
                    </code>
                  </TableCell>
                  <TableCell>
                    {user.isCreated ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-gray-300" />
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 hidden lg:table-cell">
                    {user.generatedAt.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-2">
        <Button variant="outline" onClick={handleBack} disabled={isImporting} className="w-full sm:w-auto">
          Back
        </Button>
        <Button onClick={reset} disabled={isImporting} className="w-full sm:w-auto">
          Start Over
        </Button>
      </div>
    </div>
  );
};
