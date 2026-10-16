/* Public code only. No bot token, user database, API keys or sample statistics. */
'use strict';
const tg=window.Telegram?.WebApp;
tg?.ready();tg?.expand();
tg?.setHeaderColor?.('#101211');tg?.setBackgroundColor?.('#101211');
const notice=document.getElementById('notice');
let timer;
function inform(text){notice.textContent=text;notice.hidden=false;clearTimeout(timer);timer=setTimeout(()=>{notice.hidden=true;},6500);}
const actions=new Set(['new','prompts','stickers','tools','vpn','settings']);
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
  const action=button.dataset.action;if(!actions.has(action))return;
  // sendData works when opened from a reply-keyboard Web App button.
  if(tg?.initData || tg?.initDataUnsafe?.query_id || tg?.platform && tg.platform!=='unknown'){
    try{tg.sendData(JSON.stringify({action}));return;}catch(_){inform('Откройте Mini App кнопкой «Открыть EAi Studio» в тестовом боте.');}
  }else inform('Откройте @test_eai_post_editor_bot → Дополнительные инструменты → Mini App. Эта страница не получает доступ к вашему Telegram из браузера.');
}));
document.getElementById('analytics').addEventListener('click',()=>{
  document.getElementById('analytics-result').textContent='@Test_EAi_POST_Support_bot → Статистика → Воронка и график → сохраните audience-report.json → «Загрузить отчёт». Файл обрабатывается только на вашем устройстве и никуда не отправляется. Это снимок, не текущие живые показатели. Получение отчёта в Support доступно только администратору.';
});
const stageNames={started:'Запуск бота',subscribed:'Подписка подтверждена',section:'Выбор раздела',post_created:'Создание поста',published:'Публикация',vpn_offer:'Выбор VPN'};
const count=value=>Number.isSafeInteger(value)&&value>=0&&value<=1e10;
function reportValid(data){
  return data?.format==='eai-audience-1'&&typeof data.period==='string'&&typeof data.created==='string'&&
    Array.isArray(data.series)&&data.series.length<=3660&&data.series.every(r=>typeof r.day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(r.day)&&count(r.starts)&&count(r.active))&&
    Array.isArray(data.funnel)&&data.funnel.length<=6&&data.funnel.every(r=>Object.hasOwn(stageNames,r.stage)&&count(r.users)&&count(r.events))&&
    Array.isArray(data.referrals)&&data.referrals.length<=30&&data.referrals.every(r=>typeof r.source==='string'&&r.source.length<=128&&count(r.users));
}
function svgElement(name,attributes,text){const node=document.createElementNS('http://www.w3.org/2000/svg',name);for(const [key,value] of Object.entries(attributes))node.setAttribute(key,String(value));if(text!==undefined)node.textContent=text;return node;}
function renderReport(data){
  const chart=document.getElementById('chart');chart.replaceChildren();
  const series=data.series.slice(-90),maximum=Math.max(1,...series.map(r=>r.starts));
  chart.append(svgElement('line',{x1:35,y1:200,x2:625,y2:200,stroke:'#57624b'}));
  if(!series.length)chart.append(svgElement('text',{x:35,y:100,fill:'#bdc8b4','font-size':15},'За этот период нет запусков.'));
  for(let i=0;i<series.length;i++){
    const r=series[i],width=580/Math.max(1,series.length),height=155*r.starts/maximum;
    const rect=svgElement('rect',{x:40+i*width,y:200-height,width:Math.max(1,width-3),height:Math.max(1,height),fill:'#d6bf91',rx:2});
    rect.append(svgElement('title',{},`${r.day}: ${r.starts} запусков, ${r.active} активных`));chart.append(rect);
  }
  chart.append(svgElement('text',{x:35,y:25,fill:'#bdc8b4','font-size':13},`Максимум: ${maximum} /start в день · последние ${series.length} дней периода`));
  if(series.length){chart.append(svgElement('text',{x:35,y:227,fill:'#bdc8b4','font-size':12},series[0].day));chart.append(svgElement('text',{x:530,y:227,fill:'#bdc8b4','font-size':12},series.at(-1).day));}
  const funnel=document.getElementById('funnel');funnel.replaceChildren();const peak=Math.max(1,...data.funnel.map(r=>r.users));
  for(const r of data.funnel){const row=document.createElement('div');row.className='funnel-row';const label=document.createElement('span');label.textContent=stageNames[r.stage];const meter=document.createElement('meter');meter.min=0;meter.max=peak;meter.value=r.users;meter.setAttribute('aria-label',stageNames[r.stage]);const value=document.createElement('b');value.textContent=String(r.users);row.append(label,meter,value);funnel.append(row);}
  if(!data.funnel.length)funnel.textContent='Новых событий пока нет.';
  const sources=document.getElementById('sources');sources.replaceChildren();for(const r of data.referrals){const line=document.createElement('p');line.textContent=`${r.source}: ${r.users}`;sources.append(line);}
  document.getElementById('report').hidden=false;
  document.getElementById('analytics-result').textContent=`Снимок создан: ${data.created} · ${data.period}. История не обновляется автоматически; новые данные — новый отчёт из Support. Этапы могут проходить в разном порядке.`;
}
document.getElementById('report-file').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try{if(file.size>1024*1024)throw new Error();const data=JSON.parse(await file.text());if(!reportValid(data))throw new Error();renderReport(data);inform('Отчёт открыт на устройстве. Файл никуда не отправлен.');}
  catch(_){inform('Не удалось прочитать отчёт. Используйте audience-report.json из Support, до 1 МБ.');}
  finally{event.target.value='';}
});
