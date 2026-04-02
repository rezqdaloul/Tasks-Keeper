import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Plus, X, Check, Trash2, Palette, ArrowLeft, Edit3, ChevronRight,
  Download, Upload, Settings, User, Calendar, ChevronDown, ChevronUp,
  Search, BarChart3, Undo2, Redo2, FileText, Repeat, CalendarPlus
} from 'lucide-react';

// ── Debounce ─────────────────────────────────────────────────────────────────
const debounce = (fn, ms) => {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};

// ── Themes ────────────────────────────────────────────────────────────────────
const THEMES = {
  light: {
    bg: '#FFFFFF', surface: '#F3F4F6', text: '#111827', textMuted: '#6B7280',
    border: '#E5E7EB', headerBg: '#1F2937', headerText: '#FFFFFF',
    inputBg: '#FFFFFF', inputBorder: '#D1D5DB', primary: '#3B82F6',
    success: '#10B981', completedText: '#9CA3AF', completedBg: '#F9FAFB',
    urgencyRedBg: '#FEE2E2', urgencyRedBorder: '#F87171', urgencyRedText: '#B91C1C', urgencyRedDot: '#EF4444',
    urgencyOrangeBg: '#FEF3C7', urgencyOrangeBorder: '#FCD34D', urgencyOrangeText: '#92400E', urgencyOrangeDot: '#F59E0B',
  },
  dark: {
    bg: '#111827', surface: '#1F2937', text: '#F9FAFB', textMuted: '#9CA3AF',
    border: '#374151', headerBg: '#0F172A', headerText: '#F9FAFB',
    inputBg: '#1F2937', inputBorder: '#4B5563', primary: '#60A5FA',
    success: '#34D399', completedText: '#6B7280', completedBg: '#374151',
    urgencyRedBg: '#3B0000', urgencyRedBorder: '#DC2626', urgencyRedText: '#FCA5A5', urgencyRedDot: '#F87171',
    urgencyOrangeBg: '#2D1600', urgencyOrangeBorder: '#D97706', urgencyOrangeText: '#FCD34D', urgencyOrangeDot: '#FBBF24',
  },
};

// ── Default data ──────────────────────────────────────────────────────────────
const buildDefault = () => {
  const d = (n) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().split('T')[0]; };
  return {
    users: {
      rezq: {
        id: 'rezq', name: 'Rezq',
        topics: {
          'daily-tasks': {
            id: 'daily-tasks', name: 'Daily Tasks',
            tasks: [
              { id: 1, text: 'Review project proposal', description: 'Check Q4 proposal and give feedback', completed: false, dueDate: d(1), priority: 'high', recurrence: null, createdAt: new Date().toISOString(), completedAt: null },
              { id: 2, text: 'Call dentist', description: '', completed: true, dueDate: null, priority: 'normal', recurrence: null, createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
              { id: 3, text: 'Buy groceries', description: 'Milk, bread, eggs', completed: false, dueDate: d(0), priority: 'urgent', recurrence: 'weekly', createdAt: new Date().toISOString(), completedAt: null },
            ],
          },
          work: {
            id: 'work', name: 'Work Tasks',
            tasks: [
              { id: 7, text: 'Finish quarterly report', description: 'Include all financial data', completed: false, dueDate: d(-1), priority: 'urgent', recurrence: null, createdAt: new Date().toISOString(), completedAt: null },
              { id: 8, text: 'Team meeting at 3 PM', description: 'Discuss new project timeline', completed: false, dueDate: d(4), priority: 'normal', recurrence: null, createdAt: new Date().toISOString(), completedAt: null },
            ],
          },
        },
      },
    },
    currentUser: null, currentTopic: null, themeName: 'light', showUrgency: true,
  };
};

const loadData = () => {
  try {
    const raw = localStorage.getItem('dtwv4');
    if (raw) { const p = JSON.parse(raw); if (p?.users) return p; }
  } catch (_) {}
  return buildDefault();
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function App() {
  const init = loadData();

  const [users, setUsers]               = useState(init.users);
  const [currentUser, setCurrentUser]   = useState(init.currentUser);
  const [currentTopic, setCurrentTopic] = useState(init.currentTopic);
  const [themeName, setThemeName]       = useState(init.themeName || 'light');
  const [showUrgency, setShowUrgency]   = useState(init.showUrgency !== false);
  const [showSettings, setShowSettings] = useState(false);

  // task editing
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editText, setEditText]           = useState('');
  const [editDesc, setEditDesc]           = useState('');
  const [editDue, setEditDue]             = useState('');
  const [editPriority, setEditPriority]   = useState('normal');
  const [editRec, setEditRec]             = useState('none');

  // new task
  const [newText, setNewText]       = useState('');
  const [newDesc, setNewDesc]       = useState('');
  const [newDue, setNewDue]         = useState('');
  const [newPriority, setNewPriority] = useState('normal');
  const [newRec, setNewRec]         = useState('none');
  const [showOpts, setShowOpts]     = useState(false);

  // topic / user editing
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editingUserId, setEditingUserId]   = useState(null);
  const [newTopicText, setNewTopicText]     = useState('');
  const [newUserName, setNewUserName]       = useState('');

  // ui
  const [showIE, setShowIE]               = useState(false);
  const [taskDetails, setTaskDetails]     = useState(null);
  const [showStats, setShowStats]         = useState(false);
  const [searchTerm, setSearchTerm]       = useState('');
  const [filterUrg, setFilterUrg]         = useState('all');
  const [filterPri, setFilterPri]         = useState('all');
  const [saveStatus, setSaveStatus]       = useState('saved');
  const [showExitScreen, setShowExitScreen] = useState(false);

  // history
  const [history, setHistory]         = useState([init.users]);
  const [histIdx, setHistIdx]         = useState(0);

  // refs
  const editInputRef  = useRef(null);
  const editTopicRef  = useRef(null);
  const editUserRef   = useRef(null);
  const newTaskRef    = useRef(null);
  const newTopicRef   = useRef(null);
  const newUserRef    = useRef(null);

  const T = THEMES[themeName] || THEMES.light;

  const currentUserData  = currentUser  ? users[currentUser] : null;
  const currentTopicData = currentUser && currentTopic ? users[currentUser]?.topics[currentTopic] : null;

  // ── Urgency helpers ──────────────────────────────────────────────────────
  const getDays = (ds) => {
    if (!ds) return null;
    const due = new Date(ds); due.setHours(0,0,0,0);
    const now = new Date();   now.setHours(0,0,0,0);
    return Math.ceil((due - now) / 86400000);
  };

  // red = overdue / ≤1 day | orange = exactly 2 days | none = >2 days
  const urgLevel = (ds) => {
    const d = getDays(ds);
    if (d === null) return 'none';
    if (d < 0 || d <= 1) return 'red';
    if (d === 2) return 'orange';
    return 'none';
  };

  const urgStyle = (level) => {
    if (!showUrgency || level === 'none') return {};
    if (level === 'red')    return { bg: T.urgencyRedBg,    border: T.urgencyRedBorder,    text: T.urgencyRedText,    dot: T.urgencyRedDot    };
    if (level === 'orange') return { bg: T.urgencyOrangeBg, border: T.urgencyOrangeBorder, text: T.urgencyOrangeText, dot: T.urgencyOrangeDot };
    return {};
  };

  const topicUrgLevel = (tasks = []) => {
    let max = 'none';
    tasks.forEach(t => {
      if (!t.completed) {
        const u = urgLevel(t.dueDate);
        if (u === 'red') max = 'red';
        else if (u === 'orange' && max !== 'red') max = 'orange';
      }
    });
    return max;
  };

  const userUrgLevel = (topics = {}) => {
    let max = 'none';
    Object.values(topics).forEach(tp => {
      const u = topicUrgLevel(tp.tasks);
      if (u === 'red') max = 'red';
      else if (u === 'orange' && max !== 'red') max = 'orange';
    });
    return max;
  };

  const UrgDot = ({ level }) => {
    if (!showUrgency || level === 'none') return null;
    const color = level === 'red' ? T.urgencyRedDot : T.urgencyOrangeDot;
    return <span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', backgroundColor:color, marginLeft:5, verticalAlign:'middle', flexShrink:0 }} />;
  };

  // ── Date formatting ──────────────────────────────────────────────────────
  const fmtDate = (ds) => {
    if (!ds) return null;
    const d = getDays(ds);
    if (d < 0)  return `${Math.abs(d)}d overdue`;
    if (d === 0) return 'Today';
    if (d === 1) return 'Tomorrow';
    if (d <= 7)  return `${d} days`;
    return new Date(ds).toLocaleDateString('en-US', { month:'short', day:'numeric' });
  };

  const dueDateColor = (ds) => {
    const u = urgLevel(ds);
    if (u === 'red')    return T.urgencyRedText;
    if (u === 'orange') return T.urgencyOrangeText;
    return T.textMuted;
  };

  // ── History / updateUsers ────────────────────────────────────────────────
  const updateUsers = (next) => {
    setUsers(next);
    const h = history.slice(0, histIdx + 1);
    h.push(next);
    setHistory(h);
    setHistIdx(h.length - 1);
  };

  const undo = () => {
    if (histIdx > 0) { const ni = histIdx - 1; setHistIdx(ni); setUsers(history[ni]); }
  };
  const redo = () => {
    if (histIdx < history.length - 1) { const ni = histIdx + 1; setHistIdx(ni); setUsers(history[ni]); }
  };

  // ── Auto-save ────────────────────────────────────────────────────────────
  useEffect(() => {
    setSaveStatus('saving');
    const t = setTimeout(() => {
      try {
        localStorage.setItem('dtwv4', JSON.stringify({ users, currentUser, currentTopic, themeName, showUrgency }));
        setSaveStatus('saved');
      } catch (_) { setSaveStatus('error'); }
    }, 300);
    return () => clearTimeout(t);
  }, [users, currentUser, currentTopic, themeName, showUrgency]);

  // ── Click-outside ────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (showIE && !e.target.closest('.ie-popup'))          setShowIE(false);
      if (taskDetails && !e.target.closest('.td-popup'))     setTaskDetails(null);
      if (editingTaskId && !e.target.closest('.edit-task'))  setEditingTaskId(null);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showIE, taskDetails, editingTaskId]);

  // ── Focus on edit start ──────────────────────────────────────────────────
  useEffect(() => { if (editingTaskId  && editInputRef.current)  { editInputRef.current.focus();  editInputRef.current.select();  } }, [editingTaskId]);
  useEffect(() => { if (editingTopicId && editTopicRef.current)  { editTopicRef.current.focus();  editTopicRef.current.select();  } }, [editingTopicId]);
  useEffect(() => { if (editingUserId  && editUserRef.current)   { editUserRef.current.focus();   editUserRef.current.select();   } }, [editingUserId]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey||e.ctrlKey) && !e.shiftKey && e.key==='z') { e.preventDefault(); undo(); }
      if ((e.metaKey||e.ctrlKey) &&  e.shiftKey && e.key==='z') { e.preventDefault(); redo(); }
      if (e.key === 'Escape') {
        if (editingTaskId)    setEditingTaskId(null);
        else if (taskDetails) setTaskDetails(null);
        else if (showSettings) setShowSettings(false);
      }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [editingTaskId, taskDetails, showSettings, histIdx, history]);

  // ── PWA close ────────────────────────────────────────────────────────────
  const handleClose = () => {
    // Detect if running as an installed PWA (standalone mode)
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  window.navigator.standalone === true;
    if (isPWA) {
      // In PWA mode window.close() is blocked by iOS — show exit screen instead
      setShowExitScreen(true);
    } else {
      // In a regular browser tab — close it
      window.close();
    }
  };

  // ── Recurrence ───────────────────────────────────────────────────────────
  const recLabels = { none:'No repeat', daily:'Every day', weekly:'Every week', monthly:'Every month', yearly:'Every year' };

  const nextDue = (ds, rec) => {
    if (!ds || !rec || rec==='none') return null;
    const d = new Date(ds);
    if (rec==='daily')   d.setDate(d.getDate()+1);
    if (rec==='weekly')  d.setDate(d.getDate()+7);
    if (rec==='monthly') d.setMonth(d.getMonth()+1);
    if (rec==='yearly')  d.setFullYear(d.getFullYear()+1);
    return d.toISOString().split('T')[0];
  };

  // ── Task CRUD ────────────────────────────────────────────────────────────
  const addTask = () => {
    const text = newText.trim();
    if (!text || !currentUser || !currentTopic) return;
    const task = { id: Date.now(), text, description: newDesc.trim(), completed: false, dueDate: newDue||null, priority: newPriority, recurrence: newRec==='none'?null:newRec, createdAt: new Date().toISOString(), completedAt: null };
    const n = JSON.parse(JSON.stringify(users));
    n[currentUser].topics[currentTopic].tasks.push(task);
    updateUsers(n);
    setNewText(''); setNewDesc(''); setNewDue(''); setNewPriority('normal'); setNewRec('none'); setShowOpts(false);
  };

  const toggleTask = (id) => {
    const task = currentTopicData.tasks.find(t => t.id===id);
    if (!task) return;
    const n = JSON.parse(JSON.stringify(users));
    const idx = n[currentUser].topics[currentTopic].tasks.findIndex(t => t.id===id);
    const upd = { ...task, completed:!task.completed, completedAt:!task.completed?new Date().toISOString():null };
    n[currentUser].topics[currentTopic].tasks[idx] = upd;
    if (upd.completed && upd.recurrence) {
      n[currentUser].topics[currentTopic].tasks.push({ ...upd, id:Date.now()+1, completed:false, dueDate:nextDue(upd.dueDate,upd.recurrence), createdAt:new Date().toISOString(), completedAt:null });
    }
    updateUsers(n);
  };

  const deleteTask = (id) => {
    const n = JSON.parse(JSON.stringify(users));
    n[currentUser].topics[currentTopic].tasks = n[currentUser].topics[currentTopic].tasks.filter(t => t.id!==id);
    updateUsers(n);
    if (editingTaskId===id) setEditingTaskId(null);
  };

  const clearAll = () => {
    const n = JSON.parse(JSON.stringify(users));
    n[currentUser].topics[currentTopic].tasks = [];
    updateUsers(n); setEditingTaskId(null);
  };

  const saveEdit = (id) => {
    const n = JSON.parse(JSON.stringify(users));
    const idx = n[currentUser].topics[currentTopic].tasks.findIndex(t => t.id===id);
    if (idx !== -1) {
      n[currentUser].topics[currentTopic].tasks[idx] = {
        ...n[currentUser].topics[currentTopic].tasks[idx],
        text: editText.trim() || n[currentUser].topics[currentTopic].tasks[idx].text,
        description: editDesc, dueDate: editDue||null, priority: editPriority,
        recurrence: editRec==='none'?null:editRec,
      };
      updateUsers(n);
    }
    setEditingTaskId(null);
  };

  const startEdit = (task) => {
    setEditingTaskId(task.id); setEditText(task.text); setEditDesc(task.description||'');
    setEditDue(task.dueDate||''); setEditPriority(task.priority||'normal'); setEditRec(task.recurrence||'none');
  };

  // ── User CRUD ────────────────────────────────────────────────────────────
  const addUser = () => {
    const name = newUserName.trim(); if (!name) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]/g,'-');
    if (users[id]) { alert(`User "${users[id].name}" already exists.`); return; }
    const n = JSON.parse(JSON.stringify(users));
    n[id] = { id, name, topics:{} }; updateUsers(n); setNewUserName('');
  };

  const deleteUser = (id) => {
    if (Object.keys(users).length <= 1) return;
    const n = JSON.parse(JSON.stringify(users));
    delete n[id]; updateUsers(n);
    if (currentUser===id) { setCurrentUser(null); setCurrentTopic(null); }
  };

  const saveUserName = (id, name) => {
    if (name.trim()) { const n = JSON.parse(JSON.stringify(users)); n[id].name = name.trim(); updateUsers(n); }
    setEditingUserId(null);
  };

  // ── Topic CRUD ───────────────────────────────────────────────────────────
  const addTopic = () => {
    const name = newTopicText.trim(); if (!name || !currentUser) return;
    const id = Date.now().toString();
    const n = JSON.parse(JSON.stringify(users));
    n[currentUser].topics[id] = { id, name, tasks:[] }; updateUsers(n); setNewTopicText('');
  };

  const deleteTopic = (id) => {
    const n = JSON.parse(JSON.stringify(users));
    delete n[currentUser].topics[id]; updateUsers(n);
    if (currentTopic===id) setCurrentTopic(null);
  };

  const saveTopicName = (id, name) => {
    if (name.trim()) { const n = JSON.parse(JSON.stringify(users)); n[currentUser].topics[id].name = name.trim(); updateUsers(n); }
    setEditingTopicId(null);
  };

  // ── Import / Export ──────────────────────────────────────────────────────

  // Shared helper: write a JSON file to disk
  const writeJsonFile = (filename, payload) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export format used by both full and single-user exports
  const buildExportPayload = (usersToExport, type) => ({
    version:    '4.0',
    exportType: type,           // 'full' | 'user'
    exportDate: new Date().toISOString(),
    themeName,
    showUrgency,
    users: usersToExport,
  });

  // Full backup — all users
  const doFullBackup = () => {
    writeJsonFile(
      `tasks-full-backup-${new Date().toISOString().split('T')[0]}.json`,
      buildExportPayload(users, 'full')
    );
    setShowIE(false);
  };

  // Single-user export
  const doExportUser = (userId) => {
    const user = users[userId];
    if (!user) return;
    const safeName = user.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    writeJsonFile(
      `tasks-${safeName}-${new Date().toISOString().split('T')[0]}.json`,
      buildExportPayload({ [userId]: user }, 'user')
    );
    setShowIE(false);
  };

  // Import — merges backup into current state:
  //   • Users in backup   →  override (even if already exists in app)
  //   • Users NOT backup  →  keep untouched
  const doImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);

        // Validate
        if (!data || data.version !== '4.0' || typeof data.users !== 'object') {
          alert('Invalid backup file. Please use a backup exported from this app (version 4.0).');
          return;
        }

        // Merge: start from current users, then override/add every user from the backup
        const merged = JSON.parse(JSON.stringify(users));
        Object.keys(data.users).forEach(id => {
          merged[id] = JSON.parse(JSON.stringify(data.users[id]));
        });

        updateUsers(merged);

        // Only apply theme from a full backup, not a single-user export
        if (data.exportType === 'full' && data.themeName && THEMES[data.themeName]) {
          setThemeName(data.themeName);
        }
      } catch (_) {
        alert('Could not read the file. Make sure it is a valid JSON backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setShowIE(false);
  };

  // ── Export task as .ics calendar event ──────────────────────────────────
  //
  // Generates a standard iCalendar (.ics) file for a task.
  // When opened on iPhone, iOS asks the user to add it to Apple Calendar,
  // which then triggers a native notification at the reminder time.
  //
  // Event is set at 09:00 AM on the due date (30 min duration).
  // A 15-minute-before alarm is embedded so the phone notifies the user.
  //
  const exportTaskToCalendar = (task) => {
    if (!task.dueDate) return;

    // Format a date string for .ics  →  "YYYYMMDD"
    const fmtDay = (ds) => ds.replace(/-/g, '');

    // Format a local datetime for .ics  →  "YYYYMMDDTHHMMSS"
    // We use local time (no "Z") so the event lands at the right local time
    // regardless of the user's timezone.
    const fmtLocal = (ds, hh, mm, ss) =>
      `${fmtDay(ds)}T${String(hh).padStart(2,'0')}${String(mm).padStart(2,'0')}${String(ss).padStart(2,'0')}`;

    // Timestamp for DTSTAMP (creation time, always UTC)
    const now     = new Date();
    const dtstamp = now.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';

    // Unique ID for this calendar event
    const uid = `${task.id}-${Date.now()}@dailytasks-pwa`;

    // Event starts 09:00, ends 09:30 on the due date
    const dtStart = fmtLocal(task.dueDate, 9, 0, 0);
    const dtEnd   = fmtLocal(task.dueDate, 9, 30, 0);

    // Priority mapping  →  iCal priority scale (1=highest, 9=lowest)
    const icalPriority = { urgent:'1', high:'2', normal:'5', low:'9' };

    // Build description
    const desc = [
      task.description && `Notes: ${task.description}`,
      `Priority: ${task.priority}`,
      task.recurrence && `Repeats: ${task.recurrence}`,
      'Added from Daily Tasks PWA',
    ].filter(Boolean).join('\\n');

    // .ics content — every line must end with CRLF per the spec
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Daily Tasks PWA//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${task.text}`,
      `DESCRIPTION:${desc}`,
      `PRIORITY:${icalPriority[task.priority] || '5'}`,
      // ── Alarm: notifies 15 minutes before 9 AM ──
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder – ${task.text}`,
      'TRIGGER:-PT15M',       // 15 min before the event start (8:45 AM)
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([lines], { type: 'text/calendar;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const safeName = task.text.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40);
    a.href     = url;
    a.download = `${safeName}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Filtered tasks ───────────────────────────────────────────────────────
  const debouncedSearch = useMemo(() => debounce((v) => setSearchTerm(v), 250), []);

  const filteredTasks = useMemo(() => {
    if (!currentTopicData?.tasks) return [];
    return currentTopicData.tasks.filter(t => {
      const matchS = !searchTerm || t.text.toLowerCase().includes(searchTerm.toLowerCase()) || t.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const u = urgLevel(t.dueDate);
      const matchU = filterUrg==='all' || (filterUrg==='urgent'&&u!=='none') || (filterUrg==='normal'&&u==='none');
      const matchP = filterPri==='all' || t.priority===filterPri;
      return matchS && matchU && matchP;
    });
  }, [currentTopicData, searchTerm, filterUrg, filterPri, showUrgency]);

  const stats = useMemo(() => {
    if (!currentTopicData?.tasks) return { total:0, done:0, urgent:0, todayDone:0 };
    const tasks = currentTopicData.tasks;
    const today = new Date().toDateString();
    return {
      total:     tasks.length,
      done:      tasks.filter(t=>t.completed).length,
      urgent:    tasks.filter(t=>!t.completed && urgLevel(t.dueDate)==='red').length,
      todayDone: tasks.filter(t=>t.completed&&t.completedAt&&new Date(t.completedAt).toDateString()===today).length,
    };
  }, [currentTopicData, showUrgency]);

  // ── Shared styles ────────────────────────────────────────────────────────
  // pageCard: full-screen view container — fills the entire viewport
  const pageCard = { backgroundColor:T.bg, width:'100%', minHeight:'100dvh', display:'flex', flexDirection:'column', overflowX:'hidden' };
  // card: used for popups and dropdowns only (keeps border-radius)
  const card   = { backgroundColor:T.bg, border:`1px solid ${T.border}`, borderRadius:14 };
  const surf   = { backgroundColor:T.surface, border:`1px solid ${T.border}`, borderRadius:9  };
  const inp    = { backgroundColor:T.inputBg, border:`1px solid ${T.inputBorder}`, color:T.text, borderRadius:8, padding:'7px 11px', fontSize:13, outline:'none', width:'100%', boxSizing:'border-box' };
  const hdr    = { backgroundColor:T.headerBg, padding:'11px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 };
  const iconBtn = (extra={}) => ({ background:'rgba(255,255,255,0.13)', border:'none', borderRadius:7, padding:'5px 7px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', ...extra });
  const primBtn = (extra={}) => ({ backgroundColor:T.primary, color:'#fff', border:'none', borderRadius:8, padding:'7px 13px', cursor:'pointer', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:4, ...extra });

  // ── Save dot ─────────────────────────────────────────────────────────────
  const SaveDot = () => {
    const c = saveStatus==='saving'?'#FBBF24':saveStatus==='error'?'#EF4444':'#10B981';
    return <span style={{ width:7, height:7, borderRadius:'50%', backgroundColor:c, display:'inline-block', flexShrink:0 }} title={saveStatus} />;
  };

  // ── Reusable header buttons ──────────────────────────────────────────────
  const CloseBtn = () => (
    <button onClick={handleClose} style={iconBtn({ background:'rgba(239,68,68,0.85)' })} title="Exit app">
      <X size={14} color="#fff" />
    </button>
  );

  const UndoRedo = () => (
    <>
      {histIdx > 0 && (
        <button onClick={undo} style={iconBtn()} title="Undo"><Undo2 size={14} color={T.headerText} /></button>
      )}
      {histIdx < history.length-1 && (
        <button onClick={redo} style={iconBtn()} title="Redo"><Redo2 size={14} color={T.headerText} /></button>
      )}
    </>
  );

  // ── PWA Exit Screen ───────────────────────────────────────────────────────
  // Shown when the user taps X while in installed PWA mode on iPhone.
  // iOS blocks window.close() in standalone apps, so we show this instead.
  const ExitScreen = () => !showExitScreen ? null : (
    <div style={{ position:'fixed', inset:0, zIndex:9999, backgroundColor:T.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:32 }}>
      {/* Animated home bar indicator */}
      <div style={{ fontSize:56, lineHeight:1 }}>📱</div>
      <div style={{ color:T.text, fontSize:22, fontWeight:700, textAlign:'center' }}>Ready to leave?</div>
      <div style={{ color:T.textMuted, fontSize:14, textAlign:'center', lineHeight:1.7, maxWidth:260 }}>
        Swipe up from the bottom of the screen, or press your Home button to exit the app.
      </div>
      {/* Visual swipe hint */}
      <div style={{ marginTop:8, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
        <div style={{ width:40, height:5, borderRadius:3, backgroundColor:T.textMuted, opacity:0.5 }} />
        <div style={{ color:T.textMuted, fontSize:11 }}>swipe up</div>
      </div>
      <button
        onClick={() => setShowExitScreen(false)}
        style={{ ...primBtn(), marginTop:16, padding:'12px 32px', fontSize:15, borderRadius:12 }}
      >
        Go Back
      </button>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // SETTINGS VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (showSettings) return (
    <div style={pageCard}>
      <ExitScreen />
      <div style={hdr}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={()=>setShowSettings(false)} style={iconBtn()}><ArrowLeft size={14} color={T.headerText} /></button>
          <div>
            <div style={{ color:T.headerText, fontWeight:700, fontSize:14 }}>Settings</div>
            <div style={{ color:T.headerText, opacity:.7, fontSize:11 }}>Appearance & behavior</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <SaveDot />
          <CloseBtn />
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:14 }}>

        {/* Theme */}
        <div>
          <div style={{ color:T.textMuted, fontSize:11, fontWeight:700, letterSpacing:.5, marginBottom:8, textTransform:'uppercase' }}>Theme</div>
          <div style={{ display:'flex', gap:8 }}>
            {['light','dark'].map(t => (
              <button key={t} onClick={()=>setThemeName(t)} style={{ flex:1, padding:'11px 0', borderRadius:9, border:`2px solid ${themeName===t?T.primary:T.border}`, backgroundColor: themeName===t ? T.primary+'20' : T.surface, color:T.text, fontSize:13, fontWeight:themeName===t?700:400, cursor:'pointer', transition:'all .15s' }}>
                {t==='light'?'☀️  Light':'🌙  Dark'}
              </button>
            ))}
          </div>
        </div>

        {/* Urgency toggle */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 14px', ...surf }}>
          <div>
            <div style={{ color:T.text, fontSize:13, fontWeight:600, marginBottom:2 }}>Due-Date Urgency Colors</div>
            <div style={{ color:T.textMuted, fontSize:11 }}>
              🔴 Overdue / today / tomorrow &nbsp;·&nbsp; 🟠 2 days left
            </div>
          </div>
          <button onClick={()=>setShowUrgency(v=>!v)} style={{ width:46, height:26, borderRadius:13, backgroundColor:showUrgency?T.primary:T.border, border:'none', cursor:'pointer', position:'relative', transition:'background .2s', flexShrink:0, marginLeft:12 }}>
            <span style={{ position:'absolute', top:3, left:showUrgency?21:3, width:20, height:20, borderRadius:'50%', backgroundColor:'#fff', transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.25)' }} />
          </button>
        </div>

        {/* Legend */}
        {showUrgency && (
          <div style={{ ...surf, padding:'12px 14px', display:'flex', flexDirection:'column', gap:9 }}>
            <div style={{ color:T.textMuted, fontSize:10, fontWeight:700, letterSpacing:.5, textTransform:'uppercase' }}>Color legend</div>
            {[
              { dot:T.urgencyRedDot,    bg:T.urgencyRedBg,    bd:T.urgencyRedBorder,    label:'Overdue, due today, or due tomorrow' },
              { dot:T.urgencyOrangeDot, bg:T.urgencyOrangeBg, bd:T.urgencyOrangeBorder, label:'2 days remaining' },
            ].map(({ dot, bg, bd, label }) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ width:28, height:18, borderRadius:5, backgroundColor:bg, border:`1.5px solid ${bd}`, flexShrink:0 }} />
                <span style={{ width:9, height:9, borderRadius:'50%', backgroundColor:dot, flexShrink:0 }} />
                <span style={{ color:T.text, fontSize:12 }}>{label}</span>
              </div>
            ))}
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ width:28, height:18, borderRadius:5, backgroundColor:T.bg, border:`1.5px solid ${T.border}`, flexShrink:0 }} />
              <span style={{ width:9, height:9, borderRadius:'50%', backgroundColor:T.border, flexShrink:0 }} />
              <span style={{ color:T.text, fontSize:12 }}>More than 2 days — no highlight</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // USER SELECTION VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (!currentUser) return (
    <div style={pageCard}>
      <ExitScreen />
      <div style={hdr}>
        <div>
          <div style={{ color:T.headerText, fontWeight:700, fontSize:15 }}>Daily Tasks</div>
          <div style={{ color:T.headerText, opacity:.7, fontSize:11 }}>Select a user to continue</div>
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <SaveDot />
          <UndoRedo />
          <button onClick={()=>setThemeName(n=>n==='light'?'dark':'light')} style={iconBtn()} title="Toggle theme">
            <Palette size={14} color={T.headerText} />
          </button>
          <button onClick={()=>setShowSettings(true)} style={iconBtn()} title="Settings">
            <Settings size={14} color={T.headerText} />
          </button>
          <div className="ie-popup" style={{ position:'relative' }}>
            <button onClick={()=>setShowIE(v=>!v)} style={iconBtn()} title="Import / Export">
              <div style={{ display:'flex', flexDirection:'column' }}>
                <ChevronUp size={9} color={T.headerText} />
                <ChevronDown size={9} color={T.headerText} style={{ marginTop:-3 }} />
              </div>
            </button>
            {showIE && (
              <div style={{ position:'absolute', right:0, top:'calc(100% + 6px)', width:186, ...card, padding:6, zIndex:60, boxShadow:'0 6px 24px rgba(0,0,0,.22)' }}>

                {/* Export section */}
                <div style={{ color:T.textMuted, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, padding:'4px 10px 4px', marginBottom:2 }}>
                  Export
                </div>

                {/* Full backup */}
                <button onClick={doFullBackup} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'8px 10px', background:'none', border:'none', color:T.text, fontSize:12, cursor:'pointer', borderRadius:6, textAlign:'left' }}>
                  <Download size={13} color={T.primary} />
                  <span>Full Backup</span>
                  <span style={{ marginLeft:'auto', color:T.textMuted, fontSize:10 }}>all users</span>
                </button>

                {/* Per-user exports */}
                {Object.values(users).map(user => (
                  <button key={user.id} onClick={()=>doExportUser(user.id)} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'8px 10px', background:'none', border:'none', color:T.text, fontSize:12, cursor:'pointer', borderRadius:6, textAlign:'left' }}>
                    <User size={13} color={T.textMuted} />
                    <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</span>
                  </button>
                ))}

                {/* Divider */}
                <div style={{ height:1, backgroundColor:T.border, margin:'5px 4px' }} />

                {/* Import */}
                <label style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'8px 10px', color:T.text, fontSize:12, cursor:'pointer', borderRadius:6 }}>
                  <Upload size={13} color={T.success} />
                  <span>Import Backup</span>
                  <input type="file" accept=".json" onChange={doImport} style={{ display:'none' }} />
                </label>

              </div>
            )}
          </div>
          <CloseBtn />
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'10px 12px', display:'flex', flexDirection:'column', gap:6 }}>
        {Object.values(users).map(user => {
          const ul = userUrgLevel(user.topics);
          const us = urgStyle(ul);
          return (
            <div key={user.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 13px', borderRadius:10, border:`1.5px solid ${us.border||T.border}`, backgroundColor:us.bg||T.surface, transition:'all .15s' }}>
              <User size={22} color={us.text||T.textMuted} style={{ flexShrink:0 }} />
              <div style={{ flex:1, minWidth:0 }}>
                {editingUserId===user.id ? (
                  <input ref={editUserRef} defaultValue={user.name} style={{ ...inp, padding:'4px 8px', fontSize:13 }}
                    onBlur={e=>saveUserName(user.id,e.target.value)}
                    onKeyDown={e=>{ if(e.key==='Enter')  saveUserName(user.id,e.target.value); if(e.key==='Escape') setEditingUserId(null); }} />
                ) : (
                  <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                    <span onClick={()=>setCurrentUser(user.id)} style={{ color:us.text||T.text, fontWeight:600, fontSize:14, cursor:'pointer' }}>{user.name}</span>
                    <UrgDot level={ul} />
                    <ChevronRight size={14} color={T.textMuted} style={{ cursor:'pointer', marginLeft:2 }} onClick={()=>setCurrentUser(user.id)} />
                  </div>
                )}
                <div style={{ color:T.textMuted, fontSize:11, marginTop:2 }}>
                  {Object.keys(user.topics).length} topics · {Object.values(user.topics).reduce((a,tp)=>a+tp.tasks.length,0)} tasks
                </div>
              </div>
              <div style={{ display:'flex', gap:3, flexShrink:0 }}>
                <button onClick={()=>setEditingUserId(user.id)} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><Edit3 size={13} color={T.primary} /></button>
                <button onClick={()=>deleteUser(user.id)}       style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><X     size={13} color={T.urgencyRedDot} /></button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding:'10px 12px', borderTop:`1px solid ${T.border}`, backgroundColor:T.surface }}>
        <div style={{ display:'flex', gap:8 }}>
          <input ref={newUserRef} type="text" placeholder="Add new user…" value={newUserName}
            onChange={e=>setNewUserName(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter') addUser(); }}
            style={{ ...inp, flex:1 }} />
          <button onClick={addUser} disabled={!newUserName.trim()} style={primBtn({ opacity:newUserName.trim()?1:.4 })}>
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TOPIC SELECTION VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (!currentTopic) return (
    <div style={pageCard}>
      <ExitScreen />
      <div style={hdr}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={()=>setCurrentUser(null)} style={iconBtn()}><ArrowLeft size={14} color={T.headerText} /></button>
          <div>
            <div style={{ color:T.headerText, fontWeight:700, fontSize:14 }}>{currentUserData.name}'s Topics</div>
            <div style={{ color:T.headerText, opacity:.7, fontSize:11 }}>Select a topic</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <SaveDot />
          <UndoRedo />
          <button onClick={()=>setThemeName(n=>n==='light'?'dark':'light')} style={iconBtn()} title="Toggle theme"><Palette size={14} color={T.headerText} /></button>
          <button onClick={()=>setShowSettings(true)} style={iconBtn()} title="Settings"><Settings size={14} color={T.headerText} /></button>
          <CloseBtn />
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'10px 12px', display:'flex', flexDirection:'column', gap:6 }}>
        {Object.values(currentUserData.topics).map(tp => {
          const tl = topicUrgLevel(tp.tasks);
          const ts = urgStyle(tl);
          return (
            <div key={tp.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 13px', borderRadius:10, border:`1.5px solid ${ts.border||T.border}`, backgroundColor:ts.bg||T.surface, transition:'all .15s' }}>
              <div style={{ flex:1, minWidth:0 }}>
                {editingTopicId===tp.id ? (
                  <input ref={editTopicRef} defaultValue={tp.name} style={{ ...inp, padding:'4px 8px', fontSize:13 }}
                    onBlur={e=>saveTopicName(tp.id,e.target.value)}
                    onKeyDown={e=>{ if(e.key==='Enter') saveTopicName(tp.id,e.target.value); if(e.key==='Escape') setEditingTopicId(null); }} />
                ) : (
                  <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                    <span onClick={()=>setCurrentTopic(tp.id)} style={{ color:ts.text||T.text, fontWeight:600, fontSize:13, cursor:'pointer' }}>{tp.name}</span>
                    <UrgDot level={tl} />
                    <ChevronRight size={13} color={T.textMuted} style={{ cursor:'pointer', marginLeft:2 }} onClick={()=>setCurrentTopic(tp.id)} />
                  </div>
                )}
                <div style={{ color:T.textMuted, fontSize:11, marginTop:2 }}>
                  {tp.tasks.length} tasks · {tp.tasks.filter(t=>t.completed).length} done
                </div>
              </div>
              <div style={{ display:'flex', gap:3, flexShrink:0 }}>
                <button onClick={()=>setEditingTopicId(tp.id)} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><Edit3 size={12} color={T.primary} /></button>
                <button onClick={()=>deleteTopic(tp.id)}       style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><X     size={12} color={T.urgencyRedDot} /></button>
              </div>
            </div>
          );
        })}
        {Object.keys(currentUserData.topics).length===0 && (
          <div style={{ textAlign:'center', padding:'28px 0', color:T.textMuted, fontSize:13 }}>No topics yet — add one below!</div>
        )}
      </div>

      <div style={{ padding:'10px 12px', borderTop:`1px solid ${T.border}`, backgroundColor:T.surface }}>
        <div style={{ display:'flex', gap:8 }}>
          <input ref={newTopicRef} type="text" placeholder="New topic name…" value={newTopicText}
            onChange={e=>setNewTopicText(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter') addTopic(); }}
            style={{ ...inp, flex:1 }} />
          <button onClick={addTopic} disabled={!newTopicText.trim()} style={primBtn({ opacity:newTopicText.trim()?1:.4 })}>
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TASK VIEW
  // ─────────────────────────────────────────────────────────────────────────
  const doneCount  = filteredTasks.filter(t=>t.completed).length;
  const totalCount = filteredTasks.length;
  const progress   = totalCount > 0 ? (doneCount/totalCount)*100 : 0;

  return (
    <div style={{ ...pageCard, position:'relative' }}>
      <ExitScreen />

      {/* Task details overlay */}
      {taskDetails && (
        <div className="td-popup" style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,.55)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ ...card, width:'100%', maxWidth:320, overflow:'hidden' }}>
            <div style={{ ...hdr, padding:'10px 14px' }}>
              <span style={{ color:T.headerText, fontWeight:700, fontSize:14 }}>Task Details</span>
              <button onClick={()=>setTaskDetails(null)} style={iconBtn()}><X size={14} color={T.headerText} /></button>
            </div>
            <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
              <div>
                <div style={{ color:T.textMuted, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:.4, marginBottom:3 }}>Task</div>
                <div style={{ color:T.text, fontSize:13 }}>{taskDetails.text}</div>
              </div>
              {taskDetails.description && (
                <div>
                  <div style={{ color:T.textMuted, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:.4, marginBottom:3 }}>Description</div>
                  <div style={{ color:T.text, fontSize:13 }}>{taskDetails.description}</div>
                </div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div>
                  <div style={{ color:T.textMuted, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:.4, marginBottom:3 }}>Priority</div>
                  <div style={{ color:T.text, fontSize:13, textTransform:'capitalize' }}>{taskDetails.priority}</div>
                </div>
                {taskDetails.dueDate && (
                  <div>
                    <div style={{ color:T.textMuted, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:.4, marginBottom:3 }}>Due</div>
                    <div style={{ color:dueDateColor(taskDetails.dueDate), fontSize:13, fontWeight:600 }}>{fmtDate(taskDetails.dueDate)}</div>
                  </div>
                )}
              </div>
              {taskDetails.recurrence && (
                <div>
                  <div style={{ color:T.textMuted, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:.4, marginBottom:3 }}>Repeat</div>
                  <div style={{ color:T.text, fontSize:13, display:'flex', alignItems:'center', gap:5 }}><Repeat size={12} />{recLabels[taskDetails.recurrence]}</div>
                </div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginTop:2 }}>
                <div style={{ color:T.textMuted, fontSize:11 }}>Created {new Date(taskDetails.createdAt).toLocaleDateString()}</div>
                {taskDetails.completedAt && <div style={{ color:T.textMuted, fontSize:11 }}>Done {new Date(taskDetails.completedAt).toLocaleDateString()}</div>}
              </div>

              {/* Add to Calendar button — only when a due date is set */}
              {taskDetails.dueDate && (
                <button
                  onClick={() => exportTaskToCalendar(taskDetails)}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', marginTop:8, padding:'9px 0', backgroundColor:T.success+'22', border:`1.5px solid ${T.success}`, borderRadius:8, color:T.success, fontSize:13, fontWeight:600, cursor:'pointer' }}
                >
                  <CalendarPlus size={15} />
                  Add to Calendar / Set Reminder
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={hdr}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={()=>setCurrentTopic(null)} style={iconBtn()}><ArrowLeft size={14} color={T.headerText} /></button>
          <div>
            <div style={{ color:T.headerText, fontWeight:700, fontSize:14 }}>{currentTopicData.name}</div>
            <div style={{ color:T.headerText, opacity:.7, fontSize:11 }}>{doneCount}/{totalCount} done · {currentUserData.name}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:5, alignItems:'center' }}>
          <SaveDot />
          <UndoRedo />
          <button onClick={()=>setShowStats(v=>!v)} style={iconBtn()} title="Stats"><BarChart3 size={14} color={T.headerText} /></button>
          <button onClick={()=>setShowSettings(true)} style={iconBtn()} title="Settings"><Settings size={14} color={T.headerText} /></button>
          <CloseBtn />
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height:3, backgroundColor:T.border }}>
        <div style={{ height:3, width:`${progress}%`, backgroundColor:T.primary, transition:'width .4s ease' }} />
      </div>

      {/* Stats */}
      {showStats && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', backgroundColor:T.surface, borderBottom:`1px solid ${T.border}`, padding:'10px 0' }}>
          {[{label:'Total',v:stats.total,c:T.text},{label:'Done',v:stats.done,c:T.success},{label:'Today',v:stats.todayDone,c:T.primary},{label:'Urgent',v:stats.urgent,c:T.urgencyRedDot}].map(({label,v,c})=>(
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:700, color:c }}>{v}</div>
              <div style={{ fontSize:10, color:T.textMuted, marginTop:1 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Search + filter */}
      <div style={{ padding:'8px 12px', backgroundColor:T.surface, borderBottom:`1px solid ${T.border}`, display:'flex', gap:6 }}>
        <div style={{ flex:1, position:'relative' }}>
          <Search size={13} color={T.textMuted} style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
          <input type="text" placeholder="Search…" onChange={e=>debouncedSearch(e.target.value)}
            style={{ ...inp, paddingLeft:28, fontSize:12 }} />
        </div>
        <select value={filterUrg} onChange={e=>setFilterUrg(e.target.value)} style={{ ...inp, width:'auto', padding:'6px 7px', fontSize:11 }}>
          <option value="all">All</option><option value="urgent">Urgent</option><option value="normal">Normal</option>
        </select>
        <select value={filterPri} onChange={e=>setFilterPri(e.target.value)} style={{ ...inp, width:'auto', padding:'6px 7px', fontSize:11 }}>
          <option value="all">All</option><option value="urgent">Urgent</option>
          <option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option>
        </select>
      </div>

      {/* Tasks list */}
      <div style={{ flex:1, overflowY:'auto', padding:'8px 12px', display:'flex', flexDirection:'column', gap:5 }}>
        {filteredTasks.length===0 ? (
          <div style={{ textAlign:'center', padding:'34px 0', color:T.textMuted, fontSize:13 }}>
            {searchTerm||filterUrg!=='all'||filterPri!=='all' ? 'No tasks match your filters' : 'No tasks yet — add one below!'}
          </div>
        ) : filteredTasks.map(task => {
          const ul = task.completed ? 'none' : urgLevel(task.dueDate);
          const us = urgStyle(ul);
          const isEditing = editingTaskId === task.id;

          return (
            <div key={task.id} className={isEditing?'edit-task':''} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:9, border:`1.5px solid ${us.border||T.border}`, backgroundColor:us.bg||(task.completed?T.completedBg:T.bg), transition:'all .2s' }}>

              {/* Checkbox */}
              <button onClick={()=>toggleTask(task.id)} style={{ flexShrink:0, width:18, height:18, borderRadius:5, border:`2px solid ${task.completed?T.success:T.border}`, backgroundColor:task.completed?T.success:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }}>
                {task.completed && <Check size={11} color="#fff" />}
              </button>

              {/* Content */}
              <div className={isEditing?'edit-task':''} style={{ flex:1, minWidth:0, cursor:isEditing?'default':'pointer' }} onClick={()=>{ if(!isEditing) startEdit(task); }}>
                {isEditing ? (
                  <div className="edit-task" style={{ display:'flex', flexDirection:'column', gap:5 }}>
                    <input ref={editInputRef} value={editText} onChange={e=>setEditText(e.target.value)} style={inp}
                      onKeyDown={e=>{ if(e.key==='Enter') saveEdit(task.id); if(e.key==='Escape') setEditingTaskId(null); }} />
                    <textarea value={editDesc} onChange={e=>setEditDesc(e.target.value)} placeholder="Description…" rows={2}
                      style={{ ...inp, resize:'vertical', fontSize:12 }} />
                    <div style={{ display:'flex', gap:5 }}>
                      <input type="date" value={editDue} onChange={e=>setEditDue(e.target.value)} style={{ ...inp, flex:1, fontSize:11, padding:'6px 7px' }} />
                      <select value={editPriority} onChange={e=>setEditPriority(e.target.value)} style={{ ...inp, width:'auto', fontSize:11, padding:'6px 7px' }}>
                        <option value="urgent">Urgent</option><option value="high">High</option>
                        <option value="normal">Normal</option><option value="low">Low</option>
                      </select>
                      <select value={editRec} onChange={e=>setEditRec(e.target.value)} style={{ ...inp, width:'auto', fontSize:11, padding:'6px 7px' }}>
                        <option value="none">No repeat</option><option value="daily">Daily</option>
                        <option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <button onClick={()=>saveEdit(task.id)} style={primBtn({ padding:'7px', fontSize:12 })}>Save Changes</button>
                  </div>
                ) : (
                  <>
                    <div style={{ display:'flex', alignItems:'center', gap:4, flexWrap:'wrap' }}>
                      <span style={{ color:task.completed?T.completedText:(us.text||T.text), fontSize:13, fontWeight:500, textDecoration:task.completed?'line-through':'none', wordBreak:'break-word' }}>{task.text}</span>
                      {!task.completed && <UrgDot level={ul} />}
                      {task.recurrence && <Repeat size={9} color={T.textMuted} />}
                    </div>
                    {task.description && <div style={{ color:T.textMuted, fontSize:11, marginTop:2 }}>{task.description}</div>}
                    {task.dueDate && (
                      <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:3 }}>
                        <Calendar size={10} color={dueDateColor(task.dueDate)} />
                        <span style={{ color:dueDateColor(task.dueDate), fontSize:11, fontWeight:600 }}>{fmtDate(task.dueDate)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action buttons */}
              {!isEditing && (
                <div style={{ display:'flex', gap:2, flexShrink:0 }}>
                  {/* Add to Calendar — only shown when a due date exists */}
                  {task.dueDate && (
                    <button
                      onClick={() => exportTaskToCalendar(task)}
                      style={{ background:'none', border:'none', cursor:'pointer', padding:3 }}
                      title="Add to Apple Calendar / export .ics reminder"
                    >
                      <CalendarPlus size={12} color={T.success} />
                    </button>
                  )}
                  <button onClick={()=>setTaskDetails(task)} style={{ background:'none', border:'none', cursor:'pointer', padding:3 }}><FileText size={12} color={T.primary} /></button>
                  <button onClick={()=>deleteTask(task.id)}  style={{ background:'none', border:'none', cursor:'pointer', padding:3 }}><X       size={12} color={T.urgencyRedDot} /></button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add-task bar */}
      <div style={{ padding:'8px 12px', borderTop:`1px solid ${T.border}`, backgroundColor:T.surface }}>
        {showOpts && (
          <div style={{ marginBottom:8, padding:10, ...surf, display:'flex', flexDirection:'column', gap:6 }}>
            <textarea value={newDesc} onChange={e=>setNewDesc(e.target.value)} placeholder="Description (optional)…" rows={2}
              style={{ ...inp, resize:'vertical', fontSize:12 }} />
            <div style={{ display:'flex', gap:5 }}>
              <input type="date" value={newDue} onChange={e=>setNewDue(e.target.value)} style={{ ...inp, flex:1, fontSize:11, padding:'6px 7px' }} />
              <select value={newPriority} onChange={e=>setNewPriority(e.target.value)} style={{ ...inp, width:'auto', fontSize:11, padding:'6px 7px' }}>
                <option value="urgent">Urgent</option><option value="high">High</option>
                <option value="normal">Normal</option><option value="low">Low</option>
              </select>
              <select value={newRec} onChange={e=>setNewRec(e.target.value)} style={{ ...inp, width:'auto', fontSize:11, padding:'6px 7px' }}>
                <option value="none">No repeat</option><option value="daily">Daily</option>
                <option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        )}
        <div style={{ display:'flex', gap:6 }}>
          <button onClick={clearAll} disabled={!currentTopicData?.tasks?.length}
            style={primBtn({ backgroundColor:T.urgencyRedDot, padding:'7px 10px', opacity:currentTopicData?.tasks?.length?1:.4 })} title="Clear all tasks">
            <Trash2 size={13} />
          </button>
          <input ref={newTaskRef} type="text" placeholder="Add a task… (Enter)" value={newText}
            onChange={e=>setNewText(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter') addTask(); }}
            style={{ ...inp, flex:1, fontSize:13 }} />
          <button onClick={()=>setShowOpts(v=>!v)}
            style={primBtn({ padding:'7px 10px', backgroundColor:(newDue||newDesc||newPriority!=='normal'||newRec!=='none')?T.primary:T.textMuted })}
            title="Task options">
            <Calendar size={13} />
          </button>
          <button onClick={addTask} disabled={!newText.trim()} style={primBtn({ padding:'7px 12px', opacity:newText.trim()?1:.4 })}>
            <Plus size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
