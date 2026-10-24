import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Download, Share2, Check, Copy } from 'lucide-react';
import { Instagram } from '../SocialIcons';

export const OfferScreenshotCard = ({ offer, formatExpiryIST }) => {
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanShare(true);
    }
  }, []);

  const generateVoucherImage = useCallback(() => {
    if (!offer) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 480;
    canvas.width = width;
    canvas.height = height;

    // Background gradient: Deep midnight black/navy with cyan radial glow
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#060C1B');
    bgGrad.addColorStop(0.5, '#081226');
    bgGrad.addColorStop(1, '#030712');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle blue radial glow in top-right
    const glow = ctx.createRadialGradient(width - 80, 80, 10, width - 80, 80, 280);
    glow.addColorStop(0, 'rgba(0, 140, 255, 0.28)');
    glow.addColorStop(1, 'rgba(0, 140, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // Outer double border (Electric Blue #0080FF)
    ctx.strokeStyle = '#0080FF';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(28, 28, width - 56, height - 56);

    // Header badge
    ctx.fillStyle = 'rgba(0, 140, 255, 0.15)';
    ctx.fillRect(50, 48, 270, 32);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.strokeRect(50, 48, 270, 32);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('★ OFFICIAL BIRTHDAY OFFER ★', 65, 68);

    // Brand Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('DIPESH JANGIR', width - 50, 68);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px monospace';
    ctx.fillText('DEVELOPER PORTFOLIO', width - 50, 84);

    // Main Prize Announcement
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('EXCLUSIVE BIRTHDAY DISCOUNT UNLOCKED:', 50, 135);

    // Prize Title
    const discountVal = offer.discount || offer.savings || 200;
    const finalPriceVal = offer.finalPrice || (300 - discountVal);
    const prizeText = `$${discountVal} OFF WEBSITE DEVELOPMENT`;

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(prizeText, 50, 180);

    // Standard Price & Final Price
    ctx.fillStyle = '#94A3B8';
    ctx.font = '16px monospace';
    ctx.fillText(`Standard Package Value: $${offer.standardPrice || 300}`, 50, 220);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`Your Final Development Price: $${finalPriceVal} (Save $${discountVal})`, 50, 248);

    // Divider Line
    ctx.strokeStyle = 'rgba(0, 140, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 280);
    ctx.lineTo(width - 50, 280);
    ctx.stroke();

    // Offer ID Block (Left)
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px monospace';
    ctx.fillText('OFFER VOUCHER CODE:', 50, 315);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(offer.offerId || 'BDAY-OFFER', 50, 342);

    // Expiry Block (Right)
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('VALIDITY (7 DAYS STRICT):', width - 50, 315);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(formatExpiryIST ? formatExpiryIST(offer.expiresAt) : '7 Days from issuance', width - 50, 342);

    // Footer instructions
    ctx.fillStyle = '#64748B';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(
      'To redeem: Send this voucher on Instagram @_dipesh2.0 or submit inquiry on portfolio.',
      50,
      410
    );

    // Convert to Data URL
    try {
      const url = canvas.toDataURL('image/png');
      setImageUrl(url);
    } catch (e) {
      console.warn('Canvas export error:', e);
    }
  }, [offer, formatExpiryIST]);

  useEffect(() => {
    generateVoucherImage();
  }, [generateVoucherImage]);

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `Birthday-Sale-Offer-${offer.offerId || 'Voucher'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (!canShare || !imageUrl) return;
    try {
      const blob = await (await fetch(imageUrl)).blob();
      const file = new File([blob], `Birthday-Sale-${offer.offerId}.png`, { type: 'image/png' });

      await navigator.share({
        title: "Dipesh's Birthday Sale Voucher",
        text: `I just unlocked a $${offer.discount || offer.savings} OFF website development deal on Dipesh Jangir's Birthday Sale!`,
        files: [file]
      });
    } catch {
      // Fallback to direct download if share rejected
      handleDownload();
    }
  };

  const handleCopyCode = () => {
    if (!offer?.offerId || !navigator?.clipboard?.writeText) return;
    navigator.clipboard.writeText(offer.offerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!offer) return null;

  return (
    <div className="w-full flex flex-col items-center space-y-3 mt-3">
      {/* Hidden Render Canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Rendered Preview Card */}
      {imageUrl && (
        <div className="relative rounded-2xl overflow-hidden border border-blue-500/40 shadow-[0_0_25px_rgba(0,140,255,0.25)] group">
          <img
            src={imageUrl}
            alt="Birthday Sale Offer Voucher"
            className="w-full h-auto object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full pt-1">
        <button
          type="button"
          onClick={handleDownload}
          className="py-2.5 px-3 bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-sky-300 font-mono text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span>Save PNG</span>
        </button>

        {canShare && (
          <button
            type="button"
            onClick={handleShare}
            className="py-2.5 px-3 bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-sky-300 font-mono text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Share</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleCopyCode}
          className="py-2.5 px-3 bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-sky-300 font-mono text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>

      {/* Instagram Direct Claim Link */}
      <a
        href="https://www.instagram.com/_dipesh2.0/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-950 via-[#0B1A3A] to-blue-950 hover:border-sky-400 border border-blue-500/40 text-sky-200 hover:text-white rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
      >
        <Instagram className="w-4 h-4 text-sky-400" />
        <span>Redeem via Instagram DM (@_dipesh2.0)</span>
      </a>
    </div>
  );
};
