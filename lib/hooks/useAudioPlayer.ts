import { useContext } from "react";

import { AudioContext } from "../providers/AudioProvider";

export default function useAudioPlayer() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within a AudioProvider");
  }

  return context;
}
