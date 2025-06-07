import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from '@/store/hooks';
import { loginUser, registerUser } from '@/store/slices/authSlice';
import { useToast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'vendor',
    university: 'INES-Ruhengeri',
    studentId: '',
    major: '',
    businessName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await dispatch(loginUser({ 
          email: formData.email, 
          password: formData.password 
        })).unwrap();
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      } else {
        await dispatch(registerUser(formData)).unwrap();
        toast({
          title: "Account created!",
          description: "Welcome to the campus marketplace.",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: isLogin ? "Invalid credentials" : "Registration failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="absolute -bottom-60 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLogin ? "Login" : "Create account"}</DialogTitle>
          <DialogDescription>
            {isLogin ? "Enter your credentials to access your account." : "Create a new account to join our campus marketplace."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {!isLogin && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your name" 
                required 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              required 
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              required 
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </div>

          {!isLogin && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <RadioGroup defaultValue="student" className="flex">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" onClick={() => handleInputChange('role', 'student')} />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vendor" id="vendor" onClick={() => handleInputChange('role', 'vendor')} />
                    <Label htmlFor="vendor">Vendor</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.role === 'student' && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="university">University</Label>
                    <Input 
                      id="university" 
                      placeholder="Enter your university" 
                      required 
                      value={formData.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input 
                      id="studentId" 
                      placeholder="Enter your student ID" 
                      value={formData.studentId}
                      onChange={(e) => handleInputChange('studentId', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="major">Major</Label>
                    <Input 
                      id="major" 
                      placeholder="Enter your major" 
                      value={formData.major}
                      onChange={(e) => handleInputChange('major', e.target.value)}
                    />
                  </div>
                </>
              )}

              {formData.role === 'vendor' && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input 
                      id="businessName" 
                      placeholder="Enter your business name" 
                      required 
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                    />
                  </div>
                </>
              )}
            </>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading ..." : isLogin ? "Login" : "Create Account"}
          </Button>
        </form>
        <div className="text-center mt-4">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Need an account? Create one." : "Already have an account? Login."}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
