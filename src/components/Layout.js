import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logoutUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const navStyle = ({ isActive }) => ({
    display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px',
    borderRadius:'10px', fontSize:'13px', fontWeight:500, textDecoration:'none',
    transition:'all .2s', color: isActive ? 'var(--accent)' : 'var(--text2)',
    background: isActive ? 'var(--accent-dim)' : 'transparent',
    borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
  });

  return (
    <div style={{display:'flex',flexDirection:'column',minHeight:'100vh',background:'var(--bg)'}}>
      {/* Topbar */}
      <div style={{display:'flex',alignItems:'center',padding:'0 1.75rem',height:'60px',background:'var(--surface)',borderBottom:'1px solid var(--border)',position:'sticky',top:0,zIndex:100,boxShadow:'var(--shadow-sm)',gap:'1rem'}}>
        <div style={{fontFamily:'var(--font-head)',fontSize:'22px',fontWeight:800,color:'var(--accent)',flex:1,letterSpacing:'-0.5px'}}>
          Emp<span style={{color:'var(--text)'}}>MS</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'34px',height:'34px',borderRadius:'50%',background:'var(--accent-dim)',border:'2px solid var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700,color:'var(--accent)'}}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{fontSize:'13px',fontWeight:600,color:'var(--text)'}}>{user?.username}</div>
            <div style={{fontSize:'11px',color:'var(--text3)'}}>{user?.role}</div>
          </div>
          <span style={{fontSize:'11px',padding:'3px 10px',borderRadius:'20px',fontWeight:600,marginLeft:'4px',
            background: isAdmin ? 'var(--accent-dim)' : 'var(--blue-lt)',
            color:      isAdmin ? 'var(--accent)'     : 'var(--blue)',
            border:     `1px solid ${isAdmin ? '#b7e4c7' : '#bfdbfe'}`}}>
            {isAdmin ? '👑 Admin' : '👤 User'}
          </span>
          <button onClick={()=>{ logoutUser(); navigate('/login'); }}
            style={{padding:'7px 16px',background:'transparent',border:'1.5px solid var(--border)',borderRadius:'8px',color:'var(--text2)',fontSize:'12px',fontWeight:500,cursor:'pointer',transition:'all .2s',marginLeft:'4px'}}
            onMouseEnter={e=>{e.target.style.borderColor='var(--red)';e.target.style.color='var(--red)';e.target.style.background='var(--red-lt)'}}
            onMouseLeave={e=>{e.target.style.borderColor='var(--border)';e.target.style.color='var(--text2)';e.target.style.background='transparent'}}>
            Sign out
          </button>
        </div>
      </div>

      <div style={{display:'flex',flex:1}}>
        {/* Sidebar */}
        <div style={{width:'220px',background:'var(--surface)',borderRight:'1px solid var(--border)',padding:'1.5rem 1rem',display:'flex',flexDirection:'column',gap:'2px',boxShadow:'var(--shadow-sm)'}}>
          <div style={{fontSize:'10px',color:'var(--text3)',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',padding:'0 14px',marginBottom:'10px'}}>Main Menu</div>
          <NavLink to="/dashboard"    style={navStyle}>📊 Dashboard</NavLink>
          <NavLink to="/employees"    style={navStyle}>👥 Employees</NavLink>
          {isAdmin && <NavLink to="/add-employee" style={navStyle}>＋ Add Employee</NavLink>}

          <div style={{marginTop:'auto',padding:'1rem',background:'var(--accent-dim)',borderRadius:'10px',border:'1px solid #b7e4c7'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'var(--accent)',marginBottom:'4px'}}>
              {isAdmin ? '👑 Admin Access' : '👤 User Access'}
            </div>
            <div style={{fontSize:'11px',color:'var(--text2)',lineHeight:1.5}}>
              {isAdmin ? 'Full CRUD permissions enabled' : 'Read-only access to employees'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,padding:'2rem',overflowY:'auto',background:'var(--bg)'}}>
          <Outlet/>
        </div>
      </div>
    </div>
  );
}