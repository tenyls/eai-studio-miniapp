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
  document.getElementById('analytics-result').textContent='Закрытые отчёты: @Test_EAi_POST_Support_bot → Статистика → Воронка и график. Здесь личные данные не загружаются. Для графиков внутри Mini App нужен защищённый HTTPS API: проверка Telegram-подписи и прав администратора уже подготовлена в серверном модуле проекта.';
});
