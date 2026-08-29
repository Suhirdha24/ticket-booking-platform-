import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';

export default function MusicPlayerWidget() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(38); // percentage

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

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
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80"
            alt="Festival Anthems"
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
            Festival Anthems
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
            Playlist by EventLinqs
          </div>
        </div>

        {/* Animated Soundwave Visualizer Bars */}
        <div className="soundwave-visualizer" style={{ opacity: isPlaying ? 1 : 0.4 }}>
          <div className="soundwave-bar"></div>
          <div className="soundwave-bar"></div>
          <div className="soundwave-bar"></div>
          <div className="soundwave-bar"></div>
          <div className="soundwave-bar"></div>
          <div className="soundwave-bar"></div>
          <div className="soundwave-bar"></div>
          <div className="soundwave-bar"></div>
        </div>
      </div>

      {/* Scrubber Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, minWidth: '24px' }}>
          1:24
        </span>
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            setProgress(pos * 100);
          }}
          style={{
            flex: 1,
            height: '4px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '9999px',
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
              borderRadius: '9999px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: '-3px',
                top: '-3px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 0 8px rgba(139, 92, 246, 0.8)',
              }}
            ></div>
          </div>
        </div>
        <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, minWidth: '24px' }}>
          3:45
        </span>
      </div>

      {/* Playback Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
          }}
          aria-label="Previous Track"
        >
          <SkipBack size={15} />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--gradient-purple)',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.5)',
            transition: 'transform 0.15s ease',
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
        </button>

        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
          }}
          aria-label="Next Track"
        >
          <SkipForward size={15} />
        </button>
      </div>
    </div>
  );
}
