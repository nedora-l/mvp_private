'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { directoryApiClient } from "@/lib/services/client/directory/directory.client.service";
import { toast } from "sonner";
import { Eye, EyeOff, RefreshCw, UserPlus } from 'lucide-react';
import zxcvbn from 'zxcvbn';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  username: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

const PasswordStrengthIndicator = ({ password }: { password?: string }) => {
  if (!password) return null;
  const result = zxcvbn(password);
  const score = result.score;

  const strengthLevels = [
    { text: 'Very Weak', color: 'bg-red-500' },
    { text: 'Weak', color: 'bg-orange-500' },
    { text: 'Fair', color: 'bg-yellow-500' },
    { text: 'Good', color: 'bg-blue-500' },
    { text: 'Strong', color: 'bg-green-500' },
  ];

  return (
    <div className="mt-2">
      <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        {strengthLevels.map((_, index) => (
          <div key={index} className="w-1/5">
            {score >= index && <div className={`h-full ${strengthLevels[score].color}`} />}
          </div>
        ))}
      </div>
      <p className={`text-xs mt-1 text-right ${strengthLevels[score].color.replace('bg', 'text')}`}>
        {strengthLevels[score].text}
      </p>
    </div>
  );
};

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

interface RegisterModalProps {
  onRegistrationSuccess: () => void;
}

export function RegisterModal({ onRegistrationSuccess }: RegisterModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    },
  })

  const email = form.watch('email');
  useEffect(() => {
    form.setValue('username', email);
  }, [email, form]);

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    form.setValue("password", newPassword);
    toast({
      title: "Password Generated",
      description: "A new secure password has been generated.",
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await directoryApiClient.addUser(values);
      if (response.status === 201) {
        toast({
          title: "Success",
          description: `User ${values.username} registered successfully!`,
        });
        setIsOpen(false);
        form.reset();
        onRegistrationSuccess();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to register user.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred.",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau collaborateur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create an account</DialogTitle>
          <DialogDescription>
            Fill in the details below to create your new account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Button type="button" variant="link" size="sm" onClick={handleGeneratePassword} className="pr-0 h-auto py-0 text-xs">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Generate
                    </Button>
                  </div>
                  <FormControl>
                    <div className="relative">
                        <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="********" 
                            {...field} 
                            onChange={(e) => {
                                field.onChange(e);
                                setPassword(e.target.value);
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                  </FormControl>
                  <PasswordStrengthIndicator password={password} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create account</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
