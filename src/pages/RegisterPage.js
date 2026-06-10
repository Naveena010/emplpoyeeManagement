import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import ErrorBox from '../components/ErrorBox';
import PasswordField from '../components/PasswordField';

export default function RegisterPage() {
  const [form, setForm]       = useState({ username:'', password:'', role:'ROLE_USER' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await register(form);
      setSuccess(res.data + ' — redirecting to login…');
      setTimeout(() => navigate('/login'), 1800);
    } catch(err) {
      setError(err.clientMessage);
    } finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',background:'var(--bg)'}}>
      {/* Left Panel */}
      <div style={{flex:'0 0 45%',background:'linear-gradient(145deg,#1e3a5f 0%,#1a56db 60%,#3b82f6 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'3rem',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-80px',right:'-80px',width:'300px',height:'300px',background:'rgba(255,255,255,0.05)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-60px',left:'-60px',width:'240px',height:'240px',background:'rgba(255,255,255,0.03)',borderRadius:'50%'}}/>
        <div style={{position:'relative',textAlign:'center',color:'white'}}>
          <div style={{fontFamily:'var(--font-head)',fontSize:'48px',fontWeight:800,letterSpacing:'-1px',marginBottom:'12px'}}>EmpMS</div>
          <div style={{fontSize:'16px',opacity:.8,maxWidth:'260px',lineHeight:1.7}}>Join your team — create an account and get started today</div>
          <div style={{marginTop:'3rem',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            {[{icon:'👑',label:'Admin Role'},{icon:'👤',label:'User Role'},{icon:'🔒',label:'Secure Auth'},{icon:'📊',label:'Dashboard'}].map(i=>(
              <div key={i.label} style={{background:'rgba(255,255,255,0.1)',borderRadius:'12px',padding:'14px',textAlign:'center'}}>
                <div style={{fontSize:'22px',marginBottom:'4px'}}>{i.icon}</div>
                <div style={{fontSize:'12px',opacity:.85}}>{i.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
        <div style={{width:'100%',maxWidth:'400px',animation:'fadeUp .4s ease'}}>
          <div style={{marginBottom:'2.5rem'}}>
            <div style={{fontFamily:'var(--font-head)',fontSize:'32px',fontWeight:800,letterSpacing:'-0.5px'}}>Create account</div>
            <div style={{color:'var(--text2)',marginTop:'6px',fontSize:'14px'}}>Fill in your details to get started</div>
          </div>
          <form onSubmit={handle} style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
            <TextField label="Username" value={form.username} onChange={v=>setForm({...form,username:v})} placeholder="Choose a username"/>
            <PasswordField label="Password" value={form.password} onChange={v=>setForm({...form,password:v})} placeholder="Choose a password"/>
            <div>
              <label style={{display:'block',fontSize:'12px',fontWeight:600,color:'var(--text2)',marginBottom:'7px',textTransform:'uppercase',letterSpacing:'.06em'}}>Role</label>
              <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}
                style={{width:'100%',padding:'12px 14px',background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'10px',color:'var(--text)',fontSize:'14px',outline:'none'}}>
                <option value="ROLE_USER">👤 User — view only</option>
                <option value="ROLE_ADMIN">👑 Admin — full access</option>
              </select>
            </div>
            <ErrorBox message={error}/>
            {success && (
              <div style={{padding:'12px 16px',background:'#d8f3dc',border:'1px solid #95d5b2',borderRadius:'10px',color:'var(--accent)',fontSize:'13px',fontWeight:500}}>
                ✅ {success}
              </div>
            )}
            <button type="submit" disabled={loading}
              style={{padding:'13px',background:'var(--blue)',color:'white',border:'none',borderRadius:'10px',fontSize:'15px',fontWeight:700,cursor:loading?'not-allowed':'pointer',opacity:loading?.7:1,boxShadow:'0 4px 14px rgba(26,86,219,0.35)'}}>
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </form>
          <div style={{marginTop:'2rem',textAlign:'center',fontSize:'14px',color:'var(--text2)'}}>
            Already have an account?{' '}
            <Link to="/login" style={{color:'var(--blue)',textDecoration:'none',fontWeight:600}}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <label style={{display:'block',fontSize:'12px',fontWeight:600,color:'var(--text2)',marginBottom:'7px',textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</label>
      <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:'100%',padding:'12px 14px',background:'var(--surface)',border:`1.5px solid ${focus?'var(--blue)':'var(--border)'}`,borderRadius:'10px',color:'var(--text)',fontSize:'14px',outline:'none',transition:'all .2s',boxShadow:focus?'0 0 0 3px rgba(26,86,219,0.12)':'none'}}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}/>
    </div>
  );
}