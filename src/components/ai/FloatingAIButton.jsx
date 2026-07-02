import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles } from '../ui/icons';

export default function FloatingAIButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/patient/assistant') return null;

  return (
    <button
      onClick={() => navigate('/patient/assistant')}
      aria-label="Open AI Medical Assistant"
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-pine-600 text-white pl-4 pr-5 py-3.5 shadow-lift hover:bg-pine-700 transition-all hover:-translate-y-0.5 animate-fadeUp"
    >
      <Sparkles size={18} />
      <span className="text-sm font-semibold">Ask AI Assistant</span>
    </button>
  );
}
