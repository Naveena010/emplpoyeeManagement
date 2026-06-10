import { useState } from 'react';

// Eye Open SVG
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// Eye Closed SVG
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function PasswordField({ label, value, onChange, placeholder }) {
  const [show,  setShow]  = useState(false);
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <div>
      <label style={{
        display:'block', fontSize:'12px', fontWeight:600,
        color:'var(--text2)', marginBottom:'7px',
        textTransform:'uppercase', letterSpacing:'.06em'
      }}>
        {label}
      </label>
      <div style={{position:'relative'}}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width:'100%',
            padding:'12px 46px 12px 14px',
            background:'var(--surface)',
            border:`1.5px solid ${focus ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius:'10px',
            color:'var(--text)',
            fontSize:'14px',
            outline:'none',
            transition:'all .2s',
            boxShadow: focus ? '0 0 0 3px rgba(45,106,79,0.12)' : 'none'
          }}
          onFocus={() => setFocus(true)}
          onBlur={()  => setFocus(false)}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          onMouseEnter={() => setHover(false)}
          onMouseLeave={() => setHover(true)}
          title={show ? 'Hide password' : 'Show password'}
          style={{
            position:'absolute',
            right:'12px',
            top:'50%',
            transform:'translateY(-50%)',
            background:'none',
            border:'none',
            cursor:'pointer',
            padding:'4px',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            color: hover ? 'var(--accent)' : 'var(--text3)',
            transition:'color .2s'
          }}
        >
          {show ? <EyeOpen/> : <EyeOff/>}
        </button>
      </div>
    </div>
  );
}