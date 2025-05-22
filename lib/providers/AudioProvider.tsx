"use client";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";

interface AudioContextType {
  player: React.RefObject<HTMLAudioElement | null>;
  currentTimestamp: number;
  isPlayingThis: (audio: string) => boolean;
  play: (url?: string) => void;
  pause: () => void;
  isPlaying: boolean;
}

export const AudioContext = createContext<AudioContextType | undefined>(
  undefined
);

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.4);
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useRef<HTMLAudioElement>(null);

  const play = (url?: string) => {
    if (!player.current) return;

    if (!url || url === player.current.src) {
      player.current.play();
      setIsPlaying(true);
      return;
    }

    player.current.src = url;

    pause();

    player.current.oncanplay = () => {
      if (!player.current) return;

      player.current.volume = volume;

      player.current.play();
      setIsPlaying(true);
    };
  };

  const pause = () => {
    if (!player.current) return;
    player.current.pause();
    setIsPlaying(false);
  };

  const isPlayingThis = (audio: string) => {
    return (
      (player.current?.src.includes(audio) && !player.current.paused) || false
    );
  };

  useEffect(() => {
    if (!player.current) return;

    player.current.onplay = () => setIsPlaying(true);
    player.current.onpause = () => setIsPlaying(false);

    player.current.ontimeupdate = () => {
      setCurrentTimestamp(player.current?.currentTime || 0);
    };

    return () => {
      if (!player.current) return;

      player.current.onplay = null;
      player.current.onpause = null;
      player.current.ontimeupdate = null;
    };
  }, [player.current]);

  return (
    <AudioContext.Provider
      value={{
        player,
        isPlayingThis,
        play,
        pause,
        currentTimestamp,
        isPlaying,
      }}
    >
      {children}
      <audio ref={player} onEnded={() => setIsPlaying(false)} />
    </AudioContext.Provider>
  );
};
