import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { LoginForm } from '@/components/auth/login-form';
import { Plane, Globe, MapPin } from 'lucide-react';

export default function AuthPage() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && user) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand & Visual */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500">
        {/* Animated Bubble Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large floating bubbles */}
          <div 
            className="absolute w-[600px] h-[600px] rounded-full bg-white/10 backdrop-blur-sm"
            style={{
              top: '-15%',
              right: '-10%',
              animation: 'float 20s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute w-[500px] h-[500px] rounded-full bg-white/8"
            style={{
              bottom: '-20%',
              left: '-10%',
              animation: 'float 25s ease-in-out infinite reverse'
            }}
          />
          <div 
            className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-br from-white/15 to-white/5"
            style={{
              top: '40%',
              left: '20%',
              animation: 'float 18s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute w-[200px] h-[200px] rounded-full bg-white/12"
            style={{
              top: '20%',
              right: '25%',
              animation: 'float 22s ease-in-out infinite reverse'
            }}
          />
          <div 
            className="absolute w-[150px] h-[150px] rounded-full bg-gradient-to-br from-teal-400/30 to-emerald-400/20"
            style={{
              bottom: '30%',
              right: '15%',
              animation: 'float 15s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute w-[100px] h-[100px] rounded-full bg-white/10"
            style={{
              top: '60%',
              left: '10%',
              animation: 'float 12s ease-in-out infinite reverse'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Roda Bem Turismo</span>
          </div>

          {/* Hero Text */}
          <div className="max-w-lg">
            <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
              Gestao de viagens simplificada
            </h1>
            <p className="text-lg xl:text-xl text-white/80 leading-relaxed mb-10">
              Gerencie seus clientes, reservas e itinerarios em uma plataforma moderna e intuitiva.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium">
                <Globe className="w-4 h-4" />
                Clientes
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium">
                <MapPin className="w-4 h-4" />
                Reservas
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium">
                <Plane className="w-4 h-4" />
                Viagens
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/60 text-sm">
            Sistema de gestao empresarial
          </p>
        </div>

        {/* CSS Animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0) scale(1); }
            25% { transform: translateY(-20px) translateX(10px) scale(1.02); }
            50% { transform: translateY(-10px) translateX(-15px) scale(0.98); }
            75% { transform: translateY(-25px) translateX(5px) scale(1.01); }
          }
        `}</style>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        {/* Subtle background bubbles for right panel */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/10 to-green-400/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] bg-gradient-to-br from-teal-400/8 to-emerald-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <LoginForm onToggleMode={() => {}} />
        </div>
      </div>
    </div>
  );
}
