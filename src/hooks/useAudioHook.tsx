import { Howl } from "howler";
import { useEffect, useRef } from "react";

interface AudioRefs {
  spin: Howl | null;
  background: Howl | null;
  jukebox: Howl | null;
  memories: NodeJS.Timeout[];
}

export const useAudioHook = () => {
  const audioRef = useRef<AudioRefs>({
    spin: null,
    background: null,
    jukebox: null,
    memories: [],
  });

  useEffect(() => {
    // Initialize audio objects
    audioRef.current = {
      ...audioRef.current,
      spin: new Howl({
        src: ["/audio/spinning.mp3"],
        loop: true,
      }),
      background: new Howl({
        src: ["/audio/background.mp3"],
        loop: true,
      }),
      jukebox: new Howl({
        src: ["/audio/jukebox.mp3"],
        volume: 0.1,
        sprite: {
          betChange: [0, 1050],
          bigWin: [1100, 2000],
          bonusLose: [3200, 1200],
          bonusWin: [4410, 1300],
          buttonLine: [5800, 1050],
          coins: [7700, 650],
          megaWin: [8350, 2800],
          counting: [11200, 1700],
          spin: [21850, 750],
        },
      }),
      memories: [],
    };

    return () => {
      stopAllSounds();
    };
  }, []);

  const playSound = (
    soundType: "spin" | "background" | "jukebox",
    sprite: string | null = null
  ) => {
    const audio = audioRef.current;

    if (sprite && audio.jukebox) {
      audio.jukebox.play(sprite);
      audio.jukebox.volume(0.1);
    } else {
      switch (soundType) {
        case "spin":
          audio.spin?.play();
          audio.spin?.volume(0.1);
          break;
        case "background":
          audio.background?.play();
          break;
        default:
          break;
      }
    }
  };

  const stopSound = (soundType: "spin" | "background" | "jukebox") => {
    const audio = audioRef.current;

    switch (soundType) {
      case "spin":
        audio.spin?.stop();
        break;
      case "background":
        audio.background?.stop();
        break;
      case "jukebox":
        audio.jukebox?.stop();
        break;
      default:
        break;
    }
  };

  const stopAllSounds = () => {
    const audio = audioRef.current;
    audio.spin?.stop();
    audio.background?.stop();
    audio.jukebox?.stop();

    // Clear any pending timeouts
    audio.memories.forEach((timeout) => clearTimeout(timeout));
    audio.memories = [];
  };

  const playWithDelay = (
    soundType: "spin" | "background" | "jukebox",
    delay: number,
    sprite: string | null = null
  ) => {
    const timeout = setTimeout(() => {
      playSound(soundType, sprite);
    }, delay);

    audioRef.current.memories.push(timeout);
  };

  return {
    playSound,
    stopSound,
    stopAllSounds,
    playWithDelay,
  };
};
