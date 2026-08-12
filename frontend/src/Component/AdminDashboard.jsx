import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ADMIN_API = "http://localhost:8080/admin";

/* ══════════════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#140f00;--surface:#1e1700;--card:#271e00;--card2:#1a1300;
    --accent:#e8c06d;--accent2:#c9a84c;--cream:#faf5e8;--muted:#9a8a5a;
    --border:rgba(232,192,109,0.18);
    --danger:#e07070;--success:#6dbf6d;--info:#7ab8e8;
  }
  body{margin:0;font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--cream);min-height:100vh}
  .dash{display:flex;min-height:100vh}
  .sidebar{width:240px;background:var(--surface);border-right:1px solid var(--border);padding:28px 0;display:flex;flex-direction:column;flex-shrink:0;position:sticky;top:0;height:100vh}
  .brand{padding:0 24px 28px;border-bottom:1px solid var(--border)}
  .brand-role{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--accent);font-weight:500}
  .brand-name{font-family:'Playfair Display',serif;font-size:18px;color:var(--cream);margin-top:4px}
  .nav{flex:1;padding:20px 12px}
  .nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:4px;cursor:pointer;font-size:13px;color:var(--muted);transition:all .15s;border:none;background:none;width:100%;text-align:left}
  .nav-item:hover{background:rgba(232,192,109,.08);color:var(--cream)}
  .nav-item.active{background:rgba(232,192,109,.15);color:var(--accent);font-weight:500}
  .nav-item svg{stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
  .logout-btn{margin:12px;padding:10px 12px;border-radius:4px;border:1px solid rgba(232,192,109,.2);background:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .15s}
  .logout-btn:hover{border-color:var(--danger);color:var(--danger)}
  .main{flex:1;display:flex;flex-direction:column;overflow:auto}
  .topbar{padding:20px 32px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--bg);z-index:10}
  .page-title{font-family:'Playfair Display',serif;font-size:22px;color:var(--cream)}
  .user-chip{display:flex;align-items:center;gap:10px}
  .avatar{width:36px;height:36px;border-radius:50%;background:rgba(232,192,109,.12);border:1px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--accent)}
  .user-email{font-size:13px;color:var(--muted)}
  .content{padding:28px 32px;flex:1}

  .welcome-banner{background:linear-gradient(135deg,rgba(232,192,109,.1),rgba(201,168,76,.05));border:1px solid var(--border);border-radius:6px;padding:22px 28px;margin-bottom:24px;display:flex;align-items:center;gap:20px}
  .wb-icon{width:48px;height:48px;border-radius:50%;background:rgba(232,192,109,.1);border:1px solid var(--accent);display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .wb-icon svg{stroke:var(--accent);fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
  .wb-title{font-family:'Playfair Display',serif;font-size:20px;color:var(--cream)}
  .wb-sub{font-size:13px;color:var(--muted);margin-top:4px}

  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
  .stat-card{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:20px 18px}
  .stat-label{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
  .stat-value{font-size:26px;font-weight:600;color:var(--accent)}
  .stat-sub{font-size:12px;color:var(--muted);margin-top:4px}

  .section-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .section-card{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:22px}
  .section-title{font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
  .list-item{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(232,192,109,.07);font-size:13px}
  .list-item:last-child{border-bottom:none}
  .li-name{color:var(--cream)}
  .li-sub{font-size:11px;color:var(--muted);margin-top:2px}

  .badge{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500;white-space:nowrap}
  .badge-gold{background:rgba(232,192,109,.15);color:var(--accent)}
  .badge-green{background:rgba(109,191,109,.13);color:var(--success)}
  .badge-red{background:rgba(224,112,112,.13);color:var(--danger)}
  .badge-blue{background:rgba(122,184,232,.13);color:var(--info)}
  .badge-muted{background:rgba(154,138,90,.1);color:var(--muted)}

  /* Table */
  .page-section{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:24px}
  .table-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;gap:12px;flex-wrap:wrap}
  .toolbar-title{font-family:'Playfair Display',serif;font-size:18px;color:var(--cream)}
  .toolbar-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .search-wrap{position:relative;display:flex;align-items:center}
  .search-wrap svg{position:absolute;left:10px;stroke:var(--muted);fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
  .search-input{padding:8px 10px 8px 34px;background:rgba(232,192,109,.05);border:1px solid var(--border);border-radius:4px;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;width:220px;transition:border-color .2s}
  .search-input::placeholder{color:var(--muted)}
  .search-input:focus{border-color:var(--accent)}
  .entries-select{padding:8px 10px;background:rgba(232,192,109,.05);border:1px solid var(--border);border-radius:4px;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;cursor:pointer}
  .dt-wrap{overflow-x:auto;border-radius:4px;border:1px solid var(--border)}
  table{width:100%;border-collapse:collapse;font-size:13px}
  thead{background:rgba(232,192,109,.07)}
  th{padding:12px 14px;text-align:left;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);white-space:nowrap;cursor:pointer;user-select:none;border-bottom:1px solid var(--border)}
  th:hover{color:var(--cream)}
  th .sort-icon{display:inline-block;margin-left:4px;opacity:.5;font-size:10px}
  th.sorted .sort-icon{opacity:1}
  td{padding:11px 14px;border-bottom:1px solid rgba(232,192,109,.06);color:var(--cream);vertical-align:middle}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:rgba(232,192,109,.03)}
  .action-cell{display:flex;gap:6px;align-items:center}
  .btn-edit{padding:5px 10px;border-radius:4px;border:1px solid rgba(232,192,109,.3);background:rgba(232,192,109,.08);color:var(--accent);font-size:11px;font-family:'DM Sans',sans-serif;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all .15s}
  .btn-edit:hover{background:rgba(232,192,109,.18);border-color:var(--accent)}
  .btn-del{padding:5px 10px;border-radius:4px;border:1px solid rgba(224,112,112,.3);background:rgba(224,112,112,.08);color:var(--danger);font-size:11px;font-family:'DM Sans',sans-serif;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all .15s}
  .btn-del:hover{background:rgba(224,112,112,.18);border-color:var(--danger)}
  .pagination{display:flex;align-items:center;justify-content:space-between;margin-top:16px;flex-wrap:wrap;gap:8px}
  .page-info{font-size:12px;color:var(--muted)}
  .page-btns{display:flex;gap:4px}
  .page-btn{padding:5px 10px;border-radius:4px;border:1px solid var(--border);background:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;transition:all .15s}
  .page-btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
  .page-btn.active{background:rgba(232,192,109,.15);border-color:var(--accent);color:var(--accent);font-weight:600}
  .page-btn:disabled{opacity:.35;cursor:not-allowed}
  .table-state{padding:48px;text-align:center;color:var(--muted);font-size:14px}
  .spinner-lg{width:28px;height:28px;border:3px solid rgba(232,192,109,.15);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 12px}
  @keyframes spin{to{transform:rotate(360deg)}}

  /* Skeleton */
  .skel{background:linear-gradient(90deg,rgba(232,192,109,.05) 25%,rgba(232,192,109,.1) 50%,rgba(232,192,109,.05) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:4px;height:22px}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

  /* Toast */
  .toast{position:fixed;bottom:24px;right:24px;z-index:9999;padding:12px 18px;border-radius:5px;font-size:13px;font-weight:500;display:flex;align-items:center;gap:8px;animation:slideUp .3s ease both;box-shadow:0 8px 24px rgba(0,0,0,.5);max-width:320px}
  .toast-success{background:#1a1300;border:1px solid var(--success);color:var(--success)}
  .toast-error{background:#2a0f0f;border:1px solid var(--danger);color:var(--danger)}
  @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

  /* Modal */
  .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(5px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .modal{background:var(--surface);border:1px solid var(--border);border-radius:8px;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,.7);animation:slideDown .3s cubic-bezier(.22,1,.36,1)}
  @keyframes slideDown{from{opacity:0;transform:translateY(-18px)}to{opacity:1;transform:translateY(0)}}
  .modal-header{padding:22px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
  .modal-title{font-family:'Playfair Display',serif;font-size:18px;color:var(--cream)}
  .modal-close{background:none;border:none;color:var(--muted);cursor:pointer;padding:4px;display:flex;align-items:center;transition:color .15s;border-radius:4px}
  .modal-close:hover{color:var(--danger)}
  .modal-body{padding:22px 24px}
  .modal-footer{padding:16px 24px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:10px}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .form-field{display:flex;flex-direction:column;gap:6px}
  .form-field.full{grid-column:1/-1}
  .form-label{font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--accent)}
  .form-input{padding:10px 12px;background:rgba(232,192,109,.04);border:1px solid var(--border);border-radius:4px;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;transition:border-color .2s,box-shadow .2s;width:100%}
  .form-input::placeholder{color:rgba(154,138,90,.45)}
  .form-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(232,192,109,.08)}
  .form-input:disabled{opacity:.4;cursor:not-allowed}
  select.form-input{cursor:pointer}
  select.form-input option{background:var(--surface);color:var(--cream)}
  .err-msg{background:rgba(224,112,112,.08);border:1px solid rgba(224,112,112,.3);border-radius:4px;padding:10px 12px;font-size:13px;color:var(--danger);margin-bottom:14px}

  /* Buttons */
  .btn-primary{padding:9px 20px;background:linear-gradient(135deg,#e8c06d,#c9a84c);border:none;border-radius:4px;color:#140f00;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:opacity .15s,transform .1s;white-space:nowrap}
  .btn-primary:hover:not(:disabled){opacity:.9;transform:translateY(-1px)}
  .btn-primary:disabled{opacity:.5;cursor:not-allowed}
  .btn-ghost{padding:9px 16px;background:none;border:1px solid var(--border);border-radius:4px;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all .15s}
  .btn-ghost:hover{border-color:var(--accent);color:var(--accent)}
  .btn-add{padding:9px 16px;background:rgba(109,191,109,.12);border:1px solid rgba(109,191,109,.3);border-radius:4px;color:var(--success);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .15s;white-space:nowrap}
  .btn-add:hover{background:rgba(109,191,109,.2);border-color:var(--success)}
  .btn-danger{padding:9px 20px;background:rgba(224,112,112,.12);border:1px solid rgba(224,112,112,.35);border-radius:4px;color:var(--danger);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s}
  .btn-danger:hover{background:rgba(224,112,112,.22)}

  /* Confirm modal */
  .confirm-modal{background:var(--surface);border:1px solid rgba(224,112,112,.3);border-radius:8px;width:100%;max-width:380px;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,.7);animation:slideDown .3s cubic-bezier(.22,1,.36,1);text-align:center}
  .confirm-title{font-family:'Playfair Display',serif;font-size:18px;color:var(--cream);margin-bottom:8px}
  .confirm-sub{font-size:13px;color:var(--muted);margin-bottom:22px;line-height:1.6}
  .confirm-btns{display:flex;gap:10px;justify-content:center}
`;

/* ── Nav ───────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { key:"dashboard", label:"Dashboard",  icon:<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></> },
  { key:"students",  label:"Students",   icon:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
  { key:"faculty",   label:"Faculty",    icon:<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
];

/* ── Helpers ───────────────────────────────────────────────────── */
const BtnSpinner = () => (
  <span style={{width:13,height:13,border:"2px solid rgba(20,15,0,.3)",borderTopColor:"#140f00",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite"}}/>
);
const Skel = ({w="100%",h=20}) => <div className="skel" style={{width:w,height:h}}/>;

function Toast({toast}){
  if(!toast) return null;
  return(
    <div className={`toast toast-${toast.type}`}>
      {toast.type==="success"
        ?<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        :<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      }
      {toast.msg}
    </div>
  );
}
function useToast(){
  const [toast,setToast]=useState(null);
  const show=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3200);};
  return {toast,show};
}

/* ── Close icon ────────────────────────────────────────────────── */
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ── Edit / Delete icons ───────────────────────────────────────── */
const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const DelIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════
   REUSABLE DATA TABLE
══════════════════════════════════════════════════════════════════ */
function DataTable({ title, data, columns, loading, onEdit, onDelete, addButton, extraCols=[] }){
  const [search,setSearch]     = useState("");
  const [pageSize,setPageSize] = useState(10);
  const [page,setPage]         = useState(1);
  const [sortKey,setSortKey]   = useState(columns[0]||"id");
  const [sortAsc,setSortAsc]   = useState(true);

  const filtered = useMemo(()=>{
    const q=search.toLowerCase();
    return data
      .filter(r=>Object.values(r).some(v=>String(v??"").toLowerCase().includes(q)))
      .sort((a,b)=>{
        const av=String(a[sortKey]??"").toLowerCase(), bv=String(b[sortKey]??"").toLowerCase();
        return sortAsc?av.localeCompare(bv):bv.localeCompare(av);
      });
  },[data,search,sortKey,sortAsc]);

  const totalPages=Math.max(1,Math.ceil(filtered.length/pageSize));
  const paginated=filtered.slice((page-1)*pageSize,page*pageSize);
  const toggleSort=k=>{if(sortKey===k)setSortAsc(a=>!a);else{setSortKey(k);setSortAsc(true);}setPage(1);};

  return(
    <div className="page-section">
      <div className="table-toolbar">
        <div className="toolbar-title">
          {title} <span style={{fontSize:14,color:"var(--muted)",fontWeight:400}}>({data.length})</span>
        </div>
        <div className="toolbar-right">
          {addButton}
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"var(--muted)"}}>
            Show
            <select className="entries-select" value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1);}}>
              {[5,10,25,50].map(n=><option key={n} value={n}>{n}</option>)}
            </select>
            entries
          </div>
          <div className="search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="search-input" placeholder={`Search ${title.toLowerCase()}…`}
              value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
          </div>
        </div>
      </div>

      {loading
        ?<div className="table-state"><div className="spinner-lg"/>Loading…</div>
        :filtered.length===0
          ?<div className="table-state">No records found.</div>
          :<>
            <div className="dt-wrap">
              <table>
                <thead><tr>
                  <th style={{width:40}}>#</th>
                  {columns.map(col=>(
                    <th key={col} className={sortKey===col?"sorted":""} onClick={()=>toggleSort(col)}>
                      {col.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase())}
                      <span className="sort-icon">{sortKey===col?(sortAsc?"▲":"▼"):"⇅"}</span>
                    </th>
                  ))}
                  {extraCols.map(c=><th key={c.label}>{c.label}</th>)}
                  <th style={{width:110}}>Actions</th>
                </tr></thead>
                <tbody>
                  {paginated.map((row,i)=>(
                    <tr key={row.id??i}>
                      <td style={{color:"var(--muted)",fontSize:12}}>{(page-1)*pageSize+i+1}</td>
                      {columns.map(col=>(
                        <td key={col} style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {col==="password" ? "••••••" : (row[col]??"—")}
                        </td>
                      ))}
                      {extraCols.map(c=><td key={c.label}>{c.render(row)}</td>)}
                      <td>
                        <div className="action-cell">
                          <button className="btn-edit" onClick={()=>onEdit(row)}><EditIcon/>Edit</button>
                          <button className="btn-del"  onClick={()=>onDelete(row)}><DelIcon/>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <div className="page-info">
                Showing {Math.min((page-1)*pageSize+1,filtered.length)}–{Math.min(page*pageSize,filtered.length)} of {filtered.length}
              </div>
              <div className="page-btns">
                <button className="page-btn" disabled={page===1} onClick={()=>setPage(1)}>«</button>
                <button className="page-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
                {Array.from({length:Math.min(5,totalPages)},(_,i)=>{
                  let p;
                  if(totalPages<=5)p=i+1;
                  else if(page<=3)p=i+1;
                  else if(page>=totalPages-2)p=totalPages-4+i;
                  else p=page-2+i;
                  return <button key={p} className={`page-btn${page===p?" active":""}`} onClick={()=>setPage(p)}>{p}</button>;
                })}
                <button className="page-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</button>
                <button className="page-btn" disabled={page===totalPages} onClick={()=>setPage(totalPages)}>»</button>
              </div>
            </div>
          </>
      }
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CONFIRM DELETE
══════════════════════════════════════════════════════════════════ */
function ConfirmDelete({name, onCancel, onConfirm, deleting}){
  return(
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onCancel()}>
      <div className="confirm-modal">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:12}}>
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
        <div className="confirm-title">Confirm Delete</div>
        <div className="confirm-sub">
          You are about to delete <strong style={{color:"var(--cream)"}}>{name}</strong>.<br/>
          This action cannot be undone.
        </div>
        <div className="confirm-btns">
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STUDENT MODAL  (Edit only — admin cannot add students)
══════════════════════════════════════════════════════════════════ */
const STUDENT_FIELDS = [
  {key:"name",      label:"Full Name",   type:"text"},
  {key:"email",     label:"Email",       type:"email"},
  {key:"rollNo",    label:"Roll No",     type:"text"},
  {key:"course",    label:"Course",      type:"text"},
  {key:"semester",  label:"Semester",    type:"text"},
  {key:"branch",    label:"Branch",      type:"text"},
  {key:"phone",     label:"Phone",       type:"text"},
  {key:"address",   label:"Address",     type:"text", full:true},
];

function StudentModal({student, onClose, onSaved}){
  const [form,setForm]=useState({...student});
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");

  const save=async()=>{
    setSaving(true); setErr("");
    try{
      const res=await fetch(`${ADMIN_API}/updateStudent/${student.id}`,{
        method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)
      });
      if(!res.ok) throw new Error(await res.text());
      onSaved(await res.json());
    }catch(e){setErr(e.message);}
    finally{setSaving(false);}
  };

  return(
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Edit Student</div>
          <button className="modal-close" onClick={onClose}><CloseIcon/></button>
        </div>
        <div className="modal-body">
          {err&&<div className="err-msg">{err}</div>}
          <div className="form-grid">
            <div className="form-field"><label className="form-label">ID</label><input className="form-input" value={form.id||""} disabled/></div>
            {STUDENT_FIELDS.map(f=>(
              <div key={f.key} className={`form-field${f.full?" full":""}`}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" type={f.type} value={form[f.key]??""} placeholder={f.label}
                  onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}/>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving?<><BtnSpinner/>Saving…</>:"Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FACULTY MODAL  (Add & Edit)
══════════════════════════════════════════════════════════════════ */
const EMPTY_FACULTY = {id:"", name:"", email:"", password:"", mobile:"", qualification:"", gender:""};
const FACULTY_FIELDS = [
  {key:"id",            label:"Faculty ID",    type:"text"},
  {key:"name",          label:"Full Name",     type:"text"},
  {key:"email",         label:"Email",         type:"email"},
  {key:"password",      label:"Password",      type:"password"},
  {key:"mobile",        label:"Mobile",        type:"text"},
  {key:"qualification", label:"Qualification", type:"text"},
  {key:"gender",        label:"Gender",        type:"text"},
];

function FacultyModal({faculty, onClose, onSaved, isEdit}){
  const [form,setForm]=useState(faculty ? {...faculty} : {...EMPTY_FACULTY});
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");

  const validate=()=>{
    if(!form.id?.trim())    return "Faculty ID is required.";
    if(!form.name?.trim())  return "Name is required.";
    if(!form.email?.trim()) return "Email is required.";
    if(!isEdit && !form.password?.trim()) return "Password is required.";
    return "";
  };
  const save=async()=>{
    const e=validate(); if(e){setErr(e);return;}
    setSaving(true); setErr("");
    try{
      const url    = isEdit ? `${ADMIN_API}/updateFaculty/${faculty.id}` : `${ADMIN_API}/addFaculty`;
      const method = isEdit ? "PATCH" : "POST";
      const res=await fetch(url,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      if(!res.ok) throw new Error(await res.text());
      onSaved(await res.json(), isEdit);
    }catch(e){setErr(e.message);}
    finally{setSaving(false);}
  };

  return(
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{isEdit?"Edit Faculty":"Add New Faculty"}</div>
          <button className="modal-close" onClick={onClose}><CloseIcon/></button>
        </div>
        <div className="modal-body">
          {err&&<div className="err-msg">{err}</div>}
          <div className="form-grid">
            {FACULTY_FIELDS.map(f=>(
              <div key={f.key} className="form-field">
                <label className="form-label">{f.label}{!isEdit&&f.key==="password"?" *":""}</label>
                <input className="form-input" type={f.type} value={form[f.key]??""} placeholder={f.label}
                  onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}/>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving?<><BtnSpinner/>Saving…</>:isEdit?"Save Changes":"Add Faculty"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DASHBOARD HOME
══════════════════════════════════════════════════════════════════ */
function DashboardHome({adminData, students, faculty}){
  const loading = !adminData;

  /* Programs from student.course */
  const programs = useMemo(()=>{
    const map={};
    students.forEach(s=>{
      if(!s.course) return;
      if(!map[s.course]) map[s.course]={name:s.course,students:0};
      map[s.course].students++;
    });
    return Object.values(map);
  },[students]);

  /* Qualifications from faculty.qualification */
  const departments = useMemo(()=>{
    const map={};
    faculty.forEach(f=>{
      if(!f.qualification) return;
      if(!map[f.qualification]) map[f.qualification]={name:f.qualification,faculty:0};
      map[f.qualification].faculty++;
    });
    return Object.values(map);
  },[faculty]);

  return(
    <>
      <div className="welcome-banner">
        <div className="wb-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <div className="wb-title">
            {loading ? <div className="skel" style={{width:200,height:22}}/> : `Welcome, ${adminData.name || "Admin"}!`}
          </div>
          <div className="wb-sub">
            {loading ? <div className="skel" style={{width:260,height:14,marginTop:8}}/> : `${adminData.email} · ${adminData.role || "Admin"} · Full Access`}
          </div>
        </div>
      </div>

      {/* Stats — all from DB */}
      <div className="stats">
        {[
          {label:"Total Students", value:loading?null:students.length, sub:"In database"},
          {label:"Total Faculty",  value:loading?null:faculty.length,  sub:"Active staff"},
          {label:"Programs",       value:loading?null:2,  sub:"MBA, MCA etc."},
          {label:"Qualifications", value:loading?null:departments.length,sub:"From faculty data"},
        ].map(s=>(
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">
              {s.value===null ? <Skel w={48} h={28}/> : s.value}
            </div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="section-grid">
        {/* Programs overview */}
        <div className="section-card">
          <div className="section-title">Programs Overview</div>
          {programs.length===0
            ?<div style={{color:"var(--muted)",fontSize:13}}>No program data yet.</div>
            :programs.map(p=>(
              <div className="list-item" key={p.name}>
                <div className="li-name">{p.name}</div>
                <span className="badge badge-gold">{p.students} students</span>
              </div>
            ))
          }
        </div>

        {/* Departments overview */}
        <div className="section-card">
          <div className="section-title">Faculty Qualifications</div>
          {departments.length===0
            ?<div style={{color:"var(--muted)",fontSize:13}}>No department data yet.</div>
            :departments.map(d=>(
              <div className="list-item" key={d.name}>
                <div className="li-name">{d.name}</div>
                <span className="badge badge-blue">{d.faculty} faculty</span>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STUDENTS MANAGEMENT
══════════════════════════════════════════════════════════════════ */
function StudentsManagement({students, setStudents}){
  const [editing,setEditing]     = useState(null);
  const [confirmDel,setConfirmDel] = useState(null);
  const [deleting,setDeleting]   = useState(false);
  const {toast,show:showToast}   = useToast();

  const columns = useMemo(()=>{
    if(!students.length) return [];
    return Object.keys(students[0]).filter(k=>k!=="password"&&k!=="lectures"&&k!=="faculty");
  },[students]);

  const handleDelete=async()=>{
    setDeleting(true);
    try{
      const res=await fetch(`${ADMIN_API}/deleteStudent/${confirmDel.id}`,{method:"DELETE"});
      if(!res.ok) throw new Error(await res.text());
      setStudents(p=>p.filter(s=>s.id!==confirmDel.id));
      showToast("Student deleted successfully.");
    }catch(e){showToast("Delete failed: "+e.message,"error");}
    finally{setDeleting(false);setConfirmDel(null);}
  };

  return(
    <>
      <Toast toast={toast}/>
      {editing&&(
        <StudentModal student={editing} onClose={()=>setEditing(null)}
          onSaved={u=>{setStudents(p=>p.map(s=>s.id===u.id?u:s));setEditing(null);showToast(`${u.name||"Student"} updated!`);}}/>
      )}
      {confirmDel&&(
        <ConfirmDelete name={confirmDel.name||"this student"} deleting={deleting}
          onCancel={()=>setConfirmDel(null)} onConfirm={handleDelete}/>
      )}
      <DataTable
        title="All Students"
        data={students}
        columns={columns}
        loading={students.length===0}
        onEdit={setEditing}
        onDelete={setConfirmDel}
      />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FACULTY MANAGEMENT  (Add + Edit + Delete)
══════════════════════════════════════════════════════════════════ */
function FacultyManagement({faculty, setFaculty}){
  const [editing,setEditing]       = useState(null);
  const [showAdd,setShowAdd]       = useState(false);
  const [confirmDel,setConfirmDel] = useState(null);
  const [deleting,setDeleting]     = useState(false);
  const {toast,show:showToast}     = useToast();

  const columns = useMemo(()=>{
    if(!faculty.length) return ["name","email","phone","department"];
    return Object.keys(faculty[0]).filter(k=>k!=="lectures"&&k!=="password");
  },[faculty]);

  const handleDelete=async()=>{
    setDeleting(true);
    try{
      const res=await fetch(`${ADMIN_API}/deleteFaculty/${confirmDel.id}`,{method:"DELETE"});
      if(!res.ok) throw new Error(await res.text());
      setFaculty(p=>p.filter(f=>f.id!==confirmDel.id));
      showToast("Faculty deleted.");
    }catch(e){showToast("Delete failed: "+e.message,"error");}
    finally{setDeleting(false);setConfirmDel(null);}
  };

  const handleSaved=(saved,isEdit)=>{
    if(isEdit) setFaculty(p=>p.map(f=>f.id===saved.id?saved:f));
    else       setFaculty(p=>[saved,...p]);
    setEditing(null);setShowAdd(false);
    showToast(isEdit?`${saved.name} updated!`:`${saved.name} added!`);
  };

  return(
    <>
      <Toast toast={toast}/>
      {showAdd&&<FacultyModal isEdit={false} onClose={()=>setShowAdd(false)} onSaved={handleSaved}/>}
      {editing&&<FacultyModal faculty={editing} isEdit={true} onClose={()=>setEditing(null)} onSaved={handleSaved}/>}
      {confirmDel&&(
        <ConfirmDelete name={confirmDel.name||"this faculty"} deleting={deleting}
          onCancel={()=>setConfirmDel(null)} onConfirm={handleDelete}/>
      )}
      <DataTable
        title="All Faculty"
        data={faculty}
        columns={columns}
        loading={false}
        onEdit={setEditing}
        onDelete={setConfirmDel}
        addButton={
          <button className="btn-add" onClick={()=>setShowAdd(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Faculty
          </button>
        }
      />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════ */
export default function AdminDashboard(){
  const {state}  = useLocation();
  const navigate = useNavigate();
  const email    = state?.email || "admin@university.edu";

  /* ── Shared state ── */
  const [adminData, setAdminData] = useState(null);
  const [students,  setStudents]  = useState([]);
  const [faculty,   setFaculty]   = useState([]);
  const [active,    setActive]    = useState("dashboard");

  const initials = adminData?.name
    ? adminData.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)
    : email.slice(0,2).toUpperCase();

  /* ── Fetch admin profile ── */
  useEffect(()=>{
    fetch(`${ADMIN_API}/getbyemail/${encodeURIComponent(email)}`)
      .then(r=>r.ok?r.json():null).then(d=>{if(d)setAdminData(d);}).catch(()=>{});
  },[email]);

  /* ── Fetch all students ── */
  useEffect(()=>{
    fetch(`${ADMIN_API}/getAllStudents`)
      .then(r=>r.ok?r.json():[]).then(setStudents).catch(()=>{});
  },[]);

  /* ── Fetch all faculty ── */
  useEffect(()=>{
    fetch(`${ADMIN_API}/getAllFaculty`)
      .then(r=>r.ok?r.json():[]).then(setFaculty).catch(()=>{});
  },[]);

  const PAGE_TITLES={dashboard:"Dashboard",students:"Manage Students",faculty:"Manage Faculty"};

  return(
    <div className="dash">
      <style>{styles}</style>

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-role">Admin Portal</div>
          <div className="brand-name">Academia</div>
        </div>
        <nav className="nav">
          {NAV_ITEMS.map(item=>(
            <button key={item.key} className={`nav-item${active===item.key?" active":""}`}
              onClick={()=>setActive(item.key)}>
              <svg width="16" height="16" viewBox="0 0 24 24">{item.icon}</svg>
              {item.label}
            </button>
          ))}
        </nav>
        <button className="logout-btn" onClick={()=>navigate("/")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="page-title">{PAGE_TITLES[active]}</div>
          <div className="user-chip">
            <div className="user-email">{email}</div>
            <div className="avatar">{initials}</div>
          </div>
        </div>
        <div className="content">
          {active==="dashboard" && <DashboardHome adminData={adminData} students={students} faculty={faculty}/>}
          {active==="students"  && <StudentsManagement students={students} setStudents={setStudents}/>}
          {active==="faculty"   && <FacultyManagement  faculty={faculty}  setFaculty={setFaculty}/>}
        </div>
      </main>
    </div>
  );
}
