import { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [toast,     setToast]     = useState({ msg:'', type:'' });
  const { isAdmin } = useAuth();
  const navigate    = useNavigate();

  const load = () => {
    setLoading(true);
    getEmployees().then(r=>{ setEmployees(r.data); setFiltered(r.data); setLoading(false); }).catch(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{
    const q = search.toLowerCase();
    setFiltered(employees.filter(e=>e.name.toLowerCase().includes(q)||e.department.toLowerCase().includes(q)||e.email.toLowerCase().includes(q)));
  },[search,employees]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee? Status will be set to INACTIVE.')) return;
    try { await deleteEmployee(id); showToast('Employee deleted.','success'); load(); }
    catch(e) { showToast(e.response?.data?.message||'Delete failed.','error'); }
  };
  const showToast = (msg,type) => { setToast({msg,type}); setTimeout(()=>setToast({msg:'',type:''}),3000); };

  return (
    <div style={{animation:'fadeUp .35s ease'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.75rem'}}>
        <div>
          <div style={{fontFamily:'var(--font-head)',fontSize:'30px',fontWeight:800,letterSpacing:'-0.5px'}}>
            Employees <span style={{color:'var(--accent)'}}>Directory</span>
          </div>
          <div style={{color:'var(--text2)',fontSize:'14px',marginTop:'4px'}}>{employees.length} total employees</div>
        </div>
        {isAdmin && (
          <button onClick={()=>navigate('/add-employee')}
            style={{padding:'11px 22px',background:'var(--accent)',color:'white',border:'none',borderRadius:'10px',fontSize:'14px',fontWeight:700,cursor:'pointer',boxShadow:'0 4px 14px rgba(45,106,79,0.3)'}}>
            + Add Employee
          </button>
        )}
      </div>

      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',overflow:'hidden',boxShadow:'var(--shadow-sm)'}}>
        {/* Toolbar */}
        <div style={{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem 1.5rem',borderBottom:'1px solid var(--border)',background:'var(--surface2)'}}>
          <div style={{position:'relative',flex:1}}>
            <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'14px',pointerEvents:'none'}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, department, email…"
              style={{width:'100%',padding:'9px 12px 9px 36px',background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'9px',color:'var(--text)',fontSize:'13px',outline:'none',transition:'border-color .2s'}}
              onFocus={e=>e.target.style.borderColor='var(--accent)'}
              onBlur={e=>e.target.style.borderColor='var(--border)'}/>
          </div>
          <span style={{fontSize:'12px',color:'var(--text2)',fontWeight:500,whiteSpace:'nowrap',background:'var(--accent-dim)',padding:'5px 12px',borderRadius:'20px',color:'var(--accent)'}}>{filtered.length} results</span>
        </div>

        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:'750px'}}>
            <thead>
              <tr style={{background:'var(--surface2)'}}>
                {['#','Employee','Email','Department','Designation','Phone','Salary','Status','Actions'].map(h=>(
                  <th key={h} style={{padding:'11px 16px',textAlign:'left',fontSize:'11px',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'.06em',fontWeight:700,borderBottom:'1px solid var(--border)',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{padding:'4rem',textAlign:'center',color:'var(--text2)'}}>Loading employees…</td></tr>
              ) : filtered.length===0 ? (
                <tr><td colSpan={9} style={{padding:'4rem',textAlign:'center',color:'var(--text2)'}}>No employees match your search.</td></tr>
              ) : filtered.map(e=>(
                <tr key={e.id} style={{borderBottom:'1px solid var(--border)',transition:'background .15s'}}
                  onMouseEnter={ev=>ev.currentTarget.style.background='var(--surface2)'}
                  onMouseLeave={ev=>ev.currentTarget.style.background='transparent'}>
                  <td style={{padding:'13px 16px',color:'var(--text3)',fontSize:'12px',fontWeight:600}}>#{e.id}</td>
                  <td style={{padding:'13px 16px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                      <div style={{width:'34px',height:'34px',borderRadius:'50%',background:'var(--accent-dim)',border:'1.5px solid #b7e4c7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:800,color:'var(--accent)',flexShrink:0}}>
                        {e.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{fontWeight:600,color:'var(--text)',fontSize:'14px'}}>{e.name}</span>
                    </div>
                  </td>
                  <td style={{padding:'13px 16px',color:'var(--text2)',fontSize:'13px'}}>{e.email}</td>
                  <td style={{padding:'13px 16px'}}>
                    <span style={{fontSize:'12px',padding:'3px 10px',background:'var(--blue-lt)',border:'1px solid #bfdbfe',borderRadius:'20px',color:'var(--blue)',fontWeight:500}}>{e.department}</span>
                  </td>
                  <td style={{padding:'13px 16px',color:'var(--text2)',fontSize:'13px'}}>{e.designation||'—'}</td>
                  <td style={{padding:'13px 16px',color:'var(--text2)',fontSize:'13px'}}>{e.phone||'—'}</td>
                  <td style={{padding:'13px 16px',fontWeight:600,color:'var(--text)',fontSize:'13px'}}>{e.salary ? '₹'+Number(e.salary).toLocaleString() : '—'}</td>
                  <td style={{padding:'13px 16px'}}><StatusBadge status={e.status}/></td>
                  <td style={{padding:'13px 16px'}}>
                    {isAdmin ? (
                      <div style={{display:'flex',gap:'6px'}}>
                        <ActionBtn color="var(--blue)" bg="var(--blue-lt)" border="#bfdbfe" onClick={()=>navigate(`/edit-employee/${e.id}`)}>Edit</ActionBtn>
                        <ActionBtn color="var(--red)"  bg="var(--red-lt)"  border="#fca5a5" onClick={()=>handleDelete(e.id)}>Delete</ActionBtn>
                      </div>
                    ) : <span style={{fontSize:'12px',color:'var(--text3)'}}>View only</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast.msg && (
        <div style={{position:'fixed',bottom:'2rem',right:'2rem',padding:'13px 20px',borderRadius:'10px',fontSize:'13px',fontWeight:600,
          background: toast.type==='success'?'#d8f3dc':'var(--red-lt)',
          color:      toast.type==='success'?'var(--accent)':'var(--red)',
          border:     `1px solid ${toast.type==='success'?'#95d5b2':'#fca5a5'}`,
          boxShadow:'var(--shadow-lg)',animation:'fadeUp .3s ease',zIndex:999}}>
          {toast.type==='success'?'✅':'❌'} {toast.msg}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const a = status==='ACTIVE';
  return <span style={{display:'inline-flex',alignItems:'center',gap:'5px',padding:'4px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:700,background:a?'#d8f3dc':'var(--red-lt)',color:a?'var(--accent)':'var(--red)',border:`1px solid ${a?'#95d5b2':'#fca5a5'}`}}><span style={{width:'6px',height:'6px',borderRadius:'50%',background:a?'var(--accent)':'var(--red)',display:'inline-block'}}/>{status}</span>;
}

function ActionBtn({ children, onClick, color, bg, border }) {
  const [h,setH]=useState(false);
  return <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{padding:'5px 13px',borderRadius:'7px',fontSize:'12px',fontWeight:600,cursor:'pointer',border:`1px solid ${h?border:'var(--border)'}`,color:h?color:'var(--text2)',background:h?bg:'transparent',transition:'all .2s'}}>{children}</button>;
}