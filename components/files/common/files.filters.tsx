"use client"
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Filter, Calendar as CalendarIcon, User, Folder, Star, Trash2 } from "lucide-react";

const fileTypes = [
  { id: "pdf", label: "PDFs" },
  { id: "document", label: "Documents" },
  { id: "spreadsheet", label: "Spreadsheets" },
  { id: "presentation", label: "Presentations" },
  { id: "image", label: "Images & Photos" },
  { id: "video", label: "Videos" },
];

const people = [
  { id: "user1", name: "John Doe" },
  { id: "user2", name: "Jane Smith" },
  { id: "user3", name: "Peter Jones" },
];

export function FilesFilters({ dictionary, locale }) {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[350px] sm:w-[450px] p-0">
        <SheetHeader className="p-6">
          <SheetTitle>Advanced Filters</SheetTitle>
        </SheetHeader>
        <div className="p-6 border-t">
          <Accordion type="multiple" defaultValue={["fileType", "lastModified", "people"]} className="w-full">
            <AccordionItem value="fileType">
              <AccordionTrigger className="text-base font-semibold">File type</AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-3">
                  {fileTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox id={`type-${type.id}`} />
                      <Label htmlFor={`type-${type.id}`} className="font-normal">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="people">
              <AccordionTrigger className="text-base font-semibold">People</AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-3">
                  <Input placeholder="Search by name or email..." />
                  {people.map((person) => (
                    <div key={person.id} className="flex items-center space-x-2">
                      <Checkbox id={`person-${person.id}`} />
                      <Label htmlFor={`person-${person.id}`} className="font-normal">
                        {person.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="lastModified">
              <AccordionTrigger className="text-base font-semibold">Last modified</AccordionTrigger>
              <AccordionContent className="pt-4">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? date.toLocaleDateString() : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="location">
              <AccordionTrigger className="text-base font-semibold">Location</AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Folder className="h-5 w-5 text-gray-500" />
                        <span>Anywhere</span>
                    </div>
                    <div className="pl-4 space-y-2">
                        <div className="flex items-center space-x-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <span>Starred</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            <span>Trash</span>
                        </div>
                    </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="p-6 border-t flex justify-end space-x-2">
            <Button variant="ghost">Clear</Button>
            <Button>Apply Filters</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
