import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ── API ───────────────────────────────────────────────────────── */
const STUDENT_API = "http://localhost:8080/student";
const LECTURE_API = "http://localhost:8080/lecture";

/*
  Spring Boot endpoints used:
  ┌──────────────────────────────────────────────────────────────────┐
  │ GET /student/login/{email}/{password} → "Login successful" (done)│
  │ GET /student/getbyemail/{email}       → Student object  ← NEW   │
  │ GET /student/getlecture/{course}      → Lecture[] by course      │
  │   (already exists in StudentController)                          │
  └──────────────────────────────────────────────────────────────────┘

  Add to StudentController.java:
  ─────────────────────────────
  @GetMapping("/getbyemail/{email}")
  public ResponseEntity<?> getByEmail(@PathVariable String email) {
      Student student = services.findByEmail(email); // add this to StudentServices
      if (student == null) return ResponseEntity.status(404).body("Not found");
      return ResponseEntity.ok(student);
  }

  Add to StudentServices.java:
  ─────────────────────────────
  public Student findByEmail(String email) {
      return studentRepository.findByEmail(email);
      // OR: studentRepository.findAll().stream()
      //       .filter(s -> s.getEmail().equals(email))
      //       .findFirst().orElse(null);
  }

  Add to StudentRepository.java:
  ─────────────────────────────
  Student findByEmail(String email);
*/

/* ══════════════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#0f1a0f;--surface:#162016;--card:#1c2b1c;--card2:#121e12;
    --accent:#6dbf6d;--cream:#f0f7f0;--muted:#7a9e7a;
    --border:rgba(109,191,109,0.18);
    --warn:#e8c06d;--danger:#e07070;--info:#7ab8e8;
  }
  body{margin:0;font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--cream);min-height:100vh}
  .dash{display:flex;min-height:100vh}

  /* Sidebar */
  .sidebar{width:240px;background:var(--surface);border-right:1px solid var(--border);padding:28px 0;display:flex;flex-direction:column;flex-shrink:0;position:sticky;top:0;height:100vh}
  .brand{padding:0 24px 28px;border-bottom:1px solid var(--border)}
  .brand-role{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--accent);font-weight:500}
  .brand-name{font-family:'Playfair Display',serif;font-size:18px;color:var(--cream);margin-top:4px}
  .nav{flex:1;padding:20px 12px}
  .nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:4px;cursor:pointer;font-size:13px;color:var(--muted);transition:all .15s;border:none;background:none;width:100%;text-align:left}
  .nav-item:hover{background:rgba(109,191,109,.08);color:var(--cream)}
  .nav-item.active{background:rgba(109,191,109,.15);color:var(--accent);font-weight:500}
  .nav-item svg{stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
  .logout-btn{margin:12px;padding:10px 12px;border-radius:4px;border:1px solid rgba(109,191,109,.2);background:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .15s}
  .logout-btn:hover{border-color:var(--danger);color:var(--danger)}

  /* Main */
  .main{flex:1;display:flex;flex-direction:column;overflow:auto}
  .topbar{padding:20px 32px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--bg);z-index:10}
  .page-title{font-family:'Playfair Display',serif;font-size:22px;color:var(--cream)}
  .user-chip{display:flex;align-items:center;gap:10px}
  .avatar{width:36px;height:36px;border-radius:50%;background:rgba(109,191,109,.18);border:1px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--accent)}
  .user-email{font-size:13px;color:var(--muted)}
  .content{padding:28px 32px;flex:1}

  /* Welcome */
  .welcome-banner{background:linear-gradient(135deg,rgba(109,191,109,.1),rgba(74,158,74,.05));border:1px solid var(--border);border-radius:6px;padding:22px 28px;margin-bottom:24px;display:flex;align-items:center;gap:20px}
  .wb-icon{width:52px;height:52px;border-radius:50%;background:rgba(109,191,109,.15);border:1px solid var(--accent);display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .wb-icon svg{stroke:var(--accent);fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
  .wb-title{font-family:'Playfair Display',serif;font-size:20px;color:var(--cream)}
  .wb-sub{font-size:13px;color:var(--muted);margin-top:4px}

  /* Stats */
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
  .stat-card{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:20px 18px}
  .stat-label{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
  .stat-value{font-size:26px;font-weight:600;color:var(--accent)}
  .stat-sub{font-size:12px;color:var(--muted);margin-top:4px}

  /* Sections */
  .section-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
  .section-card{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:22px}
  .section-card.full{grid-column:1/-1}
  .section-title{font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
  .list-item{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(109,191,109,.07);font-size:13px}
  .list-item:last-child{border-bottom:none}
  .li-name{color:var(--cream)}
  .li-sub{font-size:11px;color:var(--muted);margin-top:2px}

  /* Badges */
  .badge{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500;white-space:nowrap}
  .badge-green{background:rgba(109,191,109,.15);color:var(--accent)}
  .badge-amber{background:rgba(232,192,109,.15);color:var(--warn)}
  .badge-blue{background:rgba(122,184,232,.15);color:var(--info)}
  .badge-muted{background:rgba(122,158,122,.12);color:var(--muted)}
  .badge-red{background:rgba(224,112,112,.13);color:var(--danger)}

  /* Lecture cards */
  .lec-list{display:flex;flex-direction:column;gap:10px}
  .lec-card{background:var(--card2);border:1px solid var(--border);border-radius:5px;padding:14px 16px;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;transition:border-color .2s}
  .lec-card:hover{border-color:rgba(109,191,109,.4)}
  .lec-card.completed{border-left:3px solid var(--accent);opacity:.7}
  .lec-card.pending{border-left:3px solid var(--warn)}
  .lec-date-col{display:flex;flex-direction:column;align-items:center;min-width:48px;background:rgba(109,191,109,.07);border-radius:4px;padding:8px 6px;border:1px solid var(--border)}
  .lec-day{font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);font-weight:600}
  .lec-date-num{font-size:20px;font-weight:700;color:var(--accent);line-height:1.1}
  .lec-month{font-size:9px;text-transform:uppercase;color:var(--muted);margin-top:1px}
  .lec-info{min-width:0}
  .lec-subject{font-size:14px;font-weight:600;color:var(--cream);margin-bottom:4px}
  .lec-meta{display:flex;gap:12px;flex-wrap:wrap}
  .lec-meta-item{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--muted)}
  .lec-meta-item svg{stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}

  /* Profile card */
  .profile-card{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:24px;margin-bottom:20px}
  .profile-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:14px}
  .profile-field{display:flex;flex-direction:column;gap:4px}
  .pf-label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);font-weight:500}
  .pf-value{font-size:13px;color:var(--cream);font-weight:500}

  /* Skeleton */
  .skel{background:linear-gradient(90deg,rgba(109,191,109,.05) 25%,rgba(109,191,109,.1) 50%,rgba(109,191,109,.05) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:4px;height:18px}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .spinner-lg{width:28px;height:28px;border:3px solid rgba(109,191,109,.15);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 12px}
  .table-state{padding:40px;text-align:center;color:var(--muted);font-size:13px}

  /* Filter pills */
  .filters{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
  .filter-btn{padding:5px 14px;border-radius:20px;border:1px solid var(--border);background:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;transition:all .15s}
  .filter-btn:hover{border-color:var(--accent);color:var(--accent)}
  .filter-btn.active{background:rgba(109,191,109,.15);border-color:var(--accent);color:var(--accent);font-weight:500}

  /* Search */
  .search-wrap{position:relative;display:flex;align-items:center;margin-bottom:14px}
  .search-wrap svg{position:absolute;left:10px;stroke:var(--muted);fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
  .search-input{padding:8px 10px 8px 34px;background:rgba(109,191,109,.05);border:1px solid var(--border);border-radius:4px;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;width:100%;transition:border-color .2s}
  .search-input::placeholder{color:var(--muted)}
  .search-input:focus{border-color:var(--accent)}
`;

/* ── Nav ────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { key:"dashboard",  label:"Dashboard",   icon:<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></> },
  { key:"courses",    label:"My Courses",  icon:<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></> },
  { key:"profile",    label:"My Profile",  icon:<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
  { key:"schedule",   label:"Schedule",    icon:<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
];

/* ── Helpers ────────────────────────────────────────────────────── */
const Skel = ({w="100%",h=18}) => <div className="skel" style={{width:w,height:h}}/>;

const fmtDate = (d) => {
  if(!d) return {day:"--",num:"--",month:"---"};
  const dt = new Date(d);
  return {
    day:   dt.toLocaleDateString("en",{weekday:"short"}),
    num:   dt.getDate(),
    month: dt.toLocaleDateString("en",{month:"short"}),
  };
};
const fmtTime = (t) => {
  if(!t) return "";
  const [h,m] = t.split(":");
  const hr = parseInt(h);
  return `${hr%12||12}:${m} ${hr>=12?"PM":"AM"}`;
};

/* ══════════════════════════════════════════════════════════════════
   DASHBOARD HOME
══════════════════════════════════════════════════════════════════ */
function DashboardHome({ studentData, lectures }){
  const loading = !studentData;

  const completedLec = lectures.filter(l => l.status === "completed").length;
  const pendingLec   = lectures.filter(l => l.status === "pending").length;

  /* Unique subjects from lectures */
  const subjects = [...new Set(lectures.map(l => l.subject).filter(Boolean))];

  /* Recent 4 lectures sorted newest first */
  const recent = [...lectures]
    .sort((a,b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  return (
    <>
      {/* Welcome banner — real student name from DB */}
      <div className="welcome-banner">
        <div className="wb-icon">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <div>
          <div className="wb-title">
            {loading
              ? <Skel w={200} h={22}/>
              : `Welcome back, ${studentData.name || "Student"}!`
            }
          </div>
          <div className="wb-sub">
            {loading
              ? <Skel w={240} h={14}/>
              : `${studentData.program || "—"} · Semester ${studentData.semester || "—"} · Roll No: ${studentData.id || "—"}`
            }
          </div>
        </div>
      </div>

      {/* Stats — all from DB */}
      <div className="stats">
        {[
          { label:"My Course",          value: loading ? null : (studentData.program || "—"),  sub:"Enrolled program" },
          { label:"Total Lectures",     value: loading ? null : lectures.length,               sub:"In my course" },
          { label:"Completed",          value: loading ? null : completedLec,                  sub:"Lectures done" },
          { label:"Pending",            value: loading ? null : pendingLec,                    sub:"Upcoming" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">
              {s.value === null ? <Skel w={50} h={28}/> : s.value}
            </div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="section-grid">
        {/* Subjects from lectures */}
        <div className="section-card">
          <div className="section-title">Subjects in {studentData?.course || "My Course"}</div>
          {loading
            ? [1,2,3].map(i=><div key={i} style={{padding:"10px 0"}}><Skel/></div>)
            : subjects.length === 0
              ? <div style={{color:"var(--muted)",fontSize:13}}>No subjects found for your course yet.</div>
              : subjects.map(s => (
                <div className="list-item" key={s}>
                  <span className="li-name">{s}</span>
                  <span className="badge badge-blue">
                    {lectures.filter(l=>l.subject===s&&l.status==="completed").length} done
                  </span>
                </div>
              ))
          }
        </div>

        {/* Recent lectures */}
        <div className="section-card">
          <div className="section-title">Recent Lectures</div>
          {loading
            ? [1,2,3].map(i=><div key={i} style={{padding:"10px 0"}}><Skel/></div>)
            : recent.length === 0
              ? <div style={{color:"var(--muted)",fontSize:13}}>No lectures scheduled yet.</div>
              : recent.map(l => (
                <div className="list-item" key={l.id}>
                  <div>
                    <div className="li-name">{l.subject}</div>
                    <div className="li-sub">{l.date} · {fmtTime(l.time)}</div>
                  </div>
                  <span className={`badge ${l.status==="completed"?"badge-green":"badge-amber"}`}>
                    {l.status}
                  </span>
                </div>
              ))
          }
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MY COURSES — lectures filtered by student's course
══════════════════════════════════════════════════════════════════ */
function MyCoursesView({ studentData, lectures }){
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");

  const sorted = useMemo(() => {
    return [...lectures]
      .filter(l => filter === "all" || l.status === filter)
      .filter(l => {
        const q = search.toLowerCase();
        return !q || (l.subject||"").toLowerCase().includes(q)
                  || (l.faculty_name||"").toLowerCase().includes(q);
      })
      .sort((a,b) => {
        if(a.status==="completed" && b.status!=="completed") return 1;
        if(a.status!=="completed" && b.status==="completed") return -1;
        return new Date(b.date) - new Date(a.date);
      });
  }, [lectures, filter, search]);

  const counts = {
    all:       lectures.length,
    pending:   lectures.filter(l=>l.status==="pending").length,
    completed: lectures.filter(l=>l.status==="completed").length,
  };

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"var(--cream)",marginBottom:4}}>
          My Course — {studentData?.course || "—"}
        </div>
        <div style={{fontSize:13,color:"var(--muted)"}}>
          All lectures scheduled for your program · {lectures.length} total
        </div>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <svg width="14" height="14" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input className="search-input" placeholder="Search by subject or faculty…"
          value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      {/* Filter pills */}
      <div className="filters">
        {["all","pending","completed"].map(f => (
          <button key={f} className={`filter-btn${filter===f?" active":""}`} onClick={()=>setFilter(f)}>
            {f==="all"?`All (${counts.all})`:f==="pending"?`Pending (${counts.pending})`:`Completed (${counts.completed})`}
          </button>
        ))}
      </div>

      {/* Lecture cards */}
      {sorted.length === 0
        ? <div className="table-state">No lectures found.</div>
        : <div className="lec-list">
            {sorted.map(lec => {
              const {day,num,month} = fmtDate(lec.date);
              return (
                <div key={lec.id} className={`lec-card ${lec.status}`}>
                  <div className="lec-date-col">
                    <div className="lec-day">{day}</div>
                    <div className="lec-date-num">{num}</div>
                    <div className="lec-month">{month}</div>
                  </div>
                  <div className="lec-info">
                    <div className="lec-subject">{lec.subject}</div>
                    <div className="lec-meta">
                      <div className="lec-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                        </svg>
                        {lec.faculty_name || "—"}
                      </div>
                      <div className="lec-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {fmtTime(lec.time)}
                      </div>
                      <div className="lec-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                        {lec.course}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${lec.status==="completed"?"badge-green":"badge-amber"}`}>
                    {lec.status==="completed" ? "✓ Done" : "⏳ Pending"}
                  </span>
                </div>
              );
            })}
          </div>
      }
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SCHEDULE — same as My Courses but calendar-style grouped by date
══════════════════════════════════════════════════════════════════ */
function ScheduleView({ lectures }){
  /* Group lectures by date */
  const grouped = useMemo(() => {
    const map = {};
    [...lectures]
      .sort((a,b) => new Date(a.date)-new Date(b.date))
      .forEach(l => {
        const d = l.date || "Unknown";
        if(!map[d]) map[d] = [];
        map[d].push(l);
      });
    return Object.entries(map);
  }, [lectures]);

  return (
    <div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"var(--cream)",marginBottom:4}}>Schedule</div>
      <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>All upcoming & past lectures for your course</div>

      {grouped.length === 0
        ? <div className="table-state"><div className="spinner-lg"/>Loading schedule…</div>
        : grouped.map(([date, lecs]) => {
          const dt = new Date(date);
          const isToday = new Date().toDateString() === dt.toDateString();
          return (
            <div key={date} style={{marginBottom:20}}>
              <div style={{
                fontSize:12,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",
                color: isToday ? "var(--accent)" : "var(--muted)",
                marginBottom:10,display:"flex",alignItems:"center",gap:8
              }}>
                {isToday && <span className="badge badge-green" style={{fontSize:10}}>TODAY</span>}
                {dt.toLocaleDateString("en",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
              </div>
              <div className="lec-list">
                {lecs.map(lec => (
                  <div key={lec.id} className={`lec-card ${lec.status}`}>
                    <div className="lec-date-col" style={{minWidth:42,padding:"6px 4px"}}>
                      <div className="lec-day" style={{fontSize:8}}>{fmtDate(lec.date).day}</div>
                      <div className="lec-date-num" style={{fontSize:16}}>{fmtDate(lec.date).num}</div>
                      <div className="lec-month" style={{fontSize:8}}>{fmtDate(lec.date).month}</div>
                    </div>
                    <div className="lec-info">
                      <div className="lec-subject">{lec.subject}</div>
                      <div className="lec-meta">
                        <div className="lec-meta-item">
                          <svg width="11" height="11" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                          {lec.faculty_name}
                        </div>
                        <div className="lec-meta-item">
                          <svg width="11" height="11" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {fmtTime(lec.time)}
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${lec.status==="completed"?"badge-green":"badge-amber"}`}>
                      {lec.status==="completed"?"✓ Done":"⏳ Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MY PROFILE — all from DB
══════════════════════════════════════════════════════════════════ */
function ProfileView({ studentData }){
  const loading = !studentData;
  const fields = [
    {label:"Full Name",    key:"name"},
    {label:"Email",        key:"email"},
    {label:"Gender",       key:"gender"},
    {label:"Program",      key:"program"},
    {label:"Mobile",       key:"mobile"},
    {label:"Qualification",key:"qualification"},
    {label:"City",         key:"city"},
    {label:"State",        key:"state"},
    {label:"District",     key:"district"},
  ];

  return (
    <div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"var(--cream)",marginBottom:4}}>My Profile</div>
      <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>Your details from the database</div>

      <div className="profile-card">
        <div style={{display:"flex",alignItems:"center",gap:16,paddingBottom:16,borderBottom:"1px solid var(--border)"}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(109,191,109,.15)",border:"2px solid var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"var(--accent)"}}>
            {loading ? "?" : (studentData.name||"S").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)}
          </div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"var(--cream)"}}>
              {loading ? <Skel w={160} h={20}/> : studentData.name || "—"}
            </div>
            <div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>
              {loading ? <Skel w={200} h={14}/> : `${studentData.course||"—"} · Sem ${studentData.semester||"—"}`}
            </div>
          </div>
        </div>

        <div className="profile-grid">
          {fields.filter(f=>!f.full).map(f=>(
            <div key={f.key} className="profile-field">
              <div className="pf-label">{f.label}</div>
              <div className="pf-value">
                {loading ? <Skel w="80%" h={16}/> : (studentData[f.key] || "—")}
              </div>
            </div>
          ))}
        </div>

        {/* Full-width fields */}
        {fields.filter(f=>f.full).map(f=>(
          <div key={f.key} style={{marginTop:14,borderTop:"1px solid var(--border)",paddingTop:14}}>
            <div className="pf-label">{f.label}</div>
            <div className="pf-value" style={{marginTop:4}}>
              {loading ? <Skel w="60%" h={16}/> : (studentData[f.key] || "—")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT — fetches student profile + lectures once
══════════════════════════════════════════════════════════════════ */
export default function StudentDashboard(){
  const {state}  = useLocation();
  const navigate = useNavigate();
  const email    = state?.email || "student@university.edu";

  const [studentData, setStudentData] = useState(null);  // full student object from DB
  const [lectures,    setLectures]    = useState([]);     // lectures for student's course
  const [active,      setActive]      = useState("dashboard");

  /* Derived */
  const initials = studentData?.name
    ? studentData.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)
    : email.slice(0,2).toUpperCase();

  /* ── Fetch 1: Student profile by email ── */
  useEffect(()=>{
    fetch(`${STUDENT_API}/getbyemail/${encodeURIComponent(email)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if(data) setStudentData(data); })
      .catch(()=>{});
  },[email]);

  /* ── Fetch 2: Lectures for student's course ── */
  useEffect(()=>{
    if(!studentData?.program) return;
    fetch(`${STUDENT_API}/getlecture/${encodeURIComponent(studentData.program)}`)
      .then(r => r.ok ? r.json() : [])
      .then(setLectures)
      .catch(()=>{});
  },[studentData?.program]);

  const PAGE_TITLES = {
    dashboard: "Dashboard",
    courses:   "My Courses",
    profile:   "My Profile",
    schedule:  "Schedule",
  };

  return(
    <div className="dash">
      <style>{styles}</style>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-role">Student Portal</div>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="main">
        <div className="topbar">
          <div className="page-title">{PAGE_TITLES[active]}</div>
          <div className="user-chip">
            <div className="user-email">{email}</div>
            <div className="avatar">{initials}</div>
          </div>
        </div>

        <div className="content">
          {active==="dashboard" && <DashboardHome studentData={studentData} lectures={lectures}/>}
          {active==="courses"   && <MyCoursesView studentData={studentData} lectures={lectures}/>}
          {active==="profile"   && <ProfileView   studentData={studentData}/>}
          {active==="schedule"  && <ScheduleView  lectures={lectures}/>}
        </div>
      </main>
    </div>
  );
}
