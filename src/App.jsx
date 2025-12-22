import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, Star, Check, Instagram, Twitter, Facebook, Youtube, Download, AlertCircle, ArrowDown } from 'lucide-react';

/**
 * PIGGY & KAY - THE SPARKLE WITHIN
 * A Framer-style, high-conversion launch site.
 */

// --- CONFIGURATION ---
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzdi0VNKpXWY50NO2UHExKTs5k1jMnMuxbw67Kx2LuAowWIU7AFHrGXxF1IAdXPw5LU/exec"; 
// Use environment variable for backend API URL, defaults to same-origin /api for production
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "/api"; 

const FONTS = {
  head: "font-['Comic_Neue',_'Bubblegum_Sans',_sans-serif]",
  body: "font-['Nunito',_sans-serif]",
};

// --- COMPONENTS ---

const RibbonHeader = () => {
  const [fontSize, setFontSize] = useState(48);

  useEffect(() => {
    const updateFontSize = () => {
      // Mobile (< 768px): 144px, Tablet (≥ 768px): 72px
      setFontSize(window.innerWidth < 768 ? 144 : 72);
    };
    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    return () => window.removeEventListener('resize', updateFontSize);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto -mb-4 md:-mb-8 z-20 hover:scale-105 transition-transform duration-500">
      <svg viewBox="0 0 1400 350" className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="blushGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFB6C1" /> 
            <stop offset="100%" stopColor="#FFFFFF" /> 
          </linearGradient>
        </defs>
        <path id="ribbon-curve" d="M 50,100 C 500,60 900,140 1350,80" fill="transparent" />
        <text className={`${FONTS.head} font-bold tracking-wider drop-shadow-md`} style={{ fontSize: `${fontSize}px`, filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.1))' }}>
          <textPath href="#ribbon-curve" startOffset="50%" textAnchor="middle">
            <tspan fill="url(#blushGradient)">Piggy & Kay</tspan>
          </textPath>
        </text>
      </svg>
    </div>
  );
};

const SparkleCursor = () => {
  const [sparkles, setSparkles] = useState([]);
  const sparkleCount = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (Math.random() > 0.3) return;
      const newSparkle = {
        id: sparkleCount.current++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 4 + 2, 
        style: { left: e.clientX, top: e.clientY, animationDuration: `${Math.random() * 0.8 + 0.4}s` }
      };
      setSparkles(prev => [...prev.slice(-15), newSparkle]); 
    };
    if (window.matchMedia("(pointer: fine)").matches) window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => { if (sparkles.length > 0) setSparkles(prev => prev.slice(1)); }, 100);
    return () => clearInterval(interval);
  }, [sparkles.length]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {sparkles.map(s => (
        <div key={s.id} className="absolute rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.8)] animate-cursor-sparkle" style={{ ...s.style, width: s.size, height: s.size }} />
      ))}
    </div>
  );
};

const SparkleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#5e9aff] to-white opacity-90" />
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white blur-[1px] opacity-40 animate-float" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: `${Math.random() * 6 + 2}px`, height: `${Math.random() * 6 + 2}px`, animationDuration: `${Math.random() * 5 + 5}s`, animationDelay: `${Math.random() * 5}s` }} />
      ))}
      {[...Array(30)].map((_, i) => (
        <div key={`snow-${i}`} className="absolute rounded-full bg-white opacity-70 animate-fall" style={{ left: `${Math.random() * 100}%`, top: `-10px`, width: `${Math.random() * 4 + 2}px`, height: `${Math.random() * 4 + 2}px`, animationDuration: `${Math.random() * 10 + 10}s`, animationDelay: `${Math.random() * 10}s` }} />
      ))}
    </div>
  );
};

const PiggyAndKayHero = ({ className, id }) => {
  const [imgSrc, setImgSrc] = useState("./images/piggy-kay-hero.png");
  return (
    <div className={`${className} relative flex items-center justify-center`}>
      <img 
        id={id} 
        src={imgSrc}
        crossOrigin="anonymous"
        onError={() => setImgSrc("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='600' height='500' viewBox='0 0 600 500'%3e%3crect width='600' height='500' fill='%23FFF0F5' rx='20' ry='20'/%3e%3ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23EC4899'%3eImage Not Found%3c/text%3e%3c/svg%3e")}
        alt="Piggy and Kay sitting in the snow" 
        className="w-full h-auto object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700 ease-in-out"
        style={{
            // Mask Updated: Starts fading at 10% (black 10%) instead of 30%, making it super soft
            maskImage: 'radial-gradient(ellipse 95% 90% at 50% 45%, black 10%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 95% 90% at 50% 45%, black 10%, transparent 85%)'
        }}
      />
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-[40%] right-[30%] w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute bottom-[30%] left-[40%] w-1 h-1 bg-yellow-100 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>
    </div>
  );
};

// --- NEW AUTHOR BIO SECTION ---
const AuthorSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 } // Trigger when 20% visible
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
    // Reduced spacing here: my-8 md:my-12 (was my-24)
    <div ref={sectionRef} className="relative w-full max-w-4xl mx-auto my-8 md:my-12 min-h-[400px] perspective-1000">
      {/* Visual Page Turn Effect Container */}
      <div 
        className={`bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl border border-white transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 rotate-0 opacity-100' : 'translate-y-24 rotate-3 opacity-0 origin-bottom-right'}`}
        style={{
            // "Page Turn" feel: Starts slightly rotated from bottom right, then flattens out
            transformOrigin: 'bottom right',
        }}
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Author Photo */}
            <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 relative">
                <div className="absolute inset-0 bg-yellow-200 rounded-full blur-md opacity-50 animate-pulse"></div>
                <img 
                    src="/images/amanda.jpg" 
                    alt="Author" 
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-md relative z-10" 
                />
            </div>
            
            {/* Bio Text */}
            <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
                    Meet the Author
                </div>
                <h3 className={`${FONTS.head} text-3xl font-bold text-slate-800`}>
                    Inspired by Real Magic
                </h3>
                <p className="text-slate-600 leading-relaxed italic">
                    "I wrote Piggy & Kay to explore the wisdom of looking inward through the whimsical eyes of a child, where a stuffed animal isn't just a toy, but a beloved friend that helps make sense of things. In a rapidly evolving world overflowing with information, Piggy reminds us all that amidst all the noise, our inner truth remains peaceful. We simply must be brave enough to slow down and listen to the sparkle within."
                </p>
                <div className="pt-4">
                    <p className="font-handwriting text-2xl text-slate-500">- Amanda & The Real Piggy</p>
                </div>
            </div>
        </div>

        {/* Decorative page corner */}
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-slate-200 to-transparent opacity-20 pointer-events-none rounded-br-3xl"></div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [view, setView] = useState('landing');
  const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supporterNumber, setSupporterNumber] = useState(2348); 

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) setView("success");
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (GOOGLE_SHEET_WEB_APP_URL && GOOGLE_SHEET_WEB_APP_URL.startsWith("https://script.google.com")) {
        try {
            await fetch(GOOGLE_SHEET_WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors', 
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(userData)
            });
        } catch (error) { console.error("Error saving:", error); }
    } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    setIsSubmitting(false);
    setView('preorder');
    // Scroll to top of page on form submit
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToForm = () => {
    document.getElementById('join-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen relative text-slate-800 ${FONTS.body} selection:bg-pink-200 cursor-auto overflow-x-hidden`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Nunito:wght@400;600;800&display=swap');
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes fall { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 0.8; } 100% { transform: translateY(100vh); opacity: 0; } }
        @keyframes gentle-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes cursor-sparkle { 0% { transform: scale(0) translate(0,0); opacity: 0; } 20% { opacity: 1; transform: scale(1); } 100% { transform: scale(0) translate(10px, 10px); opacity: 0; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fall { animation: fall linear infinite; }
        .animate-bounce-gentle { animation: gentle-bounce infinite ease-in-out; }
        .animate-cursor-sparkle { animation: cursor-sparkle 0.8s forwards; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>

      <SparkleBackground />
      <SparkleCursor />

      {/* Added pb-32 on mobile to account for sticky footer */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-6 pb-32 md:pb-12 min-h-screen flex flex-col">
        
        <div className="w-full flex justify-center pt-4 md:pt-8 pb-4">
          <RibbonHeader />
        </div>

        {view === 'landing' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 w-full flex-grow flex flex-col items-center">
            
            {/* SECTION 1: HERO (Intro Only) */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full mb-12">
              
              <div className="w-full md:w-1/2 relative group order-1 md:order-1">
                <div className="absolute inset-0 bg-white/40 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000"></div>
                <PiggyAndKayHero className="w-full h-auto transform transition hover:scale-105 duration-700 animate-bounce-gentle" />
              </div>

              <div className="w-full md:w-1/2 space-y-6 text-center md:text-left order-2 md:order-2">
                <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold text-purple-600 shadow-sm border border-purple-100 mx-auto md:mx-0">
                  <Sparkles size={16} className="animate-pulse text-yellow-400" />
                  <span>psssst...Piggy wants to tell you a secret: YOU'RE INVITED!</span>
                </div>
                
                <h2 className={`${FONTS.head} text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-800`}>
                   The book series your inner child has been waiting for.
                </h2>
                
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto md:mx-0">
                   Come along on this heart-warming adventure as a curious young girl named Kay, and her wise friend Piggy, explore the world with wonder and uncover the sparkle within.
                </p>

                {/* Desktop "Jump to Form" Button */}
                <div className="hidden md:flex pt-4">
                    <button 
                      onClick={scrollToForm}
                      className="bg-white text-slate-600 font-bold px-6 py-3 rounded-full shadow-sm border border-slate-200 hover:shadow-md hover:border-pink-300 transition flex items-center gap-2"
                    >
                      <ArrowDown size={18} />
                      Join the Waitlist
                    </button>
                </div>
              </div>
            </div>

            {/* SECTION 2: AUTHOR BIO (Revealed on Scroll) */}
            <AuthorSection />

            {/* SECTION 3: SIGN UP FORM */}
            <div id="join-section" className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 bg-white/60 backdrop-blur-lg p-8 rounded-[2rem] shadow-xl border border-white relative overflow-hidden">
                {/* Decorative BG element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>

                <div className="w-full md:w-1/2 text-center md:text-left relative z-10">
                    <h3 className={`${FONTS.head} text-3xl font-bold text-slate-800 mb-2`}>
                        Be the first to know.
                    </h3>
                    <p className="text-slate-600">
                        Piggy & Kay arrive this holiday season. Join the Sparkle Club to get early access to the First Edition.
                    </p>
                </div>

                <div className="w-full md:w-1/2 relative z-10">
                  <form id="join-form" onSubmit={handleJoin} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        required
                        type="text" 
                        placeholder="First Name"
                        className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-white/80 focus:bg-white focus:ring-2 focus:ring-pink-300 focus:outline-none transition"
                        value={userData.firstName}
                        onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                      />
                      <input 
                        required
                        type="text" 
                        placeholder="Last Name"
                        className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-white/80 focus:bg-white focus:ring-2 focus:ring-pink-300 focus:outline-none transition"
                        value={userData.lastName}
                        onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                      />
                    </div>
                    <input 
                      required
                      type="email" 
                      placeholder="Best email for magical updates"
                      className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-white/80 focus:bg-white focus:ring-2 focus:ring-pink-300 focus:outline-none transition"
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                    />
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="hidden md:flex w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-300 hover:to-purple-300 text-white font-bold text-xl py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 justify-center items-center gap-2 group"
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">Sending magic...</span>
                      ) : (
                        <>
                          Join the Sparkle Club 
                          <Star size={20} className="group-hover:rotate-180 transition-transform duration-500 text-yellow-200 fill-yellow-200" />
                        </>
                      )}
                    </button>
                    <p className="hidden md:block text-center text-xs text-slate-400 font-semibold uppercase tracking-widest">
                      Piggy promises: No spam, only snacks...oh, and magic.
                    </p>
                  </form>
                </div>
            </div>

            {/* MOBILE STICKY CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-pink-100 md:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pointer-events-auto">
                <button 
                  type="submit"
                  form="join-form"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-300 hover:to-purple-300 text-white font-bold text-xl py-3 rounded-xl shadow-lg flex justify-center items-center gap-2 group"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending magic...</span>
                  ) : (
                    <>
                      Join the Sparkle Club 
                      <Star size={20} className="text-yellow-200 fill-yellow-200" />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-2">
                  Piggy promises: No spam, only snacks...oh, and magic.
                </p>
            </div>

          </div>
        )}

        {/* --- VIEW 2: PRE-ORDER --- */}
        {view === 'preorder' && (
          <PreOrderView 
            userData={userData} 
            toSuccess={() => setView('success')} 
          />
        )}

        {/* --- VIEW 3: SUCCESS --- */}
        {view === 'success' && (
          <SuccessView 
            userData={userData} 
            supporterNumber={supporterNumber} 
          />
        )}

      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function PreOrderView({ userData, toSuccess }) {
  const [quantity, setQuantity] = useState(1);
  const [donation, setDonation] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const basePrice = 20;

  const getDiscount = (qty) => {
    if (qty >= 5) return 0.15;
    if (qty >= 3) return 0.10;
    return 0;
  };

  const discountRate = getDiscount(quantity);
  const subtotal = quantity * basePrice;
  const discountAmount = subtotal * discountRate;
  const total = (subtotal - discountAmount) + Number(donation);

  // Handle checkout: call backend to create Stripe session
  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const response = await fetch(`${BACKEND_API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity,
          donation: Number(donation)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = data.sessionUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError(error.message || 'Something went wrong. Please try again.');
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto w-full pt-10">
      
      {/* Header Copy */}
      <div className="text-center mb-8 space-y-4">
        
        {/* Sparkle Badge */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20 flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 to-purple-400 rounded-full animate-pulse opacity-70 blur-md"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-pink-100 to-white rounded-full border-4 border-pink-200 flex items-center justify-center shadow-xl animate-bounce-gentle">
                  <Sparkles className="text-yellow-400 w-10 h-10 fill-yellow-400 drop-shadow-sm" />
              </div>
              <div className="absolute -top-2 -right-2"><Star size={16} className="text-yellow-300 fill-yellow-300 animate-spin-slow" /></div>
              <div className="absolute -bottom-1 -left-2"><Star size={12} className="text-purple-300 fill-purple-300 animate-pulse" /></div>
          </div>
        </div>
        
        <h2 className={`${FONTS.head} text-3xl md:text-4xl font-bold text-slate-800`}>
          It's official, you're in {userData.firstName}!
        </h2>
        
        <p className="text-slate-600 font-medium px-4 text-lg max-w-lg mx-auto leading-relaxed">
          You have joined a community of <span className="text-pink-600 font-bold">2,347</span> parents waiting for <span className="font-bold underline decoration-black decoration-2 underline-offset-2">Piggy & Kay: The Sparkle Within</span>.
        </p>

        <div className="pt-2">
            <span className="inline-block bg-white/60 backdrop-blur-sm px-6 py-2 rounded-full text-purple-700 font-bold shadow-sm border border-purple-100 animate-pulse">
                Secure your copy by pre-ordering below!
            </span>
        </div>
      </div>

      {/* Product Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Book Image & Details */}
        <div className="bg-[#FFF0F5] p-8 text-center relative overflow-hidden group cursor-pointer">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300" />
          
          <div className="relative inline-block transform group-hover:scale-105 transition-transform duration-500 perspective-1000">
             <img 
               src="/images/PK%20A%20Winter%20Sparkle.png" 
               alt="Piggy & Kay: A Winter Sparkle Book Cover"
               className="w-40 md:w-48 h-56 md:h-64 object-cover rounded-lg shadow-2xl relative z-10"
               onError={() => console.log('Image failed to load')}
             />
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-bold text-slate-800">Piggy & Kay: A Winter Sparkle</h3>
            <p className="text-slate-500 text-sm">Hardcover First Edition • Coming Dec 2025</p>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 md:p-8 space-y-6 md:space-y-8">
          
          <div className="space-y-3">
             <div className="flex justify-between items-center">
               <label className="font-bold text-slate-700">How many copies would you like to reserve?</label>
               {discountRate > 0 && (
                 <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full animate-pulse">
                   {(discountRate * 100).toFixed(0)}% Savings Unlocked!
                 </span>
               )}
             </div>
             
             <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 hover:bg-pink-50 transition"
                >-</button>
                <div className="flex-1 text-center font-bold text-xl">{quantity}</div>
                <button 
                  onClick={() => setQuantity(Math.min(20, quantity + 1))}
                  className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 hover:bg-pink-50 transition"
                >+</button>
             </div>
             
             <div className="flex gap-2 text-xs">
                <div className={`flex-1 p-2 rounded text-center transition-colors ${quantity >= 3 && quantity < 5 ? 'bg-green-100 text-green-700 font-bold border border-green-200' : 'bg-slate-100 text-slate-400'}`}>
                  Buy 3 get 10% off
                </div>
                <div className={`flex-1 p-2 rounded text-center transition-colors ${quantity >= 5 ? 'bg-green-100 text-green-700 font-bold border border-green-200' : 'bg-slate-100 text-slate-400'}`}>
                  Buy 5 get 15% off
                </div>
             </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-dashed border-slate-200">
            <label className="font-bold text-slate-700 flex items-center gap-2">
              <Heart size={16} className="text-pink-500 fill-pink-500" />
              Help Piggy & Kay travel to local libraries.
            </label>
            <div className="grid grid-cols-4 gap-2">
               {[10, 25, 50].map(amt => (
                 <button 
                   key={amt}
                   onClick={() => setDonation(amt)}
                   className={`px-2 py-2 rounded-lg border font-medium text-sm transition ${donation === amt ? 'bg-pink-500 text-white border-pink-500' : 'bg-white border-slate-200 text-slate-600 hover:border-pink-300'}`}
                 >
                   ${amt}
                 </button>
               ))}
               <div className="relative">
                 <span className="absolute left-2 top-2 text-slate-400 text-sm">$</span>
                 <input 
                   type="number" 
                   value={donation}
                   onChange={(e) => setDonation(Number(e.target.value))}
                   className="w-full pl-5 pr-1 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm"
                   placeholder="Other"
                 />
               </div>
            </div>
            <p className="text-xs text-slate-500">Helps us create free resources for teachers.</p>
          </div>

          {/* Checkout Button */}
          <button 
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-300 hover:to-purple-300 disabled:from-gray-300 disabled:to-gray-300 text-white py-4 rounded-xl font-bold text-lg shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-between px-6 group cursor-pointer no-underline"
          >
            <span>{isCheckingOut ? 'Creating checkout...' : 'Pre-order Now'}</span>
            <span className="bg-white/20 px-3 py-1 rounded-lg text-white font-mono group-hover:bg-white/30 transition-colors">
              ${total.toFixed(2)}
            </span>
          </button>

          {/* Error Message */}
          {checkoutError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              {checkoutError}
            </div>
          )}
          
          <div className="flex justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
            <Instagram size={20} className="cursor-pointer hover:text-pink-600 transition-colors" />
            <Twitter size={20} className="cursor-pointer hover:text-blue-400 transition-colors" />
            <Facebook size={20} className="cursor-pointer hover:text-blue-700 transition-colors" />
            <Youtube size={20} className="cursor-pointer hover:text-red-600 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessView({ userData, supporterNumber }) {
  const particles = Array.from({ length: 50 });
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  useEffect(() => {
    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    
    if (!window.html2canvas) {
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    try {
      if (window.html2canvas && cardRef.current) {
        let canvas = null;
        
        canvas = await window.html2canvas(cardRef.current, {
          backgroundColor: null, 
          scale: 2, 
          useCORS: true, 
          logging: false,
          allowTaint: false 
        });

        canvas.toBlob((blob) => {
            if (!blob) {
                throw new Error("Canvas is empty");
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `PiggyAndKay-Founder-${userData.firstName || 'Member'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setIsDownloading(false);
        }, 'image/png');

      } else {
        throw new Error("Library not loaded");
      }
    } catch (err) {
      console.error("Failed to download card:", err);
      
       try {
          const heroImage = document.getElementById('card-hero-image');
          const heroFallback = document.getElementById('card-hero-fallback');
          
          if(heroImage) heroImage.style.display = 'none';
          if(heroFallback) heroFallback.style.display = 'flex';

          const safeCanvas = await window.html2canvas(cardRef.current, {
              backgroundColor: null, 
              scale: 2, 
              useCORS: false, 
              logging: false
          });

          if(heroImage) heroImage.style.display = 'block';
          if(heroFallback) heroFallback.style.display = 'none';

          safeCanvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `PiggyAndKay-Founder-${userData.firstName || 'Member'}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                setIsDownloading(false);
          }, 'image/png');
       } catch (finalErr) {
           setDownloadError("Security settings blocked the image generation. Please try taking a screenshot instead!");
           setIsDownloading(false);
       }
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center w-full pt-10 pb-20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 rounded-sm animate-fall"
            style={{
               left: `${Math.random() * 100}%`,
               top: `-20px`,
               backgroundColor: ['#FFD700', '#FF69B4', '#E6E6FA', '#FFFFFF'][Math.floor(Math.random() * 4)],
               animationDuration: `${Math.random() * 2 + 3}s`,
               animationDelay: `${Math.random() * 0.5}s`
            }}
          />
        ))}
      </div>
      <div className="text-center mb-10 relative z-10 px-4">
        <h2 className={`${FONTS.head} text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4`}>
          Welcome to the Inner Circle!
        </h2>
        <p className="text-lg md:text-xl text-slate-600">
           The magic is officially yours, {userData.firstName}.
        </p>
      </div>

      {/* CARD CONTAINER (This is what gets downloaded) */}
      <div className="relative group perspective-1000 mb-8 px-4">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
        
        {/* The Card DOM Element */}
        <div 
          ref={cardRef}
          className="relative bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center transform transition-transform group-hover:rotate-1"
        >
          <div className="w-full h-1 bg-gradient-to-r from-pink-300 via-yellow-200 to-purple-300 mb-6 rounded-full" />
          
          {/* We add an ID to the Hero image so we can toggle it during screenshot */}
          <div id="card-hero-image">
             <PiggyAndKayHero className="w-40 h-32 mb-4" />
          </div>

          {/* FALLBACK BADGE */}
          <div id="card-hero-fallback" style={{display: 'none'}} className="w-32 h-32 mb-4 rounded-full bg-pink-100 items-center justify-center border-4 border-pink-200">
             <div className="text-center">
                <Star className="w-12 h-12 text-yellow-400 mx-auto fill-yellow-400" />
                <span className={`text-pink-600 font-bold ${FONTS.head} text-lg`}>Piggy & Kay</span>
             </div>
          </div>

          <div className="bg-green-500 border border-green-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Official Sparkle Holder
          </div>
          <h3 className={`${FONTS.head} text-3xl font-bold text-slate-800 mb-1`}>
            {userData.firstName} {userData.lastName}
          </h3>
          <p className="text-slate-400 text-sm mb-6">Supporter #{supporterNumber}</p>
          <div className="text-xs text-slate-500 italic border-t border-slate-100 pt-4 w-full">
            "You are now a part of Piggy & Kay's Sparkle Club where magic lives forever."
          </div>
        </div>
      </div>

      {/* Buttons: Download & Share */}
      <div className="flex flex-col gap-4 w-full max-w-xs justify-center items-center">
        
        {downloadError && (
             <div className="w-full mb-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                 <AlertCircle size={16} className="mt-0.5 shrink-0" />
                 <span>{downloadError}</span>
             </div>
        )}

        <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-slate-700 transition transform hover:scale-105 active:scale-95 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
             <span className="animate-pulse">Creating Magic...</span>
          ) : (
             <>
               <Download size={18} />
               <span>Download Card</span>
             </>
          )}
        </button>

        <div className="flex gap-4 w-full justify-center">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I just pre-ordered my copy of \"Piggy & Kay: A Winter Sparkle.\" I can't wait to read this with the kids!")}&url=${encodeURIComponent("https://piggy-and-kay.vercel.app")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#1DA1F2] text-white px-4 py-3 rounded-full font-bold shadow-lg hover:bg-[#1a91da] transition transform hover:scale-105 active:scale-95 text-sm cursor-pointer"
            >
              <Twitter size={18} />
              <span>Tweet</span>
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://piggy-and-kay.vercel.app")}&quote=${encodeURIComponent("I just pre-ordered my copy of \"Piggy & Kay: A Winter Sparkle.\" I can't wait to read this with the kids!")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#4267B2] text-white px-4 py-3 rounded-full font-bold shadow-lg hover:bg-[#365899] transition transform hover:scale-105 active:scale-95 text-sm cursor-pointer"
            >
              <Facebook size={18} />
              <span>Share</span>
            </a>
        </div>
      </div>
    </div>
  );
}
