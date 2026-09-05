// Campus Notice Copilot - Personalized Edition for Nandhakumar Murugan
// Connected to Gemini Antigravity Bridge (http://127.0.0.1:8765)
(function() {
  'use strict';

  const BRIDGE_API = 'http://127.0.0.1:8765/api/whatsapp-feed';
  const BRIDGE_BATCH_API = 'http://127.0.0.1:8765/api/whatsapp-batch';
  const STORAGE_KEY = 'nandha_campus_notices_data';
  
  let notices = [];
  let currentFilter = 'all';
  let searchQuery = '';
  let bridgeStatus = 'checking';

  // Personal Priority Keywords for Nandhakumar Murugan
  const CATEGORIES = {
    mention: ['@nandha', 'nandhakumar', 'nandha', 'smnk', '24ucy129'],
    exam: ['exam', 'cia', 'cia-1', 'arrear', 'deadline', 'hall ticket', 'seating', 'datesheet', 'timetable', '24uma161', '24upy171', '24uma261', '24uma361', '24uma463', 'nptel', 'safe ai', 'responsible ai'],
    circular: ['circular', 'notification', 'directive', 'holiday', 'regulations', 'policy', 'mobile', 'leave', 'notice', 'soi', 'fund my crazy', 'pitch night'],
    assignment: ['assignment', 'lab record', 'homework', 'submission', 'record note', 'report', 'quiz', 'viva', 'project']
  };

  // Load from chrome.storage
  chrome.storage.local.get([STORAGE_KEY], (res) => {
    if (res && res[STORAGE_KEY]) {
      notices = res[STORAGE_KEY];
      updateUI();
    }
  });

  function saveNotices() {
    chrome.storage.local.set({ [STORAGE_KEY]: notices });
  }

  function detectCategory(text) {
    const t = text.toLowerCase();
    for (const [cat, kws] of Object.entries(CATEGORIES)) {
      if (kws.some(kw => t.includes(kw))) return cat;
    }
    return null;
  }

  function getActiveChatName() {
    const el = document.querySelector('header span[data-testid="conversation-info-header-chat-title"]') ||
               document.querySelector('#main header span[dir="auto"]') ||
               document.querySelector('header span[title]');
    return el ? (el.title || el.innerText || 'Active Chat') : 'Active Chat';
  }

  // Stream single message to Antigravity Bridge
  async function streamToBridge(msg) {
    try {
      await fetch(BRIDGE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });
    } catch (e) {
      console.warn('[Bridge] Stream unreachable:', e.message);
    }
  }

  function processText(text, container) {
    if (!text || text.length < 10) return;
    const cat = detectCategory(text);
    if (!cat) return;

    if (notices.some(n => n.text === text.trim())) return;

    const pre = container ? (container.getAttribute('data-pre-plain-text') || '') : '';
    let sender = 'Faculty / Member';
    let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const match = pre.match(/\[(.*?)\]\s*(.*?):/);
    if (match) {
      time = match[1];
      sender = match[2];
    }

    const newNotice = {
      id: 'nandha_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      category: cat,
      chat: getActiveChatName(),
      sender: sender,
      time: time,
      date: new Date().toLocaleDateString(),
      text: text.trim(),
      timestamp: Date.now()
    };

    notices.unshift(newNotice);
    if (notices.length > 300) notices.pop();
    saveNotices();
    updateUI();

    // Push to Bridge
    streamToBridge(newNotice);
  }

  // DEEP SYNC: Scrapes all rendered historical messages in active chat
  async function syncAllLoadedMessages() {
    const chatTitle = getActiveChatName();
    const containers = document.querySelectorAll('#main div.copyable-text');
    if (!containers || containers.length === 0) {
      return alert('No messages found in the active chat window. Open a chat first!');
    }

    const messagesToSync = [];
    containers.forEach(c => {
      const text = (c.innerText || '').trim();
      if (!text) return;
      const pre = c.getAttribute('data-pre-plain-text') || '';
      let sender = 'Chat Member';
      let time = new Date().toLocaleTimeString();
      const m = pre.match(/\[(.*?)\]\s*(.*?):/);
      if (m) { time = m[1]; sender = m[2]; }

      messagesToSync.push({
        chat: chatTitle,
        sender: sender,
        time: time,
        text: text,
        category: detectCategory(text) || 'general'
      });
      processText(text, c);
    });

    try {
      const res = await fetch(BRIDGE_BATCH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat: chatTitle, messages: messagesToSync })
      });
      const data = await res.json();
      alert(`✅ Synced ${messagesToSync.length} messages from '${chatTitle}' directly into Gemini Antigravity Bridge!`);
    } catch (e) {
      alert(`⚠️ Synced ${messagesToSync.length} messages locally. Bridge server note: ${e.message}`);
    }
  }

  // SCAN GROUPS: Scans visible groups in left pane
  async function scanAllGroups() {
    const pane = document.querySelector('#pane-side');
    if (!pane) return alert('Left chat list not found.');

    const chatItems = pane.querySelectorAll('div[role="listitem"]') || pane.querySelectorAll('div[data-testid="cell-frame-container"]');
    const groupList = [];

    chatItems.forEach(item => {
      const titleEl = item.querySelector('span[title]') || item.querySelector('span[dir="auto"]');
      const textEl = item.querySelector('div._ak8l') || item.querySelector('span._ao3e');
      if (titleEl) {
        groupList.push({
          group_name: titleEl.title || titleEl.innerText,
          last_preview: textEl ? textEl.innerText : '',
          chat: 'Group Directory'
        });
      }
    });

    if (groupList.length === 0) return alert('No groups visible in pane.');

    try {
      await fetch(BRIDGE_BATCH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat: 'All Groups Snapshot', messages: groupList })
      });
      alert(`✅ Captured & Synced ${groupList.length} college groups to Antigravity Bridge!`);
    } catch (e) {
      alert(`Captured ${groupList.length} groups locally.`);
    }
  }

  // Create UI
  function createInterface() {
    if (document.getElementById('cnc-fab-btn')) return;

    const fab = document.createElement('button');
    fab.id = 'cnc-fab-btn';
    fab.title = 'Antigravity Campus Notice Hub';
    fab.innerHTML = '⚡<span id="cnc-badge-count">0</span>';
    document.body.appendChild(fab);

    const drawer = document.createElement('div');
    drawer.id = 'cnc-drawer';
    drawer.innerHTML = `
      <div class="cnc-header">
        <div>
          <h3>⚡ Antigravity Copilot</h3>
          <small id="cnc-bridge-indicator" style="font-size:10px;opacity:0.9;">🟢 Bridge: Connected (localhost:8765)</small>
        </div>
        <button class="cnc-close-btn" id="cnc-close-drawer">✕</button>
      </div>
      <div class="cnc-sync-bar">
        <button class="cnc-sync-btn" id="cnc-sync-chat" title="Sync all visible messages in this chat to Antigravity">📥 Sync Chat History</button>
        <button class="cnc-sync-btn" id="cnc-scan-groups" title="Scan all visible groups in sidebar">🌐 Scan Groups</button>
      </div>
      <div class="cnc-controls">
        <input type="text" class="cnc-search-input" id="cnc-search" placeholder="Search notices, exams, arrears..." />
        <div class="cnc-filter-pills">
          <div class="cnc-pill active" data-filter="all">All</div>
          <div class="cnc-pill" data-filter="mention">🚨 Mentions</div>
          <div class="cnc-pill" data-filter="exam">📝 Exams</div>
          <div class="cnc-pill" data-filter="circular">📜 Circulars</div>
          <div class="cnc-pill" data-filter="assignment">📚 Labs</div>
        </div>
      </div>
      <div class="cnc-notices-list" id="cnc-list"></div>
      <div class="cnc-footer">
        <button class="cnc-footer-btn" id="cnc-export-md">📥 Export Digest</button>
        <button class="cnc-footer-btn" id="cnc-clear-all" style="color:#C5221F;">Clear</button>
      </div>
    `;
    document.body.appendChild(drawer);

    fab.addEventListener('click', () => drawer.classList.toggle('open'));
    document.getElementById('cnc-close-drawer').addEventListener('click', () => drawer.classList.remove('open'));
    document.getElementById('cnc-sync-chat').addEventListener('click', syncAllLoadedMessages);
    document.getElementById('cnc-scan-groups').addEventListener('click', scanAllGroups);

    document.getElementById('cnc-search').addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderCards();
    });

    document.querySelectorAll('.cnc-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.cnc-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderCards();
      });
    });

    document.getElementById('cnc-export-md').addEventListener('click', exportMarkdown);
    document.getElementById('cnc-clear-all').addEventListener('click', () => {
      if (confirm('Clear notices?')) {
        notices = [];
        saveNotices();
        updateUI();
      }
    });

    // Check bridge health
    fetch('http://127.0.0.1:8765/health')
      .then(res => res.json())
      .then(data => {
        const ind = document.getElementById('cnc-bridge-indicator');
        if (ind && data.status === 'connected') {
          ind.innerText = `🟢 Bridge Active | ${data.target_user}`;
        }
      })
      .catch(() => {
        const ind = document.getElementById('cnc-bridge-indicator');
        if (ind) ind.innerText = '🟡 Local Receiver Standby';
      });
  }

  function renderCards() {
    const listEl = document.getElementById('cnc-list');
    if (!listEl) return;

    let filtered = notices;
    if (currentFilter !== 'all') {
      filtered = filtered.filter(n => n.category === currentFilter);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(n => 
        n.text.toLowerCase().includes(searchQuery) ||
        n.chat.toLowerCase().includes(searchQuery) ||
        n.sender.toLowerCase().includes(searchQuery)
      );
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="cnc-empty-state">
          <div style="font-size:28px;margin-bottom:6px;">📬</div>
          <b>No notices found</b>
          <p>Click <b>Sync Chat History</b> above to pull all rendered messages from this group directly into Antigravity!</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(n => {
      const calTitle = encodeURIComponent(`[KiTE] ${n.chat}: ${n.text.slice(0, 40)}`);
      const calDetails = encodeURIComponent(`Notice from: ${n.sender} (${n.chat})\n\n${n.text}`);
      const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&details=${calDetails}`;

      return `
        <div class="cnc-card ${n.category}">
          <div class="cnc-card-meta">
            <span class="cnc-tag ${n.category}">${n.category}</span>
            <span>${n.time} • ${n.date}</span>
          </div>
          <div class="cnc-card-chat">👥 ${escapeHtml(n.chat)} <span style="font-weight:normal;color:#5F6368;">(${escapeHtml(n.sender)})</span></div>
          <div class="cnc-card-text">${escapeHtml(n.text)}</div>
          <div class="cnc-card-actions">
            <a href="${calUrl}" target="_blank" class="cnc-btn-sm" title="Add to Google Calendar">📅 Calendar</a>
            <button class="cnc-btn-sm cnc-copy-btn" data-text="${escapeHtml(n.text)}">📋 Copy</button>
            <button class="cnc-btn-sm cnc-dismiss-btn" data-id="${n.id}" style="margin-left:auto;">✕</button>
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.cnc-copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        navigator.clipboard.writeText(e.target.getAttribute('data-text') || '');
        const prev = e.target.innerText;
        e.target.innerText = '✅ Copied';
        setTimeout(() => e.target.innerText = prev, 1200);
      });
    });

    document.querySelectorAll('.cnc-dismiss-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        notices = notices.filter(n => n.id !== id);
        saveNotices();
        updateUI();
      });
    });
  }

  function updateUI() {
    const badge = document.getElementById('cnc-badge-count');
    if (badge) badge.innerText = notices.length;
    renderCards();
  }

  function exportMarkdown() {
    if (notices.length === 0) return alert('No notices to export.');
    let md = `# 🏛️ Nandhakumar Murugan - WhatsApp Academic & Campus Digest\n*Generated via Antigravity WhatsApp Bridge*\n\n---\n\n`;
    notices.forEach((n, i) => {
      md += `### ${i + 1}. [${n.category.toUpperCase()}] ${n.chat}\n`;
      md += `* **Sender**: ${n.sender} | **Date**: ${n.date} ${n.time}\n`;
      md += `> ${n.text}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WhatsApp_Antigravity_Digest_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function setupObserver() {
    createInterface();
    const targetNode = document.querySelector('#main') || document.body;

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const containers = node.querySelectorAll ? node.querySelectorAll('div.copyable-text') : [];
            containers.forEach(c => processText(c.innerText, c));
          }
        }
      }
    });

    observer.observe(targetNode, { childList: true, subtree: true });
    console.log('[Antigravity] Personalized Copilot active for Nandhakumar Murugan.');
  }

  const checkReady = setInterval(() => {
    if (document.querySelector('#main') || document.querySelector('#pane-side')) {
      clearInterval(checkReady);
      setupObserver();
    }
  }, 1000);

})();
