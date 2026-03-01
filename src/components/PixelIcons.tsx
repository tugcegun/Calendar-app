// Pixel art icons — bigger, more detailed animals + UI icons

export function PixelFrog({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect x="3" y="1" width="3" height="3" fill="#C7DB9C"/>
      <rect x="10" y="1" width="3" height="3" fill="#C7DB9C"/>
      <rect x="4" y="2" width="2" height="2" fill="#fff"/>
      <rect x="11" y="2" width="2" height="2" fill="#fff"/>
      <rect x="5" y="2" width="1" height="1" fill="#1a1a2e"/>
      <rect x="12" y="2" width="1" height="1" fill="#1a1a2e"/>
      <rect x="1" y="4" width="14" height="5" fill="#C7DB9C"/>
      <rect x="2" y="5" width="12" height="3" fill="#8fcc7a"/>
      <rect x="5" y="7" width="2" height="1" fill="#E50046"/>
      <rect x="9" y="7" width="2" height="1" fill="#E50046"/>
      <rect x="6" y="8" width="4" height="1" fill="#E50046"/>
      <rect x="2" y="9" width="4" height="3" fill="#C7DB9C"/>
      <rect x="10" y="9" width="4" height="3" fill="#C7DB9C"/>
      <rect x="1" y="11" width="3" height="2" fill="#8fcc7a"/>
      <rect x="12" y="11" width="3" height="2" fill="#8fcc7a"/>
    </svg>
  );
}

export function PixelCat({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="0" width="2" height="4" fill="#FDAB9E"/>
      <rect x="12" y="0" width="2" height="4" fill="#FDAB9E"/>
      <rect x="2" y="3" width="12" height="7" fill="#FDAB9E"/>
      <rect x="3" y="4" width="10" height="5" fill="#ffd4a8"/>
      <rect x="4" y="5" width="2" height="2" fill="#fff"/>
      <rect x="10" y="5" width="2" height="2" fill="#fff"/>
      <rect x="5" y="5" width="1" height="1" fill="#1a1a2e"/>
      <rect x="11" y="5" width="1" height="1" fill="#1a1a2e"/>
      <rect x="7" y="7" width="2" height="1" fill="#E50046"/>
      <rect x="6" y="8" width="1" height="1" fill="#FDAB9E"/>
      <rect x="9" y="8" width="1" height="1" fill="#FDAB9E"/>
      <rect x="3" y="10" width="10" height="3" fill="#FDAB9E"/>
      <rect x="4" y="13" width="3" height="2" fill="#FDAB9E"/>
      <rect x="9" y="13" width="3" height="2" fill="#FDAB9E"/>
      <rect x="13" y="9" width="3" height="1" fill="#FDAB9E"/>
      <rect x="14" y="10" width="2" height="1" fill="#FDAB9E"/>
    </svg>
  );
}

export function PixelLion({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect x="1" y="0" width="14" height="3" fill="#FDAB9E"/>
      <rect x="0" y="2" width="16" height="3" fill="#FDAB9E"/>
      <rect x="1" y="4" width="14" height="7" fill="#ffd4a8"/>
      <rect x="2" y="5" width="12" height="5" fill="#ffe0b8"/>
      <rect x="4" y="5" width="2" height="2" fill="#fff"/>
      <rect x="10" y="5" width="2" height="2" fill="#fff"/>
      <rect x="5" y="6" width="1" height="1" fill="#1a1a2e"/>
      <rect x="11" y="6" width="1" height="1" fill="#1a1a2e"/>
      <rect x="6" y="8" width="4" height="2" fill="#E50046"/>
      <rect x="7" y="9" width="2" height="1" fill="#c5003a"/>
      <rect x="0" y="5" width="2" height="5" fill="#FDAB9E"/>
      <rect x="14" y="5" width="2" height="5" fill="#FDAB9E"/>
      <rect x="3" y="11" width="4" height="3" fill="#ffd4a8"/>
      <rect x="9" y="11" width="4" height="3" fill="#ffd4a8"/>
      <rect x="4" y="14" width="2" height="2" fill="#FDAB9E"/>
      <rect x="10" y="14" width="2" height="2" fill="#FDAB9E"/>
    </svg>
  );
}

export function PixelBunny({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="0" width="2" height="5" fill="#fff"/>
      <rect x="10" y="0" width="2" height="5" fill="#fff"/>
      <rect x="5" y="1" width="1" height="3" fill="#E50046"/>
      <rect x="11" y="1" width="1" height="3" fill="#E50046"/>
      <rect x="3" y="4" width="10" height="7" fill="#fff"/>
      <rect x="4" y="5" width="8" height="5" fill="#f5f5f0"/>
      <rect x="5" y="6" width="2" height="2" fill="#E50046"/>
      <rect x="9" y="6" width="2" height="2" fill="#E50046"/>
      <rect x="6" y="6" width="1" height="1" fill="#1a1a2e"/>
      <rect x="10" y="6" width="1" height="1" fill="#1a1a2e"/>
      <rect x="7" y="8" width="2" height="1" fill="#E50046"/>
      <rect x="4" y="11" width="3" height="3" fill="#fff"/>
      <rect x="9" y="11" width="3" height="3" fill="#fff"/>
    </svg>
  );
}

export function PixelStar({ size = 14, color = '#C7DB9C', className = '' }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="0" width="2" height="2" fill={color}/>
      <rect x="3" y="2" width="4" height="1" fill={color}/>
      <rect x="0" y="3" width="10" height="2" fill={color}/>
      <rect x="1" y="5" width="8" height="1" fill={color}/>
      <rect x="2" y="6" width="6" height="1" fill={color}/>
      <rect x="3" y="7" width="1" height="2" fill={color}/>
      <rect x="6" y="7" width="1" height="2" fill={color}/>
    </svg>
  );
}

export function PixelHeart({ size = 14, color = '#E50046', className = '' }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect x="1" y="1" width="3" height="2" fill={color}/>
      <rect x="6" y="1" width="3" height="2" fill={color}/>
      <rect x="0" y="2" width="10" height="2" fill={color}/>
      <rect x="1" y="4" width="8" height="2" fill={color}/>
      <rect x="2" y="6" width="6" height="1" fill={color}/>
      <rect x="3" y="7" width="4" height="1" fill={color}/>
      <rect x="4" y="8" width="2" height="1" fill={color}/>
    </svg>
  );
}

export function PixelHand({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 16" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="0" width="3" height="2" fill="#fff8e8"/>
      <rect x="4" y="2" width="3" height="4" fill="#FDAB9E"/>
      <rect x="7" y="6" width="3" height="2" fill="#FDAB9E"/>
      <rect x="7" y="7" width="3" height="1" fill="#e5a87a"/>
      <rect x="2" y="7" width="2" height="3" fill="#FDAB9E"/>
      <rect x="3" y="6" width="4" height="5" fill="#FDAB9E"/>
      <rect x="4" y="8" width="6" height="3" fill="#FDAB9E"/>
      <rect x="4" y="6" width="6" height="1" fill="#e5a87a"/>
      <rect x="4" y="11" width="5" height="3" fill="#FDAB9E"/>
      <rect x="4" y="13" width="5" height="1" fill="#e5a87a"/>
    </svg>
  );
}

export function PixelFist({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 14" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect x="1" y="1" width="10" height="1" fill="#ffd4a8"/>
      <rect x="1" y="2" width="10" height="3" fill="#FDAB9E"/>
      <rect x="1" y="3" width="3" height="2" fill="#e5a87a"/>
      <rect x="5" y="3" width="2" height="2" fill="#e5a87a"/>
      <rect x="8" y="3" width="3" height="2" fill="#e5a87a"/>
      <rect x="0" y="5" width="12" height="4" fill="#FDAB9E"/>
      <rect x="0" y="8" width="3" height="2" fill="#ffd4a8"/>
      <rect x="1" y="9" width="10" height="2" fill="#FDAB9E"/>
      <rect x="2" y="11" width="8" height="2" fill="#FDAB9E"/>
      <rect x="2" y="12" width="8" height="1" fill="#d4956a"/>
    </svg>
  );
}

export function PixelMusic({ size = 14, color = '#E50046', className = '' }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 12" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect x="3" y="0" width="7" height="2" fill={color}/>
      <rect x="8" y="0" width="2" height="7" fill={color}/>
      <rect x="3" y="0" width="2" height="9" fill={color}/>
      <rect x="0" y="7" width="5" height="3" fill={color}/>
      <rect x="5" y="5" width="5" height="3" fill={color}/>
    </svg>
  );
}

export function PixelCalendar({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect x="0" y="2" width="12" height="10" fill="#FFF8D6"/>
      <rect x="0" y="2" width="12" height="3" fill="#E50046"/>
      <rect x="2" y="0" width="2" height="4" fill="#FDAB9E"/>
      <rect x="8" y="0" width="2" height="4" fill="#FDAB9E"/>
      <rect x="2" y="6" width="2" height="2" fill="#1a1a2e"/>
      <rect x="5" y="6" width="2" height="2" fill="#1a1a2e"/>
      <rect x="8" y="6" width="2" height="2" fill="#1a1a2e"/>
      <rect x="2" y="9" width="2" height="2" fill="#1a1a2e"/>
    </svg>
  );
}

export function PixelArrowLeft({ size = 12, color = '#1a1a2e' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" style={{ imageRendering: 'pixelated' }}>
      <rect x="3" y="0" width="2" height="2" fill={color}/>
      <rect x="1" y="2" width="2" height="2" fill={color}/>
      <rect x="3" y="2" width="5" height="4" fill={color}/>
      <rect x="1" y="4" width="2" height="2" fill={color}/>
      <rect x="3" y="6" width="2" height="2" fill={color}/>
    </svg>
  );
}

export function PixelArrowRight({ size = 12, color = '#1a1a2e' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" style={{ imageRendering: 'pixelated' }}>
      <rect x="3" y="0" width="2" height="2" fill={color}/>
      <rect x="5" y="2" width="2" height="2" fill={color}/>
      <rect x="0" y="2" width="5" height="4" fill={color}/>
      <rect x="5" y="4" width="2" height="2" fill={color}/>
      <rect x="3" y="6" width="2" height="2" fill={color}/>
    </svg>
  );
}
