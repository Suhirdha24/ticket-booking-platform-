import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Festival Anthems',
    artist: 'Playlist by EventLinqs',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80',
    duration: 225, // 3:45
  },
  {
    id: 2,
    title: 'Neon Nights (Live Set)',
    artist: 'Playlist by EventLinqs',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80',
    duration: 198, // 3:18
  },
  {
    id: 3,
    title: 'Electric Horizon',
    artist: 'Playlist by EventLinqs',
    cover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=150&auto=format&fit=crop&q=80',
    duration: 242, // 4:02
  },
];

const formatTime = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function MusicPlayerWidget() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(84); // Starts at 1:24

  const currentTrack = TRACKS[trackIndex];
  const duration = currentTrack.duration;
  const progressPercent = Math.min(100, Math.max(0, (currentTime / duration) * 100));

  // Dynamically update elapsed time (left-side number) while playing
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setTrackIndex((curr) => (curr + 1) % TRACKS.length);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTime(Math.floor(pos * duration));
  };

  const handleNext = () => {
    setTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setCurrentTime(0);
  };

  const handlePrev = () => {
    if (currentTime > 3) {
      setCurrentTime(0);
    } else {
      setTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
      setCurrentTime(0);
    }
  };

  return (
    <div
      className="glass-widget-card"
      style={{
        padding: '1.15rem 1.35rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        minWidth: '280px',
        maxWidth: '340px',
      }}
    >
      {/* Top Track Info & Album Art */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div
          style={{
            position: 'relative',
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {isPlaying && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(139, 92, 246, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Music size={16} color="#FFFFFF" />
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              color: '#FFFFFF',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {currentTrack.title}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#94A3B8',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {currentTrack.artist}
          </div>
        </div>

        {/* Animated Soundwave Visualizer Bars */}
        <div className="soundwave-visualizer" style={{ opacity: isPlaying ? 1 : 0.35 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
            <div
              key={bar}
              className="soundwave-bar"
              style={{
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            />
          ))}
        </div>
      </div>

      {/* Scrubber Progress Bar & Dynamic Time Display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {/* Left Side Elapsed Time Number */}
        <span
          style={{
            fontSize: '0.7rem',
            color: '#A78BFA',
            fontWeight: 700,
            minWidth: '28px',
            fontVariantNumeric: 'tabular-nums',
          }}
          title="Elapsed Time"
        >
          {formatTime(currentTime)}
        </span>

        {/* Interactive Scrubber Track */}
        <div
          onClick={handleSeek}
          style={{
            flex: 1,
            height: '5px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '9999px',
            position: 'relative',
            cursor: 'pointer',
          }}
          title="Click to seek"
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
              borderRadius: '9999px',
              position: 'relative',
              transition: isPlaying ? 'width 0.2s linear' : 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: '-4px',
                top: '-3px',
                width: '11px',
                height: '11px',
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 0 10px rgba(167, 139, 250, 0.9)',
              }}
            />
          </div>
        </div>

        {/* Right Side Total Track Duration */}
        <span
          style={{
            fontSize: '0.7rem',
            color: '#94A3B8',
            fontWeight: 600,
            minWidth: '28px',
            textAlign: 'right',
            fontVariantNumeric: 'tabular-nums',
          }}
          title="Total Duration"
        >
          {formatTime(duration)}
        </span>
      </div>

      {/* Playback Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
        <button
          onClick={handlePrev}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            borderRadius: '50%',
            transition: 'color 0.2s ease',
          }}
          aria-label="Previous Track"
          title="Previous Track"
        >
          <SkipBack size={16} />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'var(--gradient-purple)',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.6)',
            transition: 'transform 0.15s ease, box-shadow 0.2s ease',
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} style={{ marginLeft: '2px' }} />}
        </button>

        <button
          onClick={handleNext}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            borderRadius: '50%',
            transition: 'color 0.2s ease',
          }}
          aria-label="Next Track"
          title="Next Track"
        >
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
}
