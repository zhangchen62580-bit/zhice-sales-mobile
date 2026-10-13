const $ = s => document.querySelector(s);
const STORE = 'zhice_local_memory_v2';
let clients = JSON.parse(localStorage.getItem(STORE) || '[]');
let current = null;
const save = () => localStorage.setItem(STORE, JSON.stringify(clients));
const esc = v => String(v || '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
function toast(text) { $('#status').textContent = text; setTimeout(() => { if ($('#status')) $('#status').textContent = 'Enter 发送，Shift+Enter 换行'; }, 2400); }
function fullOldReply(text) {
  if (/有什么用|作用|好处|价值|能带来|对企业|实际/.test(text)) return '这类认定不是只挂在墙上的荣誉，实际价值通常有几块：地方奖励和项目申报机会、研发费用加计扣除等税费政策空间、融资和招投标时的企业背书，以及后续技改、研发、人才和产业项目的优先关注。具体政策和金额要以当地当年通知、企业条件和审核结果为准。您更关注补贴、融资还是招投标？';
  if (/补贴|奖励|福利|政策|优惠|省钱|拿钱/.test(text)) return '政策优势主要看地区和申报梯度，常见方向包括认定奖励、研发费用加计扣除、税费优惠、融资支持、招投标加分和技改/研发项目优先关注，但不是所有企业都自动享受，最终以当地通知和主管部门审核为准。您企业在哪个地区？';
  if (/贷款|融资|银行|授信/.test(text)) return '认定本身不是贷款保证，但能作为企业规范经营、创新能力和政策资质的证明，部分银行会结合企业经营、流水、纳税和征信给予授信参考。能不能贷、能贷多少还要看银行综合审核，您企业近一年营收和纳税情况怎么样？';
  if (/科小|科技型中小|创新型中小|专精特新|小巨人/.test(text) && /不行|不适合|能不能|贷款|通过|条件/.test(text)) return '先别急着按营业执照来判断，科小更要看主营业务、研发投入、科技人员和知识产权是否匹配；贷款还要结合银行授信条件，不能只看一个认定。您公司主营什么产品、近一年有没有研发投入？';
  if (/条件|要求|门槛|标准/.test(text)) return '不能只看有没有专利，通常要按创新型中小企业、专精特新中小企业、小巨人等梯度，综合看主营产品、细分市场、研发投入、知识产权、营收、科技人员和合规情况。您准备申报哪个地区、哪个梯度？';
  if (/材料|资料|清单|准备/.test(text)) return '重点准备营业执照、近2—3年财务报表、研发台账、知识产权证书、科技人员社保、产品销售佐证、合同发票和合规材料；还要校准研发归集、审计数据和知识产权与主营产品的匹配度，具体以当地通知为准。您现在资料整理到什么程度了？';
  if (/费用|价格|多少钱|收费|预算/.test(text)) return '费用要结合企业基础、申报梯度、资料完整度和整改难度确认，不是简单按“办一个证”报价。您准备申报哪个梯度，现有研发台账和财务数据齐不齐？';
  if (/时间|截止|什么时候|多久/.test(text)) return '时间主要取决于所在地区和当年申报批次，通常要先完成资料核对和口径校准，再按通知节点推进。您是想赶哪一批？';
  if (/保证|通过|成功率|包过/.test(text)) return '结果不能提前保证，最终以主管部门审核为准；我们能先把申报梯度、材料口径、知识产权匹配和风险点核清楚，降低返工风险。您目前最担心哪一块？';
  if (/专利|知识产权|商标|软著/.test(text)) return '先看知识产权类型、权利人、有效期和申报阶段，再判断是否与主营产品、研发内容匹配；匹配得上才有助于申报和企业布局。您现在已有哪类知识产权？';
  if (/审计|研发|营收|发票|数据/.test(text)) return '这类重点是研发、营收、合同发票和系统填报口径能相互佐证，先把数据口径校准，再判断能不能申报。您现在最不一致的是哪一项？';
  if (/项目|补贴|申报/.test(text)) return '先核对项目指南、企业条件、研发基础、人才和知识产权匹配度，再判断申报价值；补贴和立项结果以主管部门审核为准。您准备申报哪个项目？';
  return '先回应您最担心的点，再判断是否适合，不急着下结论。先确认一个关键信息：企业所在地区和主营业务是什么？';
}
function oldReply(text) {
  if (/科小|科技型中小|创新型中小|专精特新|小巨人/.test(text) && /不行|不适合|能不能|贷款|通过|条件/.test(text)) return '先别急着按营业执照来判断，科小更要看主营业务、研发投入、科技人员和知识产权是否匹配，能不能贷款也要结合银行授信条件，不能只看一个认定。您公司主营什么产品、近一年有没有研发投入？';
  if (/条件|要求|门槛|标准/.test(text)) return '这个不能只看有没有专利，要结合申报梯度、地区口径、主营产品、研发投入、知识产权和合规情况判断。您准备申报哪个地区、哪个梯度？';
  if (/材料|资料|清单|准备/.test(text)) return '先准备营业执照、近2—3年财务报表、研发台账、知识产权证书、科技人员社保、产品销售佐证、合同发票和合规材料，具体以当地通知为准。您现在资料整理到什么程度了？';
  if (/费用|价格|多少钱|收费|预算/.test(text)) return '费用要结合企业基础、申报梯度、资料完整度和整改难度确认，不是简单按“办一个证”报价。您准备申报哪个梯度？';
  if (/时间|截止|什么时候|多久/.test(text)) return '时间主要取决于所在地区和当年申报批次，通常要先完成资料核对和口径校准。您是想赶哪一批？';
  if (/保证|通过|成功率|包过/.test(text)) return '结果不能提前保证，最终以主管部门审核为准；我们能先把申报梯度、材料口径和风险点核清楚。您目前最担心哪一块？';
  if (/用处|作用|好处|价值|对企业|政策福利|政策优势|有什么用/.test(text)) return '专精特新/科小的价值不只是挂一块牌子，通常体现在：符合条件时可对接各级奖补和扶持，研发费用、税费和项目申报有政策空间；融资授信、招投标和大客户合作时多一层资质背书；后续技改、研发、人才和产业项目也可能获得优先关注。具体补贴和优惠以当地当年政策、企业条件和主管部门审核为准。您更关注补贴、融资还是招投标？';
  if (/专利|知识产权|商标|软著/.test(text)) return '先看知识产权类型、权利人、有效期，以及和主营产品、研发内容是否匹配，再判断是做布局还是配套申报。您现在已有哪类知识产权？';
  if (/审计|研发|营收|发票|数据/.test(text)) return '这类重点是研发、营收、合同发票和系统填报口径能相互佐证，先把数据口径校准，再判断能不能申报。您现在最不一致的是哪一项？';
  if (/项目|补贴|申报/.test(text)) return '先核对项目指南、企业条件和现有研发基础，再判断匹配度，补贴和立项结果以主管部门审核为准。您准备申报哪个项目？';
  return '我先按您目前说的情况做初步判断，不急着下结论。先确认一个关键信息：企业所在地区和主营业务是什么？';
}
function renderClients() { const q = ($('#search').value || '').toLowerCase(); $('#clients').innerHTML = clients.filter(c => (c.name + c.company).toLowerCase().includes(q)).map(c => `<div class="client ${c.id === current ? 'active' : ''}" data-id="${c.id}"><b>${esc(c.name)}</b><small>${esc(c.company || '未填写')}</small></div>`).join(''); document.querySelectorAll('.client').forEach(n => n.onclick = () => openClient(n.dataset.id)); }
function openClient(id) { current = id; const c = clients.find(x => x.id === id); if (!c) return; $('#empty').hidden = true; $('#chat').hidden = false; $('#clientName').textContent = c.name; $('#clientCompany').textContent = c.company || '未填写公司'; $('#insight').textContent = c.messages.length ? `最近客户原话：\n${c.messages.filter(x => x.role === 'customer').slice(-3).map(x => x.text).join('\n')}\n\n回复策略：先回应客户真正担心的点，只追问一个关键事实，再推进资料核对或初步评估。` : ''; $('#messages').innerHTML = c.messages.map(m => `<div class="bubble ${m.role}"><div class="meta">${m.role === 'customer' ? '客户' : '建议回复'} · ${new Date(m.at).toLocaleString()}</div>${esc(m.text)}</div>`).join(''); $('#messages').scrollTop = 999999; renderClients(); }
function addMessage(role, text) { const c = clients.find(x => x.id === current); c.messages.push({ role, text, at: new Date().toISOString() }); save(); }
function send() { if (!current) return toast('请先选择客户'); const input = $('#input'); const text = input.value.trim(); if (!text) return; input.value = ''; addMessage('customer', text); addMessage('assistant', fullOldReply(text)); openClient(current); }
$('#send').onclick = send;
$('#input').onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
$('#search').oninput = renderClients;
$('#newClient').onclick = () => $('#clientDialog').showModal();
$('#clientForm').onsubmit = e => { e.preventDefault(); const c = { id: Date.now().toString(36), name: $('#name').value.trim() || '未命名客户', company: $('#company').value.trim(), tags: $('#tags').value.split(',').map(x => x.trim()).filter(Boolean), messages: [] }; clients.unshift(c); save(); $('#clientDialog').close(); $('#clientForm').reset(); renderClients(); openClient(c.id); };
$('#consolidate').onclick = () => toast('已按当前客户记录完成沉淀');
$('#consolidateAll').onclick = () => { save(); toast('本机客户记录已保存'); };
$('#export').onclick = () => { const c = clients.find(x => x.id === current); if (!c) return; const text = `# ${c.name}\n\n公司：${c.company || ''}\n\n## 沟通记录\n${c.messages.map(m => `- ${m.at} **${m.role}**：${m.text}`).join('\n')}`; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/markdown' })); a.download = `${c.name}.md`; a.click(); };
renderClients();
