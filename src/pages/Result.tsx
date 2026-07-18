import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Check, Copy, Download, Share2, Instagram, X } from "lucide-react";
import { checkers } from "@/data/checkers";
import { verdictSystems } from "@/lib/verdicts";
import { generateResultImage } from "@/lib/imageGenerator";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from "@/components/ui/dialog";

function useCountUp(end: number, duration: number = 1.5) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

export default function Result() {
  const params = useParams();
  const checkerId = params.checkerId as string;
  const score = parseInt(params.score as string, 10);
  
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const checker = checkers.find(c => c.id === checkerId);
  const count = useCountUp(isNaN(score) ? 0 : score);

  useEffect(() => {
    if (!checker || isNaN(score)) return;
    
    const verdicts = verdictSystems[checkerId];
    if (!verdicts) return;
    
    const matchedVerdict = verdicts.find(v => score >= v.min && score <= v.max) || verdicts[0];
    
    generateResultImage(checker, score, matchedVerdict.title)
      .then(url => setShareImage(url))
      .catch(err => console.error("Image generation failed", err));
  }, [checker, score, checkerId]);

  if (!checker || isNaN(score)) {
    return <div className="min-h-[100dvh] flex items-center justify-center text-white">Result not found</div>;
  }

  const verdicts = verdictSystems[checkerId];
  const verdict = verdicts.find(v => score >= v.min && score <= v.max) || verdicts[0];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleDownloadImage = () => {
    if (!shareImage) return;
    const a = document.createElement("a");
    a.href = shareImage;
    a.download = `identity-lab-${checkerId}-result.png`;
    a.click();
  };

  const handleInstagramShare = async () => {
  if (!shareImage) return;

  try {
    const res = await fetch(shareImage);
    const blob = await res.blob();
    const file = new File(
      [blob],
      `identity-lab-${checkerId}-result.png`,
      { type: "image/png" }
    );

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "My Identity Lab Result",
        text: "Check out my Identity Lab result!"
      });
    } else {
      // Browser doesn't support sharing files
      handleDownloadImage();
    }
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      handleDownloadImage();
    }
  }
};
  

  const handleSnapchatShare = async () => {
    if (!shareImage) return;
    try {
      const res = await fetch(shareImage);
      const blob = await res.blob();
      const file = new File([blob], `identity-lab-${checkerId}-result.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "My Identity Lab Result" });
      } else {
        handleDownloadImage();
        setTimeout(() => window.open("https://www.snapchat.com/", "_blank"), 600);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        handleDownloadImage();
      }
    }
  };

  const size = 280;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (count / 100) * circumference;

  return (
    <div className="min-h-[100dvh] w-full bg-black text-white flex flex-col items-center justify-center px-4 py-12 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center w-full max-w-md"
      >
        <div className="relative mb-12 flex justify-center items-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="#1a1a1a" strokeWidth={strokeWidth} />
            <defs>
              <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
            </defs>
            <circle
              cx={size / 2} cy={size / 2} r={radius} fill="transparent"
              stroke="url(#purpleGrad)" strokeWidth={strokeWidth} strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.1s linear" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">{count}%</span>
            <span className="text-gray-400 font-medium text-sm mt-1 uppercase tracking-widest flex items-center gap-2">
              <span className="text-xl">{checker.emoji}</span>
              {checker.title.replace(' Checker', '')}
            </span>
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-purple-500 font-bold uppercase tracking-[0.2em] text-sm mb-4">Your Verdict</h3>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">{verdict.title}</h2>
          <p className="text-gray-400 text-lg px-4 leading-relaxed">{verdict.description}</p>
        </div>

        <div className="w-full flex flex-col gap-4 mt-4">
          <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
            <DialogTrigger asChild>
              <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-5 rounded-full transition-all text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                <Share2 size={20} />
                Share Result
              </button>
            </DialogTrigger>
           <DialogContent className="bg-[#111111] border-[#2a2a2a] text-white rounded-[32px] sm:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <DialogTitle className="sr-only">Share Result</DialogTitle>
              <div className="relative p-6 pt-8 pb-8 flex flex-col items-center">
            
                <h2 className="text-2xl font-bold mb-6 text-center">Share Your Identity</h2>
                {shareImage ? (
                  <div className="w-48 rounded-xl overflow-hidden border border-[#2a2a2a] shadow-lg mb-8 bg-black">
                    <img src={shareImage} alt="Result Preview" className="w-full h-auto object-cover" />
                  </div>
                ) : (
                  <div className="w-48 h-80 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] mb-8 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button onClick={handleInstagramShare} className="col-span-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-opacity">
                    <Instagram size={20} />
                    Share Result
                  </button>             

                  <button onClick={handleDownloadImage} className="bg-[#222222] hover:bg-[#333333] text-white font-medium py-4 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors">
                    <Download size={20} />
                    <span className="text-sm">Save Image</span>
                  </button>
                  <button onClick={handleCopyLink} className="bg-[#222222] hover:bg-[#333333] text-white font-medium py-4 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors relative">
                    {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                    <span className="text-sm">{copied ? "Copied!" : "Copy Link"}</span>
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-6 text-center">Social sharing works best on mobile. <br/>It will download the image and try to open the app.</p>
              </div>
            </DialogContent>
          </Dialog>

          <Link href="/">
            <button className="w-full bg-white hover:bg-gray-200 text-black font-bold py-5 rounded-full transition-colors text-lg flex items-center justify-center gap-2">
              Try Another Checker
            </button>
          </Link>
          <Link href={`/quiz/${checkerId}`}>
            <button className="w-full bg-transparent border-2 border-[#2a2a2a] hover:border-[#4a4a4a] text-white font-bold py-4 rounded-full transition-colors text-lg flex items-center justify-center mt-2">
              Play Again
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}