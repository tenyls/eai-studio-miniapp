'use strict';
const tg=window.Telegram?.WebApp;tg?.ready();tg?.expand();
if(tg?.isVersionAtLeast?.('6.1')){tg.setHeaderColor?.('#030b20');tg.setBackgroundColor?.('#030b20');}
const notice=document.getElementById('notice');let noticeTimer;
function inform(text){notice.textContent=text;notice.hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>{notice.hidden=true;},6500);}
const actions=new Set(['new','continue','drafts','clean','prompts','stickers','useful','settings','donate','suggest']);
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
 const action=button.dataset.action;if(!actions.has(action))return;
 if(tg?.platform&&tg.platform!=='unknown'){try{tg.sendData(JSON.stringify({action}));return;}catch(_){}}
 inform('Откройте @test_eai_post_editor_bot → Дополнительные инструменты → Mini App → «Открыть EAi Studio». Инструмент откроется в чате с ботом.');
}));
const starters=[
 ['Пост-знакомство','Я — [имя]. Помогаю [кому] получить [результат].\nЗдесь делюсь [три темы]. Начните с [первый шаг].\nА какая задача сейчас у вас?'],
 ['Находка недели','Сохраняю себе и делюсь с вами: [инструмент / приём].\nПригодится, если вы [ситуация].\nКак попробовать: 1) [шаг], 2) [шаг], 3) [результат].\nСсылка: [адрес].'],
 ['До / после','Было: [исходный материал].\nСделал: [что изменили — без преувеличений].\nСтало: [проверяемый результат].\nЧто помогло больше всего: [один вывод].'],
 ['PROMPT, который стоит сохранить','Задача: [что создаём].\nPROMPT: «Создай [объект] в стиле [стиль]. Контекст: [контекст]. Свет: [свет]. Детали: [детали]. Формат: [формат]».\nЗамените поля под свою идею.'],
 ['Три ошибки и решение','Три вещи, которые мешали мне в [тема]:\n1. [ошибка] → [что попробовать вместо].\n2. [ошибка] → [решение].\n3. [ошибка] → [решение].\nНачните с [самый простой шаг].'],
 ['Подборка без воды','[Число] находок для [задача]:\n• [название] — [зачем нужно] — [ссылка].\n• [название] — [зачем нужно] — [ссылка].\n• [название] — [зачем нужно] — [ссылка].\nСохраните, чтобы не искать снова.'],
 ['История с выводом','Вчера я [ситуация]. Ожидал [ожидание], а получилось [факт].\nПопробовал [действие] — заметил [результат].\nМой вывод: [мысль, полезная читателю].\nБыло у вас похожее?']
];
async function copyText(text){try{await navigator.clipboard.writeText(text);inform('Скопировано. Добавьте свои детали и отправьте в бот.');}catch(_){inform('Выделите текст и скопируйте средствами Telegram.');}}
const box=document.getElementById('starters');
for(const [index,[title,text]] of starters.entries()){
 const card=document.createElement('article');card.className='starter';const heading=document.createElement('h3');heading.textContent=`0${index+1} · ${title}`;const content=document.createElement('p');content.textContent=text;const copy=document.createElement('button');copy.textContent='Скопировать заготовку';copy.addEventListener('click',()=>copyText(text));card.append(heading,content,copy);box.append(card);
}
function openStarters(){box.hidden=!box.hidden;if(!box.hidden)box.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
document.getElementById('open-starters').addEventListener('click',openStarters);document.getElementById('show-starters').addEventListener('click',openStarters);
document.getElementById('share-studio').addEventListener('click',()=>{
 const url='https://t.me/test_eai_post_editor_bot?start=studio_share';const text='Из «сохраню на потом» — в готовый пост. EAi Post Studio: редактор, PROMPT и стикеры прямо в Telegram.';
 if(tg?.platform&&tg.platform!=='unknown')tg.openTelegramLink('https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(text));else copyText(text+'\n'+url);
});
