const $ = s => document.querySelector(s);
const STORE = 'zhice_local_memory_v2';
let clients = JSON.parse(localStorage.getItem(STORE) || '[]');
let current = null;
const save = () => localStorage.setItem(STORE, JSON.stringify(clients));
const esc = v => String(v || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(t){ $('#status').textContent=t; setTimeout(()=>$('#status').textContent='Enter 发送，Shift+Enter 换行',2400); }
function oldReply(t){
 if(/审计|研发|营收|合同|发票|数据|对不上|不一致/.test(t)) return '这类重点是研发、营收、合同发票和系统填报口径能相互佐证，先把数据口径校准，再判断能不能申报。您现在最不一致的是哪一项？';
 if(/条件|要求|门槛|标准/.test(t)) return '不能只看有没有专利，通常要按创新型中小企业、专精特新中小企业、小巨人等梯度，综合看主营产品、细分市场、研发投入、知识产权、营收、科技人员和合规情况。您准备申报哪个地区、哪个梯度？';
 if(/项目申报|申报项目|项目申请|申报哪个项目|项目扶持|产业项目|技改项目|研发项目|人才项目/.test(t)) return '先核对项目指南、企业条件、研发基础、人才和知识产权匹配度，再判断申报价值；补贴和立项结果以主管部门审核为准。您准备申报哪个项目？';
 if(/贷款|融资|授信|银行/.test(t)) return '这类认定可以作为融资和银行授信时的企业背书，但不能替代银行对经营、流水、纳税、负债和还款能力的审核。您现在更关注贷款额度、利率还是授信材料？';
 if(/有什么用|作用|好处|价值|能带来|对企业|实际/.test(t)) return '这类认定不是只挂在墙上的荣誉，实际价值通常有几块：地方奖励和项目申报机会、研发费用加计扣除等税费政策空间、融资和招投标时的企业背书，以及后续技改、研发、人才和产业项目的优先关注。具体政策和金额要以当地当年通知、企业条件和审核结果为准。您更关注补贴、融资还是招投标？';
 if(/补贴|奖励|福利|政策|优惠|省钱|拿钱/.test(t)) return '政策优势主要看地区和申报梯度，常见方向包括认定奖励、研发费用加计扣除、税费优惠、融资支持、招投标加分和技改/研发项目优先关注，但不是所有企业都自动享受，最终以当地通知和主管部门审核为准。您企业在哪个地区？';
 if(/科小|科技型中小|创新型中小|专精特新|小巨人/.test(t)&&/不行|不适合|能不能|贷款|通过/.test(t)) return '先别急着按营业执照来判断，科小更要看主营业务、研发投入、科技人员和知识产权是否匹配，贷款还要结合银行授信条件，不能只看一个认定。您公司主营什么产品、近一年有没有研发投入？';
 if(/材料|资料|清单|准备/.test(t)) return '重点准备营业执照、近2—3年财务报表、研发台账、知识产权证书、科技人员社保、产品销售佐证、合同发票和合规材料；还要校准研发归集、审计数据和知识产权与主营产品的匹配度，具体以当地通知为准。您现在资料整理到什么程度了？';
 if(/费用|价格|多少钱|收费|预算/.test(t)) return '费用要结合企业申报梯度、材料完整度和服务范围确认，不是简单按一个证书报价；先把申报方向、研发台账和财务数据核清楚，再给您准确方案。您准备申报哪个梯度？';
 if(/时间|截止|什么时候|周期|多久/.test(t)) return '时间要看当地通知和申报批次，通常要先完成条件核对、材料准备和口径校准，再按通知节点提交，不能一概而论。您准备申报哪个地区？';
 if(/保证|通过|成功率|包过/.test(t)) return '结果不能提前保证，最终以主管部门审核为准；我们能先把申报梯度、材料口径、知识产权匹配和风险点核清楚，降低返工风险。您目前最担心哪一块？';
 if(/专利|知识产权|商标|软著/.test(t)) return '先看知识产权类型、权利人、有效期和申报阶段，再判断是否与主营产品、研发方向匹配；匹配后再安排申报，避免材料和业务两张皮。您现有的是哪类知识产权？';
 return '先回应您最关心的点，判断是否适合，再给下一步建议；目前只追问一个关键事实：您企业所在地区和主营业务是什么？';
}
const policyIntro = '先给您讲清楚，这类企业认定/项目申报的价值不只是挂一块牌子：符合条件时通常可以对接地方奖励和项目申报机会，研发费用加计扣除等税费优惠，融资授信和招投标资质背书，以及技改、研发、人才和产业项目的优先关注。具体政策、金额和能否享受，要看企业所在地区、申报梯度、企业条件及主管部门审核结果。';
function render(){const q=($('#search').value||'').toLowerCase();$('#clients').innerHTML=clients.filter(c=>(c.name+c.company).toLowerCase().includes(q)).map(c=>'<div class="client '+(c.id===current?'active':'')+'" data-id="'+c.id+'"><b>'+esc(c.name)+'</b><small>'+esc(c.company||'未填写')+'</small></div>').join('');document.querySelectorAll('.client').forEach(n=>n.onclick=()=>open(n.dataset.id));}
function open(id){current=id;const c=clients.find(x=>x.id===id);if(!c)return;$('#empty').hidden=true;$('#chat').hidden=false;$('#clientName').textContent=c.name;$('#clientCompany').textContent=c.company||'未填写公司';$('#insight').textContent=c.messages.length?'最近客户原话：\n'+c.messages.filter(x=>x.role==='customer').slice(-3).map(x=>x.text).join('\n')+'\n\n回复策略：先回应客户真正担心的点，只追问一个关键事实，再推进资料核对或初步评估。':'';$('#messages').innerHTML=c.messages.map(m=>'<div class="bubble '+m.role+'"><div class="meta">'+(m.role==='customer'?'客户':'建议回复')+' · '+new Date(m.at).toLocaleString()+'</div>'+esc(m.text)+'</div>').join('');$('#messages').scrollTop=999999;render();}
function add(role,text){clients.find(x=>x.id===current).messages.push({role,text,at:new Date().toISOString()});save();}
function send(){if(!current)return toast('请先选择客户');const i=$('#input'),t=i.value.trim();if(!t)return;i.value='';const c=clients.find(x=>x.id===current);const firstReply=!(c.messages||[]).some(x=>x.role==='assistant');add('customer',t);const reply=oldReply(t);add('assistant',firstReply?policyIntro+'\n\n结合您刚才说的：'+reply:reply);open(current);}
$('#send').onclick=send;$('#input').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}};$('#search').oninput=render;$('#newClient').onclick=()=>$('#clientDialog').showModal();$('#clientForm').onsubmit=e=>{e.preventDefault();const c={id:Date.now().toString(36),name:$('#name').value.trim()||'未命名客户',company:$('#company').value.trim(),tags:$('#tags').value.split(',').map(x=>x.trim()).filter(Boolean),messages:[]};clients.unshift(c);save();$('#clientDialog').close();$('#clientForm').reset();render();open(c.id);};$('#consolidate').onclick=()=>toast('已按当前客户记录完成沉淀');$('#consolidateAll').onclick=()=>{save();toast('本机客户记录已保存');};$('#export').onclick=()=>{const c=clients.find(x=>x.id===current);if(!c)return;const t='# '+c.name+'\n\n公司：'+(c.company||'')+'\n\n## 沟通记录\n'+c.messages.map(m=>'- '+m.at+' **'+m.role+'**：'+m.text).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/markdown'}));a.download=c.name+'.md';a.click();};
render();
