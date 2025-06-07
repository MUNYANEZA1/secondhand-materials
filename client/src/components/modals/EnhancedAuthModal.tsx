import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, GraduationCap, Building, MapPin, Phone, Camera, ChevronLeft, Check } from 'lucide-react';

const EnhancedAuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [registrationStep, setRegistrationStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    university: 'INES-Ruhengeri',
    studentId: '',
    major: '',
    graduationYear: new Date().getFullYear() + 4,
    businessName: '',
    businessType: 'individual',
    businessLicense: '',
    location: '',
    contactNumber: '',
    bio: '',
  });

  const universities = [
    'INES-Ruhengeri',
    'University of Rwanda',
    'Kigali Independent University',
    'Mount Kenya University',
    'Other'
  ];

  const majors = [
    'Computer Science',
    'Information Technology',
    'Software Engineering',
    'Business Administration',
    'Engineering',
    'Medicine',
    'Law',
    'Education',
    'Other'
  ];

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    if (isLogin) {
      // Simulate login
      setTimeout(() => {
        setLoading(false);
        alert('Login successful!');
        onClose();
        resetForm();
      }, 1500);
    } else {
      if (registrationStep === 1) {
        if (!formData.name || !formData.email || !formData.password) {
          setError('Please fill all required fields');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        setError('');
        setTimeout(() => {
          setRegistrationStep(2);
          setLoading(false);
        }, 800);
      } else if (registrationStep === 2) {
        if (formData.role === 'student' && !formData.studentId) {
          setError('Student ID is required');
          setLoading(false);
          return;
        }
        if (formData.role === 'vendor' && !formData.businessName) {
          setError('Business name is required');
          setLoading(false);
          return;
        }
        setError('');
        setTimeout(() => {
          setRegistrationStep(3);
          setLoading(false);
        }, 800);
      } else {
        setTimeout(() => {
          setLoading(false);
          alert('Registration successful!');
          onClose();
          resetForm();
        }, 1500);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      university: 'INES-Ruhengeri',
      studentId: '',
      major: '',
      graduationYear: new Date().getFullYear() + 4,
      businessName: '',
      businessType: 'individual',
      businessLicense: '',
      location: '',
      contactNumber: '',
      bio: '',
    });
    setAvatarFile(null);
    setAvatarPreview('');
    setRegistrationStep(1);
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    resetForm();
  };

  const goBack = () => {
    if (registrationStep > 1) {
      setRegistrationStep(registrationStep - 1);
    }
  };

  if (!isOpen) return null;

  const renderStep1 = () => (
    <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
      {/* Avatar Upload */}
      <div className="flex justify-center">
        <div className="relative group">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-blue-500 p-1 shadow-lg">
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center">
                  {formData.name ? (
                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      {formData.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <Camera className="h-8 w-8 text-gray-400" />
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
            onClick={() => document.getElementById('avatar-upload')?.click()}
          >
            <Camera className="h-4 w-4 text-emerald-600" />
          </button>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
      {/* Role Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700">I am a:</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'student', icon: GraduationCap, label: 'Student' },
            { value: 'vendor', icon: Building, label: 'Vendor' }
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormData({...formData, role: value})}
              className={`relative p-4 border-2 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                formData.role === value
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon className={`h-6 w-6 ${
                  formData.role === value ? 'text-emerald-600' : 'text-gray-500'
                }`} />
                <span className={`text-sm font-medium ${
                  formData.role === value ? 'text-emerald-700' : 'text-gray-700'
                }`}>
                  {label}
                </span>
              </div>
              {formData.role === value && (
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* University Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">University</label>
        <select
          value={formData.university}
          onChange={(e) => setFormData({...formData, university: e.target.value})}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
        >
          {universities.map(uni => (
            <option key={uni} value={uni}>{uni}</option>
          ))}
        </select>
      </div>

      {/* Role-specific fields */}
      {formData.role === 'student' ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Student ID</label>
            <input
              name="studentId"
              placeholder="e.g., INES2023001"
              value={formData.studentId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Major</label>
            <select
              value={formData.major}
              onChange={(e) => setFormData({...formData, major: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
            >
              <option value="">Select your major</option>
              {majors.map(major => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Business Name</label>
            <input
              name="businessName"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
              required
            />
          </div>
          
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Business Type</label>
            <div className="flex space-x-4">
              {[
                { value: 'individual', label: 'Individual' },
                { value: 'company', label: 'Company' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({...formData, businessType: value})}
                  className={`flex-1 py-2 px-4 border-2 rounded-lg transition-all duration-200 ${
                    formData.businessType === value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5 animate-in slide-in-from-right-5 duration-500">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Location</label>
        <div className="relative group">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            name="location"
            placeholder="e.g., Musanze, Rwanda"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Contact Number</label>
        <div className="relative group">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            name="contactNumber"
            placeholder="+250 7XX XXX XXX"
            value={formData.contactNumber}
            onChange={handleInputChange}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Bio (Optional)</label>
        <textarea
          name="bio"
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white resize-none"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed -bottom-[420px] inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div 
        className="w-[100%] max-w-md max-h-[80vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-5 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10"></div>
          
          {/* Close Button */}
          <button
            className="absolute right-4 top-4 h-8 w-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 z-10 hover:scale-110"
            onClick={onClose}
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
          
          {/* Header */}
          <div className="relative px-6 pt-8 pb-6 text-center">
            <div className="mb-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back' : 
                 registrationStep === 1 ? 'Create Account' :
                 registrationStep === 2 ? 'Tell Us About You' :
                 'Final Details'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {isLogin 
                  ? 'Sign in to your GreenLoop account' 
                  : 'Join the INES community marketplace'
                }
              </p>
            </div>
            
            {/* Progress Bar */}
            {!isLogin && (
              <div className="flex justify-center space-x-2 mt-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="relative">
                    <div
                      className={`h-2 w-12 rounded-full transition-all duration-500 ${
                        step < registrationStep 
                          ? 'bg-gradient-to-r from-emerald-500 to-blue-500' 
                          : step === registrationStep
                          ? 'bg-gradient-to-r from-emerald-400 to-blue-400'
                          : 'bg-gray-200'
                      }`}
                    />
                    {step < registrationStep && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white animate-in zoom-in duration-300" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="px-6 pb-6">
            <div className="space-y-6">
              {isLogin ? (
                <div className="space-y-5 animate-in fade-in duration-500">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {registrationStep === 1 && renderStep1()}
                  {registrationStep === 2 && renderStep2()}
                  {registrationStep === 3 && renderStep3()}
                </>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl animate-in slide-in-from-top-2 duration-300">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                {!isLogin && registrationStep > 1 && (
                  <button 
                    type="button" 
                    onClick={goBack}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                )}
                
                <button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Please wait...</span>
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 
                    registrationStep === 3 ? 'Create Account' : 'Continue'
                  )}
                </button>
              </div>
            </div>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-blue-700 transition-all duration-200"
                onClick={toggleMode}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>

            {/* Demo Credentials */}
            {isLogin && (
              <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-xl border border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2 text-center">Demo Credentials</p>
                <div className="text-xs space-y-1 font-mono">
                  <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                    <span className="text-gray-600">Student:</span>
                    <span className="text-gray-800">demo@ines.ac.rw / demo123</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                    <span className="text-gray-600">Vendor:</span>
                    <span className="text-gray-800">vendor@example.com / demo123</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                    <span className="text-gray-600">Admin:</span>
                    <span className="text-gray-800">admin@ines.ac.rw / demo123</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuthModal;