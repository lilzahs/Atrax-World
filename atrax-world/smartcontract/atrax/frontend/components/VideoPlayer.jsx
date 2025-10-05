import React, { useMemo, useState } from 'react';

export default function VideoPlayer({ videoId }) {
  const [theater, setTheater] = useState(false);
  const src = useMemo(() => {
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}`;
  }, [videoId]);

  return (
    <div className={theater ? 'vp theater' : 'vp'}>
      <div className="vp-actions">
        <button className="btn alt" onClick={() => setTheater(v => !v)}>
          {theater ? 'Thu nhỏ' : 'Chế độ rạp'}
        </button>
        {videoId && (
          <a className="btn" href={`https://youtu.be/${videoId}`} target="_blank" rel="noreferrer">Mở YouTube</a>
        )}
      </div>
      {videoId ? (
        <div className="vp-frame">
          <iframe
            src={src}
            title="YouTube player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="vp-placeholder">Nhập link/ID YouTube để bắt đầu</div>
      )}
    </div>
  );
}

