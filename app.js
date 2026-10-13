const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let mode = 'normal';

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function toast(message) {
  const node = $('#toast');
  if (!node) return;
  node.textContent = message;
  node.classList.add('show');
  setTimeout(() => node.classList.remove('show'), 2200);
}

const policyIntro = '先给您讲清楚：这类企业认定/项目申报的价值不只是挂一块牌子。符合条件时，通常可以对接地方奖励和项目申报机会，研发费用加计扣除等税费优惠，融资授信和招投标资质背书，以及技改、研发、人才和产业项目的优先关注。具体政策、金额和能否享受，要看企业所在地区、申报梯度、企业条件及主管部门审核结果。';

function legacyReply(text) {
  if (/审计|研发|营收|合同|发票|数据|对不上|不一致/.test(text)) return '这类重点是研发、营收、合同发票和系统填报口径能相互佐证，先把数据口径校准，再判断能不能申报。您现在最不一致的是哪一项？';
  if (/条件|要求|门槛|标准/.test(text)) return '不能只看有没有专利，通常要按创新型中小企业、专精特新中小企业、小巨人等梯度，综合看主营产品、细分市场、研发投入、知识产权、营收、科技人员和合规情况。您准备申报哪个地区、哪个梯度？';
  if (/费用|价格|多少钱|收费/.test(text)) return '费用要看企业基础、申报梯度、材料完整度和整改难度，不能按“办一个证”简单报价。您准备申报哪个梯度，现有知识产权、研发台账和近两年财务数据整理到什么程度？';
  if (/保证|通过|成功率|包过|能不能过/.test(text)) return '不能承诺包过，最终要以主管部门审核为准；我们能控制的是梯度匹配、专利布局、审计校准、材料逻辑和申报风险预审。您所在省市、成立年限和主营产品是什么？';
  if (/贷款|融资|银行|授信/.test(text)) return '这类认定可以作为融资和银行授信时的企业背书，但不能替代银行对经营、流水、纳税、负债和还款能力的审核。您更关注贷款额度、利率还是授信材料？';
  if (/补贴|奖励|福利|政策|优惠|省钱|拿钱|有什么用|作用|好处|价值|对企业|实际/.test(text)) return '专精特新/科小的价值不只是挂一块牌子，通常体现在：符合条件时可对接各级奖补和扶持，研发费用、税费和项目申报有政策空间；融资授信、招投标和大客户合作时多一层资质背书；后续技改、研发、人才和产业项目也可能获得优先关注。具体补贴和优惠以当地当年政策、企业条件和主管部门审核为准。您更关注补贴、融资还是招投标？';
  if (/材料|资料|清单|准备/.test(text)) return '重点准备营业执照、近2—3年财务报表、研发台账、知识产权证书、科技人员社保、产品销售佐证、合同发票和合规材料；还要校准研发归集、审计数据和知识产权与主营产品的匹配度，具体以当地通知为准。您现在资料整理到什么程度了？';
  if (/专利|知识产权|商标|软著/.test(text)) return '先看知识产权类型、权利人、有效期和申报阶段，再判断是否与主营产品、研发内容匹配；匹配得上才有助于申报和企业布局。您现在已有哪类知识产权？';
  if (/项目|申报/.test(text)) return '先核对项目指南、企业条件、研发基础、人才和知识产权匹配度，再判断申报价值；补贴和立项结果以主管部门审核为准。您准备申报哪个项目？';
  return '专精特新更看企业的专业化经营和持续创新基础，不是简单购买一个证书；我们通常先看申报梯度、地区口径、主营产品、知识产权、研发投入和财务数据，再做培育或申报方案。您想先做企业测评，还是已经确定申报哪个梯度？';
}

function copy(text) {
  navigator.clipboard?.writeText(text).then(() => toast('已复制回复')).catch(() => toast('复制失败，请手动复制'));
}

function chars() {
  const input = $('#customer');
  const counter = $('#chars');
  if (input && counter) counter.textContent = `${input.value.length} / 1000`;
}

function nav(view) {
  $$('.view').forEach(node => node.classList.toggle('on', node.id === view));
  $$('nav button').forEach(node => node.classList.toggle('active', node.dataset.view === view));
}

function renderQuick() {
  const quick = $('#quick');
  if (!quick) return;
  const items = [
    ['我们想做专精特新，主要看哪些条件？', '先区分申报梯度和地区，再看主营产品、研发投入、知识产权和经营合规。'],
    ['你们这个项目申报能保证拿到补贴吗？', '先核对项目要求和企业条件，补贴和立项结果以主管部门审核为准。'],
    ['专利对企业认定有什么用？', '先看专利和主营产品是否匹配，再判断适合知识产权布局还是配套申报。'],
    ['审计数据和申报材料对不上怎么办？', '先做数据口径校准，研发、营收、合同发票和系统填报必须能相互佐证。']
  ];
  quick.innerHTML = items.map((item, index) => `<div class="quick-card" data-quick="${index}"><small>客户可能会说</small><p>“${item[0]}”</p><span>${item[1]}</span></div>`).join('');
  $$('[data-quick]').forEach(node => node.onclick = () => {
    $('#customer').value = node.querySelector('p').textContent.replace(/[“”]/g, '');
    chars();
    generateByApi();
  });
}

async function generateByApi() {
  const input = $('#customer');
  const customerText = input?.value.trim();
  if (!customerText) return toast('先把客户原话放进来');
  const style = mode === 'warm' ? '更有人情味' : mode === 'short' ? '短一点' : '正常销售';
  const province = $('#province')?.value || '全国口径';
  const button = $('#go');
  if (button) {
    button.disabled = true;
    button.dataset.oldText = button.textContent;
    button.textContent = '正在生成…';
  }
  try {
    const localContent = `${policyIntro}\n\n结合您刚才说的：${legacyReply(customerText)}`;
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerText, style, province })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'API 请求失败');
    const content = localContent;
    $('#result').innerHTML = `<div class="result-body"><div class="reason"><h4>销售判断</h4><p><b>说话方式：</b>${escapeHtml(style)}</p><p><b>省份口径：</b>${escapeHtml(province)}</p><p><b>生成方式：</b>${data.model === 'local-specialty' ? '专精特新专业规则' : '企服销售规则 API'}</p><span class="tag">新逻辑</span></div><div class="reply"><h4>客户回复文本</h4><p style="white-space:pre-wrap">${escapeHtml(content)}</p><button class="copy" id="copyReply">复制回复</button></div></div>`;
    $('#copyReply').onclick = () => copy(content);
    toast('已按新销售逻辑生成');
  } catch (error) {
    const content = `${policyIntro}\n\n结合您刚才说的：${legacyReply(customerText)}`;
    $('#result').innerHTML = `<div class="result-body"><div class="reason"><h4>回复判断</h4><p><b>生成方式：</b>旧网站本地回复逻辑</p><span class="tag">离线可用</span></div><div class="reply"><h4>客户回复文本</h4><p style="white-space:pre-wrap">${escapeHtml(content)}</p><button class="copy" id="copyReply">复制回复</button></div></div>`;
    $('#copyReply').onclick = () => copy(content);
    toast('已使用旧网站本地回复逻辑');
    toast(error.message || 'API 请求失败');
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = button.dataset.oldText || '按新逻辑生成';
    }
  }
}

$('#date') && ($('#date').textContent = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }));
$('#customer')?.addEventListener('input', chars);
$('#go')?.addEventListener('click', generateByApi);
$('#sample')?.addEventListener('click', () => {
  $('#customer').value = '我们想做专精特新，主要看哪些条件？';
  chars();
  generateByApi();
});
$$('.modes button').forEach(button => button.addEventListener('click', () => {
  $$('.modes button').forEach(node => node.classList.remove('selected'));
  button.classList.add('selected');
  mode = button.dataset.mode || 'normal';
}));
$$('nav button').forEach(button => button.addEventListener('click', () => nav(button.dataset.view)));
$$('[data-jump]').forEach(button => button.addEventListener('click', () => nav(button.dataset.jump)));
renderQuick();
chars();
