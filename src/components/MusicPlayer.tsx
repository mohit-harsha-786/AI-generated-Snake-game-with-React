import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Genesis (AI Generated)",
    artist: "CyberMinds",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Digital Horizon (AI Generated)",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Quantum Drift (AI Generated)",
    artist: "Neural Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-fuchsia-500/30 rounded-2xl p-6 w-full max-w-md mx-auto neon-border-fuchsia">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
      />
      
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-fuchsia-600 to-cyan-600 mb-4 flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.5)] animate-[spin_10s_linear_infinite]" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
          <div className="w-8 h-8 rounded-full bg-gray-900"></div>
        </div>
        <h3 className="text-xl font-bold text-white neon-text-fuchsia text-center">{currentTrack.title}</h3>
        <p className="text-cyan-400 font-mono text-sm mt-1">{currentTrack.artist}</p>
      </div>

      <div className="flex items-center justify-center gap-6 mb-6">
        <button 
          onClick={prevTrack}
          className="p-2 text-gray-400 hover:text-white hover:neon-text-cyan transition-all"
        >
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-14 h-14 flex items-center justify-center bg-fuchsia-600 text-white rounded-full hover:bg-fuchsia-500 hover:shadow-[0_0_15px_rgba(217,70,239,0.8)] transition-all"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>
        
        <button 
          onClick={nextTrack}
          className="p-2 text-gray-400 hover:text-white hover:neon-text-cyan transition-all"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <div className="flex items-center gap-3 text-gray-400">
        <Volume2 size={18} />
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
        />
      </div>
    </div>
  );
}
