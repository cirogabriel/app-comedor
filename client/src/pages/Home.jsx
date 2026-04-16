import { useNavigate } from 'react-router-dom';
import { User, Lock, UtensilsCrossed } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center space-y-12 max-w-2xl w-full">

          {/* Logo */}
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center">
                <UtensilsCrossed className="h-7 w-7 text-[#1a1a1a]" strokeWidth={1.5} />
              </div>
            </div>

            <div className="space-y-4">
              <h1
                className="text-7xl font-light text-[#1a1a1a] tracking-tight leading-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                comedor
              </h1>
              <p className="text-[10px] tracking-[0.25em] text-[#888] uppercase font-medium">
                Sistema de Reservas Universitario
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#888] font-light leading-relaxed">
            Plataforma para gestionar reservas en el comedor de la comunidad universitaria
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 w-full max-w-xs mx-auto">
            <button
              onClick={() => navigate('/estudiante')}
              className="flex items-center justify-between w-full px-6 py-4 border border-[#1a1a1a] bg-[#1a1a1a] text-white hover:bg-transparent hover:text-[#1a1a1a] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <User className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
                <span className="font-medium text-sm tracking-widest uppercase">Estudiante</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
            </button>

            <button
              onClick={() => navigate('/admin')}
              className="flex items-center justify-between w-full px-6 py-4 border border-[#1a1a1a] bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <Lock className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
                <span className="font-medium text-sm tracking-widest uppercase">Administrador</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
            </button>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#ddd] py-8">
        <p className="text-center text-[10px] tracking-[0.2em] text-[#aaa] uppercase">
          Comedor Universitario © 2024
        </p>
      </div>
    </div>
  );
};

export default Home;