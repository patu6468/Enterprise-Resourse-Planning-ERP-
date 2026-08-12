import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ── API base URLs ─────────────────────────────────────────────── */
const FACULTY_API = "https://enterprise-resourse-planning-erp-x4n9.onrender.com/faculty";
const LECTURE_API = "https://enterprise-resourse-planning-erp-x4n9.onrender.com/lecture";
const STUDENT_API = "https://enterprise-resourse-planning-erp-x4n9.onrender.com/student";

/*
  Spring Boot endpoints used:
  ┌─────────────────────────────────────────────────────────┐
  │ GET  /faculty/getbyemail/{email}   → Faculty object     │
  │ GET  /faculty/getAllstudent        → Student[]           │
  │ GET  /faculty/getlecture/{course}  → Lecture[] by course│  ← already in StudentController
  │ GET  /lecture/getlecture           → all Lecture[]       │
  │ POST /lecture/addlecture           → add Lecture         │
  │ PATCH /lecture/updatelecture/{id}  → update Lecture      │
  │ DELETE /lecture/deletelecture/{id} → delete Lecture      │
  │ PATCH /faculty/updatestudent/{id}  → update Student      │
  └─────────────────────────────────────────────────────────┘

  NEW endpoints needed in Spring Boot (add to FacultyController):
  ┌──────────────────────────────────────────────────────────────┐
  │ GET /faculty/getbyemail/{email}   → returns Faculty object   │
  │   (already described in LectureController.java comments)     │
  └──────────────────────────────────────────────────────────────┘
*/

/* ══════════════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#0d1520;--surface:#111d2e;--card:#152237;--card2:#0f1a2a;
    --accent:#7ab8e8;--cream:#eef4fb;--muted:#6a90b8;
    --border:rgba(122,184,232,0.18);
    --danger:#e07070;--success:#6dbf6d;--warn:#e8c06d;
  }
  body{margin:0;font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--cream);min-height:100vh}
  .dash{display:flex;min-height:100vh}
  .sidebar{width:240px;background:var(--surface);border-right:1px solid var(--border);padding:28px 0;display:flex;flex-direction:column;flex-shrink:0;position:sticky;top:0;height:100vh}
  .brand{padding:0 24px 28px;border-bottom:1px solid var(--border)}
  .brand-role{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--accent);font-weight:500}
  .brand-name{font-family:'Playfair Display',serif;font-size:18px;color:var(--cream);margin-top:4px}
  .nav{flex:1;padding:20px 12px}
  .nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:4px;cursor:pointer;font-size:13px;color:var(--muted);transition:all .15s;border:none;background:none;width:100%;text-align:left}
  .nav-item:hover{background:rgba(122,184,232,.08);color:var(--cream)}
  .nav-item.active{background:rgba(122,184,232,.15);color:var(--accent);font-weight:500}
  .nav-item svg{stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
  .logout-btn{margin:12px;padding:10px 12px;border-radius:4px;border:1px solid rgba(122,184,232,.2);background:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .15s}
  .logout-btn:hover{border-color:var(--danger);color:var(--danger)}
  .main{flex:1;display:flex;flex-direction:column;overflow:auto}
  .topbar{padding:20px 32px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--bg);z-index:10}
  .page-title{font-family:'Playfair Display',serif;font-size:22px;color:var(--cream)}
  .user-chip{display:flex;align-items:center;gap:10px}
  .avatar{width:36px;height:36px;border-radius:50%;background:rgba(122,184,232,.15);border:1px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--accent)}
  .user-email{font-size:13px;color:var(--muted)}
  .content{padding:28px 32px;flex:1}

  .welcome-banner{background:linear-gradient(135deg,rgba(122,184,232,.1),rgba(74,144,196,.05));border:1px solid var(--border);border-radius:6px;padding:22px 28px;margin-bottom:24px;display:flex;align-items:center;gap:20px}
  .wb-icon{width:48px;height:48px;border-radius:50%;background:rgba(122,184,232,.12);border:1px solid var(--accent);display:flex;align-items:center;justify-content:center;flex-shrink:0}
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
  .section-title{font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--border)}
  .list-item{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(122,184,232,.07);font-size:13px}
  .list-item:last-child{border-bottom:none}
  .li-name{color:var(--cream)}
  .li-sub{font-size:11px;color:var(--muted);margin-top:2px}

  .badge{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500;white-space:nowrap}
  .badge-blue{background:rgba(122,184,232,.15);color:var(--accent)}
  .badge-amber{background:rgba(232,192,109,.15);color:var(--warn)}
  .badge-green{background:rgba(109,191,109,.15);color:var(--success)}
  .badge-muted{background:rgba(106,144,184,.1);color:var(--muted)}
  .badge-red{background:rgba(224,112,112,.13);color:var(--danger)}

  .courses-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
  .course-card{background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:20px;transition:border-color .2s}
  .course-card:hover{border-color:var(--accent)}
  .course-code{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--accent);font-weight:600;margin-bottom:6px}
  .course-name{font-size:15px;font-weight:600;color:var(--cream);margin-bottom:10px}
  .course-meta{display:flex;flex-direction:column;gap:4px}
  .course-meta-row{display:flex;justify-content:space-between;font-size:12px;color:var(--muted)}

  .page-section{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:24px}
  .table-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;gap:12px;flex-wrap:wrap}
  .toolbar-title{font-family:'Playfair Display',serif;font-size:18px;color:var(--cream)}
  .toolbar-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .search-wrap{position:relative;display:flex;align-items:center}
  .search-wrap svg{position:absolute;left:10px;stroke:var(--muted);fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
  .search-input{padding:8px 10px 8px 34px;background:rgba(122,184,232,.06);border:1px solid var(--border);border-radius:4px;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;width:220px;transition:border-color .2s}
  .search-input::placeholder{color:var(--muted)}
  .search-input:focus{border-color:var(--accent)}
  .entries-select{padding:8px 10px;background:rgba(122,184,232,.06);border:1px solid var(--border);border-radius:4px;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;cursor:pointer}
  .dt-wrap{overflow-x:auto;border-radius:4px;border:1px solid var(--border)}
  table{width:100%;border-collapse:collapse;font-size:13px}
  thead{background:rgba(122,184,232,.08)}
  th{padding:12px 14px;text-align:left;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);white-space:nowrap;cursor:pointer;user-select:none;border-bottom:1px solid var(--border)}
  th:hover{color:var(--cream)}
  th .sort-icon{display:inline-block;margin-left:4px;opacity:.5;font-size:10px}
  th.sorted .sort-icon{opacity:1}
  td{padding:11px 14px;border-bottom:1px solid rgba(122,184,232,.07);color:var(--cream);vertical-align:middle}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:rgba(122,184,232,.03)}
  .btn-edit{padding:5px 10px;border-radius:4px;border:1px solid rgba(122,184,232,.3);background:rgba(122,184,232,.08);color:var(--accent);font-size:11px;font-family:'DM Sans',sans-serif;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all .15s}
  .btn-edit:hover{background:rgba(122,184,232,.18);border-color:var(--accent)}
  .btn-del{padding:5px 10px;border-radius:4px;border:1px solid rgba(224,112,112,.3);background:rgba(224,112,112,.08);color:var(--danger);font-size:11px;font-family:'DM Sans',sans-serif;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all .15s}
  .btn-del:hover{background:rgba(224,112,112,.18);border-color:var(--danger)}
  .pagination{display:flex;align-items:center;justify-content:space-between;margin-top:16px;flex-wrap:wrap;gap:8px}
  .page-info{font-size:12px;color:var(--muted)}
  .page-btns{display:flex;gap:4px}
  .page-btn{padding:5px 10px;border-radius:4px;border:1px solid var(--border);background:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;transition:all .15s}
  .page-btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
  .page-btn.active{background:rgba(122,184,232,.15);border-color:var(--accent);color:var(--accent);font-weight:600}
  .page-btn:disabled{opacity:.35;cursor:not-allowed}
  .table-state{padding:48px;text-align:center;color:var(--muted);font-size:14px}
  .spinner-lg{width:32px;height:32px;border:3px solid rgba(122,184,232,.15);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 12px}
  .skel{background:linear-gradient(90deg,rgba(122,184,232,.05) 25%,rgba(122,184,232,.12) 50%,rgba(122,184,232,.05) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:4px;height:22px}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  @keyframes spin{to{transform:rotate(360deg)}}

  .toast{position:fixed;bottom:24px;right:24px;z-index:9999;padding:12px 18px;border-radius:5px;font-size:13px;font-weight:500;display:flex;align-items:center;gap:8px;animation:slideUp .3s ease both;box-shadow:0 8px 24px rgba(0,0,0,.4);max-width:320px}
  .toast-success{background:#0f2a0f;border:1px solid var(--success);color:var(--success)}
  .toast-error{background:#2a0f0f;border:1px solid var(--danger);color:var(--danger)}
  @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

  .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(5px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .modal{background:var(--surface);border:1px solid var(--border);border-radius:8px;width:100%;max-width:540px;max-height:92vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,.65);animation:slideDown .3s cubic-bezier(.22,1,.36,1)}
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
  .form-input{padding:10px 12px;background:rgba(122,184,232,.05);border:1px solid var(--border);border-radius:4px;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;transition:border-color .2s,box-shadow .2s;width:100%}
  .form-input::placeholder{color:rgba(106,144,184,.45)}
  .form-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(122,184,232,.08)}
  .form-input:disabled{opacity:.4;cursor:not-allowed;background:rgba(122,184,232,.02)}
  select.form-input{cursor:pointer}
  select.form-input option{background:var(--surface);color:var(--cream)}

  .btn-primary{padding:9px 20px;background:linear-gradient(135deg,#7ab8e8,#4a90c4);border:none;border-radius:4px;color:#0d1520;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:opacity .15s,transform .1s;white-space:nowrap}
  .btn-primary:hover:not(:disabled){opacity:.9;transform:translateY(-1px)}
  .btn-primary:disabled{opacity:.5;cursor:not-allowed}
  .btn-ghost{padding:9px 16px;background:none;border:1px solid var(--border);border-radius:4px;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all .15s}
  .btn-ghost:hover{border-color:var(--accent);color:var(--accent)}
  .btn-add{padding:9px 16px;background:rgba(109,191,109,.12);border:1px solid rgba(109,191,109,.3);border-radius:4px;color:var(--success);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .15s;white-space:nowrap}
  .btn-add:hover{background:rgba(109,191,109,.2);border-color:var(--success)}

  .sch-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;gap:12px;flex-wrap:wrap}
  .sch-toolbar-left{display:flex;flex-direction:column;gap:4px}
  .sch-title{font-family:'Playfair Display',serif;font-size:20px;color:var(--cream)}
  .sch-sub{font-size:13px;color:var(--muted)}
  .sch-filters{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap}
  .filter-btn{padding:6px 14px;border-radius:20px;border:1px solid var(--border);background:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;transition:all .15s}
  .filter-btn:hover{border-color:var(--accent);color:var(--accent)}
  .filter-btn.active{background:rgba(122,184,232,.15);border-color:var(--accent);color:var(--accent);font-weight:500}
  .lec-list{display:flex;flex-direction:column;gap:12px}
  .lec-card{background:var(--card2);border:1px solid var(--border);border-radius:6px;padding:18px 20px;display:grid;grid-template-columns:auto 1fr auto;gap:16px;align-items:center;transition:border-color .2s}
  .lec-card:hover{border-color:rgba(122,184,232,.4)}
  .lec-card.completed{opacity:.65;border-left:3px solid var(--success)}
  .lec-card.pending{border-left:3px solid var(--warn)}
  .lec-date-col{display:flex;flex-direction:column;align-items:center;min-width:54px;background:rgba(122,184,232,.07);border-radius:5px;padding:10px 8px;border:1px solid var(--border)}
  .lec-day{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);font-weight:600}
  .lec-date{font-size:22px;font-weight:700;color:var(--accent);line-height:1.1}
  .lec-month{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-top:2px}
  .lec-info{display:flex;flex-direction:column;gap:5px;min-width:0}
  .lec-subject{font-size:15px;font-weight:600;color:var(--cream)}
  .lec-meta{display:flex;gap:14px;flex-wrap:wrap}
  .lec-meta-item{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--muted)}
  .lec-meta-item svg{stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
  .lec-actions{display:flex;flex-direction:column;gap:6px;align-items:flex-end}
  .btn-status{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:none;letter-spacing:.04em;transition:all .15s;white-space:nowrap}
  .btn-status.pending{background:rgba(232,192,109,.15);color:var(--warn);border:1px solid rgba(232,192,109,.3)}
  .btn-status.pending:hover{background:rgba(232,192,109,.25)}
  .btn-status.completed{background:rgba(109,191,109,.15);color:var(--success);border:1px solid rgba(109,191,109,.3)}
  .btn-status.completed:hover{background:rgba(109,191,109,.25)}
  .lec-edit-row{display:flex;gap:5px}
  .empty-state{padding:60px 20px;text-align:center;color:var(--muted)}
  .empty-icon{width:52px;height:52px;border-radius:50%;background:rgba(122,184,232,.07);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;margin:0 auto 14px}
  .empty-icon svg{stroke:var(--muted);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
  .confirm-modal{background:var(--surface);border:1px solid rgba(224,112,112,.3);border-radius:8px;width:100%;max-width:380px;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,.65);animation:slideDown .3s cubic-bezier(.22,1,.36,1);text-align:center}
  .confirm-title{font-family:'Playfair Display',serif;font-size:18px;color:var(--cream);margin-bottom:8px}
  .confirm-sub{font-size:13px;color:var(--muted);margin-bottom:22px;line-height:1.5}
  .confirm-btns{display:flex;gap:10px;justify-content:center}
  .btn-danger{padding:9px 20px;background:rgba(224,112,112,.15);border:1px solid rgba(224,112,112,.4);border-radius:4px;color:var(--danger);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s}
  .btn-danger:hover{background:rgba(224,112,112,.25)}
  .error-banner{background:rgba(224,112,112,.08);border:1px solid rgba(224,112,112,.25);border-radius:4px;padding:10px 14px;font-size:13px;color:var(--danger);margin-bottom:16px}

  /* =========================
   FACULTY RESPONSIVE DESIGN
   ========================= */

@media (max-width: 900px) {

  .sidebar {
    width: 200px;
  }

  .topbar {
    padding: 18px 20px;
  }

  .content {
    padding: 20px;
  }

  .stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-grid {
    grid-template-columns: 1fr;
  }

  .section-card.full {
    grid-column: auto;
  }

  .profile-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}


@media (max-width: 600px) {

  .dash {
    display: block;
  }

  /* Sidebar */
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    padding: 12px 0;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }

  .brand {
    padding: 0 16px 12px;
  }

  .nav {
    display: flex;
    overflow-x: auto;
    padding: 8px 12px;
    gap: 6px;
  }

  .nav-item {
    width: auto;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .logout-btn {
    margin: 8px 12px 0;
  }

  /* Main */
  .main {
    width: 100%;
    overflow: visible;
  }

  .topbar {
    padding: 14px 16px;
  }

  .page-title {
    font-size: 18px;
  }

  .user-email {
    display: none;
  }

  .avatar {
    width: 32px;
    height: 32px;
  }

  .content {
    padding: 16px;
  }

  /* Stats */
  .stats {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .stat-card {
    padding: 14px 12px;
  }

  .stat-value {
    font-size: 21px;
  }

  /* Sections */
  .section-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .section-card {
    padding: 16px;
  }

  /* Profile */
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .profile-card {
    padding: 16px;
  }

  /* Lecture cards */
  .lec-card {
    grid-template-columns: auto 1fr;
    gap: 10px;
  }

  .lec-info {
    min-width: 0;
  }

  .lec-actions {
    grid-column: 1 / -1;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .lec-edit-row {
    display: flex;
    width: 100%;
    gap: 8px;
  }

  .lec-edit-row button,
  .btn-status {
    flex: 1;
  }

  .lec-meta {
    gap: 7px;
    flex-wrap: wrap;
  }

  .lec-meta-item {
    font-size: 11px;
  }

  .lec-subject {
    font-size: 13px;
  }

  /* Search */
  .search-input {
    font-size: 12px;
  }

  /* Filters */
  .filters {
    display: flex;
    overflow-x: auto;
    gap: 6px;
    padding-bottom: 4px;
  }

  .filter-btn {
    flex-shrink: 0;
    white-space: nowrap;
  }
}


@media (max-width: 400px) {

  .content {
    padding: 12px;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .welcome-banner {
    padding: 14px;
  }

  .section-card {
    padding: 14px;
  }

  .lec-card {
    padding: 11px;
  }

  .lec-date-col {
    min-width: 42px;
  }

  .lec-edit-row {
    flex-direction: column;
  }

  .lec-edit-row button,
  .btn-status {
    width: 100%;
  }
}
`;

/* ── Nav items ─────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { key:"dashboard", label:"Dashboard",  icon:<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></> },
  { key:"courses",   label:"My Courses", icon:<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></> },
  { key:"students",  label:"Students",   icon:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
  { key:"schedule",  label:"Schedule",   icon:<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
];

/* ── Tiny helpers ──────────────────────────────────────────────── */
const BtnSpinner = () => (
  <span style={{width:13,height:13,border:"2px solid rgba(13,21,32,.3)",borderTopColor:"#0d1520",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite"}}/>
);
const Skel = ({w="100%",h=22}) => <div className="skel" style={{width:w,height:h}}/>;

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

/* ── useToast hook ─────────────────────────────────────────────── */
function useToast(){
  const [toast,setToast]=useState(null);
  const show=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3200);};
  return {toast,show};
}

/* ══════════════════════════════════════════════════════════════════
   DASHBOARD HOME — all stats from DB
══════════════════════════════════════════════════════════════════ */
function DashboardHome({ facultyData, students, lectures, facultyId }){
  const myLectures = lectures.filter(l =>
    (facultyId && l.faculty?.id === facultyId) ||
    (!facultyId && l.faculty_name === facultyData?.name)
  );
  const pendingLectures = myLectures.filter(l => l.status === "pending");

  /* Unique courses (programs) from student list */
  const programs = [...new Set(students.map(s => s.course).filter(Boolean))];

  /* Unique subjects from lecture list for this faculty */
  const mySubjects = [...new Set(myLectures.map(l => l.subject).filter(Boolean))];

  const loading = !facultyData;

  return (
    <>
      {/* Welcome banner */}
      <div className="welcome-banner">
        <div className="wb-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div>
          <div className="wb-title">
            {loading ? <Skel w={160} h={24}/> : `Welcome, ${facultyData.name}!`}
          </div>
          <div className="wb-sub">
            {loading ? <Skel w={220} h={16}/> : `${facultyData.email} · ${facultyData.department || "Faculty"}`}
          </div>
        </div>
      </div>

      {/* Stats — all from DB */}
      <div className="stats">
        {[
          { label:"Total Students",   value: loading ? null : students.length,        sub:"In database" },
          { label:"My Lectures",      value: loading ? null : myLectures.length,      sub:"All time" },
          { label:"Pending Lectures", value: loading ? null : pendingLectures.length, sub:"Not completed" },
          { label:"My Subjects",      value: loading ? null : mySubjects.length,      sub:"This semester" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">
              {s.value === null ? <Skel w={48} h={30}/> : s.value}
            </div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="section-grid">
        {/* My Lectures at a glance */}
        <div className="section-card">
          <div className="section-title">Recent Lectures</div>
          {myLectures.length === 0
            ? <div style={{color:"var(--muted)",fontSize:13}}>No lectures found.</div>
            : myLectures.slice(0,5).map((l,i) => (
              <div className="list-item" key={l.id ?? i}>
                <div>
                  <div className="li-name">{l.subject}</div>
                  <div className="li-sub">{l.course} · {l.date}</div>
                </div>
                <span className={`badge ${l.status==="completed"?"badge-green":"badge-amber"}`}>
                  {l.status}
                </span>
              </div>
            ))
          }
        </div>

        {/* Programs from student course field */}
        <div className="section-card">
          <div className="section-title">Programs Offered</div>
          {programs.length === 0
            ? <div style={{color:"var(--muted)",fontSize:13}}>No program data.</div>
            : programs.map(p => {
              const count = students.filter(s => s.course === p).length;
              return (
                <div className="list-item" key={p}>
                  <span className="li-name">{p}</span>
                  <span className="badge badge-blue">{count} students</span>
                </div>
              );
            })
          }
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MY COURSES VIEW — programs from student.course, subjects from lectures
══════════════════════════════════════════════════════════════════ */
function MyCoursesView({ students, lectures, facultyId, facultyName }){
  /* Programs = unique course values from student records */
  const programs = useMemo(() => {
    const map = {};
    students.forEach(s => {
      if(!s.course) return;
      if(!map[s.course]) map[s.course] = { name: s.course, students: 0 };
      map[s.course].students++;
    });
    return Object.values(map);
  }, [students]);

  /* Subjects = unique subjects from this faculty's lectures */
  const subjects = useMemo(() => {
    const myLecs = lectures.filter(l =>
      (facultyId && l.faculty?.id === facultyId) ||
      (!facultyId && l.faculty_name === facultyName)
    );
    const map = {};
    myLecs.forEach(l => {
      if(!l.subject) return;
      if(!map[l.subject]) map[l.subject] = { subject: l.subject, course: l.course, count: 0 };
      map[l.subject].count++;
    });
    return Object.values(map);
  }, [lectures, facultyId, facultyName]);

  const loading = students.length === 0 && lectures.length === 0;

  return (
    <div>
      {/* Programs */}
      <div style={{marginBottom:8}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"var(--cream)",marginBottom:4}}>Programs</div>
        <div style={{fontSize:13,color:"var(--muted)",marginBottom:16}}>Derived from enrolled students in database</div>
      </div>
      <div className="courses-grid" style={{marginBottom:32}}>
        {loading
          ? [1,2].map(i => <div key={i} className="course-card"><Skel/><br/><Skel w="60%"/></div>)
          : programs.length === 0
            ? <div style={{color:"var(--muted)",fontSize:13}}>No programs found in student records.</div>
            : programs.map(p => (
              <div className="course-card" key={p.name} style={{borderColor:"rgba(122,184,232,0.35)"}}>
                <div className="course-code" style={{fontSize:13,fontWeight:700}}>{p.name}</div>
                <div className="course-meta" style={{marginTop:10}}>
                  <div className="course-meta-row">
                    <span>Enrolled Students</span>
                    <span className="badge badge-blue">{p.students}</span>
                  </div>
                </div>
              </div>
            ))
        }
      </div>

      {/* Subjects */}
      <div style={{marginBottom:8}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"var(--cream)",marginBottom:4}}>My Subjects</div>
        <div style={{fontSize:13,color:"var(--muted)",marginBottom:16}}>Subjects derived from your lecture records</div>
      </div>
      <div className="courses-grid">
        {loading
          ? [1,2,3,4].map(i => <div key={i} className="course-card"><Skel/><br/><Skel w="60%"/></div>)
          : subjects.length === 0
            ? <div style={{color:"var(--muted)",fontSize:13}}>No subjects found. Add lectures to see subjects here.</div>
            : subjects.map(s => (
              <div className="course-card" key={s.subject}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                  <div className="course-code">{s.subject}</div>
                  {s.course && <span className="badge badge-muted" style={{fontSize:10}}>{s.course}</span>}
                </div>
                <div className="course-meta" style={{marginTop:10}}>
                  <div className="course-meta-row">
                    <span>Lectures held</span>
                    <span className="badge badge-blue">{s.count}</span>
                  </div>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STUDENTS TABLE
══════════════════════════════════════════════════════════════════ */
function UpdateStudentModal({student,onClose,onSaved}){
  const [form,setForm]=useState({...student});
  const [saving,setSaving]=useState(false);
  const fields=[
    {key:"name",         label:"Full Name",     type:"text"},
    {key:"email",        label:"Email",         type:"email"},
    {key:"mobile",       label:"Mobile",        type:"text"},
    {key:"gender",       label:"Gender",        type:"text"},
    {key:"program",      label:"Program",       type:"text"},
    {key:"qualification",label:"Qualification", type:"text"},
    {key:"caste",        label:"Caste",         type:"text"},
    {key:"city",         label:"City",          type:"text"},
    {key:"district",     label:"District",      type:"text"},
    {key:"subDistrict",  label:"Sub District",  type:"text"},
    {key:"state",        label:"State",         type:"text"},
    {key:"pinCode",      label:"Pin Code",      type:"text"},
  ];
  const save=async()=>{
    setSaving(true);
    try{
      const res=await fetch(`${FACULTY_API}/updatestudent/${student.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      if(!res.ok) throw new Error(await res.text());
      onSaved(await res.json());
    }catch(e){alert("Update failed: "+e.message);}
    finally{setSaving(false);}
  };
  return(
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Edit Student</div>
          <button className="modal-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-field"><label className="form-label">ID</label><input className="form-input" value={form.id||""} disabled/></div>
            {fields.map(f=>(
              <div key={f.key} className={`form-field${f.full?" full":""}`}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" type={f.type} value={form[f.key]??""} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.label}/>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save} disabled={saving}>{saving?<><BtnSpinner/>Saving…</>:"Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════
   ADD STUDENT MODAL
══════════════════════════════════════════════════════════════════ */
const EMPTY_STUDENT = {
  id:"", name:"", email:"", password:"",
  mobile:"", gender:"", program:"",
  qualification:"", caste:"",
  city:"", district:"", subDistrict:"",
  state:"", pinCode:""
};

function AddStudentModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY_STUDENT });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const fields = [
    { key:"id",           label:"Student ID",    type:"text",     req:true },
    { key:"name",         label:"Full Name",     type:"text",     req:true },
    { key:"email",        label:"Email",         type:"email",    req:true },
    { key:"password",     label:"Password",      type:"password", req:true },
    { key:"mobile",       label:"Mobile",        type:"text" },
    { key:"gender",       label:"Gender",        type:"text" },
    { key:"program",      label:"Program",       type:"text" },
    { key:"qualification",label:"Qualification", type:"text" },
    { key:"caste",        label:"Caste",         type:"text" },
    { key:"city",         label:"City",          type:"text" },
    { key:"district",     label:"District",      type:"text" },
    { key:"subDistrict",  label:"Sub District",  type:"text" },
    { key:"state",        label:"State",         type:"text" },
    { key:"pinCode",      label:"Pin Code",      type:"text" },
  ];

  const validate = () => {
    if (!form.id.trim())       return "Student ID is required.";
    if (!form.name.trim())     return "Name is required.";
    if (!form.email.trim())    return "Email is required.";
    if (!form.password.trim()) return "Password is required.";
    return "";
  };

  const save = async () => {
    const e = validate(); if (e) { setErr(e); return; }
    setSaving(true); setErr("");
    try {
      const res = await fetch(`${FACULTY_API}/addstudent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      onSaved(await res.json());
    } catch (ex) { setErr(ex.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Add New Student</div>
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {err && (
            <div style={{background:"rgba(224,112,112,.1)",border:"1px solid rgba(224,112,112,.3)",borderRadius:4,padding:"10px 12px",fontSize:13,color:"var(--danger)",marginBottom:14}}>
              {err}
            </div>
          )}
          <div className="form-grid">
            {fields.map(f => (
              <div key={f.key} className={`form-field${f.full ? " full" : ""}`}>
                <label className="form-label">{f.label}{f.req ? " *" : ""}</label>
                <input
                  className="form-input"
                  type={f.type}
                  value={form[f.key] ?? ""}
                  placeholder={f.label}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving ? <><BtnSpinner />Saving…</> : "Add Student"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentsTable({students, setStudents}){
  const [loading]     = useState(false); // already loaded from parent
  const [search,setSearch]   = useState("");
  const [pageSize,setPageSize] = useState(10);
  const [page,setPage]       = useState(1);
  const [sortKey,setSortKey] = useState("name");
  const [sortAsc,setSortAsc] = useState(true);
  const [editing,setEditing] = useState(null);
  const [showAdd, setShowAdd]     = useState(false);
  const {toast,show:showToast} = useToast();

  const filtered=useMemo(()=>{
    const q=search.toLowerCase();
    return students
      .filter(s=>Object.values(s).some(v=>String(v??"").toLowerCase().includes(q)))
      .sort((a,b)=>{
        const av=String(a[sortKey]??"").toLowerCase(), bv=String(b[sortKey]??"").toLowerCase();
        return sortAsc?av.localeCompare(bv):bv.localeCompare(av);
      });
  },[students,search,sortKey,sortAsc]);

  const totalPages=Math.max(1,Math.ceil(filtered.length/pageSize));
  const paginated=filtered.slice((page-1)*pageSize,page*pageSize);
  const toggleSort=k=>{if(sortKey===k)setSortAsc(a=>!a);else{setSortKey(k);setSortAsc(true);}setPage(1);};
  const columns=useMemo(()=>{
    if(!students.length) return [];
    return Object.keys(students[0]).filter(k=>k!=="password"&&k!=="lectures"&&k!=="faculty");
  },[students]);

  return(
    <>
      <Toast toast={toast}/>
       {showAdd && (
              <AddStudentModal
                onClose={() => setShowAdd(false)}
                onSaved={s => {
                  setStudents(p => [s, ...p]);
                  setShowAdd(false);
                  showToast(`${s.name || 'Student'} added!`);
                }}
              />
            )}
      {editing&&(
        <UpdateStudentModal student={editing} onClose={()=>setEditing(null)}
          onSaved={u=>{setStudents(p=>p.map(s=>s.id===u.id?u:s));setEditing(null);showToast(`${u.name||"Student"} updated!`);}}/>
      )}
      <div className="page-section">
        <div className="table-toolbar">
          <div className="toolbar-title">All Students <span style={{fontSize:14,color:"var(--muted)",fontWeight:400}}>({students.length} total)</span></div>
          <div className="toolbar-right">
              <button className="btn-add" onClick={() => setShowAdd(true)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                          Add Student
                        </button>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"var(--muted)"}}>
              Show
              <select className="entries-select" value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1);}}>
                {[5,10,25,50].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
              entries
            </div>
            <div className="search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input className="search-input" placeholder="Search students…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
            </div>
          </div>
        </div>

        {students.length===0
          ?<div className="table-state"><div className="spinner-lg"/>Loading students…</div>
          :filtered.length===0
            ?<div className="table-state">No students match your search.</div>
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
                    <th style={{width:80}}>Action</th>
                  </tr></thead>
                  <tbody>
                    {paginated.map((s,i)=>(
                      <tr key={s.id??i}>
                        <td style={{color:"var(--muted)",fontSize:12}}>{(page-1)*pageSize+i+1}</td>
                        {columns.map(col=>(
                          <td key={col} style={{maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                            {s[col]??"—"}
                          </td>
                        ))}
                        <td>
                          <button className="btn-edit" onClick={()=>setEditing(s)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <div className="page-info">Showing {Math.min((page-1)*pageSize+1,filtered.length)}–{Math.min(page*pageSize,filtered.length)} of {filtered.length}</div>
                <div className="page-btns">
                  <button className="page-btn" disabled={page===1} onClick={()=>setPage(1)}>«</button>
                  <button className="page-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
                  {Array.from({length:Math.min(5,totalPages)},(_,i)=>{
                    let p;
                    if(totalPages<=5) p=i+1;
                    else if(page<=3) p=i+1;
                    else if(page>=totalPages-2) p=totalPages-4+i;
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
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LECTURE MODAL
══════════════════════════════════════════════════════════════════ */
const EMPTY_LEC = {subject:"",faculty_name:"",date:"",time:"",course:"",status:"pending"};

function LectureModal({lecture, facultyName, facultyId, courses, onClose, onSaved, isEdit}){
  const [form,setForm]=useState(
    lecture ? {...lecture,date:lecture.date||"",time:lecture.time||""} : {...EMPTY_LEC,faculty_name:facultyName}
  );
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const validate=()=>{
    if(!form.subject.trim()) return "Subject is required.";
    if(!form.date)           return "Date is required.";
    if(!form.time)           return "Time is required.";
    if(!form.course.trim())  return "Course is required.";
    return "";
  };

  const save=async()=>{
    const e=validate(); if(e){setErr(e);return;}
    setSaving(true); setErr("");
    try{
      const url    = isEdit ? `${LECTURE_API}/updatelecture/${lecture.id}` : `${LECTURE_API}/addlecture`;
      const method = isEdit ? "PATCH" : "POST";
      const payload= {...form};
      if(facultyId) payload.faculty={id:facultyId};
      const res=await fetch(url,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      if(!res.ok) throw new Error(await res.text());
      const result=isEdit ? await res.json() : {...payload,id:Date.now()};
      onSaved(result,isEdit);
    }catch(ex){setErr("Save failed: "+ex.message);}
    finally{setSaving(false);}
  };

  return(
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{isEdit?"Edit Lecture":"Add Lecture"}</div>
          <button className="modal-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="modal-body">
          {err&&<div className="error-banner">{err}</div>}
          <div className="form-grid">
            <div className="form-field full">
              <label className="form-label">Subject</label>
              <input className="form-input" placeholder="e.g. Data Structures" value={form.subject} onChange={e=>set("subject",e.target.value)}/>
            </div>
            <div className="form-field full">
              <label className="form-label">Faculty Name</label>
              <input className="form-input" value={form.faculty_name} disabled/>
            </div>
            {/* Course dropdown — populated from DB programs */}
            <div className="form-field">
              <label className="form-label">Course / Program</label>
              {courses.length > 0 ? (
                <select className="form-input" value={form.course} onChange={e=>set("course",e.target.value)}>
                  <option value="">Select…</option>
                  {courses.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <input
                  className="form-input"
                  placeholder="Type course name…"
                  value={form.course}
                  onChange={e=>set("course",e.target.value)}
                />
              )}
            </div>
            <div className="form-field">
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e=>set("status",e.target.value)}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={form.date} onChange={e=>set("date",e.target.value)}/>
            </div>
            <div className="form-field">
              <label className="form-label">Time</label>
              <input className="form-input" type="time" value={form.time} onChange={e=>set("time",e.target.value)}/>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving?<><BtnSpinner/>Saving…</>:isEdit?"Save Changes":"Add Lecture"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Confirm Delete ────────────────────────────────────────────── */
function ConfirmDelete({lecture,onCancel,onConfirm,deleting}){
  return(
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onCancel()}>
      <div className="confirm-modal">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:12}}>
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
        <div className="confirm-title">Delete Lecture?</div>
        <div className="confirm-sub">Delete <strong style={{color:"var(--cream)"}}>{lecture.subject}</strong> on {lecture.date}? This cannot be undone.</div>
        <div className="confirm-btns">
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm} disabled={deleting}>{deleting?"Deleting…":"Delete"}</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SCHEDULE VIEW
══════════════════════════════════════════════════════════════════ */
function ScheduleView({facultyName, facultyId, lectures, setLectures, courses}){
  const [filter,setFilter]       = useState("all");
  const [showAdd,setShowAdd]     = useState(false);
  const [editing,setEditing]     = useState(null);
  const [confirmDel,setConfirmDel]= useState(null);
  const [deleting,setDeleting]   = useState(false);
  const {toast,show:showToast}   = useToast();

  const myLectures = useMemo(()=>
    lectures.filter(l=>
      (facultyId && l.faculty?.id===facultyId)||
      (!facultyId && l.faculty_name===facultyName)
    )
  ,[lectures,facultyId,facultyName]);

  const sorted = useMemo(()=>[...myLectures]
    .filter(l=>filter==="all"||l.status===filter)
    .sort((a,b)=>{
      if(a.status==="completed"&&b.status!=="completed") return 1;
      if(a.status!=="completed"&&b.status==="completed") return -1;
      return new Date(b.date)-new Date(a.date);
    })
  ,[myLectures,filter]);

  const counts={
    all:myLectures.length,
    pending:myLectures.filter(l=>l.status==="pending").length,
    completed:myLectures.filter(l=>l.status==="completed").length,
  };

  const handleAdded=(newLec)=>{
    setLectures(prev=>[newLec,...prev]);
    setShowAdd(false);
    showToast("Lecture added!");
  };
  const handleUpdated=(updated)=>{
    setLectures(prev=>prev.map(l=>l.id===updated.id?updated:l));
    setEditing(null);
    showToast("Lecture updated!");
  };
  const toggleStatus=async(lec)=>{
    const ns=lec.status==="pending"?"completed":"pending";
    try{
      const res=await fetch(`${LECTURE_API}/updatelecture/${lec.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({...lec,status:ns})});
      if(!res.ok) throw new Error(await res.text());
      const updated=await res.json();
      setLectures(prev=>prev.map(l=>l.id===updated.id?updated:l));
      showToast(`Marked as ${ns}`);
    }catch(e){showToast("Update failed: "+e.message,"error");}
  };
  const handleDelete=async()=>{
    if(!confirmDel) return;
    setDeleting(true);
    try{
      const res=await fetch(`${LECTURE_API}/deletelecture/${confirmDel.id}`,{method:"DELETE"});
      if(!res.ok) throw new Error(await res.text());
      setLectures(prev=>prev.filter(l=>l.id!==confirmDel.id));
      showToast("Lecture deleted.");
    }catch(e){showToast("Delete failed: "+e.message,"error");}
    finally{setDeleting(false);setConfirmDel(null);}
  };

  const fmtDate=(d)=>{
    if(!d) return {day:"--",date:"--",month:"---"};
    const dt=new Date(d);
    return{day:dt.toLocaleDateString("en",{weekday:"short"}),date:dt.getDate(),month:dt.toLocaleDateString("en",{month:"short"})};
  };
  const fmtTime=(t)=>{
    if(!t) return "";
    const [h,m]=t.split(":");
    const hr=parseInt(h);
    return `${hr%12||12}:${m} ${hr>=12?"PM":"AM"}`;
  };

  return(
    <>
      <Toast toast={toast}/>
      {showAdd&&<LectureModal facultyName={facultyName} facultyId={facultyId} courses={courses} isEdit={false} onClose={()=>setShowAdd(false)} onSaved={handleAdded}/>}
      {editing&&<LectureModal lecture={editing} facultyName={facultyName} facultyId={facultyId} courses={courses} isEdit={true} onClose={()=>setEditing(null)} onSaved={handleUpdated}/>}
      {confirmDel&&<ConfirmDelete lecture={confirmDel} deleting={deleting} onCancel={()=>setConfirmDel(null)} onConfirm={handleDelete}/>}

      <div className="sch-toolbar">
        <div className="sch-toolbar-left">
          <div className="sch-title">My Lecture Schedule</div>
          <div className="sch-sub">{counts.all} total · {counts.pending} pending · {counts.completed} completed</div>
        </div>
        <button className="btn-add" onClick={()=>setShowAdd(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Lecture
        </button>
      </div>

      <div className="sch-filters">
        {["all","pending","completed"].map(f=>(
          <button key={f} className={`filter-btn${filter===f?" active":""}`} onClick={()=>setFilter(f)}>
            {f==="all"?`All (${counts.all})`:f==="pending"?`Pending (${counts.pending})`:`Completed (${counts.completed})`}
          </button>
        ))}
      </div>

      {sorted.length===0
        ?<div className="empty-state">
          <div className="empty-icon"><svg width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
          <div>No {filter!=="all"?filter:""} lectures found.</div>
          <div style={{marginTop:10}}><button className="btn-add" onClick={()=>setShowAdd(true)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add your first lecture</button></div>
        </div>
        :<div className="lec-list">
          {sorted.map(lec=>{
            const{day,date,month}=fmtDate(lec.date);
            return(
              <div key={lec.id} className={`lec-card ${lec.status}`}>
                <div className="lec-date-col">
                  <div className="lec-day">{day}</div>
                  <div className="lec-date">{date}</div>
                  <div className="lec-month">{month}</div>
                </div>
                <div className="lec-info">
                  <div className="lec-subject">{lec.subject}</div>
                  <div className="lec-meta">
                    <div className="lec-meta-item"><svg width="12" height="12" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>{lec.faculty_name}</div>
                    <div className="lec-meta-item"><svg width="12" height="12" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{fmtTime(lec.time)}</div>
                    <div className="lec-meta-item"><svg width="12" height="12" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>{lec.course}</div>
                  </div>
                </div>
                <div className="lec-actions">
                  <button className={`btn-status ${lec.status}`} onClick={()=>toggleStatus(lec)}>
                    {lec.status==="pending"?"⏳ Pending":"✓ Completed"}
                  </button>
                  <div className="lec-edit-row">
                    <button className="btn-edit" onClick={()=>setEditing(lec)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>
                    <button className="btn-del" onClick={()=>setConfirmDel(lec)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      }
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT — fetches ALL data once, shares with all child views
══════════════════════════════════════════════════════════════════ */
export default function FacultyDashboard(){
  const {state}  = useLocation();
  const navigate = useNavigate();
  const email    = state?.email || "faculty@university.edu";

  /* ── Shared state fetched from DB ── */
  const [facultyData, setFacultyData] = useState(null);   // full faculty object
  const [students,    setStudents]    = useState([]);
  const [lectures,    setLectures]    = useState([]);
  const [active,      setActive]      = useState("dashboard");

  /* Derived */
  const facultyId   = facultyData?.id   || null;
  const facultyName = facultyData?.name || email.split("@")[0];
  const initials    = facultyName.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) || "FA";

  /* Unique programs/courses from student.course field — used in lecture modal dropdown */
  const courses = useMemo(()=>[...new Set(students.map(s=>s.course).filter(Boolean))],[students]);

  /* ── Fetch 1: Faculty profile ── */
  useEffect(()=>{
    fetch(`${FACULTY_API}/getbyemail/${encodeURIComponent(email)}`)
      .then(r=>r.ok?r.json():null)
      .then(d=>{ if(d) setFacultyData(d); })
      .catch(()=>{});
  },[email]);

  /* ── Fetch 2: All students ── */
  useEffect(()=>{
    fetch(`${FACULTY_API}/getAllstudent`)
      .then(r=>r.ok?r.json():[])
      .then(setStudents)
      .catch(()=>{});
  },[]);

  /* ── Fetch 3: All lectures ── */
  useEffect(()=>{
    fetch(`${LECTURE_API}/getlecture`)
      .then(r=>r.ok?r.json():[])
      .then(setLectures)
      .catch(()=>{});
  },[]);

  const PAGE_TITLES={dashboard:"Dashboard",courses:"My Courses",students:"Students",schedule:"Schedule"};

  return(
    <div className="dash">
      <style>{styles}</style>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-role">Faculty Portal</div>
          <div className="brand-name">Academia</div>
        </div>
        <nav className="nav">
          {NAV_ITEMS.map(item=>(
            <button key={item.key} className={`nav-item${active===item.key?" active":""}`} onClick={()=>setActive(item.key)}>
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
          {active==="dashboard" && <DashboardHome facultyData={facultyData} students={students} lectures={lectures} facultyId={facultyId}/>}
          {active==="courses"   && <MyCoursesView students={students} lectures={lectures} facultyId={facultyId} facultyName={facultyName}/>}
          {active==="students"  && <StudentsTable students={students} setStudents={setStudents}/>}
          {active==="schedule"  && <ScheduleView facultyName={facultyName} facultyId={facultyId} lectures={lectures} setLectures={setLectures} courses={courses}/>}
        </div>
      </main>
    </div>
  );
}
