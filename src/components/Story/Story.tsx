import React from 'react';
import { story, business } from '../../content.config';
import { Mascot } from '../Mascot/Mascot';
import { getAssetUrl } from '../../utils/asset';
import './Story.css';

const ICON_MAP: Record<string, string> = {
  steam: '☕',
  tofu:  '🟫',
  moon:  '🌙',
};

export const Story: React.FC = () => {
  return (
    <section id="cerita" className="story-section" aria-label="Cerita Jaliteng">
      {/* Background scene */}
      <div className="story-scene" aria-hidden="true">
        <img
          src={getAssetUrl('assets/scene-story.jpg')}
          alt=""
          className="story-bg"
          loading="lazy"
          aria-hidden="true"
        />
        <div className="story-overlay" />
      </div>

      {/* Paper-cut layers */}
      <div className="story-paper-layer story-paper-1" aria-hidden="true" />
      <div className="story-paper-layer story-paper-2" aria-hidden="true" />

      {/* Content */}
      <div className="container story-content">
        <div className="story-grid">
          {/* Text column */}
          <div className="story-text">
            <div className="ornament-divider" style={{ marginBottom: 'var(--space-6)' }}>
              <span>✦</span>
              <h2 className="section-title story-title">{story.headline}</h2>
              <span>✦</span>
            </div>

            <blockquote className="story-positioning">
              "{business.positioning}"
            </blockquote>

            <p className="story-body">{story.body}</p>

            {/* 3 points */}
            <div className="story-points">
              {story.points.map((point, i) => (
                <div key={i} className="story-point">
                  <div className="story-point-icon" aria-hidden="true">
                    {ICON_MAP[point.icon] || '✦'}
                  </div>
                  <div>
                    <h3 className="story-point-title">{point.title}</h3>
                    <p className="story-point-desc">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mascot column */}
          <div className="story-mascot-col" aria-hidden="true">
            <Mascot pose="peek" section="story" className="story-mascot" />
          </div>
        </div>
      </div>

      {/* Torn paper top/bottom */}
      <div className="story-torn-top" aria-hidden="true" />
      <div className="story-torn-bottom" aria-hidden="true" />
    </section>
  );
};

export default Story;
