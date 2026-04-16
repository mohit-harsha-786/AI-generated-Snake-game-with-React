import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans relative overflow-hidden flex flex-col">
      {/* Background ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      <header className="w-full p-6 text-center z-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase neon-text-cyan">
          Neon <span className="text-fuchsia-400 neon-text-fuchsia">Beats</span>
        </h1>
        <p className="text-gray-400 font-mono mt-2 text-sm tracking-widest">SYNTHWAVE SNAKE EDITION</p>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 z-10">
        <div className="w-full max-w-lg order-2 lg:order-1">
          <SnakeGame />
        </div>
        
        <div className="w-full max-w-md order-1 lg:order-2">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
