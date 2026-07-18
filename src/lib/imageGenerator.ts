
import { Checker } from '../data/checkers';

export async function generateResultImage(
  checker: Checker,
  score: number,
  verdictTitle: string
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error("Could not get canvas context");
  
  // Instagram Story format
  canvas.width = 1080;
  canvas.height = 1920;
  
  // Background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0a0a0a');
  gradient.addColorStop(1, '#1e0f40');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Glow effect behind circle
  const glow = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 100, canvas.width/2, canvas.height/2, 500);
  glow.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Texts
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // App Title
  ctx.font = 'bold 48px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Identity Lab', canvas.width/2, 150);
  
  // Checker emoji and title
  ctx.font = '120px sans-serif';
  ctx.fillText(checker.emoji, canvas.width/2, 350);
  
  ctx.font = 'bold 64px sans-serif';
  ctx.fillText(checker.title, canvas.width/2, 500);
  
  // Circle
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/2, 250, 0, Math.PI * 2);
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 25;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/2, 250, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * (score / 100)));
  ctx.strokeStyle = '#8B5CF6';
  ctx.lineWidth = 25;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  // Score
  ctx.font = 'bold 160px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${score}%`, canvas.width/2, canvas.height/2 + 20); // slightly offset for better optical centering
  
  // Verdict
  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = '#a78bfa';
  ctx.letterSpacing = "4px"; // Not strictly supported in all canvas, but good to have
  ctx.fillText('YOUR VERDICT', canvas.width/2, canvas.height/2 + 380);
  
  ctx.font = 'bold 76px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(verdictTitle, canvas.width/2, canvas.height/2 + 480);
  
  // URL & QR Code
  ctx.font = '36px sans-serif';
  ctx.fillStyle = '#888888';
  
  return canvas.toDataURL('image/png');
}