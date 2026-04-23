import React, { useState, useEffect, useMemo, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PHASES } from "./data";
import { generateDailyPlan, AITask, sendMessage, ChatMessage, generateBlenderCode, generateCSharpArchitecture } from "./lib/gemini";
import { DevTreeModal } from "./components/DevTreeModal";

type Asset = { id: string; name: string; status: "IDEA" | "BLENDER" | "UNITY" | "DONE" };
type DevLog = { id: string; date: string; text: string; isBug: boolean; resolved: boolean };

export default function App() {
  const [activeTab, setActiveTab] = useState<'PLANNER'|'WORKBENCH'|'ASSETS'|'LOGS'>('PLANNER');
  const [isDevTreeOpen, setIsDevTreeOpen] = useState(false);

  // Existing states
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [aiTasks, setAiTasks] = useState<AITask[]>([]);
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({ "0_0": true });

  const [availabilityInput, setAvailabilityInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentChatInput, setCurrentChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  
  const [blenderPrompt, setBlenderPrompt] = useState("");
  const [blenderCode, setBlenderCode] = useState("");
  const [isGeneratingBlender, setIsGeneratingBlender] = useState(false);

  // New states
  const [csharpPrompt, setCsharpPrompt] = useState("");
  const [csharpCode, setCsharpCode] = useState("");
  const [isGeneratingCsharp, setIsGeneratingCsharp] = useState(false);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [newAssetName, setNewAssetName] = useState("");

  const [logs, setLogs] = useState<DevLog[]>([]);
  const [newLogText, setNewLogText] = useState("");
  const [isNewLogBug, setIsNewLogBug] = useState(false);

  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setCompletedTasks(JSON.parse(localStorage.getItem('pitt_tasks') || '{}'));
      setAiTasks(JSON.parse(localStorage.getItem('pitt_ai_tasks') || '[]'));
      setChatHistory(JSON.parse(localStorage.getItem('pitt_chat') || '[]'));
      setAssets(JSON.parse(localStorage.getItem('pitt_assets') || '[]'));
      setLogs(JSON.parse(localStorage.getItem('pitt_logs') || '[]'));
    } catch (e) {
      console.warn("Failed to load local storage data");
    }
  }, []);

  // Save hooks
  useEffect(() => { localStorage.setItem('pitt_assets', JSON.stringify(assets)); }, [assets]);
  useEffect(() => { localStorage.setItem('pitt_logs', JSON.stringify(logs)); }, [logs]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setIsToastVisible(false), 2500);
  };

  const calculateStats = useMemo(() => {
    let total = 0; let done = 0;
    PHASES.forEach((phase, pi) => {
      phase.days.forEach((day, di) => {
        day.tasks.forEach((task, ti) => {
          total++;
          if (completedTasks[`${pi}_${di}_${ti}`]) done++;
        });
      });
    });
    let todayRemaining = 0;
    for (let pi = 0; pi < PHASES.length; pi++) {
      for (let di = 0; di < PHASES[pi].days.length; di++) {
        const day = PHASES[pi].days[di];
        const dayDone = day.tasks.filter((_, ti) => completedTasks[`${pi}_${di}_${ti}`]).length;
        if (dayDone < day.tasks.length) {
          todayRemaining = day.tasks.length - dayDone; break;
        }
      }
      if (todayRemaining > 0) break;
    }
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, todayRemaining, pct };
  }, [completedTasks]);

  const toggleTask = (key: string) => {
    const nextObj = { ...completedTasks, [key]: !completedTasks[key] };
    setCompletedTasks(nextObj);
    localStorage.setItem('pitt_tasks', JSON.stringify(nextObj));
    if (nextObj[key]) showToast('✓ Görev tamamlandı');
  };

  const handleGeneratePlan = async () => {
    if (!availabilityInput.trim()) {
      showToast('⚠ Müsaitlik durumunu yaz'); return;
    }
    setIsGenerating(true);

    const pendingTasksList: string[] = [];
    outer:
    for (const [pi, phase] of PHASES.entries()) {
      for (const [di, day] of phase.days.entries()) {
        for (const [ti, task] of day.tasks.entries()) {
          const key = `${pi}_${di}_${ti}`;
          if (!completedTasks[key]) {
            pendingTasksList.push(`- [${task.tag.toUpperCase()}] ${task.title}`);
            if (pendingTasksList.length >= 20) break outer;
          }
        }
      }
    }

    const openBugs = logs.filter(l => l.isBug && !l.resolved);
    const bugsContext = openBugs.length > 0 ? `Açık Buglar ve Notlar:\n${openBugs.map(b => `- ${b.text}`).join('\n')}\n` : '';

    const userMsg = `Proje ilerlemesi: ${calculateStats.pct}%.\n\n${bugsContext}\nBekleyen öncelikli görevler:\n${pendingTasksList.join('\n')}\n\nKullanıcının bugünkü durumu: "${availabilityInput}".\nBu bilgilere göre (varsa önce bugları göz önünde bulundurarak) bugün için 3-4 maddelik spesifik checklist üret.\nHer madde kısa, net ve doğrudan olsun.`;

    try {
      const generatedTasks = await generateDailyPlan(userMsg);
      if (generatedTasks.length > 0) {
        setAiTasks(generatedTasks);
        localStorage.setItem('pitt_ai_tasks', JSON.stringify(generatedTasks));
        showToast('✓ Günlük plan hazır');
      }
    } catch {
      showToast('⚠ AI Hatası');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendChat = async () => {
    if (!currentChatInput.trim() || isChatting) return;
    const newMsg: ChatMessage = { role: "user", content: currentChatInput };
    const nextHistory = [...chatHistory, newMsg];
    setChatHistory(nextHistory); setCurrentChatInput(""); setIsChatting(true);
    try {
      const reply = await sendMessage(chatHistory, newMsg.content);
      const finalHistory = [...nextHistory, { role: "model", content: reply } as ChatMessage];
      setChatHistory(finalHistory);
      localStorage.setItem('pitt_chat', JSON.stringify(finalHistory));
    } catch { showToast("⚠ Mesaj gönderilemedi"); } 
    finally { setIsChatting(false); }
  };

  const handleGenerateBlender = async () => {
    if (!blenderPrompt.trim() || isGeneratingBlender) return;
    setIsGeneratingBlender(true); setBlenderCode("Üretiliyor...");
    try { setBlenderCode(await generateBlenderCode(blenderPrompt)); } 
    catch { setBlenderCode("# Error"); } 
    finally { setIsGeneratingBlender(false); }
  };

  const handleGenerateCsharp = async () => {
    if (!csharpPrompt.trim() || isGeneratingCsharp) return;
    setIsGeneratingCsharp(true); setCsharpCode("Mimari parçalanıyor...");
    try { setCsharpCode(await generateCSharpArchitecture(csharpPrompt)); } 
    catch { setCsharpCode("Error Generating Architecture."); } 
    finally { setIsGeneratingCsharp(false); }
  };

  const addAsset = () => {
    if(!newAssetName.trim()) return;
    setAssets([...assets, { id: Date.now().toString(), name: newAssetName, status: 'IDEA' }]);
    setNewAssetName("");
  };

  const changeAssetStatus = (id: string, dir: number) => {
    const statuses: Asset['status'][] = ["IDEA", "BLENDER", "UNITY", "DONE"];
    setAssets(assets.map(a => {
      if(a.id === id) {
        const curIdx = statuses.indexOf(a.status);
        const nextIdx = Math.max(0, Math.min(statuses.length - 1, curIdx + dir));
        return { ...a, status: statuses[nextIdx] };
      }
      return a;
    }));
  };

  const deleteAsset = (id: string) => setAssets(assets.filter(a => a.id !== id));

  const addLog = () => {
    if(!newLogText.trim()) return;
    setLogs([{ id: Date.now().toString(), date: new Date().toLocaleDateString(), text: newLogText, isBug: isNewLogBug, resolved: false }, ...logs]);
    setNewLogText("");
  };

  return (
    <div className="app-root">
      <header className="pitt-header">
        <div className="header-stripe"></div>
        <div className="header-inner">
          <div className="logo">
            <span className="logo-main">THE PITT</span>
            <span className="logo-sub">Dev Planner / Trauma Simulation</span>
          </div>
          <div className="header-stats">
             <div className="header-stat-item">PROGRESS <span style={{ color: 'var(--pitt-yellow)'}}>{calculateStats.pct}%</span></div>
             <div className="header-stat-item">TASKS <span style={{ color: 'var(--pitt-yellow)'}}>{calculateStats.done}/{calculateStats.total}</span></div>
             <div className="header-stat-item">ASSETS <span style={{ color: 'var(--pitt-yellow)'}}>{assets.length}</span></div>
             <div className="header-stat-item">OPEN BUGS <span style={{ color: 'var(--red-alert)'}}>{logs.filter(l=>l.isBug && !l.resolved).length}</span></div>
             <button 
                onClick={() => setIsDevTreeOpen(true)}
                style={{
                  background: 'var(--florasan)', color: 'var(--pitt-black)', border: 'none',
                  padding: '6px 12px', fontFamily: 'var(--display)', fontWeight: 700,
                  fontSize: '14px', cursor: 'pointer', marginLeft: '12px'
                }}
             >
                DEV TREE AÇ
             </button>
          </div>
        </div>
      </header>

      {isDevTreeOpen && <DevTreeModal onClose={() => setIsDevTreeOpen(false)} />}

      <div className="main-dashboard">

        {/* SOL KOLON: AI DIRECTOR CHAT */}
        <aside className="sidebar-director">
          <div className="sidebar-header">
            <div className="panel-label" style={{ margin: 0 }}>DIRECTOR COMMS</div>
          </div>
          
          <div className="chat-history">
            <div className="system-status-pnl" style={{ 
              background: 'rgba(255, 184, 28, 0.05)', 
              border: '1px solid var(--pitt-yellow)', 
              padding: '8px', 
              marginBottom: '16px',
              fontSize: '10px',
              fontFamily: 'var(--mono)',
              color: 'var(--pitt-yellow)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>SYS_MONITOR: ACTIVE</span>
                <span>v1.0.42</span>
              </div>
              <div className="status-line">{" >> GRID_STATUS: STABLE"}</div>
              <div className="status-line">{" >> AI_DIRECTOR: ONLINE"}</div>
              <div className="status-line">{" >> ASSET_PIPELINE: "}{assets.length} ITEMS</div>
            </div>
            {chatHistory.length === 0 && (
              <div className="chat-empty">AI Yönetici beklemede.</div>
            )}
            {chatHistory.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                <div className="chat-author">
                  {m.role === 'user' ? 'SEN' : 'DIRECTOR'}
                </div>
                <div className="markdown-body">
                  <Markdown remarkPlugins={[remarkGfm]}>{m.content}</Markdown>
                </div>
              </div>
            ))}
            {isChatting && <div className="chat-typing">Yazıyor...</div>}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-area">
            <textarea 
              className="availability-input" 
              style={{ minHeight: '60px', padding: '8px', fontSize: '13px' }} 
              placeholder="Mesaj yaz..." 
              value={currentChatInput} 
              onChange={e => setCurrentChatInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendChat())} 
            />
            <button className={`generate-btn ${isChatting ? 'loading' : ''}`} style={{ padding: '8px' }} onClick={handleSendChat} disabled={isChatting}>
              <span className="btn-text">GÖNDER</span>
              <div className="spinner"></div>
            </button>
          </div>
        </aside>

        {/* SAĞ KOLON: ANA ÇALIŞMA ALANI */}
        <main className="workspace">
          
          <div className="workspace-tabs">
            <button className={`main-tab-btn ${activeTab === 'PLANNER' ? 'active' : ''}`} onClick={() => setActiveTab('PLANNER')}>Roadmap & Planner</button>
            <button className={`main-tab-btn ${activeTab === 'WORKBENCH' ? 'active' : ''}`} onClick={() => setActiveTab('WORKBENCH')}>Gen Workbench</button>
            <button className={`main-tab-btn ${activeTab === 'ASSETS' ? 'active' : ''}`} onClick={() => setActiveTab('ASSETS')}>Asset Pipeline</button>
            <button className={`main-tab-btn ${activeTab === 'LOGS' ? 'active' : ''}`} onClick={() => setActiveTab('LOGS')}>Shift Logs ({logs.filter(l=>!l.resolved).length})</button>
          </div>

          <div className="workspace-content">
            <div className="content-inner">

            {/* --- TAB: PLANNER --- */}
            {activeTab === 'PLANNER' && (
              <>
                <div className="prompt-panel">
                  <div className="panel-label">GÜNLÜK PROGRAM ÜRETİCİ</div>
                  <div className="input-row">
                    <textarea className="availability-input" placeholder="Bugün hedefin ne? (Loglar ve Buglar otomatik olarak AI'a gönderilir)" value={availabilityInput} onChange={(e) => setAvailabilityInput(e.target.value)} disabled={isGenerating} />
                    <button className={`generate-btn ${isGenerating ? 'loading' : ''}`} onClick={handleGeneratePlan} disabled={isGenerating}><span className="btn-text">PLANLA</span><div className="spinner"></div></button>
                  </div>
                </div>

                <div className="ai-plan-section" style={{ minHeight: '120px' }}>
                  <div className="panel-label">AKTİF PROGRAM</div>
                  {!aiTasks.length ? (
                    <div className="ai-response-placeholder">Henüz bir program oluşturulmadı.</div>
                  ) : (
                    <div className="ai-checklist">
                      {aiTasks.map((t, i) => (
                        <div key={i} className={`ai-task ${t.done ? 'done' : ''}`} onClick={() => { const u=[...aiTasks]; u[i].done=!u[i].done; setAiTasks(u); localStorage.setItem('pitt_ai_tasks', JSON.stringify(u)); }}>
                          <div className="ai-task-check">{t.done ? '✓' : ''}</div><div className="ai-task-text">{t.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ background: 'var(--epoxy-mid)', border: '1px solid var(--concrete)' }}>
                  <div className="phase-nav">
                    {PHASES.map((phase, idx) => (
                      <button key={idx} className={`phase-tab ${currentPhase === idx ? 'active' : ''}`} onClick={() => setCurrentPhase(idx)}>{phase.name} <span className="phase-badge">{(() => {let total = 0, done = 0; phase.days.forEach((day, di) => day.tasks.forEach((_, ti) => { total++; if (completedTasks[`${idx}_${di}_${ti}`]) done++; })); return `${done}/${total}`;})()}</span></button>
                    ))}
                  </div>
                  <div className="days-container" style={{ padding: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                    {PHASES[currentPhase].days.map((day, di) => {
                      const dayKey = `${currentPhase}_${di}`;
                      const totalTasks = day.tasks.length;
                      const doneTasks = day.tasks.filter((_, ti) => completedTasks[`${currentPhase}_${di}_${ti}`]).length;
                      const pct = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
                      
                      return (
                        <div key={di} className={`day-card ${expandedDays[dayKey] ? 'expanded' : ''}`}>
                          <div className="day-header" onClick={() => setExpandedDays(p => ({...p, [dayKey]: !p[dayKey]}))}>
                            <div className="day-number">G{day.num}</div>
                            <div className="day-info"><div className="day-title">{day.title}</div><div className="day-meta">{day.meta}</div></div>
                            <div className="day-progress"><div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }}></div></div><div className="progress-text">{doneTasks}/{totalTasks}</div></div>
                          </div>
                          <div className="day-tasks">
                            {day.tasks.map((task, ti) => {
                              const taskKeyStr = `${currentPhase}_${di}_${ti}`;
                              const isDone = completedTasks[taskKeyStr];
                              return (
                                <div key={ti} className={`task-item ${isDone ? 'done' : ''}`} onClick={() => toggleTask(taskKeyStr)}>
                                  <div className="task-check">{isDone ? '✓' : ''}</div>
                                  <div className="task-content"><div className="task-title">{task.title}</div><div className="task-desc">{task.desc}</div></div>
                                  <div className={`task-tag tag-${task.tag}`}>{task.tag}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* --- TAB: WORKBENCH --- */}
            {activeTab === 'WORKBENCH' && (
              <>
                <div className="prompt-panel" style={{ borderColor: 'var(--florasan)' }}>
                  <div className="panel-label" style={{ color: 'var(--florasan)' }}>C# ARCHITECTURE BREAKDOWN</div>
                  <div className="input-row" style={{ marginBottom: '12px' }}>
                    <input className="availability-input" placeholder="Mekanik anlat (Örn: NPC Hasta triyaj sistemi)..." value={csharpPrompt} onChange={e => setCsharpPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleGenerateCsharp()} />
                    <button className={`generate-btn ${isGeneratingCsharp ? 'loading' : ''}`} style={{ background: 'var(--florasan)', color: 'var(--pitt-black)' }} onClick={handleGenerateCsharp} disabled={isGeneratingCsharp}><span className="btn-text">MİMARİ ÇIKAR</span><div className="spinner"></div></button>
                  </div>
                  {csharpCode && (
                    <div style={{ position: 'relative', marginTop: '12px' }}>
                      <div style={{ background: '#111', color: 'var(--cream)', fontFamily: 'var(--body)', fontSize: '13px', padding: '16px', border: '1px solid var(--concrete)', maxHeight: '300px', overflowY: 'auto' }}>
                        <div className="markdown-body"><Markdown>{csharpCode}</Markdown></div>
                      </div>
                      <button onClick={() => { navigator.clipboard.writeText(csharpCode); showToast("✓ Kopyalandı"); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--concrete)', color: 'var(--cream)', border: 'none', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', zIndex: 5 }}>KOPYALA</button>
                    </div>
                  )}
                </div>

                <div className="prompt-panel" style={{ borderColor: '#ff9060' }}>
                  <div className="panel-label" style={{ color: '#ff9060' }}>BLENDER PROCEDURE GENERATOR</div>
                  <div className="input-row" style={{ marginBottom: '12px' }}>
                    <input className="availability-input" placeholder="Obje ismi (Örn: Tıbbi Atık Kutusu)..." value={blenderPrompt} onChange={e => setBlenderPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleGenerateBlender()} />
                    <button className={`generate-btn ${isGeneratingBlender ? 'loading' : ''}`} style={{ background: '#ff9060', color: 'var(--pitt-black)' }} onClick={handleGenerateBlender} disabled={isGeneratingBlender}><span className="btn-text">KODLA (PY)</span><div className="spinner"></div></button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <textarea readOnly value={blenderCode} style={{ width: '100%', height: '200px', background: '#111', color: '#ff9060', fontFamily: 'var(--mono)', fontSize: '12px', padding: '12px', border: '1px solid var(--concrete)', outline: 'none' }} placeholder="# Python script'i buraya gelecek..." />
                    {blenderCode && <button onClick={() => { navigator.clipboard.writeText(blenderCode); showToast("✓ Kopyalandı"); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--concrete)', color: 'var(--cream)', border: 'none', padding: '4px 8px', fontSize: '10px', cursor: 'pointer' }}>KOPYALA</button>}
                  </div>
                </div>
              </>
            )}

            {/* --- TAB: ASSET PIPELINE --- */}
            {activeTab === 'ASSETS' && (
              <>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="availability-input" style={{ flex: 1, minHeight: 'auto' }} placeholder="Yeni Asset Ekle (Örn: Hastane Yatağı)..." value={newAssetName} onChange={e => setNewAssetName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAsset()} />
                  <button className="generate-btn" onClick={addAsset}>EKLE</button>
                </div>
                
                <div className="kanban-board">
                  {["IDEA", "BLENDER", "UNITY", "DONE"].map(col => (
                    <div key={col} className="kanban-col">
                      <div className="kanban-header" style={{ color: col === 'DONE' ? 'var(--green-ok)' : 'var(--cream)' }}>{col}</div>
                      <div className="kanban-items">
                        {assets.filter(a => a.status === col).map(asset => (
                          <div key={asset.id} className="asset-card">
                            <div className="asset-name">{asset.name}</div>
                            <div className="asset-actions">
                              <button className="asset-btn" onClick={() => changeAssetStatus(asset.id, -1)} disabled={col === 'IDEA'}>◀</button>
                              <button className="asset-btn delete" onClick={() => deleteAsset(asset.id)}>X</button>
                              <button className="asset-btn" onClick={() => changeAssetStatus(asset.id, 1)} disabled={col === 'DONE'}>▶</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* --- TAB: SHIFT LOGS --- */}
            {activeTab === 'LOGS' && (
              <>
                 <div className="prompt-panel">
                  <div className="panel-label">END OF SHIFT REPORT</div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontFamily: 'var(--mono)', cursor: 'pointer' }}>
                      <input type="radio" checked={!isNewLogBug} onChange={() => setIsNewLogBug(false)} /> Geliştirici Notu
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--red-alert)', fontFamily: 'var(--mono)', cursor: 'pointer' }}>
                      <input type="radio" checked={isNewLogBug} onChange={() => setIsNewLogBug(true)} /> Bug / Hata Raporu
                    </label>
                  </div>
                  <div className="input-row">
                    <textarea className="availability-input" placeholder="Vardiya notunu veya bug'ı yaz..." value={newLogText} onChange={e => setNewLogText(e.target.value)} />
                    <button className="generate-btn" onClick={addLog}><span className="btn-text">KAYDET</span></button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {logs.map(log => (
                    <div key={log.id} className={`log-item ${log.isBug ? 'bug' : ''} ${log.resolved ? 'resolved' : ''}`}>
                      <div className="log-header">
                        <span>{log.isBug ? 'BUG' : 'LOG'}</span>
                        <span>{log.date}</span>
                      </div>
                      <div className="log-text">{log.text}</div>
                      <div className="log-actions">
                        {log.isBug && !log.resolved && (
                          <button className="log-btn resolve" onClick={() => setLogs(logs.map(l => l.id === log.id ? {...l, resolved: true} : l))}>KAPAT (RESOLVED)</button>
                        )}
                        <button className="log-btn delete" onClick={() => setLogs(logs.filter(l => l.id !== log.id))}>SİL</button>
                      </div>
                    </div>
                  ))}
                  {logs.length === 0 && <div style={{ color: '#555', fontFamily: 'var(--mono)', fontSize: '12px', fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>Kayıtlı log bulunmuyor.</div>}
                </div>
              </>
            )}

            </div>
          </div>
        </main>
      </div>

      <div className={`toast ${isToastVisible ? 'show' : ''}`}>{toastMessage}</div>
    </div>
  );
}
