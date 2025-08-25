import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the Terms of Service');
      return;
    }
    // 🔥 Actual API call
    const response = await fetch(`http://localhost:8080/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });
    

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    toast.success('Account created successfully! Welcome to TeamSphere!');
    navigate('/login');
  } catch (error) {
    toast.error(error.message || 'Something went wrong. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-bg"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-secondary/30 to-accent-cyan/30 rounded-full blur-3xl float"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-accent-pink/30 to-primary/30 rounded-full blur-3xl float" style={{ animationDelay: '-3s' }}></div>

      <div className="relative w-full max-w-md mx-auto p-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center pulse-glow">
              <span className="text-white font-bold text-lg">TS</span>
            </div>
            <span className="gradient-text font-poppins font-bold text-2xl">
              TeamSphere
            </span>
          </Link>
        </div>

        {/* Register Card */}
        <div className="glass-card p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-poppins font-bold text-gray-900">
              Create your account
            </h1>
            <p className="text-gray-600">
              Join thousands of teams already using TeamSphere
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div className="input-with-icon">
              <User className="icon" size={20} />
              <Input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
                aria-label="Full name"
              />
            </div>

            {/* Email Field */}
            <div className="input-with-icon">
              <Mail className="icon" size={20} />
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                aria-label="Email address"
              />
            </div>

            {/* Password Field */}
            <div className="input-with-icon">
              <Lock className="icon" size={20} />
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                required
                aria-label="Password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="input-with-icon">
              <Lock className="icon" size={20} />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                aria-label="Confirm password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Requirements */}
            {/* <div className="text-sm text-gray-600 space-y-1">
              <p>Password must contain:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                  One uppercase letter
                </li>
                <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                  One number
                </li>
              </ul>
            </div> */}

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                }
                className="mt-1"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:text-primary-dark transition-colors">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary hover:text-primary-dark transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gradient-secondary text-lg py-3"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Social Login */}
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div> */}

          {/* <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full py-3">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full py-3">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div> */}

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:text-primary-dark font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;