import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';

const loginImg = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await login(username, password);
    setIsSubmitting(false);

    if (result.success) {
      if (result.isFirstLogin) {
        navigate('/first-reset');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-inter">
      {/* Left Pane - Image & Info (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-900">
        <img
          src={loginImg}
          alt="Student Studying"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/40 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 text-white w-full">
          <div>
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <span className="text-primary-600 font-black text-2xl">C</span>
              </div>
              <span className="text-3xl font-black tracking-tighter whitespace-nowrap">Ceylon Scholars</span>
            </Link>
          </div>
          
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold mb-8">
              <ShieldCheck className="w-5 h-5 text-primary-300" />
              Secure Portal Access
            </div>
            <h1 className="text-6xl font-black leading-tight mb-8">
              Welcome Back to <br />
              <span className="text-primary-400">Excellence.</span>
            </h1>
            <p className="text-xl text-primary-100/80 leading-relaxed font-medium">
              Access your personalized learning dashboard, manage classes, and track your academic progress all in one place.
            </p>
          </div>
          
          <div className="flex items-center gap-8 border-t border-white/10 pt-12">
            <div>
              <div className="text-4xl font-black text-white">100%</div>
              <div className="text-primary-200/60 font-medium uppercase tracking-widest text-xs mt-1">Secure</div>
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div>
              <div className="text-4xl font-black text-white">24/7</div>
              <div className="text-primary-200/60 font-medium uppercase tracking-widest text-xs mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 lg:px-24">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-12 flex justify-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-primary-200 shadow-2xl">
                <span className="text-white font-black text-2xl">C</span>
              </div>
              <span className="text-3xl font-black text-gray-900 tracking-tighter whitespace-nowrap">Ceylon Scholars</span>
            </Link>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Sign In</h2>
            <p className="text-lg text-gray-500 font-medium">Please enter your details to access your account.</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Username/Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-4 uppercase tracking-widest">Username or Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary-600 transition-colors">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-14 pr-6 py-5 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-lg font-medium placeholder:text-gray-400"
                    placeholder="e.g. janesmith / jane@example.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-4 mr-4">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-sm font-black text-primary-600 hover:text-primary-700 transition-colors underline underline-offset-4 decoration-primary-200 decoration-2">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary-600 transition-colors">
                    <Lock className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-14 pr-14 py-5 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-lg font-medium placeholder:text-gray-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-6 bg-primary-600 text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-primary-200 hover:bg-primary-700 hover:scale-[1.02] transform transition-all active:scale-[0.98] ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
