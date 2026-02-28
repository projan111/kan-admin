import { useEffect, useRef } from "react";

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

// Custom color extraction using canvas - more reliable than external libraries
function extractColorsFromImage(img: HTMLImageElement, colorCount: number = 6): Array<[number, number, number]> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return [];

  // Scale down for performance
  const maxSize = 100;
  const scale = Math.min(maxSize / img.width, maxSize / img.height);
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  
  // Color quantization using simple clustering
  const colorMap: Map<string, { rgb: [number, number, number], count: number }> = new Map();
  
  // Sample every nth pixel for performance
  const step = 4;
  for (let i = 0; i < pixels.length; i += step * 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    
    // Skip transparent or very light/dark pixels
    if (a < 125 || (r > 250 && g > 250 && b > 250) || (r < 10 && g < 10 && b < 10)) {
      continue;
    }
    
    // Quantize colors to reduce variation
    const qr = Math.round(r / 10) * 10;
    const qg = Math.round(g / 10) * 10;
    const qb = Math.round(b / 10) * 10;
    const key = `${qr},${qg},${qb}`;
    
    if (colorMap.has(key)) {
      colorMap.get(key)!.count++;
    } else {
      colorMap.set(key, { rgb: [qr, qg, qb], count: 1 });
    }
  }
  
  // Sort by frequency and return top colors
  return Array.from(colorMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, colorCount)
    .map(c => c.rgb);
}

export default function ImageColorPalette({ 
  src, 
  colorCount = 6,
  onDominantColorDetected,
}: {
  src: string;
  colorCount?: number;
  onDominantColorDetected?: (color: string) => void;
}) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      onDominantColorDetected?.("");
      return;
    }

    const img = new Image();
    
    // Handle CORS properly
    if (!src.startsWith('data:')) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => {
      try {
        const palette = extractColorsFromImage(img, colorCount);
        
        if (palette && palette.length > 0) {
          const extractedColors = palette.map((c) => ({
            rgb: `rgb(${c[0]}, ${c[1]}, ${c[2]})`,
            hex: rgbToHex(c[0], c[1], c[2]),
          }));
          onDominantColorDetected?.(extractedColors[0]?.hex ?? "");
        } else {
          onDominantColorDetected?.("");
        }
      } catch {
        onDominantColorDetected?.("");
      }
    };

    img.onerror = () => {
      onDominantColorDetected?.("");
    };

    img.src = src;

    // Store ref for cleanup
    if (imgRef.current) {
      imgRef.current.src = src;
    }
  }, [src, colorCount, onDominantColorDetected]);

  return (
    <>
      <img
        ref={imgRef}
        src={src}
        alt="color-analysis"
        style={{ display: "none" }}
      />
    </>
  );
}
