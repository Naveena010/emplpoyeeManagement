import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEmployee, updateEmployee, getEmployee } from '../services/api';
import ErrorBox from '../components/ErrorBox';

const EMPTY = { name:'', email:'', department:'', designation:'', phone:'', salary:'', dateOfJoining:'' };

export default function AddEmployee() {
  const [form,    setForm]    = useState(EMPTY);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id }   = useParams();
  const isEdit   = Boolean(id);

  useEffect(()=>{
    if (isEdit) getEmployee(id)
      .then(r=>{ const e=r.data; setForm({name:e.name,email:e.email,department:e.department,designation:e.designation||'',phone:e.phone||'',salary:e.salary||'',dateOfJoining:e.dateOfJoining||''}); })
      .catch(err=>setError(err.clientMessage));
  },[id,isEdit]);

  const f = field => e => setForm({...form,[field]:e.target.value});

  const handle = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      if (isEdit) await updateEmployee(id, {...form, salary:parseFloat(form.salary)||null});
      else        await createEmployee({...form, salary:parseFloat(form.salary)||null});
      setSuccess(isEdit ? 'Employee updated successfully!' : 'Employee created successfully!');
      setTimeout(()=>navigate('/employees'), 1200);
    } catch(err) {
      setError(err.clientMessage);
    } finally { setLoading(false); }
  };

  return (
    <div style={{animation:'fadeUp .35s ease',maxWidth:'680px'}}>
      <div style={{marginBottom:'2rem'}}>
        <div style={{fontFamily:'var(--font-head)',fontSize:'30px',fontWeight:800,letterSpacing:'-0.5px'}}>
          {isEdit?'Edit':'Add'} <span style={{color:'var(--accent)'}}>Employee</span>
        </div>
        <div style={{color:'var(--text2)',fontSize:'14px',marginTop:'4px'}}>
          {isEdit?'Update the employee details below':'Fill in the details to register a new employee'}
        </div>
      </div>

      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',overflow:'hidden',boxShadow:'var(--shadow-md)'}}>
        <div style={{padding:'1.1rem 1.75rem',background:'linear-gradient(135deg,var(--accent-dim),var(--blue-lt))',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'var(--surface)',border:'2px solid var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>
            {isEdit?'✏️':'👤'}
          </div>
          <div>
            <div style={{fontWeight:700,color:'var(--text)',fontSize:'15px'}}>{isEdit?'Editing employee record':'New employee registration'}</div>
            <div style={{fontSize:'12px',color:'var(--text2)'}}>{isEdit?`ID #${id}`:'Fields marked * are required'}</div>
          </div>
        </div>

        <form onSubmit={handle} style={{padding:'1.75rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem'}}>
            <Field label="Full Name *"       value={form.name}          onChange={f('name')}         placeholder="Priya Sharma"      required/>
            <Field label="Email *"           value={form.email}         onChange={f('email')}         placeholder="priya@example.com" type="email" required/>
            <Field label="Department *"      value={form.department}    onChange={f('department')}    placeholder="Finance"           required/>
            <Field label="Designation"       value={form.designation}   onChange={f('designation')}   placeholder="Senior Analyst"/>
            <Field label="Phone"             value={form.phone}         onChange={f('phone')}         placeholder="9876543210"/>
            <Field label="Salary (₹)"        value={form.salary}        onChange={f('salary')}        placeholder="55000" type="number"/>
            <div style={{gridColumn:'1/-1'}}>
              <Field label="Date of Joining *" value={form.dateOfJoining} onChange={f('dateOfJoining')} type="date" required/>
            </div>
          </div>

          {/* Error from backend shown as exception */}
          <div style={{marginTop:'1.25rem'}}>
            <ErrorBox message={error}/>
          </div>

          {success && (
            <div style={{marginTop:'1rem',padding:'12px 16px',background:'#d8f3dc',border:'1px solid #95d5b2',borderRadius:'10px',color:'var(--accent)',fontSize:'13px',fontWeight:500}}>
              ✅ {success}
            </div>
          )}

          <div style={{display:'flex',gap:'12px',marginTop:'1.75rem'}}>
            <button type="button" onClick={()=>navigate('/employees')}
              style={{padding:'11px 22px',background:'transparent',border:'1.5px solid var(--border)',borderRadius:'10px',color:'var(--text2)',fontSize:'14px',fontWeight:500,cursor:'pointer'}}
              onMouseEnter={e=>{e.target.style.borderColor='var(--text)';e.target.style.color='var(--text)'}}
              onMouseLeave={e=>{e.target.style.borderColor='var(--border)';e.target.style.color='var(--text2)'}}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{padding:'11px 28px',background:'var(--accent)',border:'none',borderRadius:'10px',color:'white',fontSize:'14px',fontWeight:700,cursor:loading?'not-allowed':'pointer',opacity:loading?.7:1,boxShadow:'0 4px 14px rgba(45,106,79,0.3)'}}>
              {loading ? 'Saving…' : isEdit ? '✅ Update Employee' : '➕ Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type='text', required }) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'var(--text2)',marginBottom:'7px',textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        style={{width:'100%',padding:'11px 14px',background:focus?'var(--surface)':'var(--surface2)',border:`1.5px solid ${focus?'var(--accent)':'var(--border)'}`,borderRadius:'10px',color:'var(--text)',fontSize:'14px',outline:'none',transition:'all .2s',boxShadow:focus?'0 0 0 3px rgba(45,106,79,0.10)':'none'}}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}/>
    </div>
  );
}