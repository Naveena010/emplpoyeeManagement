import { useEffect, useState } from 'react';
import { getEmployees } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const { isAdmin } = useAuth();
  const navigate    = useNavigate();

  useEffect(() => {
    getEmployees().then(r => { setEmployees(r.data); setLoading(false); }).catch(()=>setLoading(false));
  }, []);

  const active   = employees.filter(e=>e.status==='ACTIVE').length;
  const inactive = employees.filter(e=>e.status==='INACTIVE').length;
  const depts    = new Set(employees.map(e=>e.department)).size;

  const stats = [
    { label:'Total Employees', value:employees.length, icon:'👥', color:'var(--accent)',   bg:'var(--accent-dim)',  border:'#b7e4c7' },
    { label:'Active',          value:active,           icon:'✅', color:'var(--blue)',     bg:'var(--blue-lt)',    border:'#bfdbfe' },
    { label:'Inactive',        value:inactive,         icon:'⏸',  color:'var(--red)',      bg:'var(--red-lt)',     border:'#fca5a5' },
    { label:'Departments',     value:depts,            icon:'🏢', color:'var(--amber)',    bg:'var(--amber-lt)',   border:'#fcd34d' },
  ];

  return (
    <div style={{animation:'fadeUp .35s ease'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'2rem'}}>
        <div>
          <div style={{fontFamily:'var(--font-head)',fontSize:'30px',fontWeight:800,color:'var(--text)',letterSpacing:'-0.5px'}}>
            Dashboard <span style={{color:'var(--accent)'}}>Overview</span>
          </div>
          <div style={{color:'var(--text2)',fontSize:'14px',marginTop:'4px'}}>Here's what's happening with your team</div>
        </div>
        {isAdmin && (
          <button onClick={()=>navigate('/add-employee')}
            style={{padding:'11px 22px',background:'var(--accent)',color:'white',border:'none',borderRadius:'10px',fontSize:'14px',fontWeight:700,cursor:'pointer',boxShadow:'0 4px 14px rgba(45,106,79,0.3)',transition:'all .2s'}}
            onMouseEnter={e=>e.target.style.transform='translateY(-1px)'}
            onMouseLeave={e=>e.target.style.transform='translateY(0)'}>
            + Add Employee
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
        {stats.map(s=>(
          <div key={s.label} style={{background:'var(--surface)',border:`1px solid ${s.border}`,borderRadius:'var(--radius-lg)',padding:'1.25rem 1.5rem',boxShadow:'var(--shadow-sm)',transition:'all .2s',cursor:'default'}}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='var(--shadow-md)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='var(--shadow-sm)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
              <div style={{fontSize:'11px',fontWeight:700,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'.06em'}}>{s.label}</div>
              <div style={{fontSize:'20px'}}>{s.icon}</div>
            </div>
            <div style={{fontFamily:'var(--font-head)',fontSize:'38px',fontWeight:800,color:s.color,lineHeight:1}}>
              {loading ? '—' : s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',overflow:'hidden',boxShadow:'var(--shadow-sm)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border)',background:'var(--surface2)'}}>
          <div style={{fontFamily:'var(--font-head)',fontSize:'16px',fontWeight:700,color:'var(--text)'}}>Recent Employees</div>
          <button onClick={()=>navigate('/employees')} style={{fontSize:'12px',color:'var(--accent)',background:'none',border:'none',cursor:'pointer',fontWeight:600}}>View all →</button>
        </div>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'var(--surface2)'}}>
              {['Name','Email','Department','Designation','Status'].map(h=>(
                <th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:'11px',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'.06em',fontWeight:700,borderBottom:'1px solid var(--border)'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{padding:'3rem',textAlign:'center',color:'var(--text2)'}}>Loading…</td></tr>
            ) : employees.slice(0,6).map((e,i)=>(
              <tr key={e.id} style={{borderBottom:'1px solid var(--border)',transition:'background .15s',animationDelay:`${i*0.05}s`}}
                onMouseEnter={ev=>ev.currentTarget.style.background='var(--surface2)'}
                onMouseLeave={ev=>ev.currentTarget.style.background='transparent'}>
                <td style={{padding:'13px 16px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'var(--accent-dim)',border:'1px solid #b7e4c7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,color:'var(--accent)',flexShrink:0}}>
                      {e.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{fontWeight:600,color:'var(--text)'}}>{e.name}</span>
                  </div>
                </td>
                <td style={{padding:'13px 16px',color:'var(--text2)',fontSize:'13px'}}>{e.email}</td>
                <td style={{padding:'13px 16px'}}>
                  <span style={{fontSize:'12px',padding:'3px 10px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:'20px',color:'var(--text2)'}}>{e.department}</span>
                </td>
                <td style={{padding:'13px 16px',color:'var(--text2)'}}>{e.designation||'—'}</td>
                <td style={{padding:'13px 16px'}}><StatusBadge status={e.status}/></td>
              </tr>
            ))}
            {!loading && employees.length===0 && (
              <tr><td colSpan={5} style={{padding:'3rem',textAlign:'center',color:'var(--text2)'}}>No employees yet. Add one to get started.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const a = status==='ACTIVE';
  return <span style={{display:'inline-flex',alignItems:'center',gap:'5px',padding:'4px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:700,background:a?'#d8f3dc':'var(--red-lt)',color:a?'var(--accent)':'var(--red)',border:`1px solid ${a?'#95d5b2':'#fca5a5'}`}}><span style={{width:'6px',height:'6px',borderRadius:'50%',background:a?'var(--accent)':'var(--red)',display:'inline-block'}}/>{status}</span>;
}