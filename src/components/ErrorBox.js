export default function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div style={{padding:'12px 16px',background:'var(--red-lt)',border:'1px solid #fca5a5',borderRadius:'10px',color:'var(--red)',fontSize:'13px',fontWeight:500,display:'flex',alignItems:'flex-start',gap:'10px'}}>
      <span style={{fontSize:'16px',flexShrink:0}}>⚠️</span>
      <span>{message}</span>
    </div>
  );
}