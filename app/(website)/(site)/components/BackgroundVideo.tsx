import { useEffect, useRef, useState } from "react";

export default function BackgroundVideo({
  urls,
  className,
}: {
  urls: string[];
  className: string;
}) {
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  function getRandomVideo(exclude: string | null): string {
    const filteredArray = urls.filter((v) => exclude != v);

    return filteredArray[Math.floor(Math.random() * filteredArray.length)];
  }

  useEffect(() => {
    const handleEnded = () => {
      setIsLoading(true);
      setCurrentVideo((prev) => getRandomVideo(prev));
    };

    if (currentVideo == null) {
      handleEnded();
    }

    videoRef.current?.load();

    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.addEventListener("ended", handleEnded);
    }

    return () => {
      if (videoEl) {
        videoEl.removeEventListener("ended", handleEnded);
      }
    };
  }, [currentVideo, urls]);

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <div className="bg-black w-full h-full" />}
      {currentVideo && (
        <video
          onLoadedData={handleVideoLoad}
          ref={videoRef}
          key={currentVideo}
          src={currentVideo}
          className={className}
          autoPlay
          muted
        />
      )}
    </>
  );
}
