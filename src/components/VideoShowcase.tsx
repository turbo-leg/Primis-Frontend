'use client';

import { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Video {
  id: string;
  src: string;
  poster?: string;
  title?: string;
}

interface VideoShowcaseProps {
  videos: Video[];
  title?: string;
  subtitle?: string;
}

export default function VideoShowcase({ videos, title, subtitle }: VideoShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-primis-navy-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-serif font-light text-primis-navy dark:text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 dark:text-white/70 font-light">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="relative group">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex-none w-[280px] sm:w-[320px] aspect-[9/16] relative rounded-2xl overflow-hidden shadow-xl snap-center bg-black group/video"
              >
                <video
                  src={video.src}
                  poster={video.poster}
                  className="w-full h-full object-cover"
                  loop
                  muted={muted}
                  playsInline
                  ref={(el) => {
                    if (el) {
                      if (playingId === video.id) {
                        el.play().catch(() => {});
                      } else {
                        el.pause();
                      }
                    }
                  }}
                  onClick={() => setPlayingId(playingId === video.id ? null : video.id)}
                />
                
                {/* Play overlay when paused */}
                {playingId !== video.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/30 transition-colors pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                  {video.title && (
                    <h3 className="text-lg font-medium mb-2">{video.title}</h3>
                  )}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingId(playingId === video.id ? null : video.id);
                      }}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                      {playingId === video.id ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMuted(!muted);
                      }}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                      {muted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}
