// Данные приютов. Адреса предоставлены командой; координаты пока приблизительные и требуют проверки.
const shelters=[
{id:'zoorassvet',name:'Зоорассвет',address:'Рассветная аллея, 10, Москва',coords:[55.75,37.62],type:'municipal',animals:['dogs','cats'],days:'вт–чт, сб–вс',hours:'13:00–17:00',help:['donate','walks','guardian','photo','transport','care'],helpText:'донат · прогулки · опекунство · съёмка · транспорт · уход',needs:'Пелёнки, консервы для щенков, ветошь.',phone:'8 (909) 918-59-23',links:[['Telegram','https://t.me/zoorassvet'],['ВКонтакте','https://vk.com/priyut_zoorassvet']],color:'#7A88FE'},
{id:'dubovaya',name:'Дубовая роща',address:'Проспект Дубовой Рощи, вл. 23–25, Москва',coords:[55.82,37.62],type:'municipal',animals:['dogs'],days:'пн, ср, пт–вс',hours:'10:00–19:00',help:['donate','walks','guardian','photo','transport','care'],helpText:'донат · прогулки · опекунство · съёмка · транспорт · уход',needs:'Список необходимых вещей лучше уточнить у приюта.',phone:'gavgavsobachka@bk.ru',links:[['Сайт','https://priyut-ostankino.ru'],['Telegram','https://t.me/dubovaia_roscha']],color:'#7A88FE'},
{id:'pushistyi',name:'Пушистый друг',address:'Поселение Краснопахорское, Москва',coords:[55.43,37.19],type:'municipal',animals:['dogs','cats'],days:'вт, ср, пт–вс',hours:'09:00–18:00',help:['donate','walks','guardian','photo','care'],helpText:'донат · прогулки · опекунство · съёмка · уход',needs:'Корма: ПетПрайд, Стардог, АльфаПет (для чувствительного пищеварения), Авард, Авва, ПроПлан, Роял Канин, Сириус; лекарства Фенпраз Форте; средства от блох Дана и Барс.',phone:'+7 980-200-56-09',links:[['Telegram','https://t.me/push_drug'],['ВКонтакте','https://vk.ru/push_drug'],['MAX','https://max.ru/channel_push_drug']],color:'#7A88FE'},
{id:'yuna',name:'Юна',address:'Подольск, д. Кутьино, 64',coords:[55.39,37.55],type:'private',animals:['dogs','cats'],days:'ежедневно',hours:'10:00–22:00',help:['donate','walks','guardian','photo','transport','care','education'],helpText:'донат · прогулки · опекунство · съёмка · транспорт · уход · обучение',needs:'Миски из нержавеющей стали (непроливайки 0,5 и 1 л), автогамаки, контейнеры с крышкой на 10 л, стерильные марлевые салфетки 16×14 и 45×29.',phone:'Контакты — в соцсетях приюта',links:[['ВКонтакте','https://vk.com/yunacenter'],['Telegram','https://t.me/yuna_center']],color:'#f2a35b'},
{id:'domik',name:'Домик мелкашей',address:'Балашиха, мкр. Кучино, ул. Юннатов, 2Б',coords:[55.75,37.94],type:'private',animals:['dogs'],days:'ежедневно',hours:'09:00–21:00',help:['donate','walks','photo','transport','care','repair'],helpText:'донат · прогулки · съёмка · транспорт · уход · ремонт',needs:'Список необходимых вещей лучше уточнить у приюта.',phone:'+7 (925) 155-35-35 · domik3535@yandex.ru',links:[['Telegram','https://t.me/domik_melkashei'],['ВКонтакте','https://vk.ru/domik_melkashei']],color:'#f2a35b'},
{id:'nekrasovka',name:'Некрасовка',address:'2-я Вольская ул., 17, стр. 3, Москва',coords:[55.68,37.91],type:'municipal',animals:['dogs','cats'],days:'уточнить',hours:'уточнить',help:['donate','walks','photo'],helpText:'донат · прогулки · съёмка',needs:'Сухой и лечебный корм для собак и кошек, брезентовые поводки 3 и 5 м, древесный наполнитель для кошек.',phone:'+7 (967) 176-61-36',links:[['ВКонтакте','https://vk.com/sobakinekrasovka'],['Telegram','https://t.me/budni_lohmatogo_priuta'],['MAX','https://max.ru/join/S_wZGV1q944tpSCo92k_rBBd3g4UH6exxTezkwJjoxs']],color:'#7A88FE'}
];
const helpNames={donate:'донат',walks:'прогулки',guardian:'опекунство',photo:'съёмка',transport:'транспорт',care:'уход',education:'обучение',repair:'ремонт'};
const popup=s=>`<div class="shelter-popup"><h3>${s.name}</h3><p>📍 ${s.address}</p><p>🕒 ${s.days}, ${s.hours}</p><p class="popup-tags">🐾 ${s.animals.map(a=>a==='dogs'?'собаки':'кошки').join(' и ')}</p><p><b>Помощь:</b> ${s.helpText}</p><p><b>Нужно:</b> ${s.needs}</p><p><b>Контакты:</b> ${s.phone}</p><p>${s.links.map(x=>`<a href="${x[1]}" target="_blank" rel="noopener">${x[0]}</a>`).join(' · ')}</p></div>`;
let activeHelp='all',activeAnimal='all',activeType='all',mapMode='leaflet',leafletMap=null,ymap=null,markers={};
function filtered(){return shelters.filter(s=>(activeHelp==='all'||s.help.includes(activeHelp))&&(activeAnimal==='all'||s.animals.includes(activeAnimal))&&(activeType==='all'||s.type===activeType))}
function renderStatus(){document.getElementById('map-status').textContent=`На карте отмечено ${filtered().length} ${filtered().length===1?'приют':filtered().length<5?'приюта':'приютов'}`}
function pawIcon(type){const color=type==='municipal'?'#6D8FE8':'#F29A52';const svg=`<svg viewBox="0 0 48 48" width="42" height="42" aria-hidden="true"><g fill="${color}" stroke="#fff" stroke-width="1.8"><ellipse cx="12" cy="13" rx="5.3" ry="7" transform="rotate(-25 12 13)"/><ellipse cx="23" cy="9" rx="5.3" ry="7" transform="rotate(-7 23 9)"/><ellipse cx="34" cy="13" rx="5.3" ry="7" transform="rotate(25 34 13)"/><ellipse cx="39" cy="24" rx="4.7" ry="6.3" transform="rotate(48 39 24)"/><path d="M24 20 C17 20 10 28 12 35 C14 42 20 39 24 37 C28 39 34 42 36 35 C38 28 31 20 24 20Z"/></g></svg>`;return L.divIcon({className:'',html:`<div class="paw-marker">${svg}</div>`,iconSize:[44,44],iconAnchor:[22,22]})}
function initLeaflet(){mapMode='leaflet';const el=document.getElementById('shelter-map');el.innerHTML='';leafletMap=L.map(el,{scrollWheelZoom:false}).setView([55.72,37.55],8);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors'}).addTo(leafletMap);shelters.forEach(s=>{const m=L.marker(s.coords,{icon:pawIcon(s.type)});m.bindPopup(popup(s),{maxWidth:290});m.on('mouseover',()=>m.openPopup());m.addTo(leafletMap);markers[s.id]=m});applyMapFilters()}
function initYandex(){if(!window.ymaps||!window.YANDEX_MAPS_API_KEY||window.YANDEX_MAPS_API_KEY==='YOUR_YANDEX_MAPS_API_KEY')return false;ymaps.ready(()=>{mapMode='yandex';const el=document.getElementById('shelter-map');el.innerHTML='';ymap=new ymaps.Map(el,{center:[55.72,37.55],zoom:8,controls:['zoomControl']});shelters.forEach(s=>{const placemark=new ymaps.Placemark(s.coords,{hintContent:s.name,balloonContent:popup(s)},{preset:'islands#circleIcon',iconColor:s.type==='municipal'?'#6D8FE8':'#F29A52'});placemark.events.add('mouseenter',()=>placemark.balloon.open());ymap.geoObjects.add(placemark);markers[s.id]=placemark});applyMapFilters()});return true}
function applyMapFilters(){const visible=filtered(),ids=new Set(visible.map(s=>s.id));if(mapMode==='leaflet'){shelters.forEach(s=>{const m=markers[s.id];if(!m)return;if(ids.has(s.id)){if(!leafletMap.hasLayer(m))m.addTo(leafletMap)}else leafletMap.removeLayer(m)})}else if(ymap){ymap.geoObjects.removeAll();visible.forEach(s=>ymap.geoObjects.add(markers[s.id]))}renderStatus()}
document.querySelectorAll('[data-help]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-help]').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeHelp=b.dataset.help;applyMapFilters()}));
document.getElementById('animal-filter').addEventListener('change',e=>{activeAnimal=e.target.value;applyMapFilters()});
document.getElementById('shelter-filter').addEventListener('change',e=>{activeType=e.target.value;applyMapFilters()});
document.getElementById('reset-filters').addEventListener('click',()=>{activeHelp=activeAnimal=activeType='all';document.querySelectorAll('[data-help]').forEach(x=>x.classList.toggle('active',x.dataset.help==='all'));document.getElementById('animal-filter').value='all';document.getElementById('shelter-filter').value='all';applyMapFilters()});
if(!initYandex())initLeaflet();

// Calendar: selected dates are demo announcements and can be edited in this object.
const trips={'2026-11-30':{title:'Наш ближайший выезд 🐾',text:'Собираемся вместе, чтобы провести время с хвостиками, помочь с прогулками и заботой о приюте.',time:'Уточняется',place:'Приют объявим в наших соцсетях',bring:'Удобную одежду, закрытую обувь и хорошее настроение'},'2026-12-15':{title:'Декабрьская встреча с хвостиками ✨',text:'Продолжаем нашу добрую традицию: знакомимся с животными, гуляем и помогаем приюту с повседневными делами.',time:'Уточняется',place:'Подробности скоро в соцсетях',bring:'Удобную одежду, закрытую обувь и хорошее настроение'}};
let calYear=2026,calMonth=10,selectedDate='2026-11-30';
const monthNames=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
function dateKey(y,m,d){return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
function renderCalendar(){document.getElementById('calendar-month').textContent=`${monthNames[calMonth]} ${calYear}`;const grid=document.getElementById('calendar-grid');grid.innerHTML='';['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(n=>{const e=document.createElement('div');e.className='calendar-dayname';e.textContent=n;grid.append(e)});const first=new Date(calYear,calMonth,1),offset=(first.getDay()+6)%7,days=new Date(calYear,calMonth+1,0).getDate();for(let i=0;i<offset;i++){const e=document.createElement('div');e.className='calendar-day muted-day';grid.append(e)}for(let d=1;d<=days;d++){const key=dateKey(calYear,calMonth,d),b=document.createElement('button');const today=new Date();const isToday=key===dateKey(today.getFullYear(),today.getMonth(),today.getDate());b.className='calendar-day'+(trips[key]?' event':'')+(isToday?' today':'')+(selectedDate===key?' selected':'');b.textContent=d;b.addEventListener('click',()=>{selectedDate=key;renderCalendar();renderTrip(key)});grid.append(b)}}
function renderTrip(key){const t=trips[key],parts=key.split('-'),d=new Date(+parts[0],+parts[1]-1,+parts[2]);const info=document.getElementById('trip-info');if(!t){info.innerHTML=`<div class="trip-date">${d.getDate()} ${monthNames[d.getMonth()].toUpperCase()} · ${['ВОСКРЕСЕНЬЕ','ПОНЕДЕЛЬНИК','ВТОРНИК','СРЕДА','ЧЕТВЕРГ','ПЯТНИЦА','СУББОТА'][d.getDay()]}</div><h3>Пока без анонсов ♡</h3><p>На эту дату поездка ещё не запланирована. Заглядывай в календарь чуть позже — мы обязательно поделимся новостями!</p><a class="btn btn-primary" href="https://t.me/" target="_blank" rel="noopener">следить за анонсами ↗</a>`;return}info.innerHTML=`<div class="trip-date">${d.getDate()} ${monthNames[d.getMonth()].toUpperCase()} · ${['ВОСКРЕСЕНЬЕ','ПОНЕДЕЛЬНИК','ВТОРНИК','СРЕДА','ЧЕТВЕРГ','ПЯТНИЦА','СУББОТА'][d.getDay()]}</div><h3>${t.title}</h3><p>${t.text}</p><div class="trip-detail"><span>🕒</span><span><b>Время:</b> ${t.time}</span></div><div class="trip-detail"><span>📍</span><span><b>Место:</b> ${t.place}</span></div><div class="trip-detail"><span>💌</span><span><b>Что взять:</b> ${t.bring}</span></div><a class="btn btn-primary" href="https://t.me/" target="_blank" rel="noopener">следить за анонсами ↗</a>`}
document.getElementById('prev-month').addEventListener('click',()=>{calMonth--;if(calMonth<0){calMonth=11;calYear--}renderCalendar()});document.getElementById('next-month').addEventListener('click',()=>{calMonth++;if(calMonth>11){calMonth=0;calYear++}renderCalendar()});renderCalendar();renderTrip(selectedDate);

// Pet character interactions.
const pets={rex:{title:'Привет, я Рекс!',text:'Я очень люблю гулять, а после прогулки всегда рад вкусному корму. Составишь мне компанию?'},mila:{title:'Привет, я Мила!',text:'Мне нравится спокойное общение и ласковые слова. Давай познакомимся без спешки?'},dach:{title:'Гав-гав, я Бублик!',text:'Я такса с большим сердцем и короткими лапками. Обожаю исследовать всё вокруг!'},black:{title:'Здравствуй, я Граф!',text:'Я серьёзный на вид, но очень ценю доброту и уважение к личному пространству.'},cat:{title:'Мяу, я Плюша!',text:'Я любопытная кошечка. Люблю наблюдать за всем с уютного места и знакомиться в своём темпе.'},kit:{title:'Привет, я Пончик!',text:'Я маленький исследователь! Мне нравятся игрушки, забота и вкусные кошачьи угощения.'}};
document.querySelectorAll('[data-pet]').forEach(b=>{
  const p=pets[b.dataset.pet];
  if(!p)return;
  const bubble=document.createElement('span');
  bubble.className='pet-bubble';
  bubble.innerHTML=`<span class="speech-label">говорит хвостик</span><strong>${p.title}</strong><span class="pet-bubble-text">${p.text}</span>`;
  b.appendChild(bubble);
  const show=()=>{
    document.querySelectorAll('[data-pet]').forEach(x=>{
      x.classList.remove('selected','bubble-visible');
    });
    b.classList.add('selected','bubble-visible');
  };
  const hide=()=>{
    if(!b.matches(':focus'))b.classList.remove('bubble-visible');
  };
  b.addEventListener('mouseenter',show);
  b.addEventListener('mouseleave',hide);
  b.addEventListener('focus',show);
  b.addEventListener('blur',()=>b.classList.remove('bubble-visible'));
  b.addEventListener('click',()=>{
    if(window.matchMedia('(hover: none)').matches){
      const wasVisible=b.classList.contains('bubble-visible');
      document.querySelectorAll('[data-pet]').forEach(x=>x.classList.remove('selected','bubble-visible'));
      if(!wasVisible)show();
    }else show();
  });
});

// About section photo carousel — all images already present in the repository.
const aboutPhotos=[
  {src:'пупся1.jpg',alt:'Коллаж с нашими хвостатыми друзьями'},
  {src:'коти1.jpg',alt:'Мася — хвостатая подруга команды'},
  {src:'пупся2.jpg',alt:'Рекс — один из наших хвостатых героев'},
  {src:'котя2.jpg',alt:'Собака из ленты Лапок Вышки'},
  {src:'коти3.jpg',alt:'Рекс — один из наших хвостатых героев'}
];
let aboutPhotoIndex=0;
const aboutImage=document.getElementById('about-gallery-image');
const aboutDots=document.getElementById('about-gallery-dots');
function showAboutPhoto(index){
  aboutPhotoIndex=(index+aboutPhotos.length)%aboutPhotos.length;
  const photo=aboutPhotos[aboutPhotoIndex];
  aboutImage.src=photo.src;aboutImage.alt=photo.alt;
  aboutDots.querySelectorAll('button').forEach((dot,i)=>dot.classList.toggle('active',i===aboutPhotoIndex));
}
aboutPhotos.forEach((photo,i)=>{
  const dot=document.createElement('button');dot.type='button';dot.className='gallery-dot';
  dot.setAttribute('aria-label',`Показать фото ${i+1}`);
  dot.addEventListener('click',()=>showAboutPhoto(i));aboutDots.append(dot);
});
document.querySelector('.gallery-prev').addEventListener('click',()=>showAboutPhoto(aboutPhotoIndex-1));
document.querySelector('.gallery-next').addEventListener('click',()=>showAboutPhoto(aboutPhotoIndex+1));
showAboutPhoto(0);

// Educational article modals.
const articles={ster:['Стерилизация: почему это важно?','<p>В приютах живут животные, которым особенно нужна забота. Стерилизация — один из способов ответственного отношения к домашним питомцам и профилактики появления нежелательного потомства.</p><h3>Что важно знать?</h3><p>Решение о процедуре, подходящем возрасте и подготовке принимает ветеринарный врач с учётом здоровья и особенностей конкретного животного. Не стоит давать питомцу лекарства или пытаться подготовить его самостоятельно.</p><p>Стерилизация не заменяет заботу: животному по-прежнему нужны безопасная среда, питание, движение и регулярные осмотры.</p>'],first:['Первый поход в приют: что взять с собой?','<p>Первый визит может немного волновать — это нормально! Главное правило: следуй инструкциям сотрудников и не торопи знакомство с животными.</p><h3>Небольшой чек-лист</h3><p>Надень удобную одежду, которую не жалко испачкать, и закрытую обувь. Возьми воду, заряженный телефон и хорошее настроение. Перчатки или другие вещи бери только по согласованию с приютом.</p><p>Не корми животных принесёнными лакомствами без разрешения: у каждого может быть свой рацион.</p>'],body:['Как понять, что животному комфортно?','<p>Животные общаются не только звуками. Положение тела, ушей и хвоста, взгляд и желание приблизиться или отойти могут многое рассказать.</p><h3>Главное — уважать границы</h3><p>Не нависай над животным, не хватай его и не заставляй общаться. Дай возможность самому подойти и всегда спрашивай сотрудника приюта, как правильно познакомиться.</p><p>Если животное отходит или выглядит напряжённым, лучше дать ему пространство. Спокойствие и терпение — тоже забота.</p>'],help:['Помощь приюту: не только прогулки','<p>Не каждый волонтёр может часто приезжать в приют — и это совершенно нормально. Помощь бывает очень разной!</p><h3>Как ещё можно поддержать?</h3><p>Приютам могут быть нужны транспорт, фото и видео для пристройства, помощь с уборкой и ремонтом, информационная поддержка, регулярные пожертвования или конкретные вещи из списка нужд.</p><p>Перед покупкой обязательно уточни актуальные потребности: так помощь точно окажется полезной.</p>']};
const modal=document.getElementById('article-modal');document.querySelectorAll('[data-article]').forEach(b=>b.addEventListener('click',()=>{const a=articles[b.dataset.article];document.getElementById('modal-title').textContent=a[0];document.getElementById('modal-body').innerHTML=a[1];modal.classList.add('open');modal.setAttribute('aria-hidden','false')}));document.querySelector('.modal-close').addEventListener('click',()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')});modal.addEventListener('click',e=>{if(e.target===modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}});

// Gentle paw cursor trail.
let lastPaw=0;const cursor=document.getElementById('paw-cursor');document.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.style.opacity='.28';const now=Date.now();if(now-lastPaw>230){lastPaw=now;const p=document.createElement('span');p.textContent='🐾';p.style.cssText=`position:fixed;left:${e.clientX+5}px;top:${e.clientY+4}px;z-index:9998;pointer-events:none;font-size:16px;opacity:.25;transform:rotate(${Math.random()*35-17}deg);transition:opacity 2.8s,transform 2.8s`;document.body.appendChild(p);setTimeout(()=>{p.style.opacity='0';p.style.transform+=' translateY(-8px)'},30);setTimeout(()=>p.remove(),3000)}});document.addEventListener('mouseleave',()=>cursor.style.opacity='0');
const menu=document.querySelector('.menu-toggle');menu.addEventListener('click',()=>document.querySelector('.main-nav').classList.toggle('open'));document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.main-nav').classList.remove('open')));
