import { useState, useRef, useEffect, useMemo } from "react";
import {
  Plus, X, Check, Trash2, ArrowLeft, Edit3, ChevronRight, ChevronLeft,
  Download, Upload, Settings, Search, Undo2, Redo2, Repeat,
  CalendarPlus, CalendarDays, ListChecks, Bell, BellOff, Star, Clock,
  Sunrise, MoreHorizontal, Home, CheckCircle2, ChevronDown, ChevronUp,
  Timer, Flame, BarChart2, Zap, CheckSquare, Square, Play, Pause, RotateCcw
} from "lucide-react";

const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

// ─── 6 Themes ─────────────────────────────────────────────────────────────────
const THEMES = {
  light: {
    name:"Light", emoji:"☀️",
    systemBg:"#F2F2F7", card:"#FFFFFF", cardAlt:"#F2F2F7", cardAlt2:"#E5E5EA",
    sep:"rgba(60,60,67,0.12)", sepHard:"rgba(60,60,67,0.3)",
    text:"#000000", muted:"#6E6E73", hint:"#AEAEB2",
    primary:"#007AFF", primaryDim:"#E8F0FE",
    success:"#34C759", danger:"#FF3B30", warn:"#FF9500",
    rRedBg:"#FFE5E5", rRedBd:"#FF3B30", rRedTx:"#C8001A", rRedDt:"#FF3B30",
    rOrgBg:"#FFF4E0", rOrgBd:"#FF9500", rOrgTx:"#7D3F00", rOrgDt:"#FF9500",
    star:"#FF9500", pinBg:"#FFFBF2", ageBg:"#F9F9F9", ageTx:"#AEAEB2",
    tabBg:"rgba(255,255,255,0.96)", tabBorder:"rgba(0,0,0,0.06)",
  },
  dark: {
    name:"Dark", emoji:"🌙",
    systemBg:"#000000", card:"#1C1C1E", cardAlt:"#2C2C2E", cardAlt2:"#3A3A3C",
    sep:"rgba(255,255,255,0.08)", sepHard:"rgba(255,255,255,0.2)",
    text:"#FFFFFF", muted:"#8E8E93", hint:"#48484A",
    primary:"#0A84FF", primaryDim:"#001D3D",
    success:"#30D158", danger:"#FF453A", warn:"#FF9F0A",
    rRedBg:"#3A0000", rRedBd:"#FF453A", rRedTx:"#FF9999", rRedDt:"#FF453A",
    rOrgBg:"#2D1400", rOrgBd:"#FF9F0A", rOrgTx:"#FFB347", rOrgDt:"#FF9F0A",
    star:"#FF9F0A", pinBg:"#1F1600", ageBg:"#2C2C2E", ageTx:"#636366",
    tabBg:"rgba(44,44,46,0.96)", tabBorder:"rgba(255,255,255,0.08)",
  },
  midnight: {
    name:"Midnight", emoji:"🌌",
    systemBg:"#000010", card:"#0A0A1A", cardAlt:"#12122A", cardAlt2:"#1A1A35",
    sep:"rgba(100,120,255,0.12)", sepHard:"rgba(100,120,255,0.25)",
    text:"#E8EAFF", muted:"#7B82B8", hint:"#3D4275",
    primary:"#4FC3F7", primaryDim:"#0A1A2A",
    success:"#00E676", danger:"#FF5252", warn:"#FFD740",
    rRedBg:"#1A0005", rRedBd:"#FF5252", rRedTx:"#FF8A80", rRedDt:"#FF5252",
    rOrgBg:"#1A0F00", rOrgBd:"#FFD740", rOrgTx:"#FFE57F", rOrgDt:"#FFD740",
    star:"#FFD740", pinBg:"#0D0D20", ageBg:"#12122A", ageTx:"#3D4275",
    tabBg:"rgba(10,10,26,0.97)", tabBorder:"rgba(79,195,247,0.15)",
  },
  sand: {
    name:"Sand", emoji:"🏜️",
    systemBg:"#FAF7F2", card:"#FFFFFF", cardAlt:"#F5F0E8", cardAlt2:"#EDE5D8",
    sep:"rgba(160,120,80,0.14)", sepHard:"rgba(160,120,80,0.35)",
    text:"#2C1A0E", muted:"#8C6A4A", hint:"#C4A882",
    primary:"#C1440E", primaryDim:"#FAEDE8",
    success:"#3D8B37", danger:"#C1440E", warn:"#D4890A",
    rRedBg:"#FAEDE8", rRedBd:"#C1440E", rRedTx:"#8B2000", rRedDt:"#C1440E",
    rOrgBg:"#FDF5E0", rOrgBd:"#D4890A", rOrgTx:"#7D4E00", rOrgDt:"#D4890A",
    star:"#D4890A", pinBg:"#FDF8F0", ageBg:"#F5F0E8", ageTx:"#C4A882",
    tabBg:"rgba(255,255,255,0.97)", tabBorder:"rgba(160,120,80,0.18)",
  },
  forest: {
    name:"Forest", emoji:"🌲",
    systemBg:"#0D1F0F", card:"#122016", cardAlt:"#1A2E1C", cardAlt2:"#223D24",
    sep:"rgba(111,207,151,0.12)", sepHard:"rgba(111,207,151,0.25)",
    text:"#D4EDDA", muted:"#6B9E78", hint:"#2E5035",
    primary:"#6FCF97", primaryDim:"#0D2016",
    success:"#6FCF97", danger:"#FF6B6B", warn:"#FFD93D",
    rRedBg:"#1A0D0D", rRedBd:"#FF6B6B", rRedTx:"#FF9999", rRedDt:"#FF6B6B",
    rOrgBg:"#1A1500", rOrgBd:"#FFD93D", rOrgTx:"#FFE57F", rOrgDt:"#FFD93D",
    star:"#FFD93D", pinBg:"#0D1A0F", ageBg:"#1A2E1C", ageTx:"#2E5035",
    tabBg:"rgba(18,32,22,0.97)", tabBorder:"rgba(111,207,151,0.15)",
  },
  slate: {
    name:"Slate", emoji:"🪨",
    systemBg:"#1E2530", card:"#252D3A", cardAlt:"#2D3748", cardAlt2:"#364155",
    sep:"rgba(246,173,85,0.12)", sepHard:"rgba(246,173,85,0.25)",
    text:"#EDF2F7", muted:"#A0AEC0", hint:"#4A5568",
    primary:"#F6AD55", primaryDim:"#2D2010",
    success:"#68D391", danger:"#FC8181", warn:"#F6AD55",
    rRedBg:"#2D1515", rRedBd:"#FC8181", rRedTx:"#FEB2B2", rRedDt:"#FC8181",
    rOrgBg:"#2D2010", rOrgBd:"#F6AD55", rOrgTx:"#FCD34D", rOrgDt:"#F6AD55",
    star:"#F6AD55", pinBg:"#252D3A", ageBg:"#2D3748", ageTx:"#4A5568",
    tabBg:"rgba(37,45,58,0.97)", tabBorder:"rgba(246,173,85,0.15)",
  },
};

const EST_LABELS = { "":"–", "15":"15 min", "30":"30 min", "60":"1 hr", "120":"2 hr", "180":"3 hr" };
const mkDate = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split("T")[0]; };

const DEFAULT_DATA = {
  "demo-user": {
    id:"demo-user", name:"Demo User",
    topics:{
      "daily-tasks":{ id:"daily-tasks", name:"Daily Tasks", tasks:[
        { id:1, text:"Review project proposal", description:"Check Q4 proposal and give feedback",
          completed:false, dueDate:mkDate(1), dueTime:"14:00", priority:"high", estimate:"60",
          recurrence:null, createdAt:new Date(Date.now()-9*86400000).toISOString(), completedAt:null,
          pinned:true, subtasks:[{id:101,text:"Read executive summary",completed:true},{id:102,text:"Check budget section",completed:false},{id:103,text:"Write feedback notes",completed:false}] },
        { id:2, text:"Call dentist", description:"",
          completed:true, dueDate:null, dueTime:null, priority:"normal", estimate:"",
          recurrence:null, createdAt:new Date().toISOString(), completedAt:new Date().toISOString(),
          pinned:false, subtasks:[] },
        { id:3, text:"Buy groceries", description:"Milk, bread, eggs",
          completed:false, dueDate:mkDate(0), dueTime:"18:30", priority:"urgent", estimate:"30",
          recurrence:"weekly", createdAt:new Date().toISOString(), completedAt:null,
          pinned:false, subtasks:[{id:104,text:"Milk",completed:false},{id:105,text:"Bread",completed:true},{id:106,text:"Eggs",completed:false}] },
      ]},
      "work":{ id:"work", name:"Work Tasks", tasks:[
        { id:7, text:"Finish quarterly report", description:"Include all financial data",
          completed:false, dueDate:mkDate(-1), dueTime:"09:00", priority:"urgent", estimate:"120",
          recurrence:null, createdAt:new Date(Date.now()-14*86400000).toISOString(), completedAt:null,
          pinned:true, subtasks:[] },
        { id:8, text:"Team meeting at 3 PM", description:"Discuss new project timeline",
          completed:false, dueDate:mkDate(4), dueTime:"15:00", priority:"normal", estimate:"60",
          recurrence:null, createdAt:new Date().toISOString(), completedAt:null,
          pinned:false, subtasks:[] },
        { id:9, text:"Send project update", description:"",
          completed:false, dueDate:mkDate(2), dueTime:null, priority:"high", estimate:"15",
          recurrence:null, createdAt:new Date().toISOString(), completedAt:null,
          pinned:false, subtasks:[] },
      ]},
    },
  },
};

// ── Persistence — module-level so closures in push/undo/redo always find them ─
const STORE_KEY = "dt_v5_users";
const PREFS_KEY = "dt_v5_prefs";
// Legacy keys from previous versions — checked once for migration
const LEGACY_USER_KEYS = ["dt_v4_users", "dt_v3_users", "dtwv4"];
const LEGACY_PREF_KEYS = ["dt_v4_prefs", "dt_v3_prefs"];

const isValidUsers = (obj) =>
  obj && typeof obj === "object" && Object.keys(obj).length > 0;

const loadUsers = () => {
  try {
    // 1. Try current key first
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidUsers(parsed)) return parsed;
    }
    // 2. Migrate from any legacy key — saves under new key so it's found next time
    for (const oldKey of LEGACY_USER_KEYS) {
      const oldRaw = localStorage.getItem(oldKey);
      if (oldRaw) {
        const oldParsed = JSON.parse(oldRaw);
        if (isValidUsers(oldParsed)) {
          localStorage.setItem(STORE_KEY, oldRaw); // migrate
          localStorage.removeItem(oldKey);          // clean up old key
          return oldParsed;
        }
      }
    }
  } catch(e) { /* fall through */ }
  return DEFAULT_DATA;
};

const loadPrefs = () => {
  try {
    // 1. Try current key
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      // Normalize: old versions may not have all fields
      return {
        themeName:   p.themeName   || "light",
        showUrgency: p.showUrgency !== false,
        showBoarding:p.showBoarding !== false,
        notifOn:     p.notifOn === true,
      };
    }
    // 2. Migrate from legacy prefs key
    for (const oldKey of LEGACY_PREF_KEYS) {
      const oldRaw = localStorage.getItem(oldKey);
      if (oldRaw) {
        const p = JSON.parse(oldRaw);
        const migrated = {
          themeName:   p.themeName   || "light",
          showUrgency: p.showUrgency !== false,
          // Old versions never saved showBoarding — if they had data saved, onboarding was already seen
          showBoarding:p.showBoarding !== false,
          notifOn:     p.notifOn === true,
        };
        localStorage.setItem(PREFS_KEY, JSON.stringify(migrated));
        localStorage.removeItem(oldKey);
        return migrated;
      }
    }
  } catch(e) {}
  return { themeName:"light", showUrgency:true, showBoarding:true, notifOn:false };
};

const saveUsers = (data) => {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch(e) {}
};

const savePrefs = (prefs) => {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch(e) {}
};

// ── Computed once at module level — never re-reads localStorage on re-renders ─
const _INITIAL_PREFS = loadPrefs();

const getStreakData = (users) => {
  const dates = new Set();
  Object.values(users).forEach(u =>
    Object.values(u.topics).forEach(tp =>
      tp.tasks.forEach(t => { if (t.completed && t.completedAt) dates.add(new Date(t.completedAt).toISOString().split("T")[0]); })
    )
  );
  const today = new Date().toISOString().split("T")[0];
  let streak = 0; const check = new Date();
  if (!dates.has(today)) check.setDate(check.getDate() - 1);
  while (true) {
    const ds = check.toISOString().split("T")[0];
    if (dates.has(ds)) { streak++; check.setDate(check.getDate() - 1); } else break;
  }
  const weekData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    let count = 0;
    Object.values(users).forEach(u => Object.values(u.topics).forEach(tp => tp.tasks.forEach(t => {
      if (t.completed && t.completedAt && new Date(t.completedAt).toISOString().split("T")[0] === ds) count++;
    })));
    weekData.push({ ds, day:d.toLocaleDateString("en-US",{weekday:"short"}).slice(0,1), count });
  }
  return { streak, weekData };
};

// ── Pure module-level helpers ──────────────────────────────────────────────────
const getDaysU = (ds) => { if(!ds)return null; const due=new Date(ds);due.setHours(0,0,0,0); const now=new Date();now.setHours(0,0,0,0); return Math.ceil((due-now)/86400000); };
const urgLvU   = (ds) => { const d=getDaysU(ds); if(d===null)return"none"; if(d<0||d<=1)return"red"; if(d===2)return"orange"; return"none"; };
const fmtDateU = (ds) => { if(!ds)return null; const d=getDaysU(ds); if(d<0)return Math.abs(d)+"d overdue"; if(d===0)return"Today"; if(d===1)return"Tomorrow"; if(d<=7)return d+" days"; return new Date(ds).toLocaleDateString("en-US",{month:"short",day:"numeric"}); };
const fmtTimeU = (t)  => { if(!t)return null; const[h,m]=t.split(":"); const hr=parseInt(h); return(hr>12?hr-12:hr||12)+":"+m+" "+(hr>=12?"PM":"AM"); };
const taskAgeDays = (createdAt) => { if(!createdAt)return 0; return Math.floor((Date.now()-new Date(createdAt).getTime())/86400000); };

// ── SwipeRow — module-level to preserve identity across renders ────────────────
function SwipeRow({ task, rowNum, isLast, T, expandSubs, setExpandSubs, subInputs, setSubInputs,
  addSub, deleteSub, toggleSub, toggleTask, setCtxTask, onDelete, onMoveUp, onMoveDown,
  canMoveUp, canMoveDown, selectMode, selected, onToggleSelect }) {

  const [swipeX,    setSwipeX]    = useState(0);
  const [swiping,   setSwiping]   = useState(false);
  const [animPhase, setAnimPhase] = useState("idle");
  const startX = useRef(0), startY = useRef(0), isScrolling = useRef(false);
  const THRESHOLD = 76;

  const onTouchStart = (e) => {
    if (animPhase !== "idle" || selectMode) return;
    startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY;
    isScrolling.current = false; setSwiping(false); setSwipeX(0);
  };
  const onTouchMove = (e) => {
    if (animPhase !== "idle" || selectMode) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    if (!swiping && Math.abs(dy) > Math.abs(dx)) { isScrolling.current = true; return; }
    if (isScrolling.current) return;
    if (Math.abs(dx) > 5) { setSwiping(true); e.preventDefault(); }
    setSwipeX(Math.max(-THRESHOLD * 1.3, Math.min(THRESHOLD * 1.3, dx)));
  };
  const onTouchEnd = () => {
    if (swipeX < -THRESHOLD) {
      setAnimPhase("deleting"); setSwipeX(0);
      setTimeout(() => { onDelete(task.id); setAnimPhase("idle"); }, 360);
    } else if (swipeX > THRESHOLD) {
      setAnimPhase("completing"); setSwipeX(0);
      setTimeout(() => { toggleTask(task.id); setAnimPhase("idle"); }, 380);
    } else { setSwipeX(0); }
    setSwiping(false);
  };

  const ul = task.completed ? "none" : urgLvU(task.dueDate);
  const subtasks = task.subtasks || [];
  const subDone = subtasks.filter(s => s.completed).length;
  const isExpanded = !!expandSubs[task.id];
  const isPinned = task.pinned && !task.completed;
  const ageDays = taskAgeDays(task.createdAt);
  const showAge = !task.completed && ageDays >= 7;
  const dueTxColor = (ds) => { const u=urgLvU(ds); if(u==="red")return T.rRedTx; if(u==="orange")return T.rOrgTx; return T.muted; };

  const rowAnim = animPhase==="completing" ? {animation:"dtComplete 0.38s ease forwards"}
    : animPhase==="deleting" ? {animation:"dtDelete 0.36s cubic-bezier(0.36,0.07,0.19,0.97) forwards"} : {};

  const ghost = (e) => ({ background:"none", border:"none", color:T.primary, fontSize:15, cursor:"pointer", fontWeight:500, ...(e||{}) });
  const inp   = (e) => ({ backgroundColor:T.cardAlt, border:"none", color:T.text, borderRadius:12, padding:"12px 14px", fontSize:15, outline:"none", width:"100%", boxSizing:"border-box", ...(e||{}) });

  return (
    <div style={{ borderBottom:isLast?"none":`0.5px solid ${T.sep}`, ...rowAnim }}>
      <div style={{ position:"relative", overflow:"hidden" }}>
        {/* Swipe reveal BGs */}
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:Math.max(0,Math.min(swipeX,THRESHOLD)), backgroundColor:T.success, display:"flex", alignItems:"center", paddingLeft:16, opacity:swipeX>10?1:0, transition:"opacity .15s" }}>
          <Check size={20} color="#fff"/>
        </div>
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:Math.max(0,Math.min(-swipeX,THRESHOLD)), backgroundColor:T.danger, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:16, opacity:swipeX<-10?1:0, transition:"opacity .15s" }}>
          <Trash2 size={20} color="#fff"/>
        </div>

        <div
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
          onTouchCancel={() => { setSwipeX(0); setSwiping(false); }}
          style={{ display:"flex", alignItems:"center", padding:"12px 14px", gap:9,
            backgroundColor:selected ? T.primaryDim : isPinned ? T.pinBg : T.card,
            transform:`translateX(${swipeX}px)`,
            transition:swiping ? "none" : "transform .22s cubic-bezier(0.25,0.46,0.45,0.94)",
            position:"relative", zIndex:1 }}>

          {/* Select mode checkbox OR up/down reorder */}
          {selectMode ? (
            <button onClick={() => onToggleSelect(task.id)}
              style={{ background:"none", border:"none", cursor:"pointer", flexShrink:0, padding:2, color:selected?T.primary:T.muted }}>
              {selected ? <CheckSquare size={20}/> : <Square size={20}/>}
            </button>
          ) : !task.completed && (
            <div style={{ display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>
              <button onClick={e => { e.stopPropagation(); onMoveUp(task.id); }} disabled={!canMoveUp}
                style={{ width:28, height:28, borderRadius:8, border:"none", cursor:canMoveUp?"pointer":"default",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  backgroundColor:canMoveUp?(T.cardAlt2||"rgba(120,120,128,0.16)"):"transparent",
                  color:canMoveUp?T.text:T.hint, opacity:canMoveUp?1:0.3, transition:"all .15s",
                  WebkitTapHighlightColor:"transparent" }}>
                <ChevronUp size={16} strokeWidth={2.5}/>
              </button>
              <button onClick={e => { e.stopPropagation(); onMoveDown(task.id); }} disabled={!canMoveDown}
                style={{ width:28, height:28, borderRadius:8, border:"none", cursor:canMoveDown?"pointer":"default",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  backgroundColor:canMoveDown?(T.cardAlt2||"rgba(120,120,128,0.16)"):"transparent",
                  color:canMoveDown?T.text:T.hint, opacity:canMoveDown?1:0.3, transition:"all .15s",
                  WebkitTapHighlightColor:"transparent" }}>
                <ChevronDown size={16} strokeWidth={2.5}/>
              </button>
            </div>
          )}

          <span style={{ fontSize:12, color:T.hint, width:20, textAlign:"right", flexShrink:0, fontVariantNumeric:"tabular-nums" }}>
            {String(rowNum).padStart(2,"0")}
          </span>

          <button onClick={() => toggleTask(task.id)}
            style={{ flexShrink:0, width:22, height:22, borderRadius:11, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0,
              border:`2px solid ${task.completed?T.success:T.sepHard}`, backgroundColor:task.completed?T.success:"transparent", transition:"all .2s" }}>
            {task.completed && <Check size={12} color="#fff"/>}
          </button>

          {isPinned && <Star size={12} color={T.star} fill={T.star} style={{ flexShrink:0 }}/>}

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:15, fontWeight:isPinned?600:400, wordBreak:"break-word", lineHeight:1.3,
              color:task.completed?T.hint:T.text, textDecoration:task.completed?"line-through":"none" }}>
              {task.text}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:3, flexWrap:"wrap" }}>
              {task.dueDate && <span style={{ fontSize:12, color:dueTxColor(task.dueDate), fontWeight:500 }}>{fmtDateU(task.dueDate)}</span>}
              {task.dueTime && task.dueDate && (
                <span style={{ display:"flex", alignItems:"center", gap:2, fontSize:12, color:T.primary, fontWeight:500 }}>
                  <Clock size={9}/>{fmtTimeU(task.dueTime)}
                </span>
              )}
              {task.estimate && (
                <span style={{ display:"flex", alignItems:"center", gap:2, fontSize:11, color:T.muted, backgroundColor:T.cardAlt, borderRadius:6, padding:"1px 6px" }}>
                  <Timer size={9}/>{EST_LABELS[task.estimate]}
                </span>
              )}
              {task.recurrence && <Repeat size={9} color={T.muted}/>}
              {subtasks.length > 0 && (
                <span style={{ fontSize:11, fontWeight:500, color:subDone===subtasks.length?T.success:T.muted }}>({subDone}/{subtasks.length})</span>
              )}
              {/* Task aging badge */}
              {showAge && (
                <span style={{ fontSize:10, color:T.ageTx||T.hint, backgroundColor:T.ageBg||T.cardAlt, borderRadius:6, padding:"1px 6px" }}>
                  {ageDays}d old
                </span>
              )}
            </div>
          </div>

          {ul !== "none" && <span style={{ width:8, height:8, borderRadius:"50%", flexShrink:0, backgroundColor:ul==="red"?T.rRedDt:T.rOrgDt }}/>}
          <button onClick={e => { e.stopPropagation(); setExpandSubs(p=>({...p,[task.id]:!p[task.id]})); }}
            style={ghost({ padding:4, color:isExpanded?T.primary:T.muted })}>
            <ListChecks size={14}/>
          </button>
          <button onClick={() => setCtxTask(task)} style={ghost({ padding:"4px 2px", color:T.muted })}>
            <MoreHorizontal size={18}/>
          </button>
        </div>
      </div>

      {/* Subtask panel */}
      {isExpanded && (
        <div style={{ padding:"6px 14px 10px 52px", backgroundColor:T.cardAlt, borderTop:`0.5px solid ${T.sep}`, animation:"dtFadeIn 0.2s ease" }}>
          {subtasks.map(sub => (
            <div key={sub.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0" }}>
              <button onClick={() => toggleSub(task.id, sub.id)}
                style={{ flexShrink:0, width:16, height:16, borderRadius:3, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0,
                  border:`1.5px solid ${sub.completed?T.success:T.sepHard}`, backgroundColor:sub.completed?T.success:"transparent", transition:"all .2s" }}>
                {sub.completed && <Check size={9} color="#fff"/>}
              </button>
              <span style={{ flex:1, fontSize:13, color:sub.completed?T.muted:T.text, textDecoration:sub.completed?"line-through":"none" }}>{sub.text}</span>
              <button onClick={() => deleteSub(task.id, sub.id)} style={ghost({ padding:2, color:T.muted })}><X size={11}/></button>
            </div>
          ))}
          <div style={{ display:"flex", gap:6, marginTop:6 }}>
            <input placeholder="Add subtask…" value={subInputs[task.id]||""}
              onChange={e => setSubInputs(p=>({...p,[task.id]:e.target.value}))}
              onKeyDown={e => { if(e.key==="Enter") addSub(task.id, subInputs[task.id]||""); }}
              style={inp({ flex:1, fontSize:13, padding:"7px 10px" })}/>
            <button onClick={() => addSub(task.id, subInputs[task.id]||"")}
              style={{ backgroundColor:T.primary, color:"#fff", border:"none", borderRadius:10, padding:"7px 12px", cursor:"pointer", display:"flex", alignItems:"center" }}>
              <Plus size={13}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function App() {

  // ── ALL state (hooks must be before any conditional return) ────────────────
  // All persistence helpers and _INITIAL_PREFS are module-level — computed once
  const [users,        setUsers]       = useState(loadUsers);
  const [curUser,      setCurUser]     = useState(null);
  const [curTopic,     setCurTopic]    = useState(null);
  const [themeName,    setThemeName]   = useState(_INITIAL_PREFS.themeName || "light");
  const [showUrgency,  setShowUrgency] = useState(_INITIAL_PREFS.showUrgency !== false);
  const [activeTab,    setActiveTab]   = useState("home");
  const [homeMemUser,  setHomeMemUser] = useState(null);
  const [homeMemTopic, setHomeMemTopic]= useState(null);
  const [tabAnim,      setTabAnim]     = useState("none");
  const prevTabRef = useRef("home");

  const [showBoarding, setShowBoarding]= useState(_INITIAL_PREFS.showBoarding !== false);
  const [boardStep,    setBoardStep]   = useState(0);
  const [notifOn,      setNotifOn]     = useState(_INITIAL_PREFS.notifOn === true);

  const [showSheet,    setShowSheet]   = useState(false);
  const [sheetTask,    setSheetTask]   = useState(null);
  const [ctxTask,      setCtxTask]     = useState(null);
  const [showDone,     setShowDone]    = useState(false);
  const [expandSubs,   setExpandSubs]  = useState({});
  const [subInputs,    setSubInputs]   = useState({});
  const [filterPill,   setFilterPill]  = useState("all");
  const [showSearch,   setShowSearch]  = useState(false);
  const [searchTerm,   setSearchTerm]  = useState("");
  const [globalSearch, setGlobalSearch]= useState(false);
  const [globalTerm,   setGlobalTerm]  = useState("");

  // v5: Quick Add
  const [quickText, setQuickText] = useState("");
  const quickRef = useRef(null);

  // v5: Batch select
  const [selectMode,   setSelectMode]  = useState(false);
  const [selectedIds,  setSelectedIds] = useState(new Set());

  // v5: Focus / Pomodoro
  const [focusTask,    setFocusTask]   = useState(null);
  const [focusSecs,    setFocusSecs]   = useState(25 * 60);
  const [focusRunning, setFocusRunning]= useState(false);
  const [focusFinished,setFocusFinished]=useState(false);
  const focusInterval = useRef(null);

  const [eText,     setEText]     = useState("");
  const [eDesc,     setEDesc]     = useState("");
  const [eDue,      setEDue]      = useState("");
  const [eTime,     setETime]     = useState("");
  const [ePri,      setEPri]      = useState("normal");
  const [eRec,      setERec]      = useState("none");
  const [eEst,      setEEst]      = useState("");
  const [eShowDesc, setEShowDesc] = useState(false);

  const [editUserId,  setEditUserId]  = useState(null);
  const [editTopicId, setEditTopicId] = useState(null);
  const [newUserName, setNewUserName] = useState("");
  const [newTopicTxt, setNewTopicTxt] = useState("");
  const [addUser,     setAddUser]     = useState(false);
  const [addTopic,    setAddTopic]    = useState(false);
  const [saveStatus,  setSaveStatus]  = useState("saved");
  const [hist,        setHist]        = useState([DEFAULT_DATA]);
  const [histIdx,     setHistIdx]     = useState(0);

  const [calView,  setCalView]  = useState("agenda");
  const [calYear,  setCalYear]  = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calSel,   setCalSel]   = useState(new Date().toISOString().split("T")[0]);

  const stripRef  = useRef(null);
  const sheetRef  = useRef(null);
  const editURef  = useRef(null);
  const editTRef  = useRef(null);
  const newURef   = useRef(null);
  const newTRef   = useRef(null);
  const gSearchRef= useRef(null);
  const notifFiredRef = useRef(new Set()); // tracks task IDs already notified this session

  const T = THEMES[themeName] || THEMES.light;
  const isDark = themeName !== "light" && themeName !== "sand";
  const curUserData  = curUser  ? users[curUser]  : null;
  const curTopicData = curUser && curTopic ? users[curUser]?.topics[curTopic] : null;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getDays = (ds) => { if(!ds)return null; const due=new Date(ds);due.setHours(0,0,0,0); const now=new Date();now.setHours(0,0,0,0); return Math.ceil((due-now)/86400000); };
  const urgLv   = (ds) => { const d=getDays(ds); if(d===null)return"none"; if(d<0||d<=1)return"red"; if(d===2)return"orange"; return"none"; };
  const topicUrg= (tasks) => { let m="none"; (tasks||[]).forEach(t=>{ if(!t.completed){const u=urgLv(t.dueDate);if(u==="red")m="red";else if(u==="orange"&&m!=="red")m="orange";} }); return m; };
  const userUrg = (topics) => { let m="none"; Object.values(topics||{}).forEach(tp=>{const u=topicUrg(tp.tasks);if(u==="red")m="red";else if(u==="orange"&&m!=="red")m="orange";}); return m; };
  const fmtTime = (t) => { if(!t)return null; const[h,m]=t.split(":"); const hr=parseInt(h); return(hr>12?hr-12:hr||12)+":"+m+" "+(hr>=12?"PM":"AM"); };
  const fmtDate = (ds) => { if(!ds)return null; const d=getDays(ds); if(d<0)return Math.abs(d)+"d overdue"; if(d===0)return"Today"; if(d===1)return"Tomorrow"; if(d<=7)return d+" days"; return new Date(ds).toLocaleDateString("en-US",{month:"short",day:"numeric"}); };
  const dueTxColor = (ds) => { const u=urgLv(ds); if(u==="red")return T.rRedTx; if(u==="orange")return T.rOrgTx; return T.muted; };

  const push = (next) => {
    setUsers(next); setSaveStatus("saving");
    saveUsers(next);
    const h=hist.slice(0,histIdx+1); h.push(next); setHist(h); setHistIdx(h.length-1);
    setTimeout(()=>setSaveStatus("saved"),500);
  };
  const undo = () => {
    if(histIdx>0){ const i=histIdx-1; setHistIdx(i); setUsers(hist[i]); saveUsers(hist[i]); }
  };
  const redo = () => {
    if(histIdx<hist.length-1){ const i=histIdx+1; setHistIdx(i); setUsers(hist[i]); saveUsers(hist[i]); }
  };

  // ── Memos ──────────────────────────────────────────────────────────────────
  const debSearch  = useMemo(()=>debounce(v=>setSearchTerm(v),250),[]);
  const debGSearch = useMemo(()=>debounce(v=>setGlobalTerm(v),250),[]);

  const filteredTasks = useMemo(()=>{
    if(!curTopicData?.tasks) return [];
    const tasks = curTopicData.tasks.filter(t=>{
      const ms=!searchTerm||t.text.toLowerCase().includes(searchTerm.toLowerCase());
      const u=urgLv(t.dueDate);
      if(filterPill==="pinned") return !t.completed&&t.pinned&&ms;
      if(filterPill==="urgent") return !t.completed&&u!=="none"&&ms;
      if(filterPill==="normal") return !t.completed&&u==="none"&&ms;
      return ms;
    });
    return [...tasks.filter(t=>t.pinned&&!t.completed),...tasks.filter(t=>!t.pinned&&!t.completed),...tasks.filter(t=>t.completed)];
  },[curTopicData,searchTerm,filterPill,showUrgency]);

  const globalResults = useMemo(()=>{
    if(!globalTerm.trim()) return [];
    const term=globalTerm.toLowerCase(); const r=[];
    Object.values(users).forEach(u=>Object.values(u.topics).forEach(tp=>tp.tasks.forEach(t=>{
      if(t.text.toLowerCase().includes(term)||(t.description||"").toLowerCase().includes(term))
        r.push({...t,userName:u.name,userId:u.id,topicName:tp.name,topicId:tp.id});
    })));
    return r.slice(0,40);
  },[users,globalTerm]);

  const streakData     = useMemo(()=>getStreakData(users),[users]);
  const todayEstimate  = useMemo(()=>{
    const ts=new Date().toISOString().split("T")[0]; let total=0;
    Object.values(users).forEach(u=>Object.values(u.topics).forEach(tp=>tp.tasks.forEach(t=>{
      if(!t.completed&&t.dueDate===ts&&t.estimate) total+=parseInt(t.estimate);
    })));
    return total;
  },[users]);
  const allDated = useMemo(()=>{
    const r=[];
    Object.values(users).forEach(u=>Object.values(u.topics).forEach(tp=>tp.tasks.forEach(t=>{
      if(t.dueDate&&!t.completed) r.push({...t,userName:u.name,userId:u.id,topicName:tp.name});
    })));
    return r;
  },[users]);
  const briefing = useMemo(()=>{
    const ts=new Date().toISOString().split("T")[0], ys=new Date(Date.now()-86400000).toDateString();
    let dueToday=[],overdue=[],doneYest=0;
    Object.values(users).forEach(u=>Object.values(u.topics).forEach(tp=>tp.tasks.forEach(t=>{
      if(t.completed){if(t.completedAt&&new Date(t.completedAt).toDateString()===ys)doneYest++;}
      else if(t.dueDate===ts) dueToday.push({...t,userName:u.name,topicName:tp.name});
      else if(t.dueDate&&t.dueDate<ts) overdue.push({...t,userName:u.name,topicName:tp.name});
    })));
    return{dueToday,overdue,doneYest};
  },[users]);
  const agendaDays = useMemo(()=>{
    const today=new Date(),days=[];
    for(let i=-7;i<54;i++){const dt=new Date(today);dt.setDate(dt.getDate()+i);const ds=dt.toISOString().split("T")[0];days.push({ds,dt,tasks:allDated.filter(t=>t.dueDate===ds)});}
    return days;
  },[allDated]);
  const datePriColor = (ds) => {
    const tasks=allDated.filter(t=>t.dueDate===ds); if(!tasks.length)return null;
    const has=(p)=>tasks.some(t=>t.priority===p);
    if(has("urgent")||has("high"))return{bg:T.rRedBg,bd:T.rRedBd,tx:T.rRedTx,dt:T.rRedDt};
    if(has("normal"))return{bg:T.primaryDim,bd:T.primary,tx:T.primary,dt:T.primary};
    return{bg:T.rOrgBg,bd:T.rOrgBd,tx:T.rOrgTx,dt:T.rOrgDt};
  };

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(()=>{
    const el=document.createElement("style"); el.id="dt-global";
    el.textContent=`
      html,body{overflow:hidden!important;overscroll-behavior:none!important;position:fixed!important;width:100%!important;height:100%!important;margin:0!important;padding:0!important;}
      #root{width:100%!important;height:100%!important;max-width:none!important;overflow:hidden!important;}
      *{-webkit-tap-highlight-color:transparent;}
      @keyframes dtComplete{0%{opacity:1;}30%{background:rgba(52,199,89,0.18);}70%{opacity:0.5;max-height:80px;}100%{opacity:0;max-height:0;padding-top:0;padding-bottom:0;overflow:hidden;}}
      @keyframes dtDelete{0%{transform:translateX(0);opacity:1;}100%{transform:translateX(110%);opacity:0;}}
      @keyframes dtFadeIn{from{opacity:0;transform:translateY(-4px);}to{opacity:1;transform:translateY(0);}}
      @keyframes dtSlideInRight{from{transform:translateX(38px);opacity:0;}to{transform:translateX(0);opacity:1;}}
      @keyframes dtSlideInLeft{from{transform:translateX(-38px);opacity:0;}to{transform:translateX(0);opacity:1;}}
      @keyframes dtSheetUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
      @keyframes dtOverlayIn{from{opacity:0;}to{opacity:1;}}
      @keyframes dtFabPop{0%{transform:scale(0.7);opacity:0;}60%{transform:scale(1.08);}100%{transform:scale(1);opacity:1;}}
      @keyframes dtPulse{0%,100%{opacity:1;}50%{opacity:0.6;}}
      ::-webkit-scrollbar{display:none!important;}
    `;
    document.head.appendChild(el);
    return()=>{ try{document.head.removeChild(el);}catch(_){} };
  },[]);

  useEffect(()=>{
    setSaveStatus("saving"); const t=setTimeout(()=>setSaveStatus("saved"),500); return()=>clearTimeout(t);
  },[users,themeName,showUrgency]);

  // Belt-and-suspenders: also save users on every change (covers any path that bypasses push)
  useEffect(()=>{ saveUsers(users); },[users]);

  // Persist preferences whenever they change
  useEffect(()=>{
    savePrefs({ themeName, showUrgency, showBoarding, notifOn });
  },[themeName, showUrgency, showBoarding, notifOn]);

  // Fire notifications on mount (after 2s) and whenever the page becomes visible
  useEffect(()=>{
    const check = () => fireNotifications.current && fireNotifications.current();
    const t = setTimeout(check, 2000); // initial check after app loads
    const onVisible = () => { if(document.visibilityState === "visible") check(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearTimeout(t); document.removeEventListener("visibilitychange", onVisible); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-check notifications whenever notifOn or users data changes
  useEffect(()=>{
    if (notifOn) {
      const t = setTimeout(() => fireNotifications.current && fireNotifications.current(), 500);
      return () => clearTimeout(t);
    }
  },[notifOn, users]);
  useEffect(()=>{
    if(activeTab==="calendar"&&stripRef.current){
      setTimeout(()=>{ const el=stripRef.current?.querySelector('[data-today="true"]'); if(el)el.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"}); },150);
    }
  },[activeTab]);
  useEffect(()=>{ setShowSearch(false); setSearchTerm(""); setSelectMode(false); setSelectedIds(new Set()); },[curTopic]);
  useEffect(()=>{ if(editTopicId&&editTRef.current){editTRef.current.focus();editTRef.current.select();} },[editTopicId]);
  useEffect(()=>{ if(showSheet&&sheetRef.current) setTimeout(()=>sheetRef.current?.focus(),80); },[showSheet]);
  useEffect(()=>{ if(globalSearch&&gSearchRef.current) setTimeout(()=>gSearchRef.current?.focus(),80); },[globalSearch]);
  useEffect(()=>{
    const h=(e)=>{
      if(e.key==="Escape"){
        if(focusTask){setFocusTask(null);setFocusRunning(false);setFocusFinished(false);}
        else if(ctxTask)setCtxTask(null);
        else if(showSheet){setShowSheet(false);setSheetTask(null);}
        else if(globalSearch){setGlobalSearch(false);setGlobalTerm("");}
      }
    };
    document.addEventListener("keydown",h); return()=>document.removeEventListener("keydown",h);
  },[ctxTask,showSheet,globalSearch,focusTask]);

  // v5: Focus timer tick
  useEffect(()=>{
    if(focusRunning && focusSecs > 0){
      focusInterval.current = setInterval(()=>setFocusSecs(s=>{ if(s<=1){clearInterval(focusInterval.current);setFocusRunning(false);setFocusFinished(true);return 0;} return s-1; }),1000);
    }
    return()=>clearInterval(focusInterval.current);
  },[focusRunning]);

  // ── CRUD ────────────────────────────────────────────────────────────────────
  const recLabels={none:"No repeat",daily:"Every day",weekly:"Every week",monthly:"Every month",yearly:"Every year"};
  const nextDue=(ds,rec)=>{ if(!ds||!rec||rec==="none")return null; const d=new Date(ds); if(rec==="daily")d.setDate(d.getDate()+1); if(rec==="weekly")d.setDate(d.getDate()+7); if(rec==="monthly")d.setMonth(d.getMonth()+1); if(rec==="yearly")d.setFullYear(d.getFullYear()+1); return d.toISOString().split("T")[0]; };

  const openAdd=()=>{ if(!curUser||!curTopic)return; const today=new Date().toISOString().split("T")[0]; const now=new Date(); const nh=now.getMinutes()>0?now.getHours()+2:now.getHours()+1; const ch=nh>=24?nh-24:nh; const dt=String(ch).padStart(2,"0")+":00"; setEText("");setEDesc("");setEDue(today);setETime(dt);setEPri("normal");setERec("none");setEEst("");setEShowDesc(false); setSheetTask(null);setShowSheet(true); };
  const openEdit=(task)=>{ setEText(task.text);setEDesc(task.description||"");setEDue(task.dueDate||"");setETime(task.dueTime||"");setEPri(task.priority||"normal");setERec(task.recurrence||"none");setEEst(task.estimate||"");setEShowDesc(!!task.description); setSheetTask(task);setCtxTask(null);setShowSheet(true); };
  const saveSheet=()=>{
    const text=eText.trim(); if(!text||!curUser||!curTopic)return;
    const n=JSON.parse(JSON.stringify(users));
    if(sheetTask){
      const idx=n[curUser].topics[curTopic].tasks.findIndex(t=>t.id===sheetTask.id);
      if(idx!==-1) n[curUser].topics[curTopic].tasks[idx]={...n[curUser].topics[curTopic].tasks[idx],text,description:eDesc,dueDate:eDue||null,dueTime:eTime||null,priority:ePri,recurrence:eRec==="none"?null:eRec,estimate:eEst};
    } else {
      n[curUser].topics[curTopic].tasks.push({id:Date.now(),text,description:eDesc.trim(),completed:false,dueDate:eDue||null,dueTime:eTime||null,priority:ePri,recurrence:eRec==="none"?null:eRec,estimate:eEst,createdAt:new Date().toISOString(),completedAt:null,pinned:false,subtasks:[]});
    }
    push(n); setShowSheet(false); setSheetTask(null);
  };

  // v5: Quick Add (no sheet)
  const doQuickAdd=()=>{
    const text=quickText.trim(); if(!text||!curUser||!curTopic)return;
    const n=JSON.parse(JSON.stringify(users));
    n[curUser].topics[curTopic].tasks.push({id:Date.now(),text,description:"",completed:false,dueDate:null,dueTime:null,priority:"normal",recurrence:null,estimate:"",createdAt:new Date().toISOString(),completedAt:null,pinned:false,subtasks:[]});
    push(n); setQuickText("");
  };

  const toggleTask=(id,userId,topicId)=>{
    const uid=userId||curUser, tid=topicId||curTopic; if(!uid||!tid)return;
    const n=JSON.parse(JSON.stringify(users)); const idx=n[uid].topics[tid].tasks.findIndex(t=>t.id===id); if(idx===-1)return;
    const task=n[uid].topics[tid].tasks[idx]; const upd={...task,completed:!task.completed,completedAt:!task.completed?new Date().toISOString():null};
    n[uid].topics[tid].tasks[idx]=upd;
    // v5: recurring subtask reset — copy subtasks but reset completed state
    if(upd.completed&&upd.recurrence){
      const resetSubs=(upd.subtasks||[]).map(s=>({...s,completed:false}));
      n[uid].topics[tid].tasks.push({...upd,id:Date.now()+1,completed:false,dueDate:nextDue(upd.dueDate,upd.recurrence),createdAt:new Date().toISOString(),completedAt:null,subtasks:resetSubs});
    }
    push(n);
  };
  const deleteTask=(id)=>{ const n=JSON.parse(JSON.stringify(users)); n[curUser].topics[curTopic].tasks=n[curUser].topics[curTopic].tasks.filter(t=>t.id!==id); push(n); };
  const togglePin=(id)=>{ const n=JSON.parse(JSON.stringify(users)); const idx=n[curUser].topics[curTopic].tasks.findIndex(t=>t.id===id); if(idx!==-1){n[curUser].topics[curTopic].tasks[idx].pinned=!n[curUser].topics[curTopic].tasks[idx].pinned;push(n);} };
  const moveTask=(id,dir)=>{ const n=JSON.parse(JSON.stringify(users)); const tasks=n[curUser].topics[curTopic].tasks; const idx=tasks.findIndex(t=>t.id===id); if(idx===-1)return; const target=idx+dir; if(target<0||target>=tasks.length)return; [tasks[idx],tasks[target]]=[tasks[target],tasks[idx]]; push(n); };

  // v5: Batch actions
  const batchComplete=()=>{
    if(!selectedIds.size)return;
    const n=JSON.parse(JSON.stringify(users));
    selectedIds.forEach(id=>{ const idx=n[curUser].topics[curTopic].tasks.findIndex(t=>t.id===id); if(idx!==-1){n[curUser].topics[curTopic].tasks[idx].completed=true;n[curUser].topics[curTopic].tasks[idx].completedAt=new Date().toISOString();} });
    push(n); setSelectedIds(new Set()); setSelectMode(false);
  };
  const batchDelete=()=>{
    if(!selectedIds.size)return;
    const n=JSON.parse(JSON.stringify(users));
    n[curUser].topics[curTopic].tasks=n[curUser].topics[curTopic].tasks.filter(t=>!selectedIds.has(t.id));
    push(n); setSelectedIds(new Set()); setSelectMode(false);
  };

  const addSub=(taskId,text)=>{ const trimmed=text.trim(); if(!trimmed)return; const n=JSON.parse(JSON.stringify(users)); const task=n[curUser].topics[curTopic].tasks.find(t=>t.id===taskId); if(!task)return; if(!task.subtasks)task.subtasks=[]; task.subtasks.push({id:Date.now(),text:trimmed,completed:false}); push(n); setSubInputs(p=>({...p,[taskId]:""})); };
  const toggleSub=(taskId,subId)=>{ const n=JSON.parse(JSON.stringify(users)); const task=n[curUser].topics[curTopic].tasks.find(t=>t.id===taskId); if(!task?.subtasks)return; const sub=task.subtasks.find(s=>s.id===subId); if(sub)sub.completed=!sub.completed; push(n); };
  const deleteSub=(taskId,subId)=>{ const n=JSON.parse(JSON.stringify(users)); const task=n[curUser].topics[curTopic].tasks.find(t=>t.id===taskId); if(!task?.subtasks)return; task.subtasks=task.subtasks.filter(s=>s.id!==subId); push(n); };

  const doAddUser=()=>{ const name=newUserName.trim(); if(!name)return; const id=name.toLowerCase().replace(/[^a-z0-9]/g,"-"); if(users[id]){alert("Profile already exists.");return;} const n=JSON.parse(JSON.stringify(users)); n[id]={id,name,topics:{}}; push(n); setNewUserName("");setAddUser(false); };
  const deleteUser=(id)=>{ if(Object.keys(users).length<=1)return; const n=JSON.parse(JSON.stringify(users)); delete n[id]; push(n); if(curUser===id){setCurUser(null);setCurTopic(null);} };
  const saveUserName=(id,name)=>{ if(name.trim()){const n=JSON.parse(JSON.stringify(users));n[id].name=name.trim();push(n);} setEditUserId(null); };
  const doAddTopic=()=>{ const name=newTopicTxt.trim(); if(!name||!curUser)return; const id=Date.now().toString(); const n=JSON.parse(JSON.stringify(users)); n[curUser].topics[id]={id,name,tasks:[]}; push(n); setNewTopicTxt("");setAddTopic(false); };
  const deleteTopic=(id)=>{ const n=JSON.parse(JSON.stringify(users)); delete n[curUser].topics[id]; push(n); if(curTopic===id)setCurTopic(null); };
  const saveTopicName=(id,name)=>{ if(name.trim()){const n=JSON.parse(JSON.stringify(users));n[curUser].topics[id].name=name.trim();push(n);} setEditTopicId(null); };

  const reqNotif = async () => {
    // Always allow the UI toggle to turn on — save state synchronously first
    // so it persists even if the permission prompt is dismissed or unavailable.
    setNotifOn(true);
    savePrefs({ themeName, showUrgency, showBoarding, notifOn: true });

    // If the Notification API isn't available (Safari browser / older iOS),
    // the toggle still works — notifications will activate once installed as a PWA.
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") return; // already allowed, done

    if (Notification.permission === "denied") {
      // Can't re-prompt. Toggle stays on so user sees their intent,
      // but show instructions for how to fix it in device settings.
      alert("Notifications are blocked for this site.\n\nTo fix: Settings → Safari → tap the site → Notifications → Allow.");
      return;
    }

    // permission === "default" — request from browser
    try {
      const result = await Notification.requestPermission();
      if (result !== "granted") {
        // User denied the prompt — turn toggle back off
        setNotifOn(false);
        savePrefs({ themeName, showUrgency, showBoarding, notifOn: false });
      }
    } catch(e) {
      // requestPermission threw (some browsers require a user gesture context).
      // Keep toggle on — best-effort behaviour.
    }
  };
  // ── Add to Calendar — generates a real .ics file and triggers download ──────
  const addToCalendar = (task) => {
    const pad  = (n) => String(n).padStart(2,"0");
    const fmtDT= (ds, ts) => {
      const d = new Date(ds + "T" + (ts || "00:00") + ":00");
      return d.getFullYear() + pad(d.getMonth()+1) + pad(d.getDate()) +
             "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00";
    };
    const uid = "dt-" + task.id + "-" + Date.now() + "@dailytasks";
    const now  = fmtDT(new Date().toISOString().split("T")[0],
                        new Date().toTimeString().slice(0,5));
    const rruleMap = { daily:"FREQ=DAILY", weekly:"FREQ=WEEKLY",
                       monthly:"FREQ=MONTHLY", yearly:"FREQ=YEARLY" };

    let lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Daily Tasks PWA//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:" + uid,
      "DTSTAMP:" + now + "Z",
      "SUMMARY:" + (task.text || "Task"),
    ];

    if (task.description) {
      lines.push("DESCRIPTION:" + task.description.replace(/\n/g,"\\n"));
    }

    if (task.dueDate && task.dueTime) {
      // Timed event — 1 hour duration
      const start = fmtDT(task.dueDate, task.dueTime);
      const endD  = new Date(task.dueDate + "T" + task.dueTime + ":00");
      endD.setHours(endD.getHours() + 1);
      const end = fmtDT(
        endD.toISOString().split("T")[0],
        endD.toTimeString().slice(0,5)
      );
      lines.push("DTSTART:" + start);
      lines.push("DTEND:" + end);
      // 30-minute reminder
      lines.push("BEGIN:VALARM","TRIGGER:-PT30M","ACTION:DISPLAY",
                 "DESCRIPTION:Task due soon: " + task.text,"END:VALARM");
    } else if (task.dueDate) {
      // All-day event
      lines.push("DTSTART;VALUE=DATE:" + task.dueDate.replace(/-/g,""));
      lines.push("DTEND;VALUE=DATE:"   + task.dueDate.replace(/-/g,""));
      lines.push("BEGIN:VALARM","TRIGGER:-PT30M","ACTION:DISPLAY",
                 "DESCRIPTION:Task due: " + task.text,"END:VALARM");
    }

    if (task.recurrence && rruleMap[task.recurrence]) {
      lines.push("RRULE:" + rruleMap[task.recurrence]);
    }

    lines.push("END:VEVENT","END:VCALENDAR");

    const blob = new Blob([lines.join("\r\n")], { type:"text/calendar;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = (task.text || "task").replace(/[^a-z0-9]/gi,"_").slice(0,40) + ".ics";
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 500);
  };

  // ── Push notifications — fires for tasks due within 60 min or just overdue ──
  const fireNotifications = useRef(null);
  fireNotifications.current = () => {
    if (!notifOn) return;
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;
    const now  = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const fired = notifFiredRef.current;
    Object.values(users).forEach(u =>
      Object.values(u.topics).forEach(tp =>
        tp.tasks.forEach(t => {
          if (t.completed || !t.dueDate || !t.dueTime) return;
          if (fired.has(t.id)) return;
          // Parse due datetime
          const due = new Date(t.dueDate + "T" + t.dueTime + ":00");
          const diffMs = due - now; // positive = future, negative = past
          const diffMin = diffMs / 60000;
          // Fire if: due within next 60 minutes, OR overdue by less than 5 minutes
          if (diffMin <= 60 && diffMin >= -5) {
            fired.add(t.id);
            let body = "";
            if (diffMin < 0) body = `Overdue ${Math.abs(Math.round(diffMin))}m — ${u.name} › ${tp.name}`;
            else if (diffMin < 1) body = `Due now — ${u.name} › ${tp.name}`;
            else body = `Due in ${Math.round(diffMin)}m — ${u.name} › ${tp.name}`;
            try {
              new Notification(t.text, {
                body,
                icon: "/Tasks-Keeper/icons/icon-192.png",
                badge:"/Tasks-Keeper/icons/icon-192.png",
                tag: "dt-" + t.id,
              });
            } catch(_) {}
          }
        })
      )
    );
  };

  const doExport = () => alert("Export / Import coming soon.");

  // ── Styles ─────────────────────────────────────────────────────────────────
  const S={
    inp:(e)=>({backgroundColor:T.cardAlt,border:"none",color:T.text,borderRadius:12,padding:"12px 14px",fontSize:15,outline:"none",width:"100%",boxSizing:"border-box",...(e||{})}),
    primBtn:(e)=>({backgroundColor:T.primary,color:isDark||themeName==="midnight"||themeName==="forest"||themeName==="slate"?"#fff":"#fff",border:"none",borderRadius:12,padding:"14px",fontSize:16,fontWeight:700,cursor:"pointer",width:"100%",...(e||{})}),
    ghost:(e)=>({background:"none",border:"none",color:T.primary,fontSize:15,cursor:"pointer",fontWeight:500,...(e||{})}),
    pill:(active,e)=>({padding:"7px 16px",borderRadius:20,border:"none",fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,backgroundColor:active?T.primary:T.cardAlt,color:active?"#fff":T.muted,...(e||{})}),
    card:(e)=>({backgroundColor:T.card,borderRadius:16,overflow:"hidden",...(e||{})}),
    row:(e)=>({display:"flex",alignItems:"center",padding:"13px 16px",gap:12,...(e||{})}),
    sep:()=>({height:1,backgroundColor:T.sep,margin:"0 16px"}),
    label:(color)=>({fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,color:color||T.muted,marginBottom:8,paddingLeft:4}),
  };

  const urBtns=()=>{ return (
    <div style={{display:"flex",gap:2}}>
      <button onClick={undo} disabled={histIdx===0} title="Undo" style={S.ghost({padding:6,color:histIdx===0?T.hint:T.primary})}><Undo2 size={18}/></button>
      <button onClick={redo} disabled={histIdx>=hist.length-1} title="Redo" style={S.ghost({padding:6,color:histIdx>=hist.length-1?T.hint:T.primary})}><Redo2 size={18}/></button>
    </div>
  ); };

  // ── Tab bar ────────────────────────────────────────────────────────────────
  const handleTab=(tabId)=>{
    if(tabId==="home"){
      if(activeTab!=="home"){ setCurUser(homeMemUser); setCurTopic(homeMemTopic); setActiveTab("home"); }
      else { setCurUser(null); setCurTopic(null); }
    } else {
      if(activeTab==="home"){ setHomeMemUser(curUser); setHomeMemTopic(curTopic); setShowSearch(false); setSearchTerm(""); }
      const tabOrder={home:0,today:1,calendar:2,settings:3};
      const dir=tabOrder[tabId]>tabOrder[activeTab]?"in-right":"in-left";
      setTabAnim(dir); setTimeout(()=>setTabAnim("none"),320);
      prevTabRef.current=activeTab; setActiveTab(tabId);
    }
  };

  const showFab = activeTab==="home"&&curUser&&curTopic&&!selectMode;

  const TabBar=()=>{ return (
    <div style={{flexShrink:0,padding:"6px 14px 10px",display:"flex",alignItems:"center",gap:10}}>
      <div style={{flex:1,display:"flex",alignItems:"center",
        backgroundColor:T.tabBg, backdropFilter:"blur(24px) saturate(200%)", WebkitBackdropFilter:"blur(24px) saturate(200%)",
        borderRadius:40, padding:"4px 8px",
        boxShadow:isDark?"0 4px 24px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)":"0 4px 24px rgba(0,0,0,0.1), 0 1px 6px rgba(0,0,0,0.07)",
        border:`0.5px solid ${T.tabBorder}`}}>
        {[{id:"home",icon:<Home size={20}/>,label:"Home"},{id:"today",icon:<Sunrise size={20}/>,label:"Today"},{id:"calendar",icon:<CalendarDays size={20}/>,label:"Calendar"},{id:"settings",icon:<Settings size={20}/>,label:"Settings"}].map(tab=>{
          const active=activeTab===tab.id;
          return(
            <button key={tab.id} onClick={()=>handleTab(tab.id)}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"8px 0 7px",background:"none",border:"none",cursor:"pointer",transition:"color .2s"}}>
              <span style={{color:active?T.primary:T.muted,transition:"color .2s"}}>{tab.icon}</span>
              <span style={{fontSize:9,fontWeight:700,letterSpacing:0.2,color:active?T.primary:T.muted,transition:"color .2s"}}>{tab.label}</span>
            </button>
          );
        })}
      </div>
      {showFab&&(
        <button onClick={openAdd} style={{width:52,height:52,borderRadius:26,flexShrink:0,backgroundColor:T.primary,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 16px ${T.primary}55`,animation:"dtFabPop 0.3s ease"}}>
          <Plus size={24} color="#fff"/>
        </button>
      )}
    </div>
  ); };

  const contentAnim = tabAnim==="in-right" ? {animation:"dtSlideInRight 0.28s cubic-bezier(0.25,0.46,0.45,0.94)"}
    : tabAnim==="in-left" ? {animation:"dtSlideInLeft 0.28s cubic-bezier(0.25,0.46,0.45,0.94)"}
    : {};

  // ── Onboarding ─────────────────────────────────────────────────────────────
  const renderOnboarding=()=>{
    // done() saves SYNCHRONOUSLY before setState — guarantees prefs persist even if
    // the user closes the app immediately after tapping the final button
    const done=()=>{
      savePrefs({ themeName, showUrgency, showBoarding:false, notifOn });
      setShowBoarding(false);
    };
    const steps=[
      { icon:"✅", title:"Welcome to Daily Tasks", subtitle:"Your personal task manager — built for focus and clarity.",
        content:(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[["📁","Multiple Profiles","Manage tasks for yourself and others"],["📂","Topics","Group by Work, Personal, Projects"],["📋","Smart Tasks","Priorities, estimates, subtasks, recurrence"]].map(([ico,t,d])=>(
              <div key={t} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"14px 16px",backgroundColor:T.cardAlt,borderRadius:14}}>
                <span style={{fontSize:22,flexShrink:0}}>{ico}</span>
                <div><div style={{color:T.text,fontWeight:600,fontSize:15}}>{t}</div><div style={{color:T.muted,fontSize:13,marginTop:3}}>{d}</div></div>
              </div>
            ))}
          </div>
        ),
        primary:{label:"Get Started →",action:()=>setBoardStep(1)},secondary:null,back:null },
      { icon:"✨", title:"What's New in v5", subtitle:"Smarter, faster, more personal.",
        content:(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[{e:"⚡",t:"Quick Add",d:"Add tasks instantly from the task screen without opening a sheet"},{e:"🎯",t:"Focus Timer",d:"25-minute Pomodoro timer locks you onto one task"},{e:"✅",t:"Batch Actions",d:"Select multiple tasks to complete or delete at once"},{e:"🕒",t:"Task Aging",d:"Tasks older than 7 days show how long they've been waiting"},{e:"🎨",t:"6 Themes",d:"Light, Dark, Midnight, Sand, Forest, and Slate"}].map(({e,t,d})=>(
              <div key={t} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"12px 14px",backgroundColor:T.cardAlt,borderRadius:14}}>
                <span style={{fontSize:20,flexShrink:0}}>{e}</span>
                <div><div style={{color:T.text,fontWeight:600,fontSize:14}}>{t}</div><div style={{color:T.muted,fontSize:12,marginTop:2}}>{d}</div></div>
              </div>
            ))}
          </div>
        ),
        primary:{label:"Next →",action:()=>setBoardStep(2)},secondary:{label:"← Back",action:()=>setBoardStep(0)},back:null },
      { icon:"🔔", title:"Stay on Deadline", subtitle:"Get notified when tasks are due.",
        content:(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {notifOn ? (
              <div style={{padding:"20px 16px",backgroundColor:T.cardAlt,borderRadius:14,textAlign:"center"}}><div style={{fontSize:32,marginBottom:8}}>✅</div><div style={{color:T.success,fontWeight:700,fontSize:16}}>Notifications enabled!</div></div>
            ) : (
              <div style={{padding:16,backgroundColor:T.cardAlt,borderRadius:14,display:"flex",flexDirection:"column",gap:12}}>
                {[["🔴","Overdue / today / tomorrow","Highlighted in red"],["🟠","2 days remaining","Highlighted in orange"]].map(([dot,t,d])=>(
                  <div key={t} style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:18}}>{dot}</span><div><div style={{color:T.text,fontSize:15,fontWeight:600}}>{t}</div><div style={{color:T.muted,fontSize:13}}>{d}</div></div></div>
                ))}
              </div>
            )}
          </div>
        ),
        primary:notifOn?{label:"Enter App →",action:done}:{label:"Enable Notifications",action:async()=>{await reqNotif();done();}},
        secondary:{label:"Skip for now",action:done},back:{label:"← Back",action:()=>setBoardStep(1)} },
    ];
    const step=steps[boardStep];
    return(
      <div style={{flex:1,overflowY:"auto",minHeight:0,padding:"20px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:24,marginTop:8}}>
          {steps.map((_,i)=>(<div key={i} style={{width:i===boardStep?24:7,height:7,borderRadius:4,transition:"all .25s",backgroundColor:i===boardStep?T.primary:T.hint}}/>))}
        </div>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:52,marginBottom:12}}>{step.icon}</div>
          <div style={{fontSize:26,fontWeight:800,color:T.text,marginBottom:8,letterSpacing:-0.5}}>{step.title}</div>
          <div style={{fontSize:15,color:T.muted,lineHeight:1.6,maxWidth:280,margin:"0 auto"}}>{step.subtitle}</div>
        </div>
        {step.content}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:24,paddingBottom:32}}>
          <button onClick={step.primary.action} style={S.primBtn({borderRadius:16,fontSize:17})}>{step.primary.label}</button>
          {step.secondary&&<button onClick={step.secondary.action} style={S.ghost({padding:"10px",color:T.muted,fontSize:15})}>{step.secondary.label}</button>}
          {step.back&&<button onClick={step.back.action} style={S.ghost({padding:"8px",color:T.muted,fontSize:14})}>{step.back.label}</button>}
        </div>
      </div>
    );
  };

  // ── Today / Briefing ───────────────────────────────────────────────────────
  const renderBriefing=()=>{
    const hr=new Date().getHours(); const greet=hr<12?"Good morning":hr<17?"Good afternoon":"Good evening"; const greetIcon=hr<12?"🌅":hr<17?"☀️":"🌙";
    const{dueToday,overdue,doneYest}=briefing; const{streak,weekData}=streakData; const maxBar=Math.max(...weekData.map(d=>d.count),1);
    const fmtEst=(m)=>{ if(!m)return null; if(m<60)return m+"m"; const h=Math.floor(m/60),rm=m%60; return rm>0?h+"h "+rm+"m":h+"h"; };
    return(
      <div style={{flex:1,overflowY:"auto",minHeight:0}}>
        <div style={{padding:"28px 20px 20px",backgroundColor:T.card,borderBottom:`0.5px solid ${T.sep}`}}>
          <div style={{fontSize:13,color:T.muted,marginBottom:4}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:32}}>{greetIcon}</span>
            <div style={{flex:1,fontSize:28,fontWeight:800,color:T.text,letterSpacing:-0.5}}>{greet}</div>
            {urBtns()}
          </div>
        </div>
        {/* Streak + weekly bars */}
        <div style={{margin:"16px 16px 0",backgroundColor:T.card,borderRadius:16,padding:"16px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><Flame size={18} color={streak>0?T.warn:T.muted}/><span style={{fontSize:15,fontWeight:700,color:T.text}}>{streak>0?streak+" day streak":"Start your streak today!"}</span></div>
            <BarChart2 size={16} color={T.muted}/>
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:6,height:48}}>
            {weekData.map(({ds,day,count})=>{ const isToday=ds===new Date().toISOString().split("T")[0]; const barH=count>0?Math.max(8,Math.round((count/maxBar)*44)):4;
              return(<div key={ds} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:"100%",height:barH,borderRadius:4,backgroundColor:isToday?T.primary:count>0?T.success:T.sep,transition:"height .3s"}}/>
                <span style={{fontSize:9,color:isToday?T.primary:T.muted,fontWeight:isToday?700:400}}>{day}</span>
              </div>);
            })}
          </div>
        </div>
        {/* Stat cards */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,padding:"12px 16px 0"}}>
          {[{label:"Overdue",v:overdue.length,c:overdue.length>0?T.danger:T.success},{label:"Due Today",v:dueToday.length,c:dueToday.length>0?T.primary:T.success},{label:"Done Yesterday",v:doneYest,c:T.success}].map(({label,v,c})=>(
            <div key={label} style={{backgroundColor:T.card,borderRadius:14,padding:"12px 10px",textAlign:"center"}}>
              <div style={{fontSize:26,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:11,color:T.muted,marginTop:2,lineHeight:1.3}}>{label}</div>
            </div>
          ))}
        </div>
        {/* Daily time estimate */}
        {todayEstimate>0&&(<div style={{margin:"12px 16px 0",backgroundColor:T.card,borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}><Timer size={16} color={T.primary}/><div><span style={{fontSize:14,fontWeight:600,color:T.text}}>{fmtEst(todayEstimate)} committed today</span><div style={{fontSize:12,color:T.muted,marginTop:2}}>Based on tasks with estimates due today</div></div></div>)}
        {/* Overdue */}
        {overdue.length>0&&(<div style={{padding:"16px 16px 0"}}><div style={S.label(T.danger)}>⚠ Overdue</div><div style={S.card()}>
          {overdue.map((task,i)=>(<div key={task.userId+"-"+task.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:i<overdue.length-1?`0.5px solid ${T.sep}`:"none"}}>{task.pinned&&<Star size={12} color={T.star} fill={T.star}/>}<div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:600,color:T.danger,wordBreak:"break-word"}}>{task.text}</div><div style={{fontSize:12,color:T.muted,marginTop:2}}>{task.userName} · {task.topicName}{task.dueTime?" · "+fmtTime(task.dueTime):""}</div></div></div>))}
        </div></div>)}
        {/* Due today */}
        {dueToday.length>0&&(<div style={{padding:"16px 16px 0"}}><div style={S.label(T.primary)}>📋 Due Today</div><div style={S.card()}>
          {[...dueToday].sort((a,b)=>{if(!a.dueTime)return 1;if(!b.dueTime)return-1;return a.dueTime.localeCompare(b.dueTime);}).map((task,i)=>(<div key={task.userId+"-"+task.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:i<dueToday.length-1?`0.5px solid ${T.sep}`:"none"}}>{task.pinned&&<Star size={12} color={T.star} fill={T.star}/>}<div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:600,color:T.text,wordBreak:"break-word"}}>{task.text}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}><span style={{fontSize:12,color:T.muted}}>{task.userName} · {task.topicName}</span>{task.dueTime&&<span style={{display:"flex",alignItems:"center",gap:3,color:T.primary,fontSize:12,fontWeight:600}}><Clock size={10}/>{fmtTime(task.dueTime)}</span>}</div></div></div>))}
        </div></div>)}
        {dueToday.length===0&&overdue.length===0&&(<div style={{textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:48,marginBottom:12}}>🎉</div><div style={{fontSize:20,fontWeight:700,color:T.text}}>All clear!</div><div style={{fontSize:15,color:T.muted,marginTop:6}}>Nothing overdue or due today.</div></div>)}
        <div style={{height:24}}/>
      </div>
    );
  };

  // ── Calendar ───────────────────────────────────────────────────────────────
  const renderCalendar=()=>{
    const today=new Date(),todayStr=today.toISOString().split("T")[0];
    const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
    const agendaLabel=(dt,ds)=>{ const diff=Math.ceil((new Date(ds)-new Date(todayStr))/86400000); return{sub:diff===0?"Today":diff===1?"Tomorrow":diff===-1?"Yesterday":dt.toLocaleDateString("en-US",{weekday:"long"}),isToday:diff===0,isPast:diff<0}; };
    const PriBadge=({p})=>{ const m={urgent:{bg:T.rRedBg,tx:T.rRedTx,l:"Urgent"},high:{bg:T.rRedBg,tx:T.rRedTx,l:"High"},normal:{bg:T.primaryDim,tx:T.primary,l:"Normal"},low:{bg:T.rOrgBg,tx:T.rOrgTx,l:"Low"}}; const s=m[p]||m.normal; return <span style={{backgroundColor:s.bg,color:s.tx,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,textTransform:"uppercase",whiteSpace:"nowrap"}}>{s.l}</span>; };
    const firstDay=new Date(calYear,calMonth,1).getDay(),dim=new Date(calYear,calMonth+1,0).getDate();
    const cells=[...Array(firstDay).fill(null),...Array.from({length:dim},(_,i)=>i+1)];
    const toDS=(day)=>calYear+"-"+String(calMonth+1).padStart(2,"0")+"-"+String(day).padStart(2,"0");
    const prevM=()=>{ if(calMonth===0){setCalYear(y=>y-1);setCalMonth(11);}else setCalMonth(m=>m-1);setCalSel(null); };
    const nextM=()=>{ if(calMonth===11){setCalYear(y=>y+1);setCalMonth(0);}else setCalMonth(m=>m+1);setCalSel(null); };
    return(
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
        <div style={{backgroundColor:T.card,borderBottom:`0.5px solid ${T.sep}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px 8px"}}>
            <div style={{fontSize:22,fontWeight:800,color:T.text,letterSpacing:-0.3}}>{calView==="month"?MONTHS[calMonth]+" "+calYear:today.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {urBtns()}
              <div style={{display:"flex",backgroundColor:T.cardAlt,borderRadius:20,padding:3,gap:2}}>
                {[["agenda","Agenda"],["month","Month"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setCalView(v)} style={{padding:"5px 12px",borderRadius:17,border:"none",cursor:"pointer",transition:"all .15s",backgroundColor:calView===v?T.primary:"transparent",color:calView===v?"#fff":T.muted,fontSize:12,fontWeight:600}}>{l}</button>
                ))}
              </div>
              {calView==="month"&&(<div style={{display:"flex",gap:4}}><button onClick={prevM} style={S.ghost({padding:4})}><ChevronLeft size={20}/></button><button onClick={nextM} style={S.ghost({padding:4})}><ChevronRight size={20}/></button></div>)}
            </div>
          </div>
          {calView==="agenda"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",padding:"0 8px"}}>{["Su","Mo","Tu","We","Th","Fr","Sa"].map(n=>(<div key={n} style={{textAlign:"center",fontSize:10,fontWeight:700,color:T.muted,padding:"4px 0"}}>{n}</div>))}</div>
              <div ref={stripRef} style={{display:"flex",overflowX:"auto",padding:"4px 8px 10px",gap:3,scrollbarWidth:"none"}}>
                {agendaDays.map(({ds,dt})=>{ const pc=datePriColor(ds),isTod=ds===todayStr,isSel=ds===calSel,cnt=allDated.filter(t=>t.dueDate===ds).length;
                  return(<button key={ds} data-today={isTod?"true":"false"} onClick={()=>setCalSel(ds)} style={{flexShrink:0,width:44,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"5px 0 4px",borderRadius:12,border:"none",cursor:"pointer",outline:"none",transition:"background .15s",backgroundColor:isSel?T.primary:isTod?T.primaryDim:pc?pc.bg:"transparent"}}>
                    <span style={{fontSize:10,fontWeight:600,color:isSel?"#fff":isTod?T.primary:pc?pc.tx:T.muted}}>{dt.toLocaleDateString("en-US",{weekday:"short"}).charAt(0)}</span>
                    <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",border:!isSel&&isTod?`2px solid ${T.primary}`:"none",backgroundColor:isSel?T.primary:"transparent"}}>
                      <span style={{fontSize:15,fontWeight:isTod||isSel?800:400,color:isSel?"#fff":isTod?T.primary:pc?pc.tx:T.text}}>{dt.getDate()}</span>
                    </div>
                    {cnt>0&&<span style={{width:5,height:5,borderRadius:"50%",backgroundColor:isSel?"#fff":pc?pc.dt:T.muted}}/>}
                  </button>);
                })}
              </div>
            </div>
          )}
        </div>
        {calView==="agenda"&&(
          <div style={{flex:1,overflowY:"auto",minHeight:0}}>
            {agendaDays.filter(d=>d.tasks.length>0).length===0?<div style={{textAlign:"center",padding:"60px 20px",color:T.muted,fontSize:15}}>No upcoming tasks with due dates</div>
            :agendaDays.map(({ds,dt,tasks})=>{ if(!tasks.length)return null; const{sub,isToday,isPast}=agendaLabel(dt,ds);
              return(<div key={ds}><div style={{display:"flex",alignItems:"baseline",gap:10,padding:"16px 16px 8px"}}><span style={{fontSize:26,fontWeight:800,minWidth:38,color:isToday?T.primary:isPast?T.muted:T.text}}>{dt.getDate()}</span><span style={{fontSize:15,fontWeight:700,color:isToday?T.primary:isPast?T.muted:T.text}}>{dt.toLocaleDateString("en-US",{month:"short"})}</span><span style={{fontSize:13,color:isToday?T.primary:T.muted}}>{sub}</span><span style={{marginLeft:"auto",fontSize:12,color:T.muted}}>{tasks.length} task{tasks.length>1?"s":""}</span></div>
              <div style={{backgroundColor:T.card,borderRadius:16,margin:"0 12px 12px",overflow:"hidden"}}>
                {tasks.map((task,i)=>(<div key={task.userId+"-"+task.id} style={{display:"flex",gap:12,padding:"12px 16px",borderBottom:i<tasks.length-1?`0.5px solid ${T.sep}`:"none"}}>
                  <div style={{width:3,borderRadius:3,flexShrink:0,alignSelf:"stretch",backgroundColor:task.priority==="urgent"||task.priority==="high"?T.rRedDt:task.priority==="normal"?T.primary:T.rOrgDt}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}>{task.pinned&&<Star size={9} color={T.star} fill={T.star}/>}<span style={{fontSize:11,color:T.muted}}>{task.userName} · {task.topicName}</span></div>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}><span style={{fontSize:15,fontWeight:600,color:T.text,flex:1,wordBreak:"break-word"}}>{task.text}</span><PriBadge p={task.priority}/></div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>{task.dueTime&&<span style={{display:"flex",alignItems:"center",gap:3,fontSize:12,color:T.primary,fontWeight:600}}><Clock size={10}/>{fmtTime(task.dueTime)}</span>}{task.estimate&&<span style={{fontSize:11,color:T.muted}}>{EST_LABELS[task.estimate]}</span>}</div>
                  </div>
                </div>))}
              </div></div>);
            })}
          </div>
        )}
        {calView==="month"&&(
          <div style={{flex:1,overflowY:"auto",minHeight:0}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",backgroundColor:T.card,padding:"4px 8px 0"}}>{["S","M","T","W","T","F","S"].map((d,i)=>(<div key={i} style={{textAlign:"center",padding:"4px 0",fontSize:11,fontWeight:700,color:T.muted}}>{d}</div>))}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,padding:8,backgroundColor:T.systemBg}}>
              {cells.map((day,idx)=>{ if(!day)return <div key={"e-"+idx}/>; const ds=toDS(day),pc=datePriColor(ds),isTod=ds===todayStr,isSel=ds===calSel,cnt=allDated.filter(t=>t.dueDate===ds).length;
                return(<button key={ds} onClick={()=>setCalSel(isSel?null:ds)} style={{position:"relative",aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",borderRadius:12,cursor:"pointer",outline:"none",padding:2,transition:"all .15s",border:isSel?`2px solid ${T.primary}`:pc?`1.5px solid ${pc.bd}`:"1.5px solid transparent",backgroundColor:isSel?T.primaryDim:pc?pc.bg:T.card}}>
                  {isTod&&<div style={{position:"absolute",inset:2,borderRadius:10,border:`2px solid ${T.primary}`,opacity:0.6,pointerEvents:"none"}}/>}
                  <span style={{fontSize:14,fontWeight:isTod?800:400,color:pc?pc.tx:T.text,lineHeight:1}}>{day}</span>
                  {cnt>0&&<span style={{fontSize:9,color:pc?pc.tx:T.muted,marginTop:1}}>{cnt}</span>}
                </button>);
              })}
            </div>
            <div style={{display:"flex",gap:12,alignItems:"center",padding:"8px 16px",backgroundColor:T.card,borderTop:`0.5px solid ${T.sep}`,flexWrap:"wrap"}}>
              {[{c:T.rRedDt,l:"Urgent/High"},{c:T.primary,l:"Normal"},{c:T.rOrgDt,l:"Low"}].map(({c,l})=>(<div key={l} style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:8,height:8,borderRadius:"50%",backgroundColor:c}}/><span style={{fontSize:11,color:T.muted}}>{l}</span></div>))}
            </div>
            <div style={{padding:"12px 12px 24px"}}>
              {!calSel?<div style={{textAlign:"center",padding:"32px 0",color:T.muted,fontSize:14}}>Tap a date to see its tasks</div>:(()=>{
                const tasks=allDated.filter(t=>t.dueDate===calSel);
                if(!tasks.length)return <div style={{textAlign:"center",padding:"24px 0",color:T.muted,fontSize:14}}>No tasks on {new Date(calSel+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>;
                return(<div><div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:8}}>{new Date(calSel+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}<span style={{color:T.muted,fontWeight:400,marginLeft:6}}>· {tasks.length} task{tasks.length>1?"s":""}</span></div>
                <div style={S.card()}>{tasks.map((task,i)=>(<div key={task.userId+"-"+task.id} style={{padding:"12px 16px",display:"flex",gap:12,borderBottom:i<tasks.length-1?`0.5px solid ${T.sep}`:"none"}}>
                  <div style={{width:3,borderRadius:3,flexShrink:0,alignSelf:"stretch",backgroundColor:task.priority==="urgent"||task.priority==="high"?T.rRedDt:task.priority==="normal"?T.primary:T.rOrgDt}}/>
                  <div style={{flex:1,minWidth:0}}><div style={{fontSize:11,color:T.muted,marginBottom:2}}>{task.userName} · {task.topicName}</div><div style={{fontSize:15,fontWeight:600,color:T.text,wordBreak:"break-word"}}>{task.text}</div>{task.dueTime&&<div style={{display:"flex",alignItems:"center",gap:4,marginTop:4}}><Clock size={10} color={T.primary}/><span style={{fontSize:12,color:T.primary,fontWeight:600}}>{fmtTime(task.dueTime)}</span></div>}</div>
                </div>))}</div></div>);
              })()}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Settings ───────────────────────────────────────────────────────────────
  const renderSettings=()=>{ return (
    <div style={{flex:1,overflowY:"auto",minHeight:0,padding:"20px 16px"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20}}>
        <div style={{fontSize:28,fontWeight:800,color:T.text,letterSpacing:-0.5}}>Settings</div>{urBtns()}
      </div>
      {/* Notifications */}
      <div style={S.label()}>Notifications</div>
      <div style={{...S.card(),marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",padding:"14px 16px",gap:12,cursor:"pointer"}}
          onClick={async()=>{
            if(!notifOn){
              await reqNotif();
              // reqNotif sets notifOn via setState — effect handles the save
            } else {
              // Save synchronously before setState in case app closes immediately
              savePrefs({ themeName, showUrgency, showBoarding, notifOn:false });
              setNotifOn(false);
            }
          }}>
          <div style={{width:38,height:38,borderRadius:12,backgroundColor:notifOn?T.success+"22":T.cardAlt,
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .2s"}}>
            {notifOn
              ? <Bell size={18} color={T.success}/>
              : <BellOff size={18} color={T.muted}/>
            }
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:600,color:T.text}}>Notifications</div>
            <div style={{fontSize:13,color:notifOn?T.success:T.muted,marginTop:2,fontWeight:notifOn?600:400}}>
              {notifOn ? "✓ Enabled — tap to turn off" : "Off — tap to turn on"}
            </div>
          </div>
          {/* iOS-style toggle — tapping anywhere on the row works */}
          <div style={{
            width:51, height:31, borderRadius:16, flexShrink:0, position:"relative",
            backgroundColor:notifOn ? T.success : T.cardAlt2,
            transition:"background-color .25s",
            boxShadow:`inset 0 0 0 1px ${notifOn?"transparent":T.sepHard}`}}>
            <span style={{
              position:"absolute", top:2, left:notifOn?22:2,
              width:27, height:27, borderRadius:14,
              backgroundColor:"#fff",
              boxShadow:"0 2px 6px rgba(0,0,0,0.28)",
              transition:"left .25s cubic-bezier(0.34,1.56,0.64,1)"}}/>
          </div>
        </div>
      </div>
      {/* v5: Theme picker — 6 themes */}
      <div style={S.label()}>Theme</div>
      <div style={{...S.card(),marginBottom:20,padding:"14px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {Object.entries(THEMES).map(([key,th])=>{
            const active=themeName===key;
            return(
              <button key={key} onClick={()=>setThemeName(key)}
                style={{padding:"10px 8px",borderRadius:14,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all .2s",
                  border:`2px solid ${active?T.primary:T.sep}`,
                  backgroundColor:active?T.primaryDim:th.cardAlt}}>
                <span style={{fontSize:22}}>{th.emoji}</span>
                <span style={{fontSize:12,fontWeight:700,color:active?T.primary:T.muted}}>{th.name}</span>
                <div style={{display:"flex",gap:3}}>
                  {[th.systemBg,th.primary,th.success].map((c,i)=>(<span key={i} style={{width:8,height:8,borderRadius:"50%",backgroundColor:c,border:`1px solid ${th.sep}`}}/>))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* Urgency */}
      <div style={S.label()}>Urgency Colors</div>
      <div style={{...S.card(),marginBottom:20}}>
        <div style={S.row({justifyContent:"space-between"})}>
          <div><div style={{fontSize:15,fontWeight:500,color:T.text}}>Due-Date Highlighting</div><div style={{fontSize:13,color:T.muted,marginTop:2}}>🔴 Today/overdue · 🟠 2 days left</div></div>
          <div onClick={()=>setShowUrgency(v=>!v)} style={{width:50,height:30,borderRadius:15,cursor:"pointer",position:"relative",flexShrink:0,backgroundColor:showUrgency?T.primary:T.cardAlt2,transition:"background .2s"}}>
            <span style={{position:"absolute",top:3,left:showUrgency?23:3,width:24,height:24,borderRadius:"50%",backgroundColor:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.25)",transition:"left .2s"}}/>
          </div>
        </div>
        {showUrgency&&(<div style={{padding:"0 16px 14px"}}><div style={S.sep()}/><div style={{paddingTop:12,display:"flex",flexDirection:"column",gap:10}}>
          {[{dot:T.rRedDt,bg:T.rRedBg,bd:T.rRedBd,label:"Overdue, due today, or due tomorrow"},{dot:T.rOrgDt,bg:T.rOrgBg,bd:T.rOrgBd,label:"2 days remaining"}].map(({dot,bg,bd,label})=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:10}}><span style={{width:24,height:16,borderRadius:5,backgroundColor:bg,border:`1.5px solid ${bd}`,flexShrink:0}}/><span style={{width:8,height:8,borderRadius:"50%",backgroundColor:dot,flexShrink:0}}/><span style={{color:T.text,fontSize:13}}>{label}</span></div>
          ))}
        </div></div>)}
      </div>
      {/* Data */}
      <div style={S.label()}>Data</div>
      <div style={{...S.card(),marginBottom:32}}>
        <button onClick={doExport} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"14px 16px",background:"none",border:"none",cursor:"pointer"}}><span style={{fontSize:15,color:T.text}}>Export Backup</span><Download size={16} color={T.primary}/></button>
        <div style={S.sep()}/>
        <button onClick={doExport} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"14px 16px",background:"none",border:"none",cursor:"pointer"}}><span style={{fontSize:15,color:T.text}}>Import Backup</span><Upload size={16} color={T.primary}/></button>
        <div style={S.sep()}/>
        <button onClick={()=>{ if(window.confirm("Reset all data? This cannot be undone.")){try{localStorage.removeItem(STORE_KEY);localStorage.removeItem(PREFS_KEY);}catch(e){} window.location.reload(); } }} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"14px 16px",background:"none",border:"none",cursor:"pointer"}}><span style={{fontSize:15,color:T.danger}}>Reset All Data</span><Trash2 size={16} color={T.danger}/></button>
        <div style={S.sep()}/><div style={{display:"flex",justifyContent:"flex-end",padding:"12px 16px"}}><span style={{fontSize:12,color:T.muted}}>{saveStatus==="saving"?"Saving…":"Saved ✓"}</span></div>
      </div>
    </div>
  ); };

  // ── Users ──────────────────────────────────────────────────────────────────
  const renderUsers=()=>{ return (
    <div style={{flex:1,overflowY:"auto",minHeight:0}}>
      <div style={{padding:"28px 20px 16px",backgroundColor:T.card,borderBottom:`0.5px solid ${T.sep}`}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
          <div style={{fontSize:32,fontWeight:800,color:T.text,letterSpacing:-0.5}}>Daily Tasks</div>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>{urBtns()}<button onClick={()=>setGlobalSearch(true)} style={S.ghost({padding:6,color:T.muted})}><Search size={18}/></button></div>
        </div>
        <div style={{fontSize:14,color:T.muted,marginTop:3}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
      </div>
      <div style={{padding:"16px 16px 0"}}>
        <div style={S.label()}>Profiles</div>
        <div style={S.card()}>
          {Object.values(users).map((user,i)=>{ const ul=userUrg(user.topics); const isLast=i===Object.values(users).length-1&&!addUser;
            return(<div key={user.id} style={{borderBottom:isLast?"none":`0.5px solid ${T.sep}`}}>
              {editUserId===user.id?(<div style={{padding:"10px 16px"}}><input ref={editURef} defaultValue={user.name} style={S.inp({padding:"10px 12px",fontSize:15})} onBlur={e=>saveUserName(user.id,e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveUserName(user.id,e.target.value);if(e.key==="Escape")setEditUserId(null);}}/></div>)
              :(<div style={S.row()}>
                <div style={{width:40,height:40,borderRadius:20,backgroundColor:T.primaryDim,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:16,fontWeight:700,color:T.primary}}>{user.name.charAt(0).toUpperCase()}</span></div>
                <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>setCurUser(user.id)}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16,fontWeight:600,color:T.text}}>{user.name}</span>{ul!=="none"&&<span style={{width:7,height:7,borderRadius:"50%",backgroundColor:ul==="red"?T.rRedDt:T.rOrgDt}}/>}</div>
                  <div style={{fontSize:13,color:T.muted,marginTop:2}}>{Object.keys(user.topics).length} topics · {Object.values(user.topics).reduce((a,tp)=>a+tp.tasks.length,0)} tasks</div>
                </div>
                <div style={{display:"flex",gap:4}}><button onClick={()=>setEditUserId(user.id)} style={S.ghost({padding:6,color:T.muted})}><Edit3 size={15}/></button>{Object.keys(users).length>1&&<button onClick={()=>deleteUser(user.id)} style={S.ghost({padding:6,color:T.danger})}><Trash2 size={15}/></button>}</div>
                <ChevronRight size={16} color={T.hint} style={{cursor:"pointer"}} onClick={()=>setCurUser(user.id)}/>
              </div>)}
            </div>);
          })}
          {!addUser?(<div style={{borderTop:`0.5px solid ${T.sep}`}}><button onClick={()=>setAddUser(true)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"14px 16px",background:"none",border:"none",cursor:"pointer",color:T.primary,fontSize:15,fontWeight:500}}><div style={{width:28,height:28,borderRadius:14,backgroundColor:T.primary,display:"flex",alignItems:"center",justifyContent:"center"}}><Plus size={16} color="#fff"/></div>Add Profile</button></div>)
          :(<div style={{borderTop:`0.5px solid ${T.sep}`,padding:"10px 16px",display:"flex",gap:8}}>
            <input ref={newURef} value={newUserName} onChange={e=>setNewUserName(e.target.value)} placeholder="Name" style={S.inp({flex:1,padding:"10px 12px",fontSize:15})} onKeyDown={e=>{if(e.key==="Enter")doAddUser();if(e.key==="Escape"){setAddUser(false);setNewUserName("");}}}/>
            <button onClick={doAddUser} disabled={!newUserName.trim()} style={{backgroundColor:T.primary,color:"#fff",border:"none",borderRadius:12,padding:"10px 16px",fontSize:14,fontWeight:700,cursor:"pointer",opacity:newUserName.trim()?1:0.4}}>Add</button>
            <button onClick={()=>{setAddUser(false);setNewUserName("");}} style={S.ghost({color:T.muted})}>Cancel</button>
          </div>)}
        </div>
      </div>
      <div style={{height:24}}/>
    </div>
  ); };

  // ── Topics ─────────────────────────────────────────────────────────────────
  const renderTopics=()=>{
    const topicList=Object.values(curUserData.topics);
    return(
      <div style={{flex:1,overflowY:"auto",minHeight:0}}>
        <div style={{padding:"16px 16px 0"}}>
          <div style={S.label()}>Topics</div>
          <div style={S.card()}>
            {topicList.map((tp,i)=>{ const tl=topicUrg(tp.tasks),done=tp.tasks.filter(t=>t.completed).length,active=tp.tasks.filter(t=>!t.completed).length,isLast=i===topicList.length-1&&!addTopic;
              return(<div key={tp.id} style={{borderBottom:isLast?"none":`0.5px solid ${T.sep}`}}>
                {editTopicId===tp.id?(<div style={{padding:"10px 16px"}}><input ref={editTRef} defaultValue={tp.name} style={S.inp({padding:"10px 12px",fontSize:15})} onBlur={e=>saveTopicName(tp.id,e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveTopicName(tp.id,e.target.value);if(e.key==="Escape")setEditTopicId(null);}}/></div>)
                :(<div style={S.row()}>
                  <div style={{width:40,height:40,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,backgroundColor:tl==="red"?T.rRedBg:tl==="orange"?T.rOrgBg:T.primaryDim}}><ListChecks size={18} color={tl==="red"?T.rRedDt:tl==="orange"?T.rOrgDt:T.primary}/></div>
                  <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>setCurTopic(tp.id)}><div style={{fontSize:16,fontWeight:600,color:T.text}}>{tp.name}</div><div style={{fontSize:13,color:T.muted,marginTop:2}}>{active} active · {done} done</div></div>
                  <div style={{display:"flex",gap:4}}><button onClick={()=>setEditTopicId(tp.id)} style={S.ghost({padding:6,color:T.muted})}><Edit3 size={15}/></button><button onClick={()=>deleteTopic(tp.id)} style={S.ghost({padding:6,color:T.danger})}><Trash2 size={15}/></button></div>
                  <ChevronRight size={16} color={T.hint} style={{cursor:"pointer"}} onClick={()=>setCurTopic(tp.id)}/>
                </div>)}
              </div>);
            })}
            {topicList.length===0&&<div style={{padding:24,textAlign:"center",color:T.muted,fontSize:14}}>No topics yet</div>}
            {!addTopic?(<div style={{borderTop:topicList.length>0?`0.5px solid ${T.sep}`:"none"}}><button onClick={()=>setAddTopic(true)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"14px 16px",background:"none",border:"none",cursor:"pointer",color:T.primary,fontSize:15,fontWeight:500}}><div style={{width:28,height:28,borderRadius:14,backgroundColor:T.primary,display:"flex",alignItems:"center",justifyContent:"center"}}><Plus size={16} color="#fff"/></div>New Topic</button></div>)
            :(<div style={{borderTop:`0.5px solid ${T.sep}`,padding:"10px 16px",display:"flex",gap:8}}>
              <input ref={newTRef} value={newTopicTxt} onChange={e=>setNewTopicTxt(e.target.value)} placeholder="Topic name" style={S.inp({flex:1,padding:"10px 12px",fontSize:15})} onKeyDown={e=>{if(e.key==="Enter")doAddTopic();if(e.key==="Escape"){setAddTopic(false);setNewTopicTxt("");}}}/>
              <button onClick={doAddTopic} disabled={!newTopicTxt.trim()} style={{backgroundColor:T.primary,color:"#fff",border:"none",borderRadius:12,padding:"10px 16px",fontSize:14,fontWeight:700,cursor:"pointer",opacity:newTopicTxt.trim()?1:0.4}}>Add</button>
              <button onClick={()=>{setAddTopic(false);setNewTopicTxt("");}} style={S.ghost({color:T.muted})}>Cancel</button>
            </div>)}
          </div>
        </div>
        <div style={{height:24}}/>
      </div>
    );
  };

  // ── Tasks ──────────────────────────────────────────────────────────────────
  const renderTasks=()=>{
    const incomplete=filteredTasks.filter(t=>!t.completed);
    const completed=filteredTasks.filter(t=>t.completed);
    const pinned=incomplete.filter(t=>t.pinned);
    const regular=incomplete.filter(t=>!t.pinned);
    const total=curTopicData.tasks.length,doneCount=curTopicData.tasks.filter(t=>t.completed).length;
    const progress=total>0?(doneCount/total)*100:0;
    const topicEstMins=curTopicData.tasks.reduce((acc,t)=>(!t.completed&&t.estimate?acc+parseInt(t.estimate):acc),0);
    const fmtEst=(m)=>{ if(!m)return null; if(m<60)return m+"m"; const h=Math.floor(m/60),rm=m%60; return rm>0?h+"h "+rm+"m":h+"h"; };
    const incompleteIds=[...pinned,...regular].map(t=>t.id);
    let rowNum=0;

    const rowProps={ T, expandSubs, setExpandSubs, subInputs, setSubInputs, addSub, deleteSub, toggleSub, toggleTask, setCtxTask, onDelete:deleteTask, selectMode, selectedIds, onToggleSelect:(id)=>setSelectedIds(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; }) };

    return(
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0,position:"relative"}}>
        {/* Progress bar */}
        <div style={{height:3,backgroundColor:T.sep,flexShrink:0}}><div style={{height:3,width:progress+"%",backgroundColor:T.primary,transition:"width .5s ease"}}/></div>

        {/* v5: Batch action bar */}
        {selectMode&&(
          <div style={{padding:"8px 16px",backgroundColor:T.card,borderBottom:`0.5px solid ${T.sep}`,flexShrink:0,display:"flex",alignItems:"center",gap:10,animation:"dtFadeIn 0.2s ease"}}>
            <span style={{flex:1,fontSize:14,fontWeight:600,color:T.text}}>{selectedIds.size} selected</span>
            <button onClick={batchComplete} disabled={selectedIds.size===0} style={{backgroundColor:T.success,color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",fontSize:13,fontWeight:700,cursor:"pointer",opacity:selectedIds.size>0?1:0.5}}>Complete</button>
            <button onClick={batchDelete} disabled={selectedIds.size===0} style={{backgroundColor:T.danger,color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",fontSize:13,fontWeight:700,cursor:"pointer",opacity:selectedIds.size>0?1:0.5}}>Delete</button>
            <button onClick={()=>{setSelectMode(false);setSelectedIds(new Set());}} style={S.ghost({color:T.muted,fontSize:14})}>Cancel</button>
          </div>
        )}

        {/* Search bar */}
        {showSearch&&(
          <div style={{padding:"8px 16px",backgroundColor:T.card,borderBottom:`0.5px solid ${T.sep}`,flexShrink:0,animation:"dtFadeIn 0.2s ease"}}>
            <div style={{position:"relative"}}><Search size={14} color={T.muted} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/><input autoFocus placeholder="Search in topic…" onChange={e=>debSearch(e.target.value)} style={S.inp({paddingLeft:32,fontSize:14,padding:"9px 12px 9px 32px"})}/></div>
          </div>
        )}

        {/* Time estimate banner */}
        {topicEstMins>0&&!selectMode&&(<div style={{padding:"6px 16px",backgroundColor:T.primaryDim,borderBottom:`0.5px solid ${T.sep}`,flexShrink:0,display:"flex",alignItems:"center",gap:6}}><Timer size={13} color={T.primary}/><span style={{fontSize:12,color:T.primary,fontWeight:600}}>{fmtEst(topicEstMins)} of work remaining</span></div>)}

        {/* Filter pills */}
        <div style={{display:"flex",gap:8,padding:"10px 16px",overflowX:"auto",backgroundColor:T.card,borderBottom:`0.5px solid ${T.sep}`,scrollbarWidth:"none",flexShrink:0}}>
          {[["all","All"],["pinned","⭐ Pinned"],["urgent","🔴 Urgent"],["normal","Normal"]].map(([f,l])=>(<button key={f} onClick={()=>setFilterPill(f)} style={S.pill(filterPill===f)}>{l}</button>))}
          {/* v5: Batch select toggle */}
          <button onClick={()=>{setSelectMode(v=>!v);setSelectedIds(new Set());}} style={S.pill(selectMode,{marginLeft:"auto"})}>
            {selectMode?"✕ Done":"Select"}
          </button>
        </div>

        {/* Task list */}
        <div style={{flex:1,overflowY:"auto",minHeight:0}}>
          {pinned.length>0&&(<div style={{marginTop:16,paddingBottom:4}}><div style={{...S.label(T.star),display:"flex",alignItems:"center",gap:5,marginLeft:16}}><Star size={10} fill={T.star} color={T.star}/> Pinned</div>
            <div style={{...S.card(),margin:"0 12px"}}>
              {pinned.map((t,i)=>{ rowNum++; const idx=incompleteIds.indexOf(t.id); return <SwipeRow key={t.id} task={t} rowNum={rowNum} isLast={i===pinned.length-1} onMoveUp={()=>moveTask(t.id,-1)} onMoveDown={()=>moveTask(t.id,1)} canMoveUp={idx>0} canMoveDown={idx<incompleteIds.length-1} {...rowProps}/>; })}
            </div>
          </div>)}
          {regular.length>0&&(<div style={{marginTop:16,paddingBottom:4}}>
            {pinned.length>0&&<div style={{...S.label(),marginLeft:16}}>Tasks</div>}
            <div style={{...S.card(),margin:"0 12px"}}>
              {regular.map((t,i)=>{ rowNum++; const idx=incompleteIds.indexOf(t.id); return <SwipeRow key={t.id} task={t} rowNum={rowNum} isLast={i===regular.length-1} onMoveUp={()=>moveTask(t.id,-1)} onMoveDown={()=>moveTask(t.id,1)} canMoveUp={idx>0} canMoveDown={idx<incompleteIds.length-1} {...rowProps}/>; })}
            </div>
          </div>)}
          {completed.length>0&&(<div style={{margin:"16px 12px 0"}}>
            <button onClick={()=>setShowDone(v=>!v)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6,padding:"0 4px"}}>
              <ChevronDown size={12} style={{transform:showDone?"none":"rotate(-90deg)",transition:"transform .2s"}}/>Completed ({completed.length})
            </button>
            {showDone&&(<div style={S.card()}>{completed.map((t,i)=>{ rowNum++; return <SwipeRow key={t.id} task={t} rowNum={rowNum} isLast={i===completed.length-1} onMoveUp={()=>{}} onMoveDown={()=>{}} canMoveUp={false} canMoveDown={false} {...rowProps}/>; })}</div>)}
          </div>)}
          {filteredTasks.length===0&&(<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:40,marginBottom:12}}>📋</div><div style={{fontSize:18,fontWeight:700,color:T.text}}>No tasks</div><div style={{fontSize:14,color:T.muted,marginTop:6}}>{filterPill!=="all"?"Try a different filter":"Tap + to add your first task"}</div></div>)}
          <div style={{height:72}}/>
        </div>

        {/* v5: Quick Add bar */}
        {!selectMode&&(
          <div style={{flexShrink:0,padding:"8px 14px",backgroundColor:T.card,borderTop:`0.5px solid ${T.sep}`,display:"flex",gap:8,alignItems:"center"}}>
            <div style={{flex:1,position:"relative"}}>
              <Zap size={14} color={T.muted} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
              <input ref={quickRef} value={quickText} onChange={e=>setQuickText(e.target.value)} placeholder="Quick add a task…"
                onKeyDown={e=>{ if(e.key==="Enter"&&quickText.trim()) doQuickAdd(); }}
                style={S.inp({paddingLeft:32,fontSize:14,padding:"9px 12px 9px 32px"})}/>
            </div>
            <button onClick={doQuickAdd} disabled={!quickText.trim()}
              style={{backgroundColor:T.primary,color:"#fff",border:"none",borderRadius:12,padding:"9px 14px",cursor:"pointer",fontSize:13,fontWeight:700,opacity:quickText.trim()?1:0.4,flexShrink:0,transition:"opacity .15s"}}>
              Add
            </button>
          </div>
        )}

        {/* Floating search circle */}
        <button onClick={()=>setShowSearch(v=>!v)}
          style={{position:"absolute",bottom:selectMode?70:70,right:16,width:44,height:44,borderRadius:22,
            backgroundColor:showSearch?T.primary:T.tabBg,
            backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
            border:`0.5px solid ${T.tabBorder}`,
            boxShadow:"0 2px 12px rgba(0,0,0,0.15)",
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            transition:"all .2s",zIndex:10}}>
          <Search size={18} color={showSearch?"#fff":T.muted}/>
        </button>
      </div>
    );
  };

  // ── Add/Edit sheet ─────────────────────────────────────────────────────────
  const renderSheet=()=>{ return (
    <div style={{position:"absolute",inset:0,zIndex:80,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={()=>{setShowSheet(false);setSheetTask(null);}} style={{position:"absolute",inset:0,backgroundColor:"rgba(0,0,0,0.45)",animation:"dtOverlayIn 0.2s ease"}}/>
      <div style={{position:"relative",backgroundColor:T.card,borderRadius:"24px 24px 0 0",zIndex:1,maxHeight:"90%",overflowY:"auto",animation:"dtSheetUp 0.32s cubic-bezier(0.32,0.72,0,1)"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 8px"}}><div style={{width:40,height:4,borderRadius:2,backgroundColor:T.hint}}/></div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 20px",marginBottom:16}}>
          <button onClick={()=>{setShowSheet(false);setSheetTask(null);}} style={S.ghost({color:T.muted})}>Cancel</button>
          <div style={{fontSize:17,fontWeight:700,color:T.text}}>{sheetTask?"Edit Task":"New Task"}</div>
          <button onClick={saveSheet} disabled={!eText.trim()} style={S.ghost({fontWeight:700,opacity:eText.trim()?1:0.4})}>{sheetTask?"Save":"Add"}</button>
        </div>
        <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10}}>
          <input ref={sheetRef} value={eText} onChange={e=>setEText(e.target.value)} placeholder="Task name" style={S.inp({fontSize:18,fontWeight:500,padding:"14px 16px"})} onKeyDown={e=>{if(e.key==="Enter"&&eText.trim())saveSheet();}}/>
          {!eShowDesc?<button onClick={()=>setEShowDesc(true)} style={S.ghost({textAlign:"left",padding:"2px 4px",fontSize:14,color:T.muted})}>+ Add description</button>
          :<textarea value={eDesc} onChange={e=>setEDesc(e.target.value)} placeholder="Description (optional)" rows={2} style={S.inp({resize:"none",fontSize:14})}/>}
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:4}}><span style={{fontSize:11,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,paddingLeft:4}}>Due Date</span><input type="date" value={eDue} onChange={e=>setEDue(e.target.value)} style={S.inp({fontSize:14,padding:"10px 12px"})}/></div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><span style={{fontSize:11,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,paddingLeft:4}}>Time</span><input type="time" value={eTime} onChange={e=>setETime(e.target.value)} style={S.inp({width:"auto",fontSize:14,padding:"10px 12px"})}/></div>
          </div>
          <div><div style={{fontSize:12,color:T.muted,marginBottom:6,fontWeight:500,textTransform:"uppercase",letterSpacing:0.5}}>Priority</div>
            <div style={{display:"flex",gap:6}}>{[["urgent","🔴"],["high","🟠"],["normal","🟡"],["low","⚪"]].map(([p,ico])=>(
              <button key={p} onClick={()=>setEPri(p)} style={{flex:1,padding:"9px 0",borderRadius:10,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,fontSize:11,fontWeight:700,textTransform:"capitalize",transition:"all .15s",border:`1.5px solid ${ePri===p?T.primary:T.sep}`,backgroundColor:ePri===p?T.primaryDim:T.cardAlt,color:ePri===p?T.primary:T.muted}}>
                <span>{ico}</span><span>{p}</span>
              </button>
            ))}</div>
          </div>
          <div><div style={{fontSize:12,color:T.muted,marginBottom:6,fontWeight:500,textTransform:"uppercase",letterSpacing:0.5}}>Time Estimate</div>
            <div style={{display:"flex",gap:6}}>{[["","–"],["15","15m"],["30","30m"],["60","1h"],["120","2h"],["180","3h"]].map(([v,l])=>(
              <button key={v} onClick={()=>setEEst(v)} style={{flex:1,padding:"8px 0",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:600,transition:"all .15s",border:`1.5px solid ${eEst===v?T.primary:T.sep}`,backgroundColor:eEst===v?T.primaryDim:T.cardAlt,color:eEst===v?T.primary:T.muted}}>{l}</button>
            ))}</div>
          </div>
          <div><div style={{fontSize:12,color:T.muted,marginBottom:6,fontWeight:500,textTransform:"uppercase",letterSpacing:0.5}}>Repeat</div>
            <select value={eRec} onChange={e=>setERec(e.target.value)} style={S.inp({fontSize:14,padding:"10px 12px"})}>
              {Object.entries(recLabels).map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <button onClick={saveSheet} disabled={!eText.trim()} style={S.primBtn({opacity:eText.trim()?1:0.5,marginTop:4})}>{sheetTask?"Save Changes":"Add Task"}</button>
        </div>
        <div style={{height:32}}/>
      </div>
    </div>
  ); };

  // ── Context menu ───────────────────────────────────────────────────────────
  const renderCtxMenu=()=>{ if(!ctxTask)return null; const task=ctxTask;
    const actions=[
      {label:task.completed?"Mark Incomplete":"Mark Complete",icon:<CheckCircle2 size={18}/>,action:()=>{toggleTask(task.id);setCtxTask(null);}},
      {label:task.pinned?"Unpin":"Pin to Top",icon:<Star size={18} fill={task.pinned?T.star:"none"} color={T.star}/>,action:()=>{togglePin(task.id);setCtxTask(null);}},
      {label:"Edit",icon:<Edit3 size={18}/>,action:()=>openEdit(task)},
      {label:"Focus Mode",icon:<Zap size={18}/>,action:()=>{ setFocusTask(task); setFocusSecs(25*60); setFocusRunning(false); setFocusFinished(false); setCtxTask(null); }},
      task.dueDate?{label:"Add to Calendar",icon:<CalendarPlus size={18}/>,action:()=>{addToCalendar(task);setCtxTask(null);}}:null,
      {label:"Delete",icon:<Trash2 size={18}/>,action:()=>{deleteTask(task.id);setCtxTask(null);},danger:true},
    ].filter(Boolean);
    return(
      <div style={{position:"absolute",inset:0,zIndex:90,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
        <div onClick={()=>setCtxTask(null)} style={{position:"absolute",inset:0,backgroundColor:"rgba(0,0,0,0.4)",animation:"dtOverlayIn 0.2s ease"}}/>
        <div style={{position:"relative",zIndex:1,margin:"0 8px",marginBottom:8,animation:"dtSheetUp 0.25s cubic-bezier(0.32,0.72,0,1)"}}>
          <div style={{backgroundColor:T.card,borderRadius:16,padding:"12px 16px",textAlign:"center",marginBottom:8}}><div style={{fontSize:13,color:T.muted,lineHeight:1.4}}>{task.text}</div></div>
          <div style={{backgroundColor:T.card,borderRadius:16,overflow:"hidden",marginBottom:8}}>
            {actions.map(({label,icon,action,danger},i)=>(
              <button key={label} onClick={action} style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"15px 20px",background:"none",border:"none",textAlign:"left",fontSize:16,cursor:"pointer",color:danger?T.danger:T.text,borderBottom:i<actions.length-1?`0.5px solid ${T.sep}`:"none",transition:"opacity .15s"}}>
                <span style={{color:danger?T.danger:T.primary}}>{icon}</span>{label}
              </button>
            ))}
          </div>
          <button onClick={()=>setCtxTask(null)} style={{width:"100%",padding:15,backgroundColor:T.card,border:"none",borderRadius:16,fontSize:17,fontWeight:700,color:T.primary,cursor:"pointer"}}>Cancel</button>
        </div>
      </div>
    );
  };

  // ── v5: Focus Mode (Pomodoro) overlay ─────────────────────────────────────
  const renderFocus=()=>{ if(!focusTask)return null;
    const mins=Math.floor(focusSecs/60), secs=focusSecs%60;
    const progress=(1-(focusSecs/(25*60)))*283; // circle circumference = 283
    return(
      <div style={{position:"absolute",inset:0,zIndex:92,display:"flex",flexDirection:"column",backgroundColor:T.systemBg,animation:"dtOverlayIn 0.25s ease"}}>
        {/* Header */}
        <div style={{padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={()=>{setFocusTask(null);setFocusRunning(false);clearInterval(focusInterval.current);}} style={S.ghost({color:T.muted,fontSize:15})}>✕ Exit</button>
          <div style={{fontSize:13,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:0.8}}>Focus Mode</div>
          <div style={{width:60}}/>
        </div>
        {/* Task name */}
        <div style={{textAlign:"center",padding:"0 32px 24px"}}>
          <div style={{fontSize:18,fontWeight:700,color:T.text,lineHeight:1.4}}>{focusTask.text}</div>
          {focusTask.estimate&&<div style={{fontSize:13,color:T.muted,marginTop:6}}>Estimated: {EST_LABELS[focusTask.estimate]}</div>}
        </div>
        {/* Timer ring */}
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:32}}>
          <div style={{position:"relative",width:220,height:220}}>
            <svg width="220" height="220" style={{transform:"rotate(-90deg)"}}>
              <circle cx="110" cy="110" r="100" fill="none" stroke={T.cardAlt} strokeWidth="8"/>
              <circle cx="110" cy="110" r="100" fill="none" stroke={focusFinished?T.success:T.primary} strokeWidth="8"
                strokeDasharray="628" strokeDashoffset={628-Math.max(0,Math.min(628,progress*2.22))}
                style={{transition:"stroke-dashoffset 1s linear",strokeLinecap:"round"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              {focusFinished ? (
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:40,marginBottom:8}}>🎉</div>
                  <div style={{fontSize:18,fontWeight:700,color:T.success}}>Done!</div>
                </div>
              ) : (
                <div style={{fontSize:52,fontWeight:200,color:T.text,fontVariantNumeric:"tabular-nums",letterSpacing:-2}}>
                  {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
                </div>
              )}
            </div>
          </div>
          {/* Controls */}
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            <button onClick={()=>{setFocusSecs(25*60);setFocusRunning(false);setFocusFinished(false);clearInterval(focusInterval.current);}}
              style={{width:48,height:48,borderRadius:24,backgroundColor:T.cardAlt,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:T.muted}}>
              <RotateCcw size={20}/>
            </button>
            {!focusFinished&&(
              <button onClick={()=>setFocusRunning(v=>!v)}
                style={{width:72,height:72,borderRadius:36,backgroundColor:T.primary,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 6px 20px ${T.primary}55`,animation:focusRunning?"dtPulse 2s infinite":"none"}}>
                {focusRunning ? <Pause size={28} color="#fff"/> : <Play size={28} color="#fff"/>}
              </button>
            )}
            {focusFinished&&(
              <button onClick={()=>{toggleTask(focusTask.id);setFocusTask(null);}}
                style={{padding:"16px 28px",borderRadius:20,backgroundColor:T.success,border:"none",cursor:"pointer",fontSize:16,fontWeight:700,color:"#fff",boxShadow:`0 6px 20px ${T.success}55`}}>
                Complete Task ✓
              </button>
            )}
          </div>
          <div style={{fontSize:13,color:T.muted}}>{focusRunning?"Stay focused — you've got this":"Press play to start your 25-minute session"}</div>
        </div>
      </div>
    );
  };

  // ── Global search ──────────────────────────────────────────────────────────
  const renderGlobalSearch=()=>{
    const goToTask=(task)=>{ setActiveTab("home"); setCurUser(task.userId); setCurTopic(task.topicId); setGlobalSearch(false); setGlobalTerm(""); if((task.subtasks||[]).length>0)setExpandSubs(p=>({...p,[task.id]:true})); };
    return(
      <div style={{position:"absolute",inset:0,zIndex:95,backgroundColor:T.systemBg,display:"flex",flexDirection:"column",animation:"dtSlideInRight 0.25s ease"}}>
        <div style={{backgroundColor:T.card,padding:"12px 16px",borderBottom:`0.5px solid ${T.sep}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1,position:"relative"}}><Search size={15} color={T.muted} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/><input ref={gSearchRef} placeholder="Search all tasks…" onChange={e=>debGSearch(e.target.value)} style={S.inp({paddingLeft:34,fontSize:15,padding:"10px 12px 10px 34px"})}/></div>
          <button onClick={()=>{setGlobalSearch(false);setGlobalTerm("");}} style={S.ghost({color:T.muted,fontSize:15})}>Cancel</button>
        </div>
        <div style={{flex:1,overflowY:"auto",minHeight:0}}>
          {globalTerm.length===0?(<div style={{textAlign:"center",padding:"60px 20px"}}><Search size={40} color={T.hint} style={{marginBottom:12}}/><div style={{fontSize:16,color:T.muted}}>Search across all users and topics</div></div>)
          :globalResults.length===0?(<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:40,marginBottom:12}}>🔍</div><div style={{fontSize:16,color:T.muted}}>No results for "{globalTerm}"</div></div>)
          :(<div style={{padding:"12px 12px 32px"}}>
            <div style={{fontSize:12,color:T.muted,marginBottom:10,paddingLeft:4}}>{globalResults.length} result{globalResults.length!==1?"s":""}</div>
            <div style={S.card()}>
              {globalResults.map((task,i)=>{ const ul=task.completed?"none":urgLvU(task.dueDate);
                return(<div key={task.userId+"-"+task.id} style={{padding:"13px 16px",display:"flex",gap:10,alignItems:"flex-start",borderBottom:i<globalResults.length-1?`0.5px solid ${T.sep}`:"none",backgroundColor:task.completed?T.cardAlt:T.card}}>
                  <button onClick={()=>toggleTask(task.id,task.userId,task.topicId)} style={{flexShrink:0,width:22,height:22,borderRadius:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,marginTop:2,border:`2px solid ${task.completed?T.success:T.sepHard}`,backgroundColor:task.completed?T.success:"transparent",transition:"all .2s"}}>
                    {task.completed&&<Check size={12} color="#fff"/>}
                  </button>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,color:T.muted,marginBottom:2}}>{task.userName}<span style={{margin:"0 4px",color:T.hint}}>›</span>{task.topicName}</div>
                    <div style={{fontSize:15,fontWeight:500,color:task.completed?T.muted:T.text,textDecoration:task.completed?"line-through":"none",wordBreak:"break-word"}}>{task.text}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3,flexWrap:"wrap"}}>
                      {task.dueDate&&<span style={{fontSize:12,color:dueTxColor(task.dueDate),fontWeight:500}}>{fmtDate(task.dueDate)}</span>}
                      {task.dueTime&&task.dueDate&&<span style={{display:"flex",alignItems:"center",gap:2,fontSize:12,color:T.primary}}><Clock size={9}/>{fmtTime(task.dueTime)}</span>}
                      {task.estimate&&<span style={{fontSize:11,color:T.muted}}>{EST_LABELS[task.estimate]}</span>}
                      {task.pinned&&<Star size={10} color={T.star} fill={T.star}/>}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
                    {ul!=="none"&&<span style={{width:8,height:8,borderRadius:"50%",backgroundColor:ul==="red"?T.rRedDt:T.rOrgDt}}/>}
                    <button onClick={()=>goToTask(task)} style={{display:"flex",alignItems:"center",gap:3,backgroundColor:T.primaryDim,border:"none",borderRadius:10,padding:"4px 9px",cursor:"pointer",fontSize:11,fontWeight:700,color:T.primary}}>Go <ChevronRight size={11}/></button>
                  </div>
                </div>);
              })}
            </div>
            <div style={{fontSize:11,color:T.hint,textAlign:"center",marginTop:12}}>Tap Go to jump to a task · Tap circle to complete</div>
          </div>)}
        </div>
      </div>
    );
  };

  // ── Sub nav ────────────────────────────────────────────────────────────────
  const renderSubNav=()=>{
    const title=curTopic?curTopicData.name:curUserData.name;
    const subtitle=curTopic?curTopicData.tasks.filter(t=>t.completed).length+"/"+curTopicData.tasks.length+" done":"Select a topic";
    return(
      <div style={{backgroundColor:T.card,borderBottom:`0.5px solid ${T.sep}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",padding:"12px 16px",gap:8}}>
          <button onClick={()=>{if(curTopic){setCurTopic(null);setShowSearch(false);setSearchTerm("");}else setCurUser(null);}} style={S.ghost({display:"flex",alignItems:"center",gap:4,padding:"4px 0",marginRight:4})}>
            <ArrowLeft size={18}/><span style={{fontSize:16}}>Back</span>
          </button>
          <div style={{flex:1}}><div style={{fontSize:17,fontWeight:700,color:T.text}}>{title}</div><div style={{fontSize:12,color:T.muted,marginTop:1}}>{subtitle}</div></div>
          <div style={{display:"flex",alignItems:"center",gap:2}}>{urBtns()}</div>
        </div>
      </div>
    );
  };

  const homeContent=()=>{ if(!curUser)return renderUsers(); if(!curTopic)return renderTopics(); return renderTasks(); };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return(
    <div style={{backgroundColor:T.systemBg,width:"100%",height:"100%",overflow:"hidden",display:"flex",flexDirection:"column",position:"relative",fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif"}}>
      {showBoarding?(
        <div style={{flex:1,overflowY:"auto",minHeight:0,backgroundColor:T.card,display:"flex",flexDirection:"column"}}>{renderOnboarding()}</div>
      ):(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
          {activeTab==="home"&&curUser&&renderSubNav()}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0,position:"relative",...contentAnim}}>
            {activeTab==="today"?renderBriefing():activeTab==="calendar"?renderCalendar():activeTab==="settings"?renderSettings():homeContent()}
          </div>
          <TabBar/>
        </div>
      )}
      {showSheet&&renderSheet()}
      {ctxTask&&renderCtxMenu()}
      {focusTask&&renderFocus()}
      {globalSearch&&renderGlobalSearch()}
    </div>
  );
}
