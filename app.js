'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CATS={realestate:'عقارات',business:'تجاري',work:'عمل',services:'خدمات',personal:'شخصي'};
const SIG='التوقيعات',DOTS='…………';
/* قوالب: f=حقول البيانات الأساسية، c=البنود الثابتة [العنوان، النص، النوع] */
const T={
lease:{f:[['lessor','اسم المؤجر'],['lessorId','الرقم القومي للمؤجر'],['tenant','اسم المستأجر'],['tenantId','الرقم القومي للمستأجر'],['address','عنوان الوحدة'],['rent','الأجرة الشهرية (جنيه)'],['duration','مدة العقد'],['start','تاريخ البداية'],['deposit','مبلغ التأمين (جنيه)']],
 laws:['م 558: تعريف الإيجار','م 564 و567 و571: التزامات المؤجر','م 579 و583: التزامات المستأجر','م 590 و598: رد العين وانتهاء المدة'],
 c:[['أطراف العقد','حُرر هذا العقد في {{date}} بين السيد/ {{lessor}} (رقم قومي {{lessorId}}) ويُسمى «المؤجر»، والسيد/ {{tenant}} (رقم قومي {{tenantId}}) ويُسمى «المستأجر».','أساسي'],
 ['موضوع الإيجار','أجّر المؤجر للمستأجر الوحدة الكائنة بـ {{address}}، وقد عاينها المستأجر المعاينة التامة النافية للجهالة.','أساسي'],
 ['الغرض من الاستخدام','خُصصت العين للسكن فقط، ولا يجوز تغيير الغرض إلا بموافقة كتابية من المؤجر.','أساسي'],
 ['مدة العقد','مدة هذا العقد {{duration}} تبدأ من {{start}}، وتنتهي بانتهائها دون حاجة إلى تنبيه.','أساسي'],
 ['الأجرة وطريقة السداد','الأجرة الشهرية {{rent}} جنيهًا، تُسدد مقدمًا في أول كل شهر.','أساسي'],
 ['مبلغ التأمين','سدد المستأجر مبلغ {{deposit}} جنيهًا تأمينًا، يُرد عند التسليم بعد خصم ما يثبت من تلفيات.','اختياري'],
 ['التزامات المؤجر','يلتزم المؤجر بتسليم العين صالحة للانتفاع، والقيام بالصيانة الجوهرية، وعدم التعرض للمستأجر في انتفاعه.','أساسي'],
 ['التزامات المستأجر','يلتزم المستأجر بالمحافظة على العين واستعمالها فيما أُجرت له، وسداد استهلاك المرافق، وعدم التأجير من الباطن إلا بإذن كتابي.','أساسي'],
 ['التسليم عند الانتهاء','يرد المستأجر العين عند انتهاء العقد بالحالة التي تسلمها بها، فيما عدا الاستهلاك العادي.','أساسي'],
 ['أحكام عامة','حُرر هذا العقد من نسختين، بيد كل طرف نسخة للعمل بموجبها.','إضافي'],[SIG,'','أساسي']]},
sale:{f:[['seller','اسم البائع'],['sellerId','الرقم القومي للبائع'],['buyer','اسم المشتري'],['buyerId','الرقم القومي للمشتري'],['item','وصف المبيع'],['price','الثمن الإجمالي (جنيه)'],['paid','المدفوع عند التوقيع (جنيه)'],['delivery','موعد التسليم']],
 laws:['م 418: تعريف البيع','م 419: العلم الكافي بالمبيع','م 428: التزام البائع بنقل الحق','م 430: تأجيل نقل الملكية'],
 c:[['أطراف العقد','حُرر هذا العقد في {{date}} بين السيد/ {{seller}} (رقم قومي {{sellerId}}) ويُسمى «البائع»، والسيد/ {{buyer}} (رقم قومي {{buyerId}}) ويُسمى «المشتري».','أساسي'],
 ['المبيع','باع البائع للمشتري: {{item}}، وقد عاينه المشتري المعاينة التامة النافية للجهالة.','أساسي'],
 ['الثمن','اتفق الطرفان على ثمن إجمالي قدره {{price}} جنيهًا.','أساسي'],
 ['طريقة السداد','سدد المشتري عند التوقيع {{paid}} جنيهًا، ويُسدد الباقي وفق ما يتفق عليه الطرفان كتابةً.','أساسي'],
 ['التسليم','يسلم البائع المبيع في {{delivery}} خاليًا من أي حقوق للغير.','أساسي'],
 ['ضمان البائع','يضمن البائع عدم التعرض للمشتري، ويلتزم باتخاذ ما يلزم لنقل الحق المبيع إليه.','أساسي'],
 ['الشرط الجزائي','إذا أخل أحد الطرفين بالتزامه، جاز للطرف الآخر المطالبة بالتعويض المتفق عليه بينهما كتابةً.','اختياري'],
 ['نقل الملكية','يتعهد الطرفان باتخاذ إجراءات التسجيل اللازمة لنقل الملكية في حال كان المبيع عقارًا.','إضافي'],[SIG,'','أساسي']]},
work:{f:[['employer','اسم صاحب العمل'],['worker','اسم العامل'],['workerId','الرقم القومي للعامل'],['job','الوظيفة'],['salary','الأجر الشهري (جنيه)'],['duration','مدة العقد'],['start','تاريخ البدء']],
 laws:['قانون العمل رقم 14 لسنة 2025 (بدأ العمل به في 1 سبتمبر 2025)','قانون التأمينات الاجتماعية والمعاشات'],
 c:[['أطراف العقد','حُرر هذا العقد في {{date}} بين {{employer}} ويُسمى «صاحب العمل»، والسيد/ {{worker}} (رقم قومي {{workerId}}) ويُسمى «العامل».','أساسي'],
 ['الوظيفة والمهام','عُيّن العامل بوظيفة {{job}}، ويؤدي المهام المتفق عليها وفق توجيهات صاحب العمل.','أساسي'],
 ['مدة العقد','مدة هذا العقد {{duration}} تبدأ من {{start}}.','أساسي'],
 ['الأجر','يستحق العامل أجرًا شهريًا {{salary}} جنيهًا، بما لا يقل عن الحد الأدنى للأجور المقرر قانونًا.','أساسي'],
 ['ساعات العمل والإجازات','تسري على العامل أحكام ساعات العمل والإجازات المقررة في قانون العمل.','أساسي'],
 ['التأمينات','يلتزم صاحب العمل بالتأمين على العامل وفق قانون التأمينات الاجتماعية.','أساسي'],
 ['السرية','يلتزم العامل بالمحافظة على أسرار العمل وعدم إفشائها أثناء العقد وبعده.','اختياري'],
 ['إنهاء العقد','يُنهى العقد وفق الأحكام والإجراءات المقررة في قانون العمل.','أساسي'],[SIG,'','أساسي']]},
serv:{f:[['p1','مقدم الخدمة'],['p2','طالب الخدمة'],['scope','نطاق الخدمات'],['fee','المقابل المالي (جنيه)'],['duration','مدة التنفيذ']],
 laws:['م 646: تعريف المقاولة (وأحكامها تُطبق على كثير من عقود الأعمال)'],
 c:[['أطراف العقد','حُرر هذا العقد في {{date}} بين {{p1}} ويُسمى «الطرف الأول»، و{{p2}} ويُسمى «الطرف الثاني».','أساسي'],
 ['نطاق الخدمات','يلتزم الطرف الأول بتقديم الخدمات الآتية: {{scope}}.','أساسي'],
 ['المقابل والسداد','يلتزم الطرف الثاني بسداد {{fee}} جنيهًا وفق ما يتفق عليه الطرفان.','أساسي'],
 ['مدة التنفيذ','مدة تنفيذ الخدمات {{duration}} من تاريخ هذا العقد.','أساسي'],
 ['السرية','يلتزم الطرفان بعدم إفشاء أي معلومات سرية يطلعان عليها أثناء التنفيذ.','اختياري'],
 ['أحكام عامة','حُرر هذا العقد من نسختين، بيد كل طرف نسخة للعمل بموجبها.','إضافي'],[SIG,'','أساسي']]},
agent:{f:[['principal','اسم الموكِّل'],['principalId','الرقم القومي للموكِّل'],['agent','اسم الوكيل'],['agentId','الرقم القومي للوكيل'],['scope','نطاق الوكالة'],['duration','مدة الوكالة']],
 laws:['م 699: تعريف الوكالة','م 700: الشكل الواجب في الوكالة','م 704: عناية الوكيل','م 714: انتهاء الوكالة'],
 c:[['أطراف العقد','حُرر هذا العقد في {{date}} بين السيد/ {{principal}} (رقم قومي {{principalId}}) ويُسمى «الموكِّل»، والسيد/ {{agent}} (رقم قومي {{agentId}}) ويُسمى «الوكيل».','أساسي'],
 ['نطاق الوكالة','وكّل الموكِّل الوكيل في القيام بالعمل الآتي لحسابه: {{scope}}، ولا تمتد الوكالة إلى غيره.','أساسي'],
 ['المدة','مدة الوكالة {{duration}} من تاريخ هذا العقد، وتنتهي بإتمام العمل أو بانتهاء الأجل.','أساسي'],
 ['التزامات الوكيل','يبذل الوكيل في تنفيذ الوكالة العناية الواجبة، ويقدم للموكِّل حسابًا عما قام به.','أساسي'],
 ['ملاحظة الشكل','إذا كان العمل المُوكَّل فيه يتطلب شكلًا خاصًا، وجب أن تتوافر الوكالة في ذات الشكل.','إضافي'],[SIG,'','أساسي']]},
gen:{f:[['p1','الطرف الأول'],['p2','الطرف الثاني'],['subject','موضوع العقد'],['value','القيمة (جنيه)'],['duration','المدة']],
 laws:['أحكام نظرية العقد في القانون المدني (م 89 وما بعدها)'],
 c:[['أطراف العقد','حُرر هذا العقد في {{date}} بين {{p1}} و{{p2}}.','أساسي'],['موضوع العقد','موضوع هذا العقد: {{subject}}.','أساسي'],
 ['القيمة','القيمة المتفق عليها {{value}} جنيهًا.','أساسي'],['المدة','مدة العقد {{duration}}.','أساسي'],['أحكام عامة','حُرر هذا العقد من نسختين، بيد كل طرف نسخة.','إضافي'],[SIG,'','أساسي']]}};
const C=[
[1,'عقد إيجار سكني','realestate','نموذج لتنظيم العلاقة الإيجارية بين المؤجر والمستأجر، مع توضيح البيانات والشروط الأساسية.','lease',1,'عقد يلتزم فيه المؤجر بتمكين المستأجر من الانتفاع بعين معينة مدة معينة مقابل أجر معلوم.'],
[2,'عقد بيع ابتدائي','realestate','نموذج لتنظيم بيع وشراء الأصول أو الممتلكات وفق طبيعة المعاملة وبيانات أطرافها.','sale',1,'عقد يلتزم به البائع بنقل ملكية شيء أو حق مالي للمشتري مقابل ثمن.'],
[3,'عقد تقديم خدمات','services','نموذج لتحديد نطاق الخدمات والالتزامات والمقابل المالي ومدد التنفيذ.','serv',1,'اتفاق يلتزم فيه طرف بأداء عمل أو خدمة للطرف الآخر مقابل أجر.'],
[4,'عقد شراكة تجارية','business','نموذج لتنظيم العلاقة بين الشركاء وتحديد حصصهم وحقوقهم والتزاماتهم.','gen',1,'اتفاق بين شخصين أو أكثر على المساهمة في مشروع بتقديم حصة لاقتسام ربحه وخسارته.'],
[5,'عقد عمل محدد المدة','work','نموذج يوضح مدة العمل والمهام والأجر والالتزامات الأساسية بين صاحب العمل والعامل.','work',1,'اتفاق يعمل بموجبه العامل لدى صاحب العمل تحت إدارته مقابل أجر ولمدة محددة.'],
[6,'عقد توريد','business','نموذج لتنظيم توريد المنتجات ومواعيد التسليم والمواصفات وشروط السداد.','gen',0,'اتفاق يلتزم فيه المورد بتسليم منتجات دورية أو محددة للمتعاقد معه مقابل ثمن.'],
[7,'اتفاقية سرية معلومات','business','اتفاقية لحماية المعلومات والبيانات السرية المتبادلة أثناء التعاملات المهنية.','gen',1,'اتفاق يلتزم فيه الطرفان بعدم إفشاء المعلومات السرية المتبادلة.'],
[8,'عقد مقاولة تشطيبات','services','نموذج لتحديد أعمال التشطيب والمواصفات والمدة والمقابل وآلية التسليم.','serv',0,'عقد يتعهد فيه المقاول بتنفيذ أعمال تشطيب لقاء أجر.'],
[9,'عقد وكالة','personal','نموذج يحدد نطاق الوكالة وصلاحيات الوكيل والتزامات الأطراف ومدتها.','agent',1,'عقد يلتزم بمقتضاه الوكيل بالقيام بعمل قانوني لحساب الموكِّل.'],
[10,'ملحق عقد إيجار','realestate','نموذج لإضافة تعديل أو اتفاق مكمل إلى علاقة إيجارية قائمة.','gen',0,'اتفاق مكمل يعدّل بعض بنود عقد إيجار قائم دون المساس ببقيته.'],
[11,'عقد إيجار إداري','realestate','نموذج لتنظيم الانتفاع بوحدة مخصصة للاستخدام الإداري وفق الاتفاق.','lease',0,'إيجار وحدة مخصصة للنشاط الإداري أو المهني مقابل أجرة.'],
[12,'محضر استلام وحدة','realestate','نموذج لتوثيق حالة الوحدة وبيانات التسليم بين الأطراف.','gen',0,'محضر يوثق حالة الوحدة وقت التسليم والاستلام.']
].map(a=>({id:a[0],t:a[1],cat:a[2],d:a[3],tpl:a[4],ok:a[5],def:a[6]}));
const FAQ=[['هل النموذج ملزم قانونًا كما هو؟','هو نموذج استرشادي. تتحقق قوته القانونية باستيفاء أركان العقد وتوقيع الأطراف، ويُفضّل عرضه على محامٍ.'],
['هل تعديلي على البنود يغيّر النموذج الأصلي؟','لا. كل تعديل يُحفظ في نسختك الشخصية فقط، ويبقى النموذج الأصلي كما هو للجميع.'],
['هل أحتاج إلى توثيق العقد؟','يختلف ذلك حسب نوع العقد والغرض منه، مثل التسجيل في البيوع العقارية. استشر مختصًا قبل الاعتماد على العقد.']];
const COND=[['التراضي','صدور إيجاب وقبول متطابقين من أطراف تتوافر فيهم الأهلية.'],['المحل','أن يكون موضوع العقد معينًا أو قابلًا للتعيين ومشروعًا.'],['السبب','أن يكون الباعث على التعاقد مشروعًا.'],['البيانات الجوهرية','تحديد الأطراف والمقابل والمدة وكل ما يمنع الجهالة.']];
/* التخزين: نسخ المستخدم الشخصية فقط */
const K='ibintus_docs_v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(K))||[]}catch(e){return []}};
let docs=load(),saveT;
const persist=()=>{try{localStorage.setItem(K,JSON.stringify(docs))}catch(e){}const s=$('#saved');if(s){s.textContent='تم الحفظ في نسختك';}};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.i);toast.i=setTimeout(()=>t.classList.remove('show'),2200)};
const today=()=>new Date().toLocaleDateString('ar-EG');
function newDoc(cid){const c=C.find(x=>x.id==cid),tp=T[c.tpl];const d={id:'d'+Date.now(),cid:c.id,name:c.t+' — نسختي',v:{},cl:tp.c.map((x,i)=>({id:i+1,t:x[0],x:x[1],y:x[2],on:true})),at:Date.now()};docs.unshift(d);persist();location.hash='#/doc/'+d.id}
/* بناء نص العقد */
function build(d){const c=C.find(x=>x.id==d.cid),v=Object.assign({date:today()},d.v);
 const fill=(s,html)=>s.replace(/\{\{(\w+)\}\}/g,(_,k)=>v[k]?(html?esc(v[k]):v[k]):(html?'<span class="blank">'+DOTS+'</span>':DOTS));
 const on=d.cl.filter(x=>x.on);let n=0,h='<h1>'+esc(c.t)+'</h1>',tx=c.t+'\n\n';
 on.forEach(x=>{n++;if(x.t===SIG){h+='<h4>البند '+n+': '+SIG+'</h4><div class="sig"><div>الطرف الأول</div><div>الطرف الثاني</div></div>';tx+='\nالبند '+n+': '+SIG+'\nالطرف الأول: ........   الطرف الثاني: ........\n'}
  else{h+='<h4>البند '+n+': '+esc(x.t)+'</h4><p>'+fill(esc(x.x),true)+'</p>';tx+='\nالبند '+n+': '+x.t+'\n'+fill(x.x)+'\n'}});
 return{h,tx}}
/* الصفحات */
const card=c=>`<a class="card" href="#/c/${c.id}"><span class="tag ${c.ok?'ok':'wait'}">${c.ok?'تمت المراجعة':'قيد المراجعة'}</span><h3>${esc(c.t)}</h3><p>${esc(c.d)}</p><small class="eyebrow">${CATS[c.cat]} ←</small></a>`;
const V={
home(){return`<section class="hero"><div class="container hero-grid"><div><span class="eyebrow">مكتبة العقود القانونية</span><h1>عقدك جاهز<span>أكمل بياناتك فقط</span></h1><p class="lead">اختر النموذج المناسب، أكمل البيانات الأساسية، وعدّل البنود بالإضافة أو الحذف. ثم انسخ العقد أو اطبعه كنسخة شخصية لا تمس النموذج الأصلي.</p>
 <form class="search" id="hs" role="search"><input type="search" aria-label="ابحث عن عقد" placeholder="ابحث: عقد إيجار، توريد، وكالة…"><button class="btn pri">بحث</button></form></div>
 <div class="paper-demo" aria-hidden="true"><h3>عقد إيجار سكني</h3><s></s><s></s><s></s><s></s><s></s></div></div></section>
 <section class="section tint"><div class="container"><div class="sh"><div><span class="eyebrow">كيف يعمل</span><h2>أربع خطوات إلى عقدك</h2></div></div><div class="steps">
 ${[['اختر العقد','تصفح المكتبة أو ابحث بالاسم والتصنيف.'],['أنشئ نسختك','نسخة شخصية مستقلة عن النموذج الأصلي.'],['أكمل وعدّل','املأ البيانات، وأضف أو احذف أو عدّل البنود.'],['انسخ أو اطبع','خذ العقد جاهزًا للتوقيع.']].map((s,i)=>`<div class="step"><b>${i+1}</b><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('')}</div></div></section>
 <section class="section"><div class="container"><div class="sh"><div><span class="eyebrow">الأكثر استخدامًا</span><h2>نماذج العقود</h2></div><a class="btn" href="#/library">كل العقود</a></div><div class="grid">${C.slice(0,6).map(card).join('')}</div></div></section>`},
library(q){const s=q.q||'',cat=q.cat||'all',sort=q.sort||'rel';let r=C.filter(c=>(cat==='all'||c.cat===cat)&&(!s||(c.t+c.d).includes(s)));if(sort==='alpha')r.sort((a,b)=>a.t.localeCompare(b.t,'ar'));
 return`<div class="container page"><div class="crumb"><a href="#/">الرئيسية</a> / مكتبة العقود</div><h1>مكتبة العقود</h1>
 <div class="row" style="margin-top:14px"><input class="inp" id="lq" type="search" aria-label="ابحث في العقود" placeholder="ابحث عن عقد" value="${esc(s)}" style="max-width:420px"><select id="ls" aria-label="ترتيب" style="max-width:200px"><option value="rel">الأكثر صلة</option><option value="alpha" ${sort==='alpha'?'selected':''}>أبجديًا</option></select></div>
 <div class="filters" role="group" aria-label="التصنيف">${[['all','الكل'],...Object.entries(CATS)].map(([k,l])=>`<button class="chip" data-cat="${k}" aria-pressed="${cat===k}">${l}</button>`).join('')}</div>
 <p class="crumb" aria-live="polite">${r.length} نموذج</p>${r.length?`<div class="grid">${r.map(card).join('')}</div>`:`<div class="empty"><h3>لا توجد نتائج مطابقة</h3><p>جرّب كلمة أخرى أو أزل التصنيف.</p><a class="btn" href="#/library">إعادة ضبط</a></div>`}</div>`},
contract(id,q){const c=C.find(x=>x.id==id);if(!c)return V.nf();const tp=T[c.tpl],tab=q.tab||'ov';
 const tabs=[['ov','نظرة عامة'],['def','التعريف'],['cond','الأركان والشروط'],['law','القوانين المرتبطة'],['faq','أسئلة شائعة']];
 const body={ov:`<h2>عن النموذج</h2><p>${esc(c.d)}</p><h3>البنود المضمّنة</h3><ul class="clean">${tp.c.map((x,i)=>`<li><b>${i+1}. ${esc(x[0])}</b> <span class="tag wait">${x[2]}</span></li>`).join('')}</ul>`,
 def:`<h2>تعريف العقد</h2><p>${esc(c.def)}</p>`,cond:`<h2>الأركان والشروط</h2><ul class="clean">${COND.map(x=>`<li><h3>${x[0]}</h3><span>${x[1]}</span></li>`).join('')}</ul>`,
 law:`<h2>القوانين المرتبطة</h2><ul class="clean">${tp.laws.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="note">المواد المذكورة من القانون المدني المصري. تأكد من النص الحالي قبل الاعتماد عليه.</div>`,
 faq:`<h2>أسئلة شائعة</h2>${FAQ.map(x=>`<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join('')}`}[tab];
 return`<div class="container page"><div class="crumb"><a href="#/">الرئيسية</a> / <a href="#/library">مكتبة العقود</a> / ${esc(c.t)}</div><span class="tag ${c.ok?'ok':'wait'}">${c.ok?'تمت المراجعة':'قيد المراجعة'}</span><h1>${esc(c.t)}</h1>
 <nav class="tabs" aria-label="أقسام العقد">${tabs.map(t=>`<a href="#/c/${c.id}?tab=${t[0]}" class="${tab===t[0]?'on':''}">${t[1]}</a>`).join('')}</nav>
 <div class="two"><div class="box">${body}</div><aside class="box"><h2>ابدأ نسختك</h2><p>تُنشأ نسخة شخصية مستقلة. يمكنك تعديل بياناتها وبنودها دون أي تأثير على النموذج الأصلي.</p><button class="btn pri lg" style="width:100%" data-new="${c.id}">إنشاء نسخة وتعديلها</button></aside></div></div>`},
docs(){return`<div class="container page"><div class="crumb"><a href="#/">الرئيسية</a> / مستنداتي</div><h1>مستنداتي</h1><p class="crumb">نسخك الشخصية محفوظة في هذا المتصفح فقط.</p>${docs.length?`<div class="grid">${docs.map(d=>`<div class="card"><h3>${esc(d.name)}</h3><p>${esc(C.find(c=>c.id==d.cid).t)} · ${new Date(d.at).toLocaleDateString('ar-EG')}</p><div class="row"><a class="btn sm pri" href="#/doc/${d.id}">فتح</a><button class="btn sm dng" data-del="${d.id}">حذف</button></div></div>`).join('')}</div>`:`<div class="empty"><h3>لا توجد مستندات بعد</h3><p>ابدأ من مكتبة العقود.</p><a class="btn pri" href="#/library">تصفح العقود</a></div>`}</div>`},
nf(){return`<div class="container page"><div class="empty"><h3>الصفحة غير موجودة</h3><a class="btn" href="#/library">مكتبة العقود</a></div></div>`},
doc(id){const d=docs.find(x=>x.id===id);if(!d)return V.nf();const c=C.find(x=>x.id==d.cid),tp=T[c.tpl];
 return`<div class="container page"><div class="crumb"><a href="#/docs">مستنداتي</a> / ${esc(d.name)}</div>
 <div class="note no-print">هذه نسخة شخصية مستقلة. تعديلاتك هنا لا تغيّر النموذج الأصلي «${esc(c.t)}».</div>
 <div class="bar no-print"><label class="fld" style="flex:1;min-width:220px">اسم المستند<input class="inp" id="dn" value="${esc(d.name)}"></label><span class="saved" id="saved" aria-live="polite"></span></div>
 <div class="bar no-print"><div class="row"><button class="btn pri" id="pr">طباعة</button><button class="btn" id="cp">نسخ النص</button></div><button class="btn dng" id="rs">استعادة بنود النموذج</button></div>
 <div class="editor"><div class="panel no-print"><div class="box"><h2>البيانات الأساسية</h2><div class="fgrid">${tp.f.map(f=>`<label class="fld">${f[1]}<input class="inp" data-k="${f[0]}" value="${esc(d.v[f[0]]||'')}"></label>`).join('')}</div></div>
 <div class="box"><div class="bar"><h2 style="margin:0">البنود</h2><button class="btn sm" id="ac">إضافة بند</button></div><p class="crumb" style="margin:0 0 10px">الرموز مثل {{lessor}} تُملأ تلقائيًا من البيانات الأساسية، فلا تحذفها إلا إذا أردت كتابة القيمة بنفسك.</p><div id="cls" style="display:flex;flex-direction:column;gap:10px"></div></div></div>
 <div class="paper-wrap"><article class="paper" id="paper" aria-label="معاينة العقد"></article></div></div></div>`}};
function clauses(d){const el=$('#cls');el.innerHTML=d.cl.map((x,i)=>`<div class="cl ${x.on?'':'off'}"><div class="cl-h"><input type="checkbox" class="chk" data-on="${i}" ${x.on?'checked':''} aria-label="تضمين البند"><input type="text" class="inp" data-t="${i}" value="${esc(x.t)}" aria-label="عنوان البند"><span class="tag wait">${esc(x.y)}</span></div>${x.t===SIG?'':`<textarea data-x="${i}" aria-label="نص البند">${esc(x.x)}</textarea>`}<div class="cl-a"><button class="iconb" data-mv="${i}:-1" aria-label="نقل لأعلى" ${i?'':'disabled'}>↑</button><button class="iconb" data-mv="${i}:1" aria-label="نقل لأسفل" ${i<d.cl.length-1?'':'disabled'}>↓</button><button class="btn sm dng" data-rm="${i}">حذف البند</button></div></div>`).join('')}
function paper(d){$('#paper').innerHTML=build(d).h}
function mountDoc(d){clauses(d);paper(d);const up=()=>{d.at=Date.now();clearTimeout(saveT);saveT=setTimeout(persist,250);paper(d)};
 const root=$('#app');root.oninput=e=>{const t=e.target;if(t.dataset.k!==undefined){d.v[t.dataset.k]=t.value;up()}else if(t.dataset.t!==undefined){d.cl[t.dataset.t].t=t.value;up()}else if(t.dataset.x!==undefined){d.cl[t.dataset.x].x=t.value;up()}else if(t.id==='dn'){d.name=t.value||'مستند بلا اسم';up()}};
 root.onchange=e=>{if(e.target.dataset.on!==undefined){d.cl[e.target.dataset.on].on=e.target.checked;clauses(d);up()}};
 root.onclick=e=>{const b=e.target.closest('button');if(!b)return;const mv=b.dataset.mv,rm=b.dataset.rm;
  if(mv){const[i,s]=mv.split(':').map(Number);[d.cl[i],d.cl[i+s]]=[d.cl[i+s],d.cl[i]];clauses(d);up()}
  else if(rm!==undefined){if(confirm('حذف هذا البند من نسختك؟ النموذج الأصلي لن يتأثر.')){d.cl.splice(rm,1);clauses(d);up()}}
  else if(b.id==='ac'){d.cl.splice(Math.max(d.cl.length-1,0),0,{id:Date.now(),t:'بند جديد',x:'',y:'إضافي',on:true});clauses(d);up();$$('[data-t]')[d.cl.length-2]?.focus()}
  else if(b.id==='pr')window.print();
  else if(b.id==='cp')navigator.clipboard.writeText(build(d).tx).then(()=>toast('تم نسخ العقد'),()=>toast('تعذر النسخ، حدد النص يدويًا'));
  else if(b.id==='rs'&&confirm('استعادة بنود النموذج الأصلي؟ ستُستبدل بنودك الحالية، وتبقى بياناتك.')){d.cl=T[C.find(c=>c.id==d.cid).tpl].c.map((x,i)=>({id:i+1,t:x[0],x:x[1],y:x[2],on:true}));clauses(d);up()}}}
/* الموجّه */
function route(){const h=location.hash.slice(1)||'/',[p,qs]=h.split('?'),q=Object.fromEntries(new URLSearchParams(qs||'')),s=p.split('/').filter(Boolean),app=$('#app');app.oninput=app.onchange=null;app.onclick=null;
 let html;if(!s.length)html=V.home();else if(s[0]==='library')html=V.library(q);else if(s[0]==='c')html=V.contract(s[1],q);else if(s[0]==='docs')html=V.docs();else if(s[0]==='doc')html=V.doc(s[1]);else html=V.nf();
 app.innerHTML=html;$$('.nav nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#/'+(s[0]==='c'?'library':s[0]==='doc'?'docs':s[0]||'')));document.title=(s[0]==='c'&&C.find(x=>x.id==s[1])?.t||'IBINTUS')+' — IBINTUS';
 if(s[0]==='doc'&&docs.find(x=>x.id===s[1]))mountDoc(docs.find(x=>x.id===s[1]));window.scrollTo(0,0);app.focus({preventScroll:true})}
const go=q=>{location.hash='#/library?'+new URLSearchParams(q)};
document.addEventListener('click',e=>{const n=e.target.closest('[data-new]'),c=e.target.closest('[data-cat]'),x=e.target.closest('[data-del]');
 if(n)newDoc(n.dataset.new);else if(c){const u=new URLSearchParams(location.hash.split('?')[1]||'');u.set('cat',c.dataset.cat);go(u)}
 else if(x&&confirm('حذف هذا المستند نهائيًا؟')){docs=docs.filter(d=>d.id!==x.dataset.del);persist();route()}});
document.addEventListener('submit',e=>{if(e.target.id==='hs'){e.preventDefault();go({q:$('input',e.target).value.trim()})}});
let lt;document.addEventListener('input',e=>{if(e.target.id==='lq'){clearTimeout(lt);lt=setTimeout(()=>{const u=new URLSearchParams(location.hash.split('?')[1]||'');u.set('q',e.target.value.trim());go(u);const i=$('#lq');i.focus();i.setSelectionRange(i.value.length,i.value.length)},350)}});
document.addEventListener('change',e=>{if(e.target.id==='ls'){const u=new URLSearchParams(location.hash.split('?')[1]||'');u.set('sort',e.target.value);go(u)}});
addEventListener('hashchange',route);route();
