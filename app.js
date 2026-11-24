/* ==========================================================================
   UNOVA COLLABORATION ROOM (CAMPUSVERSE) - JAVASCRIPT CONTROLLER
   Three.js 3D Background Engine, Router, and Interactive Logic
   ========================================================================== */

// Sample Data Structures (Grounded in Sri Lankan & Global University Collaboration)
const sampleRooms = [
  { id: 1, name: "Moratuwa AI Vision Studio", category: "Research", topic: "Deep Learning for Agricultural Drones", uni: "Univ of Moratuwa & Colombo", users: 6, max: 8, status: "Open", privacy: "Public" },
  { id: 2, name: "Peradeniya Bio-Energy Lab", category: "Thesis", topic: "Biomass Gasification Optimization", uni: "Univ of Peradeniya", users: 4, max: 6, status: "Open", privacy: "Public" },
  { id: 3, name: "Jaffna Cyber Security Hub", category: "Project", topic: "Zero-Trust Mesh Network Protocol", uni: "Univ of Jaffna & Ruhuna", users: 8, max: 8, status: "Full", privacy: "Private" },
  { id: 4, name: "SLIIT & NUS Software Hub", category: "Assignment", topic: "Distributed Microservices Architecture", uni: "SLIIT & NUS Singapore", users: 3, max: 10, status: "Open", privacy: "Public" },
  { id: 5, name: "Colombo Quantum Physics Hub", category: "Presentation", topic: "Photonic Qubit Logic Gates", uni: "University of Colombo", users: 5, max: 6, status: "Open", privacy: "Public" },
  { id: 6, name: "Ruhuna Marine Tech Studio", category: "Open", topic: "Autonomous Coastal Survey Vessels", uni: "University of Ruhuna", users: 2, max: 8, status: "Open", privacy: "Public" }
];

const sampleStudents = [
  { name: "Kavinda Fernando", uni: "University of Moratuwa", dept: "Computer Science & Eng", badge: "AI Researcher", projects: 12 },
  { name: "Dilini Senanayake", uni: "University of Colombo", dept: "Physics & Data Science", badge: "Quantum Fellow", projects: 9 },
  { name: "Tharindu Perera", uni: "University of Peradeniya", dept: "Electrical & Electronic Eng", badge: "Robotics Lead", projects: 15 },
  { name: "Nirmala Jayawardena", uni: "University of Jaffna", dept: "Information Technology", badge: "Cyber Sec Specialist", projects: 7 },
  { name: "Sahan Abeywardena", uni: "SLIIT Sri Lanka", dept: "Software Engineering", badge: "Cloud Architect", projects: 11 },
  { name: "Aisha Al-Mansoor", uni: "NUS Singapore", dept: "Bioengineering", badge: "Global Scholar", projects: 14 }
];

document.addEventListener("DOMContentLoaded", () => {
  init3DBackground();
  init3DMeetingStudio();
  initRouter();
  renderRooms(sampleRooms);
  renderFeaturedRooms(sampleRooms);
  renderStudents(sampleStudents);
  initForms();
  initChat();
});

/* ==========================================================================
   1. THREE.JS 3D BACKGROUND ENGINE
   ========================================================================== */
let scene, camera, renderer, particleSystem;

function init3DBackground() {
  const canvas = document.getElementById("bg-3d-canvas");
  if (!canvas) return;
  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 400;

  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create Particles
  const particleCount = 800;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color("#00f0ff");
  const color2 = new THREE.Color("#7b2cbf");

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 1000;
    positions[i + 1] = (Math.random() - 0.5) * 1000;
    positions[i + 2] = (Math.random() - 0.5) * 1000;

    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors[i] = mixedColor.r;
    colors[i + 1] = mixedColor.g;
    colors[i + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 3,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    particleSystem.rotation.y += 0.0008;
    particleSystem.rotation.x += 0.0004;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ==========================================================================
   2. THREE.JS 3D MEETING ROOM STAGE ENGINE
   ========================================================================== */
function init3DMeetingStudio() {
  const container = document.getElementById("stage-3d-view");
  if (!container) return;

  const meetingScene = new THREE.Scene();
  const meetingCamera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
  meetingCamera.position.set(0, 5, 10);
  meetingCamera.lookAt(0, 0, 0);

  const meetingRenderer = new THREE.WebGLRenderer({ antialias: true });
  meetingRenderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(meetingRenderer.domElement);

  // Holographic Central Meeting Table
  const tableGeo = new THREE.CylinderGeometry(4, 4, 0.3, 32);
  const tableMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
  const tableMesh = new THREE.Mesh(tableGeo, tableMat);
  meetingScene.add(tableMesh);

  // Central Hologram Display Board
  const boardGeo = new THREE.PlaneGeometry(5, 3);
  const boardMat = new THREE.MeshBasicMaterial({ color: 0x7b2cbf, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
  const boardMesh = new THREE.Mesh(boardGeo, boardMat);
  boardMesh.position.set(0, 2.5, 0);
  meetingScene.add(boardMesh);

  // Student Avatars (Holographic Spheres around Table)
  const avatarCount = 5;
  const avatarGroup = new THREE.Group();

  for (let i = 0; i < avatarCount; i++) {
    const angle = (i / avatarCount) * Math.PI * 2;
    const x = Math.cos(angle) * 5;
    const z = Math.sin(angle) * 5;

    const headGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const headMat = new THREE.MeshBasicMaterial({ color: i === 0 ? 0x7b2cbf : 0x00f0ff });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.set(x, 1, z);
    avatarGroup.add(headMesh);
  }

  meetingScene.add(avatarGroup);

  function renderMeeting() {
    requestAnimationFrame(renderMeeting);
    tableMesh.rotation.y += 0.003;
    boardMesh.rotation.y += 0.005;
    avatarGroup.rotation.y += 0.001;
    meetingRenderer.render(meetingScene, meetingCamera);
  }
  renderMeeting();

  // Resize handler
  window.addEventListener("resize", () => {
    if (!container) return;
    meetingCamera.aspect = container.clientWidth / container.clientHeight;
    meetingCamera.updateProjectionMatrix();
    meetingRenderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* ==========================================================================
   3. SPA ROUTER & NAVIGATION
   ========================================================================== */
function initRouter() {
  const navItems = document.querySelectorAll("[data-page]");
  const actionRoutes = document.querySelectorAll(".action-route");

  function switchPage(targetPageId) {
    document.querySelectorAll(".page-view").forEach(page => page.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));

    const targetView = document.getElementById(targetPageId);
    if (targetView) targetView.classList.add("active");

    const activeNav = document.querySelector(`.nav-item[data-page="${targetPageId}"]`);
    if (activeNav) activeNav.classList.add("active");

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      switchPage(item.getAttribute("data-page"));
    });
  });

  actionRoutes.forEach(btn => {
    btn.addEventListener("click", () => switchPage(btn.getAttribute("data-target")));
  });
}

/* ==========================================================================
   4. ROOM RENDERING & CATEGORY FILTERS
   ========================================================================== */
function renderRooms(rooms) {
  const container = document.getElementById("rooms-cards-container");
  const portalsContainer = document.getElementById("lobby-portals-list");
  if (!container) return;

  container.innerHTML = rooms.map(r => `
    <div class="glass-card room-card">
      <div class="room-card-head">
        <span class="badge-tag">${r.category}</span>
        <span class="status-badge ${r.status === 'Full' ? 'full' : ''}">${r.status} (${r.users}/${r.max})</span>
      </div>
      <h3>${r.name}</h3>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin: 8px 0;">${r.topic}</p>
      <div style="font-size: 0.8rem; color: var(--primary-cyan); margin-bottom: 16px;"><i class="fa-solid fa-graduation-cap"></i> ${r.uni}</div>
      <button class="btn-primary btn-block" onclick="enterRoom('${r.name}', '${r.topic}')"><i class="fa-solid fa-right-to-bracket"></i> Join Room</button>
    </div>
  `).join('');

  if (portalsContainer) {
    portalsContainer.innerHTML = rooms.slice(0, 4).map(r => `
      <div class="portal-card" onclick="enterRoom('${r.name}', '${r.topic}')">
        <h4>${r.name}</h4>
        <small style="color: var(--primary-cyan); display:block; margin-top:4px;">${r.uni}</small>
        <span class="badge-tag" style="margin-top:8px; font-size:0.7rem;">${r.users}/${r.max} Online</span>
      </div>
    `).join('');
  }

  // Category Filter Handler
  const filterBtns = document.querySelectorAll(".cat-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.getAttribute("data-cat");
      const filtered = cat === "all" ? rooms : rooms.filter(r => r.category === cat);
      renderRooms(filtered);
    });
  });

  // Search Input Handler
  const searchInput = document.getElementById("room-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = rooms.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.topic.toLowerCase().includes(q) || 
        r.uni.toLowerCase().includes(q)
      );
      renderRooms(filtered);
    });
  }
}

function renderFeaturedRooms(rooms) {
  const container = document.getElementById("featured-rooms-preview");
  if (!container) return;

  container.innerHTML = rooms.slice(0, 3).map(r => `
    <div class="glass-card">
      <span class="badge-tag">${r.category}</span>
      <h3 style="margin: 10px 0 6px;">${r.name}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted);">${r.topic}</p>
      <button class="btn-glass btn-sm" style="margin-top:14px;" onclick="enterRoom('${r.name}', '${r.topic}')">Preview 3D Room</button>
    </div>
  `).join('');
}

function enterRoom(name, topic) {
  document.getElementById("current-room-title").innerText = name;
  document.getElementById("current-room-topic").innerText = "Topic: " + topic;
  
  // Route to meeting page
  document.querySelectorAll(".page-view").forEach(p => p.classList.remove("active"));
  document.getElementById("page-meeting").classList.add("active");
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   5. STUDENT PROFILES & FORMS
   ========================================================================== */
function renderStudents(students) {
  const container = document.getElementById("students-cards-container");
  const rosterContainer = document.getElementById("meeting-roster-list");
  if (!container) return;

  container.innerHTML = students.map(s => `
    <div class="glass-card student-card">
      <div class="student-avatar-circle"><i class="fa-solid fa-user-graduate"></i></div>
      <h3>${s.name}</h3>
      <span class="uni-badge">${s.uni}</span>
      <p style="font-size: 0.85rem; color: var(--text-muted);">${s.dept}</p>
      <div style="margin-top: 14px;"><span class="badge-tag">${s.badge} • ${s.projects} Projects</span></div>
    </div>
  `).join('');

  if (rosterContainer) {
    rosterContainer.innerHTML = students.slice(0, 4).map(s => `
      <li class="roster-item">
        <div class="roster-avatar">${s.name.charAt(0)}</div>
        <div>
          <strong>${s.name}</strong>
          <small style="display:block; color: var(--text-muted); font-size:0.75rem;">${s.uni}</small>
        </div>
      </li>
    `).join('');
  }
}

function initForms() {
  const form = document.getElementById("create-room-form");
  const privacySelect = document.getElementById("room-privacy");
  const pwdGroup = document.getElementById("password-group");

  if (privacySelect && pwdGroup) {
    privacySelect.addEventListener("change", (e) => {
      if (e.target.value === "Private") {
        pwdGroup.classList.remove("hidden");
      } else {
        pwdGroup.classList.add("hidden");
      }
    });
  }

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("room-name").value;
    const topic = document.getElementById("room-topic").value;
    const cat = document.getElementById("room-category").value;
    const max = document.getElementById("room-max").value;
    const privacy = document.getElementById("room-privacy").value;
    
    // Display Success Panel
    form.classList.add("hidden");
    document.getElementById("create-success-panel").classList.remove("hidden");
    
    // Summary
    document.getElementById("created-room-summary").innerHTML = `
      <p><strong>Room:</strong> ${name}</p>
      <p><strong>Category:</strong> ${cat} | <strong>Access:</strong> ${privacy}</p>
      <p><strong>Max Capacity:</strong> ${max} Students</p>
    `;

    // Add to Sample Rooms
    sampleRooms.unshift({ id: Date.now(), name, topic, category: cat, uni: "Univ of Moratuwa & Colombo", users: 1, max: parseInt(max), status: "Open", privacy: privacy });
    renderRooms(sampleRooms);
  });

  const copyBtn = document.getElementById("btn-copy-code");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const code = document.getElementById("created-invite-code").innerText;
      navigator.clipboard.writeText(code);
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      setTimeout(() => copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Code', 2000);
    });
  }
}

function initChat() {
  const btn = document.getElementById("btn-send-chat");
  const input = document.getElementById("chat-input");
  const msgBox = document.getElementById("chat-messages-box");

  if (!btn || !input) return;

  btn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;

    const msgEl = document.createElement("div");
    msgEl.className = "msg";
    msgEl.innerHTML = `<strong>You (Student Avatar):</strong> ${text}`;
    msgBox.appendChild(msgEl);
    input.value = "";
    msgBox.scrollTop = msgBox.scrollHeight;
  });

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") btn.click();
  });
}
