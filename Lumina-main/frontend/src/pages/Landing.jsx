import React, { useEffect, useRef, useState } from 'react';
import { useAccessibilityStore } from '../accessibility/useAccessibilityStore';

import { LuminaLogo } from '../components/BrandLogo';

// ─── Animated Counter ─────────────────────────────────────────────────────────
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
};

// ─── Night India SVG Background ───────────────────────────────────────────────
const HeroBg = () => (
  <svg viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0A1628"/>
        <stop offset="50%" stopColor="#1A2E52"/>
        <stop offset="100%" stopColor="#1A5C4A"/>
      </linearGradient>
      <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFDE7"/>
        <stop offset="60%" stopColor="#FFF9C4"/>
        <stop offset="100%" stopColor="#FFE082" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#4A90D9" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="#4A90D9" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1A4A38"/>
        <stop offset="100%" stopColor="#0F3028"/>
      </linearGradient>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1A7A62"/>
        <stop offset="100%" stopColor="#125040"/>
      </linearGradient>
    </defs>

    {/* Night sky */}
    <rect width="1440" height="700" fill="url(#nightSky)"/>

    {/* Stars — many */}
    {[
      [60,35],[140,18],[240,48],[380,14],[520,38],[680,11],[820,42],[960,20],[1100,36],[1280,15],[1400,44],
      [100,72],[300,58],[460,82],[640,65],[800,78],[1000,54],[1180,70],[1350,62],[1440,80],
      [180,105],[420,90],[700,115],[880,98],[1060,108],[1240,88],[1420,102],
      [50,130],[330,118],[600,140],[870,125],[1150,135],[1380,122],
      [200,28],[700,22],[1100,18],[400,52],[900,48],[1300,30],
    ].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={i%5===0?2:i%3===0?1.5:1}
        fill="#fff" opacity={0.3+((i*7)%10)*0.06}>
        {i%8===0 && <animate attributeName="opacity" values="0.2;0.9;0.2" dur={`${2+i%4}s`} repeatCount="indefinite"/>}
      </circle>
    ))}

    {/* Moon */}
    <circle cx="1180" cy="95" r="90" fill="url(#moonHalo)"/>
    <circle cx="1180" cy="95" r="54" fill="url(#moonGlow)" opacity="0.95"/>
    <circle cx="1204" cy="84" r="40" fill="#0A1628" opacity="0.28"/>
    {/* Moon craters */}
    <circle cx="1168" cy="108" r="8" fill="#FFF9C4" opacity="0.25"/>
    <circle cx="1196" cy="92" r="5" fill="#FFF9C4" opacity="0.2"/>

    {/* Far hills */}
    <path d="M0 500Q180 420 360 458Q540 496 720 428Q900 360 1080 440Q1260 520 1440 480L1440 700L0 700Z" fill="url(#hillFar)" opacity="0.6"/>
    <path d="M0 540Q240 490 480 516Q720 542 960 500Q1200 458 1440 510L1440 700L0 700Z" fill="#1A5C4A" opacity="0.8"/>

    {/* Ground */}
    <path d="M0 588Q360 562 720 574Q1080 586 1440 568L1440 700L0 700Z" fill="url(#ground)"/>
    <rect x="0" y="658" width="1440" height="42" fill="#125040"/>

    {/* LEFT — Banyan Tree silhouette */}
    <g transform="translate(72,250)" opacity="0.92">
      <rect x="-16" y="200" width="32" height="280" rx="16" fill="#0D2B1E"/>
      {/* Aerial roots */}
      <path d="M-40,280Q-48,330,-38,370" stroke="#0D2B1E" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M28,300Q38,350,30,390" stroke="#0D2B1E" strokeWidth="7" fill="none" strokeLinecap="round"/>
      <path d="M-20,310Q-26,355,-18,395" stroke="#0D2B1E" strokeWidth="6" fill="none" strokeLinecap="round"/>
      {/* Canopy */}
      <ellipse cx="0" cy="150" rx="105" ry="80" fill="#0F4030" opacity="0.95"/>
      <ellipse cx="-60" cy="130" rx="78" ry="66" fill="#125040" opacity="0.9"/>
      <ellipse cx="65" cy="126" rx="72" ry="62" fill="#0D3828" opacity="0.85"/>
      <ellipse cx="0" cy="96" rx="82" ry="65" fill="#156A52" opacity="0.8"/>
      <ellipse cx="-25" cy="108" rx="35" ry="25" fill="#1A7A62" opacity="0.3"/>
    </g>

    {/* LEFT MIDDLE — Lotus pond */}
    <ellipse cx="350" cy="618" rx="110" ry="32" fill="#0A3828" opacity="0.7"/>
    <ellipse cx="350" cy="614" rx="105" ry="26" fill="#156A52" opacity="0.35"/>
    {/* Water reflection shimmer */}
    {[310,350,392].map((x,i) => (
      <g key={i} transform={`translate(${x},600)`}>
        {[0,60,120,180,240,300].map((deg,j) => {
          const r=Math.PI*deg/180;
          return <ellipse key={j} cx={Math.cos(r)*10} cy={Math.sin(r)*7} rx="8" ry="4.5"
            fill={i===1?"#F48FB1":"#F8BBD0"} opacity="0.85"
            transform={`rotate(${deg} ${Math.cos(r)*10} ${Math.sin(r)*7})`}/>;
        })}
        <circle cx="0" cy="0" r="5.5" fill="#FFE082" opacity="0.9"/>
      </g>
    ))}

    {/* RIGHT — Coconut palms */}
    <g transform="translate(1350,260)">
      <path d="M0,400Q14,315,6,230Q-2,155,10,78" stroke="#2D1B0E" strokeWidth="20" fill="none" strokeLinecap="round"/>
      {[[-80,-14],[-45,-55],[0,-72],[45,-55],[80,-14],[60,22],[-60,22]].map(([dx,dy],i) => (
        <path key={i} d={`M10,78Q${10+dx*0.55},${78+dy*0.55} ${10+dx},${78+dy}`}
          stroke={['#0F4030','#156A52','#125040','#1A7A62','#0F4030','#0D3828','#125040'][i]}
          strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.9"/>
      ))}
      <circle cx="10" cy="82" r="11" fill="#4A2C0A"/>
      <circle cx="-4" cy="90" r="9" fill="#3D2308"/>
    </g>
    <g transform="translate(1450,290)">
      <path d="M0,360Q-12,278,-5,198Q5,128,-8,62" stroke="#2D1B0E" strokeWidth="16" fill="none" strokeLinecap="round"/>
      {[[-65,-11],[-36,-48],[0,-64],[36,-48],[65,-11],[50,19],[-50,19]].map(([dx,dy],i) => (
        <path key={i} d={`M-8,62Q${-8+dx*0.5},${62+dy*0.5} ${-8+dx},${62+dy}`}
          stroke={['#156A52','#0F4030','#1A7A62','#125040','#156A52','#0F4030','#0D3828'][i]}
          strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.82"/>
      ))}
    </g>

    {/* RIGHT — Peacock */}
    <g transform="translate(1200,510)" opacity="0.92">
      <ellipse cx="0" cy="0" rx="24" ry="15" fill="#0D3F6A"/>
      <path d="M-9,-12Q-14,-32,-12,-46" stroke="#125040" strokeWidth="11" fill="none" strokeLinecap="round"/>
      <circle cx="-12" cy="-49" r="11" fill="#156A52"/>
      {[-16,-12,-8].map((x,i) => (
        <g key={i}>
          <line x1={x} y1="-58" x2={x} y2="-70" stroke="#1A7A62" strokeWidth="2.5"/>
          <circle cx={x} cy="-71" r="3.5" fill="#4A90D9"/>
        </g>
      ))}
      <circle cx="-7" cy="-51" r="3.5" fill="#fff"/>
      <circle cx="-6.5" cy="-51" r="2" fill="#1A1A1A"/>
      <circle cx="-5.8" cy="-51.8" r="0.8" fill="#fff"/>
      {[[28,34],[40,18],[46,-4],[42,-26],[32,-44]].map(([dx,dy],i) => (
        <g key={i}>
          <path d={`M12,0Q${12+dx*0.55},${dy*0.55} ${12+dx},${dy}`}
            stroke="#0D3F6A" strokeWidth="3.5" fill="none" opacity="0.8"/>
          <ellipse cx={12+dx} cy={dy} rx="9" ry="5.5" fill="#4A90D9" opacity="0.55"
            transform={`rotate(${Math.atan2(dy,dx)*180/Math.PI} ${12+dx} ${dy})`}/>
          <circle cx={12+dx} cy={dy} r="4.5" fill="#7B68EE" opacity="0.7"/>
          <circle cx={12+dx} cy={dy} r="2" fill="#4A90D9" opacity="0.9"/>
        </g>
      ))}
    </g>

    {/* Fireflies */}
    {[[460,310],[580,280],[700,330],[820,305],[940,340],[1060,315],[540,370],[750,380]].map(([x,y],i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="3.5" fill="#FFE082" opacity="0.8">
          <animate attributeName="opacity" values="0.1;0.95;0.1" dur={`${1.4+i*0.35}s`} repeatCount="indefinite"/>
        </circle>
        <circle cx={x} cy={y} r="10" fill="#FFE082" opacity="0.12">
          <animate attributeName="opacity" values="0;0.25;0" dur={`${1.4+i*0.35}s`} repeatCount="indefinite"/>
        </circle>
      </g>
    ))}

    {/* Indian temple gateway silhouette */}
    <g opacity="0.12">
      <path d="M660 540L660 460Q660 420 680 405Q700 390 720 388Q740 390 760 405Q780 420 780 460L780 540Z" fill="#fff"/>
      <path d="M672 540L672 464Q672 430 688 418Q704 406 720 404Q736 406 752 418Q768 430 768 464L768 540Z" fill="#0A1628"/>
      <rect x="695" y="380" width="50" height="30" rx="5" fill="#fff"/>
      <polygon points="720,360 700,385 740,385" fill="#fff"/>
    </g>

    {/* Diyas on ground */}
    {[180,420,660,880,1100,1320].map((x,i) => (
      <g key={i} transform={`translate(${x},626)`}>
        <ellipse cx="0" cy="9" rx="13" ry="5.5" fill="#3D2308" opacity="0.7"/>
        <path d="M-9,0Q0,-9 9,0Q5,9,-5,9Z" fill="#8B5E3C" opacity="0.9"/>
        <circle cx="0" cy="-2" r="4.5" fill="#FFE082" opacity="0.95">
          <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.1+(i%3)*0.4}s`} repeatCount="indefinite"/>
        </circle>
        <ellipse cx="0" cy="-3" rx="2.5" ry="7" fill="#FFD54F" opacity="0.85">
          <animate attributeName="ry" values="6;9;6" dur={`${1.1+(i%3)*0.4}s`} repeatCount="indefinite"/>
        </ellipse>
      </g>
    ))}

    {/* Ground flowers */}
    {[130,320,530,740,950,1160,1370].map((x,i) => {
      const cs=[['#F8BBD0','#F48FB1'],['#FFF9C4','#FFE082'],['#B3E5FC','#81D4FA'],['#DCEDC8','#AED581'],['#F3B8FF','#CE93D8'],['#FFF9C4','#FFCC02'],['#B3E5FC','#80DEEA']];
      const [p1,p2]=cs[i%cs.length];
      return (
        <g key={i} transform={`translate(${x},590)`}>
          {[0,60,120,180,240,300].map((deg,j)=>{
            const rr=Math.PI*deg/180;
            return <ellipse key={j} cx={Math.cos(rr)*8} cy={Math.sin(rr)*8} rx="6" ry="3.8"
              fill={p1} opacity="0.78" transform={`rotate(${deg} ${Math.cos(rr)*8} ${Math.sin(rr)*8})`}/>;
          })}
          <circle cx="0" cy="0" r="5" fill={p2} opacity="0.88"/>
        </g>
      );
    })}

    {/* Foreground leaves */}
    <path d="M0 670Q55 610 130 645Q78 678 0 685Z" fill="#0D3828" opacity="0.9"/>
    <path d="M0 682Q72 638 158 658Q96 686 0 690Z" fill="#125040" opacity="0.6"/>
    <path d="M1440 670Q1385 610 1310 645Q1362 678 1440 685Z" fill="#0D3828" opacity="0.9"/>
    <path d="M1440 682Q1368 638 1282 658Q1344 686 1440 690Z" fill="#125040" opacity="0.6"/>
  </svg>
);

// ─── Main Landing ─────────────────────────────────────────────────────────────
export function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const store = useAccessibilityStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,500&display=swap');

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --navy:#0A1628;
          --blue:#4A90D9;
          --blue-mid:#357ABD;
          --blue-pale:#EBF4FF;
          --teal:#1A7A62;
          --teal-pale:#E4F2EE;
          --amber:#E8920C;
          --amber-pale:#FDF3DC;
          --purple:#7B68EE;
          --cream:#F7F6F2;
          --white:#FFFFFF;
          --text:#1A2635;
          --text-mid:#2A3F55;
          --text-soft:#5A7088;
          --border:rgba(74,144,217,0.13);
          --nav-h:68px;
        }
        html{scroll-behavior:smooth}
        body{
          font-family:'Nunito',sans-serif;
          background:var(--cream);
          color:var(--text);
          overflow-x:hidden;
          letter-spacing:0.018em;
          transition: background 0.3s ease, font-family 0.3s ease;
        }

        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}

        .a1{animation:fadeUp 0.75s 0.08s ease both}
        .a2{animation:fadeUp 0.75s 0.22s ease both}
        .a3{animation:fadeUp 0.75s 0.36s ease both}
        .a4{animation:fadeUp 0.75s 0.50s ease both}

        .nav{
          position:fixed;top:0;left:0;right:0;z-index:200;
          height:var(--nav-h);
          display:flex;align-items:center;
          padding:0 5%;
          transition:all 0.3s ease;
        }
        .nav.solid{
          background:rgba(247,246,242,0.97);
          backdrop-filter:blur(20px);
          box-shadow:0 1px 0 var(--border),0 4px 24px rgba(0,0,0,0.06);
        }
        .nav.clear{
          background:rgba(10,22,40,0.3);
          backdrop-filter:blur(10px);
        }
        .nav-link{
          font-size:14px;font-weight:700;letter-spacing:0.03em;
          text-decoration:none;
          color:var(--text-soft);
          transition:color 0.2s;position:relative;padding-bottom:2px;
        }
        .nav.clear .nav-link{color:rgba(255,255,255,0.75)}
        .nav-link::after{
          content:'';position:absolute;bottom:-2px;left:0;
          width:0;height:2.5px;background:var(--amber);
          transition:width 0.2s;border-radius:2px;
        }
        .nav-link:hover::after{width:100%}

        .btn-primary{
          display:inline-flex;align-items:center;gap:8px;
          background:var(--amber);color:#fff;
          font-family:'Nunito',sans-serif;font-weight:900;
          font-size:16px;letter-spacing:0.02em;
          padding:14px 38px;border-radius:100px;border:none;
          cursor:pointer;text-decoration:none;
          box-shadow:0 6px 22px rgba(232,146,12,0.42),0 3px 0 #B36A00 inset;
          transition:all 0.2s;
          animation:bounce 3s ease-in-out infinite;
        }
        .btn-primary:hover{
          background:#C87000;transform:translateY(-3px);
          box-shadow:0 10px 30px rgba(232,146,12,0.52);
          animation:none;
        }
        .btn-ghost{
          display:inline-flex;align-items:center;gap:8px;
          background:rgba(255,255,255,0.14);color:rgba(255,255,255,0.9);
          font-family:'Nunito',sans-serif;font-weight:800;
          font-size:15px;letter-spacing:0.02em;
          padding:13px 30px;border-radius:100px;
          border:2px solid rgba(255,255,255,0.35);
          cursor:pointer;text-decoration:none;
          backdrop-filter:blur(8px);
          transition:all 0.2s;
        }
        .btn-ghost:hover{
          background:rgba(255,255,255,0.24);
          border-color:rgba(255,255,255,0.72);
          transform:translateY(-2px);
        }

        .card{
          background:#fff;border-radius:20px;
          border:1.5px solid var(--border);
          box-shadow:0 4px 24px rgba(26,58,92,0.07);
        }
        .card-lift{transition:transform 0.28s ease,box-shadow 0.28s ease}
        .card-lift:hover{
          transform:translateY(-5px);
          box-shadow:0 20px 44px rgba(26,58,92,0.13)!important;
        }

        .eyebrow{
          font-size:11px;font-weight:900;letter-spacing:0.22em;
          text-transform:uppercase;color:var(--amber);
        }
        .sect-h2{
          font-family:'Fraunces',serif;
          font-size:clamp(1.85rem,3.5vw,2.8rem);
          font-weight:700;letter-spacing:-0.01em;
          color:var(--navy);line-height:1.13;
        }
        .sect-body{
          font-size:1.04rem;line-height:1.9;
          color:var(--text-soft);font-weight:600;
          letter-spacing:0.022em;
        }

        .preset-btn{
          display:flex;flex-direction:column;align-items:flex-start;gap:8px;
          background:#fff;border:2px solid var(--border);
          border-radius:16px;padding:20px;
          cursor:pointer;text-align:left;
          transition:all 0.22s;
          box-shadow:0 2px 12px rgba(26,58,92,0.06);
          font-family:'Nunito',sans-serif;
          min-height: 48px; min-width: 48px;
        }
        .preset-btn:hover{
          box-shadow:0 8px 28px rgba(74,144,217,0.18);
          transform:translateY(-3px);
        }

        /* Accessibility Preset Demo Effects */
        body.acc-mode-dyslexia { 
          font-family: 'Fraunces', serif !important; 
          background-color: #FFF9E5 !important;
          word-spacing: 0.15em;
          letter-spacing: 0.05em;
        }
        body.acc-mode-adhd .hero-card {
          border: 3px solid var(--amber) !important;
          box-shadow: 0 0 50px rgba(232, 146, 12, 0.3) !important;
        }
        body.acc-mode-blind {
          filter: contrast(120%) saturate(120%);
          font-size: 110%;
        }
        body.acc-mode-autism {
          --amber: #B36A00;
          --blue: #2A5A8D;
          --teal: #0D3F33;
        }
        body.acc-mode-autism * {
          animation: none !important;
          transition: none !important;
        }

        @media(max-width:860px){
          .feat-grid{grid-template-columns:1fr!important}
          .steps-grid{grid-template-columns:1fr 1fr!important}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important}
        }
        @media(max-width:540px){
          .steps-grid{grid-template-columns:1fr!important}
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:var(--cream)}
        ::-webkit-scrollbar-thumb{background:var(--blue);border-radius:3px}
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav className={`nav ${scrolled ? 'solid' : 'clear'}`} aria-label="Main navigation">
        <a href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0, minHeight: 48, minWidth: 48}}>
          <LuminaLogo size={36} color={scrolled ? '#4A90D9' : '#93C6FF'}/>
          <span style={{
            fontFamily:'Fraunces,serif',fontWeight:700,fontSize:22,
            letterSpacing:'-0.015em',
            color: scrolled ? '#0A1628' : '#fff',
            transition:'color 0.3s',
          }}>Lumina</span>
        </a>

        <div style={{display:'flex',alignItems:'center',gap:28,margin:'0 auto'}}>
          {['About','How it works','Research'].map(item=>(
            <a key={item} href={`#${item.toLowerCase().replace(/ /g,'-')}`} className="nav-link" style={{minHeight: 48, display: 'flex', alignItems: 'center'}}>{item}</a>
          ))}
        </div>

        <div style={{display:'flex',alignItems:'center',gap:16,flexShrink:0}}>
          <a href="/login" style={{
            fontSize:14,fontWeight:700,textDecoration:'none',
            color: scrolled ? 'var(--text-soft)' : 'rgba(255,255,255,0.75)',
            transition:'color 0.3s',
            minHeight: 48, display: 'flex', alignItems: 'center'
          }}>Log in</a>
          <a href="/onboarding" style={{
            display:'inline-flex',alignItems:'center',gap:6,
            background: scrolled ? 'var(--amber)' : 'rgba(255,255,255,0.16)',
            color:'#fff',
            fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:14,
            padding:'9px 20px',borderRadius:100,
            border: scrolled ? 'none' : '1.5px solid rgba(255,255,255,0.42)',
            textDecoration:'none',backdropFilter:'blur(8px)',
            transition:'all 0.3s',
            boxShadow: scrolled ? '0 4px 14px rgba(232,146,12,0.35)' : 'none',
            minHeight: 48
          }}>Get started →</a>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{
        position:'relative',minHeight:'100vh',
        display:'flex',flexDirection:'column',
        alignItems:'center',justifyContent:'center',
        overflow:'hidden',
      }}>
        <HeroBg/>

        <div style={{
          position:'relative',zIndex:5,
          display:'flex',flexDirection:'column',
          alignItems:'center',textAlign:'center',
          maxWidth:700,width:'90%',
          padding:'calc(var(--nav-h) + 48px) 0 60px',
        }}>
          <div className="hero-card" style={{
            background:'rgba(10,22,40,0.78)',
            backdropFilter:'blur(28px)',
            WebkitBackdropFilter:'blur(28px)',
            border:'1.5px solid rgba(255,255,255,0.14)',
            borderRadius:32,
            padding:'52px 56px 48px',
            boxShadow:'0 24px 64px rgba(0,0,0,0.36),inset 0 1px 0 rgba(255,255,255,0.1)',
            width:'100%',
            transition: 'border 0.3s ease, box-shadow 0.3s ease'
          }}>
            {/* Badge */}
            <div className="a1" style={{marginBottom:22}}>
              <span style={{
                display:'inline-flex',alignItems:'center',gap:7,
                background:'rgba(74,144,217,0.18)',
                border:'1.5px solid rgba(74,144,217,0.38)',
                borderRadius:100,padding:'6px 18px',
                fontSize:11.5,fontWeight:800,letterSpacing:'0.14em',
                textTransform:'uppercase',color:'#93C6FF',
              }}>
                <LuminaLogo size={14} color="#93C6FF"/>
                India's First Accessibility-Native EdTech
              </span>
            </div>

            {/* Headline */}
            <h1 className="a2" style={{
              fontFamily:'Fraunces,serif',
              fontSize:'clamp(2.4rem,5vw,3.8rem)',
              fontWeight:700,lineHeight:1.08,
              color:'#fff',
              letterSpacing:'-0.01em',
              marginBottom:22,
            }}>
              Every child deserves to{' '}
              <em style={{color:'#F5B84C',fontStyle:'italic'}}>learn their way.</em>
            </h1>

            {/* Subhead */}
            <p className="a3" style={{
              fontSize:'1.08rem',lineHeight:1.9,
              color:'rgba(255,255,255,0.72)',
              fontWeight:600,
              letterSpacing:'0.022em',
              maxWidth:500,margin:'0 auto 38px',
            }}>
              Lumina is an inclusive AI learning platform built for India's 7.8 million
              students with disabilities. No labels. No limits. Just personalised, joyful learning.
            </p>

            {/* CTAs */}
            <div className="a4" style={{
              display:'flex',gap:14,justifyContent:'center',
              flexWrap:'wrap',marginBottom:38,
            }}>
              <a href="/onboarding" className="btn-primary" style={{minHeight: 48}}>Start your journey →</a>
              <a href="/demo" className="btn-ghost" style={{minHeight: 48}}>Watch demo</a>
            </div>

            {/* Trust row */}
            <div className="a4" style={{
              display:'flex',justifyContent:'center',
              flexWrap:'wrap',gap:0,
              paddingTop:24,
              borderTop:'1px solid rgba(255,255,255,0.1)',
            }}>
              {[
                {icon:'🎓',text:'7.8M+ underserved students'},
                {icon:'🇮🇳',text:'Built for Bharat'},
                {icon:'🤖',text:'AI-powered & offline-first'},
              ].map(({icon,text},i)=>(
                <div key={text} style={{
                  display:'flex',alignItems:'center',gap:7,
                  paddingRight:i<2?22:0,marginRight:i<2?22:0,
                  borderRight:i<2?'1px solid rgba(255,255,255,0.1)':'none',
                }}>
                  <span style={{fontSize:16}} aria-hidden="true">{icon}</span>
                  <span style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,0.55)'}}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{
          position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',
          zIndex:5,display:'flex',flexDirection:'column',alignItems:'center',gap:6,
          animation:'fadeIn 2s 1.2s ease both',
        }}>
          <span style={{fontSize:12,fontWeight:700,color:'rgba(255,255,255,0.45)',letterSpacing:'0.08em'}}>Scroll to explore</span>
          <span style={{fontSize:18,color:'rgba(255,255,255,0.55)',animation:'floatY 1.9s ease-in-out infinite'}} aria-hidden="true">↓</span>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{background:'var(--navy)',padding:'56px 6%'}}>
        <div className="stats-grid" style={{
          display:'grid',gridTemplateColumns:'repeat(4,1fr)',
          gap:28,maxWidth:960,margin:'0 auto',textAlign:'center',
        }}>
          {[
            {val:7.8,suf:'M+',lab:'Students with disabilities in India'},
            {val:14,suf:'',lab:'Disability categories supported'},
            {val:12,suf:'+',lab:'Indian languages'},
            {val:0,suf:'',lab:'Medical labels required to start'},
          ].map(({val,suf,lab})=>(
            <div key={lab}>
              <div style={{
                fontFamily:'Fraunces,serif',fontSize:'2.8rem',
                fontWeight:700,color:'#F5B84C',lineHeight:1,marginBottom:9,
              }}>
                <Counter target={val} suffix={suf}/>
              </div>
              <div style={{color:'rgba(255,255,255,0.62)',fontSize:13.5,lineHeight:1.62,fontWeight:600}}>
                {lab}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" style={{background:'var(--cream)',padding:'92px 6%'}}>
        <div style={{maxWidth:1060,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:62}}>
            <p className="eyebrow" style={{marginBottom:12}}>The Lumina difference</p>
            <h2 className="sect-h2" style={{marginBottom:14}}>
              Not a platform with accessibility.<br/>
              <em style={{fontStyle:'italic',color:'var(--blue)'}}>An accessibility engine that teaches.</em>
            </h2>
            <p className="sect-body" style={{maxWidth:480,margin:'0 auto'}}>
              The same lesson. Infinite forms. Audio, visual, interactive, or tactile —
              switched automatically based on how each student learns.
            </p>
          </div>

          <div className="feat-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:22}}>
            {[
              {
                icon:'🎧',color:'#4A90D9',bg:'#EBF4FF',
                title:'For students',
                desc:'No diagnosis required. Tell Lumina what helps you — it adapts every lesson, every game, every quiz to match how your mind works.',
                tags:['Audio-first lessons','Visual diagrams','Interactive games','Voice answers'],
              },
              {
                icon:'📊',color:'#1A7A62',bg:'#E4F2EE',
                title:'For teachers',
                desc:"Live cognitive state dashboard. See who's stuck on content vs. stuck on accessibility. Get AI-powered intervention scripts instantly.",
                tags:['Live class heatmap','Pattern detection','IEP automation','Differentiation AI'],
              },
              {
                icon:'🏠',color:'#7B68EE',bg:'#F0EEFF',
                title:'For parents',
                desc:'Progress reports in your language, on WhatsApp. Home activity suggestions using household items. Zero app downloads needed.',
                tags:['WhatsApp reports','Home activities','Hindi/English','Zero tech needed'],
              },
            ].map(({icon,color,bg,title,desc,tags})=>(
              <div key={title} className="card card-lift" style={{padding:'30px 26px'}}>
                <div style={{
                  width:60,height:60,background:bg,borderRadius:17,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:26,marginBottom:18,
                  border:`1.5px solid ${color}22`,
                }} aria-hidden="true">{icon}</div>
                <h3 style={{fontSize:'1.12rem',fontWeight:800,color:'var(--text)',marginBottom:10}}>{title}</h3>
                <p style={{color:'var(--text-soft)',fontSize:14.5,lineHeight:1.84,marginBottom:18,fontWeight:600}}>{desc}</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                  {tags.map(t=>(
                    <span key={t} style={{
                      background:bg,color,fontSize:12,fontWeight:800,
                      padding:'4px 12px',borderRadius:100,border:`1px solid ${color}22`,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div style={{marginTop:78}}>
            <div style={{textAlign:'center',marginBottom:48}}>
              <p className="eyebrow" style={{marginBottom:12}}>The journey</p>
              <h2 className="sect-h2">How Lumina works</h2>
            </div>
            <div className="steps-grid" style={{
              display:'grid',gridTemplateColumns:'repeat(4,1fr)',
              gap:18,position:'relative',
            }}>
              <div style={{
                position:'absolute',top:28,left:'12.5%',right:'12.5%',height:1.5,
                background:'repeating-linear-gradient(90deg,var(--blue) 0,var(--blue) 5px,transparent 5px,transparent 12px)',
                opacity:0.15,pointerEvents:'none',
              }}/>
              {[
                {num:'01',icon:'✨',title:'Tell us what helps',desc:'5-minute preference wizard. No disability labels. Just: do you prefer listening, reading, or playing?'},
                {num:'02',icon:'🎮',title:'Enter Gyaan Lok',desc:'Your Indian mythology learning world. Choose your scholar avatar and start your first quest.'},
                {num:'03',icon:'🧠',title:'Lumina adapts',desc:'Real-time adaptation. Same lesson, different format — switched automatically as you learn.'},
                {num:'04',icon:'📈',title:'Grow together',desc:'Teacher and parent get live insights. Diya AI mentor guides you through every stuck moment.'},
              ].map(({num,icon,title,desc})=>(
                <div key={num} className="card card-lift" style={{padding:'26px 20px',textAlign:'center',position:'relative',zIndex:1}}>
                  <div style={{
                    fontFamily:'Fraunces,serif',color:'var(--amber)',
                    fontSize:11.5,fontWeight:700,marginBottom:10,letterSpacing:'0.1em',
                  }}>{num}</div>
                  <div style={{fontSize:30,marginBottom:10}} aria-hidden="true">{icon}</div>
                  <h4 style={{fontWeight:800,fontSize:'0.93rem',color:'var(--text)',marginBottom:8}}>{title}</h4>
                  <p style={{color:'var(--text-soft)',fontSize:13.5,lineHeight:1.82,fontWeight:600}}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRY PRESETS ══ */}
      <section style={{background:'#EEF4FF',padding:'92px 6%'}}>
        <div style={{maxWidth:1060,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:54}}>
            <p className="eyebrow" style={{marginBottom:12}}>Live demo</p>
            <h2 className="sect-h2" style={{marginBottom:14}}>See it adapt in real time</h2>
            <p className="sect-body" style={{maxWidth:440,margin:'0 auto'}}>
              Click any profile. Watch the entire platform transform instantly for that learner.
            </p>
          </div>

          <div style={{
            display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',
            gap:16,marginBottom:28,
          }}>
            {[
              {key:'dyslexia',icon:'📖',title:'Dyslexia Mode',desc:'OpenDyslexic font · Cream background · Syllable spacing · Audio sync',color:'#4A90D9',bg:'#EBF4FF'},
              {key:'adhd',icon:'⚡',title:'ADHD Mode',desc:'10-min sessions · Break reminders · Distraction-free · Micro rewards',color:'#E8920C',bg:'#FDF3DC'},
              {key:'blind',icon:'🔊',title:'Blind / VI Mode',desc:'High contrast · Large text · Keyboard nav · Audio-first everything',color:'#1A7A62',bg:'#E4F2EE'},
              {key:'autism',icon:'🌿',title:'Low Sensory Mode',desc:'Muted tones · Zero motion · Step-by-step · Predictable layout',color:'#7B68EE',bg:'#F0EEFF'},
            ].map(({key,icon,title,desc,color,bg})=>(
              <button key={key} className="preset-btn"
                onClick={()=>store.applyPreset(key)}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=color;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';}}
                aria-label={`Apply ${title}`}
              >
                <div style={{
                  width:48,height:48,background:bg,borderRadius:14,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:24,border:`1.5px solid ${color}22`,
                }} aria-hidden="true">{icon}</div>
                <span style={{fontSize:'0.95rem',fontWeight:800,color:'var(--text)'}}>{title}</span>
                <span style={{fontSize:'0.78rem',color:'var(--text-soft)',lineHeight:1.55,fontWeight:600}}>{desc}</span>
              </button>
            ))}
          </div>

          <div style={{textAlign:'center'}}>
            <button onClick={()=>store.resetToDefaults()} style={{
              background:'transparent',border:'none',cursor:'pointer',
              fontSize:'0.82rem',color:'var(--text-soft)',textDecoration:'underline',
              minHeight: 48, minWidth: 48
            }}>Reset to defaults</button>
          </div>
        </div>
      </section>

      {/* ══ DISABILITIES GRID ══ */}
      <section style={{background:'var(--cream)',padding:'92px 6%'}}>
        <div style={{maxWidth:1060,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:54}}>
            <p className="eyebrow" style={{marginBottom:12}}>Complete coverage</p>
            <h2 className="sect-h2" style={{marginBottom:14}}>14 categories. One platform.</h2>
            <p className="sect-body" style={{maxWidth:420,margin:'0 auto'}}>
              Most EdTech serves one learner type. Lumina serves all of them simultaneously on the same interface.
            </p>
          </div>
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',
            gap:12,
          }}>
            {[
              {icon:'📖',name:'Dyslexia',color:'#4A90D9',bg:'#EBF4FF'},
              {icon:'🔢',name:'Dyscalculia',color:'#E8920C',bg:'#FDF3DC'},
              {icon:'✏️',name:'Dysgraphia',color:'#7B68EE',bg:'#F0EEFF'},
              {icon:'⚡',name:'ADHD',color:'#E8920C',bg:'#FDF3DC'},
              {icon:'👁️',name:'Visual Impairment',color:'#1A7A62',bg:'#E4F2EE'},
              {icon:'🔊',name:'Hearing Impairment',color:'#4A90D9',bg:'#EBF4FF'},
              {icon:'✋',name:'Motor Disability',color:'#7B68EE',bg:'#F0EEFF'},
              {icon:'🧩',name:'Autism Spectrum',color:'#1A7A62',bg:'#E4F2EE'},
              {icon:'🧠',name:'Cognitive Differences',color:'#E8920C',bg:'#FDF3DC'},
              {icon:'🔇',name:'Deafblind',color:'#4A90D9',bg:'#EBF4FF'},
              {icon:'📵',name:'Low Literacy',color:'#1A7A62',bg:'#E4F2EE'},
              {icon:'🌐',name:'Language Barriers',color:'#7B68EE',bg:'#F0EEFF'},
              {icon:'📡',name:'No Internet Access',color:'#E8920C',bg:'#FDF3DC'},
              {icon:'🏡',name:'Rural Learners',color:'#1A7A62',bg:'#E4F2EE'},
            ].map(({icon,name,color,bg})=>(
              <div key={name} style={{
                background:bg,borderRadius:14,padding:'16px 14px',
                border:`1.5px solid ${color}1A`,
                display:'flex',alignItems:'center',gap:10,
                transition:'all 0.22s',cursor:'default',
              }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow=`0 8px 24px ${color}28`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}
              >
                <span style={{fontSize:22,flexShrink:0}} aria-hidden="true">{icon}</span>
                <span style={{fontSize:13.5,fontWeight:800,color,lineHeight:1.3}}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{
        background:'var(--navy)',padding:'92px 6%',
        position:'relative',overflow:'hidden',textAlign:'center',
      }}>
        <div style={{position:'absolute',top:-130,left:-130,width:420,height:420,borderRadius:'50%',background:'rgba(74,144,217,0.07)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:-90,right:-90,width:340,height:340,borderRadius:'50%',background:'rgba(232,146,12,0.07)',pointerEvents:'none'}}/>

        <div style={{position:'relative',zIndex:1}}>
          <div style={{display:'flex',justifyContent:'center',marginBottom:26}}>
            <div style={{
              width:76,height:76,
              background:'rgba(74,144,217,0.16)',
              borderRadius:24,display:'flex',alignItems:'center',justifyContent:'center',
              border:'2px solid rgba(74,144,217,0.32)',
              boxShadow:'0 8px 28px rgba(0,0,0,0.2)',
            }} aria-hidden="true">
              <LuminaLogo size={44} color="#93C6FF"/>
            </div>
          </div>

          <p className="eyebrow" style={{color:'rgba(255,255,255,0.45)',marginBottom:16}}>Ready to begin?</p>
          <h2 style={{
            fontFamily:'Fraunces,serif',fontSize:'clamp(2rem,4vw,3.1rem)',
            fontWeight:700,color:'#fff',letterSpacing:'-0.01em',
            marginBottom:18,lineHeight:1.14,
          }}>
            Start your child's<br/>learning adventure today.
          </h2>
          <p style={{
            color:'rgba(255,255,255,0.62)',fontSize:'1.04rem',
            maxWidth:420,margin:'0 auto 42px',lineHeight:1.9,fontWeight:600,
            letterSpacing:'0.022em',
          }}>
            Free to try. No diagnosis required. No medical labels.
            Just a child who deserves to learn in the way that works for them.
          </p>
          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
            <a href="/onboarding" className="btn-primary" style={{animation:'none',fontSize:16,padding:'16px 42px', minHeight: 48}}>
              Start for free →
            </a>
            <a href="/login" className="btn-ghost" style={{minHeight: 48}}>Log in to dashboard</a>
          </div>
          <p style={{color:'rgba(255,255,255,0.28)',fontSize:12.5,marginTop:26,fontWeight:700}}>
            Free for schools · Offline-first · Built for Bharat
          </p>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{
        background:'var(--cream)',borderTop:'1.5px solid var(--border)',
        padding:'34px 6%',
      }}>
        <div style={{
          maxWidth:1060,margin:'0 auto',
          display:'flex',alignItems:'center',justifyContent:'space-between',
          flexWrap:'wrap',gap:16,
        }}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none', minHeight: 48}}>
            <LuminaLogo size={30} color="#4A90D9"/>
            <span style={{fontFamily:'Fraunces,serif',fontWeight:700,fontSize:19,color:'var(--navy)',letterSpacing:'-0.01em'}}>
              Lumina
            </span>
          </a>
          <p style={{color:'var(--text-soft)',fontSize:13,fontWeight:700}}>
            © 2026 Lumina — Built for Every Mind in India.
          </p>
          <div style={{display:'flex',gap:22}}>
            {['Privacy','Terms','Contact'].map(l=>(
              <a key={l} href={`/${l.toLowerCase()}`} style={{
                color:'var(--text-soft)',textDecoration:'none',
                fontSize:13,fontWeight:700,transition:'color 0.2s',
                minHeight: 48, display: 'flex', alignItems: 'center'
              }}
                onMouseOver={e=>{e.currentTarget.style.color='var(--blue)';}}
                onMouseOut={e=>{e.currentTarget.style.color='var(--text-soft)';}}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
