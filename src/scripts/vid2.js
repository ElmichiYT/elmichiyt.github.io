(function(){

    // 1. Inyección de CSS
    const cssStyles = `
      @import url(https://elmichiyt.github.io/cdn/fonts/file.css);
      vid{ display:block; width:100%; max-width:900px; font-family: 'Inter'; }
      .vidp{ position:relative; width:100%; background:#000; border-radius:12px; overflow:hidden; box-shadow:0 20px 60px -20px rgba(0,0,0,.7); aspect-ratio:16/9; user-select:none; outline:none; }
      .vidp:focus-visible{ box-shadow:0 0 0 3px var(--accent), 0 20px 60px -20px rgba(0,0,0,.7); }
      .vidp video{ width:100%; height:100%; display:block; background:#000; object-fit:contain; }
      .vidp .hitlayer{ position:absolute; inset:0; display:flex; z-index:2; cursor:pointer; }
      .vidp .hitlayer .zone{ flex:1; height:100%; }
      .seek-flash{ position:absolute; top:50%; transform:translate(-50%,-50%) scale(.6); width:110px; height:110px; border-radius:50%; background:rgba(20,20,20,.75); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; color:#fff; font-size:12px; font-weight:500; opacity:0; pointer-events:none; z-index:3; transition:opacity .25s ease, transform .25s ease; }
      .seek-flash svg{ width:26px; height:26px; }
      .seek-flash.left{ left:22%; }
      .seek-flash.right{ left:78%; }
      .seek-flash.show{ opacity:1; transform:translate(-50%,-50%) scale(1); }
      .buffer-spin{ position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:46px; height:46px; z-index:3; opacity:0; pointer-events:none; transition:opacity .15s ease; }
      .buffer-spin.show{ opacity:1; }
      .buffer-spin svg{ width:100%; height:100%; animation:spin 0.9s linear infinite; }
      @keyframes spin{ to{ transform:rotate(360deg); } }
      .center-btn{ position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) scale(.7); width:72px; height:72px; border-radius:50%; background:rgba(20,20,20,.65); display:flex; align-items:center; justify-content:center; z-index:3; opacity:0; pointer-events:none; transition:opacity .2s ease, transform .2s ease; }
      .center-btn.show{ opacity:1; transform:translate(-50%,-50%) scale(1); }
      .center-btn svg{ width:30px; height:30px; fill:#fff; }
      .top-bar{ position:absolute; top:0; left:0; right:0; z-index:4; padding:16px 18px; background:linear-gradient(to bottom, rgba(0,0,0,.65), transparent); opacity:0; transform:translateY(-6px); transition:opacity .25s ease, transform .25s ease; pointer-events:none; }
      .vidp.show-ui .top-bar{ opacity:1; transform:translateY(0); }
      .top-bar .vt{ font-size:15px; font-weight:500; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,.5); }
      .controls{ position:absolute; left:0; right:0; bottom:0; z-index:4; padding:36px 12px 8px; background:linear-gradient(to top, rgba(0,0,0,.82) 10%, rgba(0,0,0,.45) 55%, transparent); opacity:0; transform:translateY(8px); transition:opacity .25s ease, transform .25s ease; }
      .vidp.show-ui .controls{ opacity:1; transform:translateY(0); }
      .vidp:not(.is-playing) .controls{ opacity:1; transform:translateY(0); }
      .seekbar-wrap{ position:relative; height:14px; display:flex; align-items:center; cursor:pointer; margin-bottom:2px; }
      .seekbar-track{ position:relative; width:100%; height:3px; border-radius:3px; background:rgba(255,255,255,.25); transition:height .12s ease; }
      .seekbar-wrap:hover .seekbar-track{ height:5px; }
      .seekbar-buffered{ position:absolute; left:0; top:0; height:100%; border-radius:3px; background:rgba(255,255,255,.4); width:0%; }
      .seekbar-played{ position:absolute; left:0; top:0; height:100%; border-radius:3px; background:var(--accent, #ff0033); width:0%; }
      .seekbar-thumb{ position:absolute; top:50%; width:13px; height:13px; border-radius:50%; background:var(--accent, #ff0033); transform:translate(-50%,-50%) scale(0); transition:transform .12s ease; left:0%; box-shadow:0 0 0 4px rgba(255,0,51,.18); }
      .seekbar-wrap:hover .seekbar-thumb{ transform:translate(-50%,-50%) scale(1); }
      .seek-tooltip{ position:absolute; bottom:16px; transform:translateX(-50%); background:rgba(15,15,15,.95); color:#fff; font-family:'Roboto Mono',monospace; font-size:11px; padding:3px 7px; border-radius:4px; opacity:0; pointer-events:none; transition:opacity .12s ease; white-space:nowrap; }
      .seekbar-wrap:hover .seek-tooltip{ opacity:1; }
      .btn-row{ display:flex; align-items:center; gap:2px; margin-top:6px; }
      .btn-row .spacer{ flex:1; }
      .ctrl-btn{ width:36px; height:36px; border:none; background:transparent; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; border-radius:6px; flex-shrink:0; position:relative; }
      .ctrl-btn:hover{ background:rgba(255,255,255,.12); }
      .ctrl-btn svg{ width:20px; height:20px; fill:#fff; }
      .time-display{ font-family:'Roboto Mono', monospace; font-size:12.5px; color:#fff; margin-left:4px; letter-spacing:.01em; white-space:nowrap; }
      .time-display .sep{ color:var(--text-dim, #aaa); margin:0 3px; }
      .vol-group{ display:flex; align-items:center; }
      .vol-slider-wrap{ width:0; overflow:hidden; transition:width .18s ease; display:flex; align-items:center; }
      .vol-group:hover .vol-slider-wrap, .vol-group.dragging .vol-slider-wrap{ width:72px; }
      input[type=range].vol-slider{ -webkit-appearance:none; appearance:none; width:64px; height:3px; background:rgba(255,255,255,.3); border-radius:3px; outline:none; margin-left:6px; }
      input[type=range].vol-slider::-webkit-slider-thumb{ -webkit-appearance:none; width:12px; height:12px; border-radius:50%; background:#fff; cursor:pointer; margin-top:0; }
      input[type=range].vol-slider::-moz-range-thumb{ width:12px; height:12px; border-radius:50%; background:#fff; border:none; cursor:pointer; }
      .menu{ position:absolute; bottom:46px; right:8px; z-index:6; background:rgba(24,24,24,.96); border-radius:8px; padding:6px 0; min-width:170px; box-shadow:0 6px 24px rgba(0,0,0,.5); display:none; max-height:260px; overflow-y:auto; }
      .menu.open{ display:block; }
      .menu-item{ display:flex; align-items:center; justify-content:space-between; gap:14px; padding:8px 16px; font-size:13px; color:#fff; cursor:pointer; }
      .menu-item:hover{ background:rgba(255,255,255,.08); }
      .menu-item .chk{ color:var(--accent, #ff0033); font-weight:700; visibility:hidden; }
      .menu-item.active .chk{ visibility:visible; }
      .menu-title{ padding:8px 16px; font-size:11px; letter-spacing:.06em; text-transform:uppercase; color:var(--text-dim, #aaa); border-bottom:1px solid rgba(255,255,255,.08); margin-bottom:4px; }
      .vidp.fullscreen-active{ border-radius:0; }
      vid:fullscreen .vidp{ border-radius:0; aspect-ratio:auto; height:100vh; }
      @media (max-width:520px){
        .time-display{ font-size:11px; }
        .ctrl-btn{ width:32px; height:32px; }
        .ctrl-btn svg{ width:17px; height:17px; }
        .vol-group:hover .vol-slider-wrap{ width:48px; }
      }
      footer{ color:#666; font-size:12px; text-align:center; max-width:520px; line-height:1.6; }
      footer kbd{ background:#1c1c1c; border:1px solid #2c2c2c; border-radius:4px; padding:1px 6px; font-family:'Roboto Mono',monospace; color:#ddd; }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = cssStyles;
    document.head.appendChild(styleEl);

    // Constantes e iconos del reproductor
    const ICONS = {
      play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
      pause: '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
      volHigh: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
      volLow: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3z"/></svg>',
      volMute: '<svg viewBox="0 0 24 24"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/></svg>',
      fsEnter: '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
      fsExit: '<svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>',
      settings: '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.61l-1.92-3.32a.5.5 0 0 0-.59-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.59.22L2.78 8.87a.5.5 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.5.5 0 0 0-.12.61l1.92 3.32c.12.22.39.31.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.26.42.5.42h3.84c.24 0 .46-.18.5-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.5.5 0 0 0-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/></svg>',
      pip: '<svg viewBox="0 0 24 24"><path d="M19 7H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4v-2H5V9h14v6h-4v2h4a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-1 7h-6v-4h6v4z"/></svg>',
      fwd10: '<svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>',
      back10: '<svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" transform="scale(-1,1) translate(-24,0)"/></svg>',
      spinner: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="3"/><path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>'
    };
  
    const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  
    function fmt(t){
      if(!isFinite(t) || t < 0) t = 0;
      t = Math.floor(t);
      const h = Math.floor(t/3600);
      const m = Math.floor((t%3600)/60);
      const s = t%60;
      const pad = n => String(n).padStart(2,'0');
      return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
    }
  
    function el(tag, cls, html){
      const e = document.createElement(tag);
      if(cls) e.className = cls;
      if(html !== undefined) e.innerHTML = html;
      return e;
    }
  
    class VidPlayer{
      constructor(host){
        this.host = host;
        this.speed = 1;
        this.lastVolume = 1;
        this.hideTimer = null;
        this.build();
        this.bind();
      }
  
      build(){
        const host = this.host;
        const src = host.getAttribute('src') || '';
        const poster = host.getAttribute('poster') || '';
        const title = host.getAttribute('title') || '';
        const autoplay = host.hasAttribute('autoplay');
        const loop = host.hasAttribute('loop');
        const muted = host.hasAttribute('muted');
  
        host.innerHTML = '';
        host.removeAttribute('title');
  
        const wrap = el('div','vidp');
        wrap.tabIndex = 0;
  
        const video = el('video');
        video.src = src;
        if(poster) video.poster = poster;
        video.loop = loop;
        video.muted = muted;
        video.playsInline = true;
        video.preload = 'metadata';
  
        const hitlayer = el('div','hitlayer');
        const zLeft = el('div','zone'); const zMid = el('div','zone'); const zRight = el('div','zone');
        hitlayer.append(zLeft, zMid, zRight);
  
        const flashL = el('div','seek-flash left', `${ICONS.back10}<span>10s</span>`);
        const flashR = el('div','seek-flash right', `${ICONS.fwd10}<span>10s</span>`);
  
        const spinner = el('div','buffer-spin', ICONS.spinner);
        const centerBtn = el('div','center-btn', ICONS.play);
  
        const topBar = el('div','top-bar', `<div class="vt">${title}</div>`);
  
        const controls = el('div','controls');
  
        const seekWrap = el('div','seekbar-wrap');
        const track = el('div','seekbar-track');
        const buffered = el('div','seekbar-buffered');
        const played = el('div','seekbar-played');
        const thumb = el('div','seekbar-thumb');
        const tooltip = el('div','seek-tooltip','0:00');
        track.append(buffered, played, thumb);
        seekWrap.append(track, tooltip);
  
        const row = el('div','btn-row');
  
        const playBtn = el('button','ctrl-btn', ICONS.play);
        const back10 = el('button','ctrl-btn', ICONS.back10);
        const fwd10 = el('button','ctrl-btn', ICONS.fwd10);
  
        const volGroup = el('div','vol-group');
        const muteBtn = el('button','ctrl-btn', ICONS.volHigh);
        const volSliderWrap = el('div','vol-slider-wrap');
        const volSlider = document.createElement('input');
        volSlider.type = 'range'; volSlider.min = 0; volSlider.max = 100; volSlider.value = 100;
        volSlider.className = 'vol-slider';
        volSliderWrap.append(volSlider);
        volGroup.append(muteBtn, volSliderWrap);
  
        const timeDisplay = el('div','time-display', `<span class="cur">0:00</span><span class="sep">/</span><span class="dur">0:00</span>`);
  
        const spacer = el('div','spacer');
  
        const speedBtn = el('button','ctrl-btn', ICONS.settings);
        const pipBtn = el('button','ctrl-btn', ICONS.pip);
        const fsBtn = el('button','ctrl-btn', ICONS.fsEnter);
  
        const speedMenu = el('div','menu');
        speedMenu.append(el('div','menu-title','Velocidad'));
        const speedItems = {};
        SPEEDS.forEach(s=>{
          const item = el('div','menu-item'+(s===1?' active':''), `<span>${s===1?'Normal':s+'x'}</span><span class="chk">✓</span>`);
          item.dataset.speed = s;
          speedItems[s] = item;
          speedMenu.append(item);
        });
  
        row.append(playBtn, back10, fwd10, volGroup, timeDisplay, spacer, speedBtn, pipBtn, fsBtn);
        controls.append(seekWrap, row, speedMenu);
  
        wrap.append(video, hitlayer, flashL, flashR, spinner, centerBtn, topBar, controls);
        host.append(wrap);
  
        Object.assign(this, {
          wrap, video, hitlayer, zLeft, zMid, zRight, flashL, flashR, spinner, centerBtn,
          seekWrap, track, buffered, played, thumb, tooltip,
          playBtn, back10, fwd10, muteBtn, volSlider, volGroup,
          timeDisplay, speedBtn, speedMenu, speedItems, pipBtn, fsBtn
        });
  
        if(autoplay){ video.muted = true; video.play().catch(()=>{}); }
      }
  
      bind(){
        const v = this.video;
  
        v.addEventListener('loadedmetadata', ()=>{
          this.timeDisplay.querySelector('.dur').textContent = fmt(v.duration);
        });
        v.addEventListener('timeupdate', ()=> this.updateProgress());
        v.addEventListener('progress', ()=> this.updateBuffered());
        v.addEventListener('waiting', ()=> this.spinner.classList.add('show'));
        v.addEventListener('canplay', ()=> this.spinner.classList.remove('show'));
        v.addEventListener('play', ()=>{
          this.wrap.classList.add('is-playing');
          this.playBtn.innerHTML = ICONS.pause;
          this.flashCenter(ICONS.pause);
          this.scheduleHide();
        });
        v.addEventListener('pause', ()=>{
          this.wrap.classList.remove('is-playing');
          this.playBtn.innerHTML = ICONS.play;
          this.flashCenter(ICONS.play);
          this.showUI();
        });
        v.addEventListener('ended', ()=>{ this.showUI(); this.playBtn.innerHTML = ICONS.play; });
        v.addEventListener('volumechange', ()=> this.updateVolumeUI());
  
        let clickTimer = null;
        const singleOrDouble = (zone) => (e) => {
          if(clickTimer){
            clearTimeout(clickTimer); clickTimer = null;
            if(zone === 'left') this.seekBy(-10, 'left');
            else if(zone === 'right') this.seekBy(10, 'right');
            else this.togglePlay();
          } else {
            clickTimer = setTimeout(()=>{
              clickTimer = null;
              this.togglePlay();
            }, 220);
          }
        };
        this.zLeft.addEventListener('click', singleOrDouble('left'));
        this.zMid.addEventListener('click', singleOrDouble('mid'));
        this.zRight.addEventListener('click', singleOrDouble('right'));
  
        this.playBtn.addEventListener('click', ()=> this.togglePlay());
        this.back10.addEventListener('click', ()=> this.seekBy(-10,'left'));
        this.fwd10.addEventListener('click', ()=> this.seekBy(10,'right'));
  
        this.muteBtn.addEventListener('click', ()=>{
          v.muted = !v.muted;
          if(!v.muted && v.volume === 0){ v.volume = this.lastVolume || .5; }
        });
        this.volSlider.addEventListener('input', ()=>{
          v.volume = this.volSlider.value/100;
          v.muted = v.volume === 0;
        });
  
        let seeking = false;
        const seekFromEvent = (e)=>{
          const rect = this.track.getBoundingClientRect();
          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const pct = Math.min(1, Math.max(0, (clientX - rect.left)/rect.width));
          return pct;
        };
        const moveTooltip = (e)=>{
          const rect = this.track.getBoundingClientRect();
          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const pct = Math.min(1, Math.max(0, (clientX - rect.left)/rect.width));
          this.tooltip.style.left = (pct*100)+'%';
          this.tooltip.textContent = fmt(pct * (v.duration||0));
        };
        this.seekWrap.addEventListener('mousemove', moveTooltip);
        this.seekWrap.addEventListener('mousedown', (e)=>{
          seeking = true;
          v.pause_wasPlaying = !v.paused;
          v.pause();
          const pct = seekFromEvent(e);
          v.currentTime = pct * (v.duration||0);
          this.updateProgress();
        });
        window.addEventListener('mousemove', (e)=>{
          if(!seeking) return;
          const pct = seekFromEvent(e);
          v.currentTime = pct * (v.duration||0);
          this.updateProgress();
        });
        window.addEventListener('mouseup', ()=>{
          if(!seeking) return;
          seeking = false;
          if(v.pause_wasPlaying) v.play();
        });
  
        this.speedBtn.addEventListener('click', (e)=>{
          e.stopPropagation();
          this.speedMenu.classList.toggle('open');
        });
        Object.entries(this.speedItems).forEach(([s,item])=>{
          item.addEventListener('click', ()=>{
            v.playbackRate = parseFloat(s);
            Object.values(this.speedItems).forEach(i=>i.classList.remove('active'));
            item.classList.add('active');
            this.speedMenu.classList.remove('open');
          });
        });
        document.addEventListener('click', (e)=>{
          if(!this.speedMenu.contains(e.target) && e.target !== this.speedBtn){
            this.speedMenu.classList.remove('open');
          }
        });
  
        if(!document.pictureInPictureEnabled){
          this.pipBtn.style.display = 'none';
        } else {
          this.pipBtn.addEventListener('click', async ()=>{
            try{
              if(document.pictureInPictureElement) await document.exitPictureInPicture();
              else await v.requestPictureInPicture();
            }catch(err){}
          });
        }
  
        this.fsBtn.addEventListener('click', ()=>{
          if(document.fullscreenElement) document.exitFullscreen();
          else this.host.requestFullscreen();
        });
        document.addEventListener('fullscreenchange', ()=>{
          this.fsBtn.innerHTML = document.fullscreenElement ? ICONS.fsExit : ICONS.fsEnter;
        });
  
        this.wrap.addEventListener('mousemove', ()=> this.showUI());
        this.wrap.addEventListener('mouseleave', ()=>{ if(!v.paused) this.scheduleHide(); });
  
        this.wrap.addEventListener('keydown', (e)=>{
          const key = e.key.toLowerCase();
          if([' ','arrowleft','arrowright','arrowup','arrowdown','k','j','l','m','f'].includes(key) || /^[0-9]$/.test(key)){
            e.preventDefault();
          }
          if(key === ' ' || key === 'k') this.togglePlay();
          else if(key === 'arrowright') this.seekBy(5,'right');
          else if(key === 'arrowleft') this.seekBy(-5,'left');
          else if(key === 'l') this.seekBy(10,'right');
          else if(key === 'j') this.seekBy(-10,'left');
          else if(key === 'arrowup'){ v.volume = Math.min(1, v.volume+0.05); v.muted=false; }
          else if(key === 'arrowdown'){ v.volume = Math.max(0, v.volume-0.05); }
          else if(key === 'm') v.muted = !v.muted;
          else if(key === 'f') this.fsBtn.click();
          else if(/^[0-9]$/.test(key)) v.currentTime = (parseInt(key)/10) * (v.duration||0);
          this.showUI();
        });
      }
  
      togglePlay(){
        if(this.video.paused) this.video.play().catch(()=>{});
        else this.video.pause();
      }
  
      seekBy(sec, side){
        this.video.currentTime = Math.min(this.video.duration||1e9, Math.max(0, this.video.currentTime + sec));
        const flash = side === 'left' ? this.flashL : this.flashR;
        flash.classList.add('show');
        clearTimeout(flash._t);
        flash._t = setTimeout(()=> flash.classList.remove('show'), 420);
        this.showUI();
      }
  
      flashCenter(icon){
        this.centerBtn.innerHTML = icon;
        this.centerBtn.classList.add('show');
        clearTimeout(this.centerBtn._t);
        this.centerBtn._t = setTimeout(()=> this.centerBtn.classList.remove('show'), 500);
      }
  
      updateProgress(){
        const v = this.video;
        const pct = v.duration ? (v.currentTime/v.duration)*100 : 0;
        this.played.style.width = pct+'%';
        this.thumb.style.left = pct+'%';
        this.timeDisplay.querySelector('.cur').textContent = fmt(v.currentTime);
      }
  
      updateBuffered(){
        const v = this.video;
        if(v.buffered.length && v.duration){
          const end = v.buffered.end(v.buffered.length-1);
          this.buffered.style.width = Math.min(100,(end/v.duration)*100)+'%';
        }
      }
  
      updateVolumeUI(){
        const v = this.video;
        this.volSlider.value = v.muted ? 0 : v.volume*100;
        if(!v.muted && v.volume>0) this.lastVolume = v.volume;
        if(v.muted || v.volume===0) this.muteBtn.innerHTML = ICONS.volMute;
        else if(v.volume < .5) this.muteBtn.innerHTML = ICONS.volLow;
        else this.muteBtn.innerHTML = ICONS.volHigh;
      }
  
      showUI(){
        this.wrap.classList.add('show-ui');
        clearTimeout(this.hideTimer);
        if(!this.video.paused) this.scheduleHide();
      }
  
      scheduleHide(){
        clearTimeout(this.hideTimer);
        this.hideTimer = setTimeout(()=>{
          if(!this.video.paused && !this.speedMenu.classList.contains('open')){
            this.wrap.classList.remove('show-ui');
          }
        }, 2600);
      }
    }
  
    function enhanceAll(){
      document.querySelectorAll('vid:not([data-vid-ready])').forEach(node=>{
        node.setAttribute('data-vid-ready','');
        new VidPlayer(node);
      });
    }
  
    document.addEventListener('DOMContentLoaded', enhanceAll);
  })();