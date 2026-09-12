(() => {
  const body = document.body;
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  menuBtn?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  }));

  // Reveal + direction-aware shuffle
  const observed = [...document.querySelectorAll('.reveal-card,.reveal-in,.skill-card,.project-card,.info-card,.contact-card')];
  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('in-view');
    });
  },{threshold:0.14});
  observed.forEach(el=>io.observe(el));

  function rand(min,max){return Math.round(Math.random()*(max-min)+min)}
  function prepShuffle(node){
    node.style.setProperty('--tx', `${rand(-150,150)}px`);
    node.style.setProperty('--ty', `${rand(-100,100)}px`);
    node.style.setProperty('--rx', `${rand(-16,16)}deg`);
    node.style.setProperty('--ry', `${rand(-16,16)}deg`);
    node.style.setProperty('--rz', `${rand(-10,10)}deg`);
  }
  let lastY=window.scrollY;
  let direction='down';
  let ticking=false;
  const animatedGroups = [
    document.querySelectorAll('.skill-card'),
    document.querySelectorAll('.project-card'),
    document.querySelectorAll('.info-card,.contact-card')
  ];
  function runShuffle(){
    if(direction==='down'){
      animatedGroups.forEach(group=>group.forEach((el,i)=>{prepShuffle(el); el.classList.remove('shuffle-out'); void el.offsetWidth; el.style.animationDelay=`${(i%5)*70}ms`; el.classList.add('shuffle-active')}));
    } else {
      animatedGroups.forEach(group=>group.forEach((el,i)=>{prepShuffle(el); el.classList.remove('shuffle-active'); void el.offsetWidth; el.style.animationDelay=`${(i%4)*40}ms`; el.classList.add('shuffle-out')}));
      setTimeout(()=>animatedGroups.forEach(group=>group.forEach(el=>{el.classList.remove('shuffle-out');el.style.animationDelay=''})),560);
    }
  }
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    direction=y>lastY?'down':'up';
    body.classList.toggle('scroll-up',direction==='up');
    lastY=y;
    if(!ticking){
      window.requestAnimationFrame(()=>{ticking=false;});
      ticking=true;
    }
  },{passive:true});
  let shuffleTimer;
  const sections = [...document.querySelectorAll('.skills-section,.projects-section,.bottom-grid')];
  const sectionIO=new IntersectionObserver(entries=>{
    const entering=entries.some(e=>e.isIntersecting);
    if(entering){
      clearTimeout(shuffleTimer);
      shuffleTimer=setTimeout(runShuffle,80);
    }
  },{threshold:.2});
  sections.forEach(s=>sectionIO.observe(s));

  // Gentle 3D tilt
  document.querySelectorAll('.tilt-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${(-y*7).toFixed(2)}deg) rotateY(${(x*8).toFixed(2)}deg) translateY(-5px)`;
    });
    card.addEventListener('pointerleave',()=>{card.style.transform=''});
  });

  // Smoothly adjust nav active state.
  const sectionsNav=[...document.querySelectorAll('main section[id]')];
  const navIO=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        navLinks?.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${entry.target.id}`));
      }
    });
  },{rootMargin:'-35% 0px -55% 0px',threshold:0});
  sectionsNav.forEach(s=>navIO.observe(s));
})();
