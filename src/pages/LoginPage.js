import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ErrorBox from '../components/ErrorBox';
import PasswordField from '../components/PasswordField';

export default function LoginPage() {
  const [form, setForm]       = useState({ username:'', password:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data);
      navigate('/dashboard');
    } catch(err) {
      setError(err.clientMessage);
    } finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',background:'var(--bg)'}}>
      {/* Left Panel */}
      <div style={{flex:'0 0 45%',background:'linear-gradient(145deg,#1a3c2e 0%,#2d6a4f 50%,#40916c 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'3rem',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-80px',right:'-80px',width:'300px',height:'300px',background:'rgba(255,255,255,0.04)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-60px',left:'-60px',width:'240px',height:'240px',background:'rgba(255,255,255,0.03)',borderRadius:'50%'}}/>
        <div style={{position:'relative',textAlign:'center',color:'white'}}>
          <div style={{fontFamily:'var(--font-head)',fontSize:'48px',fontWeight:800,letterSpacing:'-1px',marginBottom:'12px'}}>EmpMS</div>
          <div style={{fontSize:'16px',opacity:.8,maxWidth:'260px',lineHeight:1.7}}>Employee Management System — manage your team with ease</div>
          <div style={{marginTop:'3rem',display:'flex',flexDirection:'column',gap:'16px'}}>
            {['Register employees','Manage roles','Track departments','Audit logs'].map(t=>(
              <div key={t} style={{display:'flex',alignItems:'center',gap:'12px',fontSize:'14px',opacity:.85}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#95d5b2',flexShrink:0}}/>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
        <div style={{width:'100%',maxWidth:'400px',animation:'fadeUp .4s ease'}}>
          <div style={{marginBottom:'2.5rem'}}>
            <div style={{fontFamily:'var(--font-head)',fontSize:'32px',fontWeight:800,letterSpacing:'-0.5px'}}>Welcome back</div>
            <div style={{color:'var(--text2)',marginTop:'6px',fontSize:'14px'}}>Sign in to your account to continue</div>
          </div>
          <form onSubmit={handle} style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
            <TextField label="Username" value={form.username} onChange={v=>setForm({...form,username:v})} placeholder="Enter your username"/>
            <PasswordField label="Password" value={form.password} onChange={v=>setForm({...form,password:v})} placeholder="Enter your password"/>
            <ErrorBox message={error}/>
            <button type="submit" disabled={loading}
              style={{padding:'13px',background:'var(--accent)',color:'white',border:'none',borderRadius:'10px',fontSize:'15px',fontWeight:700,cursor:loading?'not-allowed':'pointer',opacity:loading?.7:1,boxShadow:'0 4px 14px rgba(45,106,79,0.35)'}}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <div style={{marginTop:'2rem',textAlign:'center',fontSize:'14px',color:'var(--text2)'}}>
            Don't have an account?{' '}
            <Link to="/register" style={{color:'var(--accent)',textDecoration:'none',fontWeight:600}}>Create one</Link>
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
        style={{width:'100%',padding:'12px 14px',background:'var(--surface)',border:`1.5px solid ${focus?'var(--accent)':'var(--border)'}`,borderRadius:'10px',color:'var(--text)',fontSize:'14px',outline:'none',transition:'all .2s',boxShadow:focus?'0 0 0 3px rgba(45,106,79,0.12)':'none'}}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}/>
    </div>
  );
}