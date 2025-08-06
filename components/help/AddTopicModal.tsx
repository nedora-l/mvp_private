"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smile, Building, Shield, Users2, Wrench, GraduationCap, Plus, HelpCircle, Settings, Book, Phone, Mail } from 'lucide-react';

interface AddTopicModalProps {
  onAddTopic: (topic: {
    slug: string;
    title: string;
    description: string;
    icon: any;
  }) => void;
}

export const availableIcons = [
  { name: 'default-icon', icon: Smile, label: 'Getting Started' },
  { name: 'Smile', icon: Smile, label: 'Getting Started' },
  { name: 'Building', icon: Building, label: 'Company' },
  { name: 'Shield', icon: Shield, label: 'Security' },
  { name: 'Users2', icon: Users2, label: 'Teams' },
  { name: 'Wrench', icon: Wrench, label: 'Tools' },
  { name: 'GraduationCap', icon: GraduationCap, label: 'Learning' },
  { name: 'HelpCircle', icon: HelpCircle, label: 'Support' },
  { name: 'Settings', icon: Settings, label: 'Settings' },
  { name: 'Book', icon: Book, label: 'Documentation' },
  { name: 'Phone', icon: Phone, label: 'Contact' },
  { name: 'Mail', icon: Mail, label: 'Communication' },
];

const AddTopicModal = ({ onAddTopic }: AddTopicModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate form
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    
    if (!formData.icon) {
      newErrors.icon = 'Veuillez sélectionner une icône';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedIcon = availableIcons.find(icon => icon.name === formData.icon);
    if (!selectedIcon) return;

    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newTopic = {
      slug,
      title: formData.title.trim(),
      description: formData.description.trim(),
      icon: selectedIcon.icon,
    };

    onAddTopic(newTopic);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      icon: '',
    });
    setErrors({});
    
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
    });
    setErrors({});
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une catégorie
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Support Technique"
              required
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Une brève description de cette catégorie"
              rows={3}
              required
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icône</Label>
            <Select value={formData.icon} onValueChange={(value) => handleInputChange('icon', value)}>
              <SelectTrigger className={errors.icon ? "border-red-500" : ""}>
                <SelectValue placeholder="Sélectionner une icône" />
              </SelectTrigger>
              <SelectContent>
                {availableIcons.map((iconItem) => {
                  const IconComponent = iconItem.icon;
                  return (
                    <SelectItem key={iconItem.name} value={iconItem.name}>
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4" />
                        <span>{iconItem.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.icon && (
              <p className="text-sm text-red-500">{errors.icon}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTopicModal;
