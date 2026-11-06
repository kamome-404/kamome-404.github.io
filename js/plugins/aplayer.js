(function() {
  console.log('=== APlayer script started ===');
  console.log('theme.plugins.aplayer:', typeof theme !== 'undefined' && theme.plugins && theme.plugins.aplayer);
  
  function normalizePath(p) {
    if (!p) return p;
    if (/^(https?:)?\/\//.test(p)) return p; // remote URL
    p = p.trim();
    if (p.startsWith('/source/')) p = p.replace(/^\/source/, '');
    if (p.startsWith('source/')) p = '/' + p.replace(/^source\//, '');
    if (!p.startsWith('/')) p = '/' + p;
    try {
      if (typeof config !== 'undefined' && config.root && config.root !== '/') {
        const root = config.root.replace(/\/$/, '');
        if (!p.startsWith(root + '/')) p = root + p;
      }
    } catch (e) {}
    return p;
  }

  const audioList = [];
  const isFixed = theme.plugins.aplayer.type === "fixed";
  const isMini = theme.plugins.aplayer.type === "mini";
  
  console.log('APlayer mode:', isFixed ? 'fixed' : (isMini ? 'mini' : 'unknown'));

  for (const audio of theme.plugins.aplayer.audios) {
    const audioObj = {
      name: audio.name,
      artist: audio.artist,
      url: normalizePath(audio.url),
      cover: normalizePath(audio.cover),
      theme: audio.theme,
    };
    // 只有在 lrc 存在且不为空时才添加
    if (audio.lrc) {
      audioObj.lrc = audio.lrc;
    }
    audioList.push(audioObj);
  }

  // For verification: print final audioList so you can inspect URLs in browser console
  try {
    console.log("APlayer audioList:", audioList);
  } catch (e) {}

  if (isMini) {
    window.aplayer = new APlayer({
      container: document.getElementById("aplayer"),
      mini: true,
      audio: audioList,
    });
  } else if (isFixed) {
    console.log('Creating APlayer in fixed mode with', audioList.length, 'tracks');
    console.log('Container element:', document.getElementById("aplayer"));
    
    try {
      window.aplayer = new APlayer({
        container: document.getElementById("aplayer"),
        fixed: true,
        lrcType: 3,
        audio: audioList,
      });
      
      // 确保APlayer完全初始化后再继续
      console.log('APlayer instance created successfully');
      console.log('APlayer type:', typeof window.aplayer);
      console.log('APlayer is null?', window.aplayer === null);
      console.log('APlayer is undefined?', window.aplayer === undefined);
      console.log('APlayer constructor:', window.aplayer ? window.aplayer.constructor.name : 'N/A');
      
      // 尝试获取原型方法
      if (window.aplayer) {
        try {
          const proto = Object.getPrototypeOf(window.aplayer);
          console.log('APlayer prototype:', proto);
          console.log('APlayer prototype methods:', Object.getOwnPropertyNames(proto));
        } catch (e) {
          console.error('Error getting prototype:', e);
        }
      }
      
      console.log('APlayer.list:', window.aplayer ? window.aplayer.list : 'N/A');
      console.log('APlayer.play:', window.aplayer ? typeof window.aplayer.play : 'N/A');
      
      const lrcBtn = document.querySelector(".aplayer-icon-lrc");
      if (lrcBtn) lrcBtn.click();
    } catch (error) {
      console.error('=== ERROR creating APlayer ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('APlayer constructor exists?', typeof APlayer);
    }
  }
  
  // 标记APlayer已经准备好
  if (window.aplayer) {
    window.aplayerReady = true;
    console.log('=== APlayer is ready ===');
  } else {
    console.error('=== APlayer initialization FAILED ===');
  }
})();