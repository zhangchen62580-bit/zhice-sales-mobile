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
  if (/ISO|三体系|质量管理|环境管理|职业健康|认证审核/.test(text)) return 'ISO不是买一张证书，先要看客户是为了招投标/客户准入、质量管理、环保合规还是职业健康安全；9001管质量，14001管环境，45001管职业健康安全。通常要准备体系文件、过程记录、内审、管理评审和整改证据，再接受认证审核；周期和价格要按企业人数、场所、认证范围、行业和是否临近投标节点核算，不能直接承诺25个工作日或包过。先确认一下，客户是要单独做9001，还是三体系一起做？';
  if (/审计|研发|营收|合同|发票|数据|对不上|不一致/.test(text)) return '这类重点是研发、营收、合同发票和系统填报口径能相互佐证，先把数据口径校准，再判断能不能申报。您现在最不一致的是哪一项？';
  if (/条件|要求|门槛|标准/.test(text)) return '不能只看有没有专利，通常要按创新型中小企业、专精特新中小企业、小巨人等梯度，综合看主营产品、细分市场、研发投入、知识产权、营收、科技人员和合规情况。您准备申报哪个地区、哪个梯度？';
  if (/项目申报|申报项目|项目申请|申报哪个项目|项目扶持|产业项目|技改项目|研发项目|人才项目/.test(text)) return '先核对项目指南、企业条件、研发基础、人才和知识产权匹配度，再判断申报价值；补贴和立项结果以主管部门审核为准。您准备申报哪个项目？';
  if (/费用|价格|多少钱|收费/.test(text)) return '费用要看企业基础、申报梯度、材料完整度和整改难度，不能按“办一个证”简单报价。您准备申报哪个梯度，现有知识产权、研发台账和近两年财务数据整理到什么程度？';
  if (/时间|截止|什么时候|周期|批次/.test(text)) return '时间要看当地通知和申报批次，通常要先完成条件核对、材料准备和口径校准，再按通知节点提交，不能一概而论。您准备申报哪个地区、哪个项目？';
  if (/保证|通过|成功率|包过|能不能过/.test(text)) return '不能承诺包过，最终要以主管部门审核为准；我们能控制的是梯度匹配、专利布局、审计校准、材料逻辑和申报风险预审。您所在省市、成立年限和主营产品是什么？';
  if (/贷款|融资|银行|授信/.test(text)) return '这类认定可以作为融资和银行授信时的企业背书，但不能替代银行对经营、流水、纳税、负债和还款能力的审核。您更关注贷款额度、利率还是授信材料？';
  if (/专利|知识产权|商标|软著/.test(text)) return '先看知识产权类型、权利人、有效期和申报阶段，再判断是否与主营产品、研发内容匹配；匹配得上才有助于申报和企业布局。您现在已有哪类知识产权？';
  if (/补贴|奖励|福利|政策|优惠|省钱|拿钱|有什么用|作用|好处|价值|对企业|实际/.test(text)) return '专精特新/科小的价值不只是挂一块牌子，通常体现在：符合条件时可对接各级奖补和扶持，研发费用、税费和项目申报有政策空间；融资授信、招投标和大客户合作时多一层资质背书；后续技改、研发、人才和产业项目也可能获得优先关注。具体补贴和优惠以当地当年政策、企业条件和主管部门审核为准。您更关注补贴、融资还是招投标？';
  if (/材料|资料|清单|准备/.test(text)) return '重点准备营业执照、近2—3年财务报表、研发台账、知识产权证书、科技人员社保、产品销售佐证、合同发票和合规材料；还要校准研发归集、审计数据和知识产权与主营产品的匹配度，具体以当地通知为准。您现在资料整理到什么程度了？';
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
    const response = await fetch('https://zhice-sales.zhangchen62580.workers.dev/api/online-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerText, style, biz: $('#biz')?.value || 'auto' })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '在线 API 生成失败');
    const content = data.content || localContent;
    $('#result').innerHTML = `<div class="result-body"><div class="reason"><h4>销售判断</h4><p><b>说话方式：</b>${escapeHtml(style)}</p><p><b>省份口径：</b>${escapeHtml(province)}</p><p><b>生成方式：</b>${data.online ? '在线知识库 + 旧网站回复逻辑' : '旧网站完整回复逻辑（兜底）'}</p><span class="tag">${data.online ? '在线分析完成' : '离线兜底'}</span></div><div class="reply"><h4>客户回复文本</h4><p style="white-space:pre-wrap">${escapeHtml(content)}</p><button class="copy" id="copyReply">复制回复</button></div></div>`;
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

const recognitionCatalog = [
  { type:'企业认定', name:'科技型中小企业', tags:'科小 科技型 评价', condition:'在中国境内注册；通常要求科技人员、研发活动和创新能力符合评价口径；具体指标以2026年度评价通知及属地平台为准。', time:'2026年度：按科技部门/属地平台通知申报；当年入库，有效期通常1年。', price:'官方评价通常不收取认定费；审计、咨询、材料整理等第三方费用另计。', value:'可作为研发加计扣除、项目申报和后续创新型/专精特新培育的基础。', source:'https://docs.qq.com/doc/DZnRZc0dUcURGbW1O' },
  { type:'企业认定', name:'创新型中小企业', tags:'创新型 评价 直通车', condition:'按创新能力、成长性、专业化等指标评价；部分企业可按直通条件申报，需以当年平台规则核验。', time:'2026年度时间由省市主管部门发布；材料提交后通常需等待审核、公示。', price:'认定申请本身通常不收费；审计、咨询和知识产权等准备成本不等同于官方收费。', value:'处于优质中小企业梯度前置层级，可衔接专精特新中小企业申报。', source:'https://docs.qq.com/doc/DZnRZc0dUcURGbW1O' },
  { type:'企业认定', name:'高新技术企业', tags:'高新 高企 税收', condition:'需满足知识产权、科技人员、研发费用、高新技术产品收入和企业所得税等综合条件，不能只看专利数量。', time:'2026年度申报批次、受理时间和复审安排以所在地科技/税务部门通知为准；有效期通常3年。', price:'文档参考：年收入1000万元以下审计报告约2000—2500元/本；服务费、专项审计费按企业情况另核。', value:'符合条件时可享受高新技术企业相关税收政策，并增强项目、融资和客户背书；税率和适用条件需按现行税法核验。', source:'https://docs.qq.com/doc/DZnRZc0dUcURGbW1O' },
  { type:'企业认定', name:'专精特新中小企业', tags:'专精特新 省级 认定', condition:'重点看细分市场、主营产品、研发投入、知识产权、营收、人员和合规数据的一致性；2026新办法及属地细则要分别核对。', time:'2026年度各省市分批发布；从提交到结果通常按当地流程，文档参考下证约3—5个月。', price:'文档参考服务费约1.5万元；官方认定是否收费以当年通知为准，审计/IP/整改等成本另计。', value:'可对接地方奖励、项目申报、融资授信、招投标背书和技改研发项目，但地方金额不能全国套用。', source:'https://docs.qq.com/doc/DZnRZc0dUcURGbW1O' },
  { type:'企业认定', name:'专精特新“小巨人”', tags:'小巨人 国家级', condition:'须先具备省级专精特新中小企业基础，按2026新办法核对营收、研发、知识产权、主导产品和数据真实性等指标。', time:'2026年度公开线上填报时间为4月25日至5月25日；申请和复核不收费；有效期和复核按工信部规则执行。', price:'官方申请不收费；第三方服务、审计和材料准备费用不等同于官方收费。', value:'国家级产业链、创新攻关、融资和项目资源对接价值更强，但不承诺必得补贴或项目。', source:'https://www.miit.gov.cn/jgsj/qyj/wjfb/art/2026/art_83857a4773ac4583bd1540eeb78bcbcb.html' },
  { type:'资质认定', name:'ISO三体系认证', tags:'ISO 9001 14001 45001', condition:'需要建立并运行质量、环境、职业健康安全管理体系，准备制度、记录、运行证据和现场审核。', time:'文档参考约25个工作日下证；实际取决于机构排期、企业规模和整改情况。', price:'按文档口径报价；带标/不带标价格需单独确认，不能只看低价。', value:'常用于客户准入、招投标、供应链审核和内部管理规范化。', source:'https://docs.qq.com/doc/DZnRZc0dUcURGbW1O' },
  { type:'资质认定', name:'发明专利', tags:'专利 知识产权 发明', condition:'核心是新颖性、创造性和实用性；已公开技术可能影响新颖性，申请前要做检索和保密。', time:'授权周期通常较长；授权后有效期一般20年，具体以法律和缴费状态为准。', price:'文档参考电子申请官费3450元；委托代理、答复和加急服务另计，购买现成专利约2万元仅作文档参考。', value:'可支撑核心技术、研发项目、产品竞争力和高企/专精特新材料，但必须与主导产品和研发活动匹配。', source:'https://docs.qq.com/doc/DZnRZc0dUcURGbW1O' },
  { type:'资质认定', name:'实用新型专利', tags:'专利 实用新型', condition:'适用于产品结构、构造或其结合的技术方案；软件本身通常不能直接申请实用新型。', time:'周期通常短于发明专利，具体以审查和代理进度为准；有效期一般10年。', price:'文档参考官费500元；代理/撰写购买价格约2000—3000元，仅作参考。', value:'适合补充产品结构类知识产权，但要核查权利稳定性和与主导产品的关联。', source:'https://docs.qq.com/doc/DZnRZc0dUcURGbW1O' },
  { type:'资质认定', name:'软件著作权', tags:'软著 软件 知识产权', condition:'准备源程序、说明文档和权利主体材料；权属、版本和实际开发情况要一致。', time:'以登记受理和审查进度为准，不能承诺固定下证时间。', price:'文档参考申请服务费约800—1000元；是否含代理、加急和授权服务要先确认。', value:'可用于软件产品权属证明、项目申报、客户交付和知识产权组合建设。', source:'https://docs.qq.com/doc/DZnRZc0dUcURGbW1O' },
  { type:'资质认定', name:'商标注册', tags:'商标 45类 品牌', condition:'准备商标图样、申请人资质和注册类别；共45类，提交前应做近似检索。', time:'官方审查按商标流程推进，实际时间受类别、补正和审查情况影响。', price:'官方规费、代理服务费按申请类别和渠道核算；自己网上提交通常更省代理费。', value:'用于品牌保护、市场拓展、政府采购和客户信任建设。', source:'https://docs.qq.com/doc/DZnRZc0dUcURGbW1O' },
  { type:'资质认定', name:'ICP/电信增值业务许可证', tags:'ICP 许可证 网站', condition:'适用于相应互联网信息服务场景，需结合业务模式、主体资质、服务器和属地要求判断。', time:'2026年度办理时间按通信管理部门审核进度，以当地要求为准。', price:'不能按统一价直接报价，需先判断是ICP备案、ICP许可证还是其他增值电信业务许可。', value:'降低合规经营风险，支持网站、平台和线上业务正常开展。', source:'https://docs.qq.com/doc/DZnRZc0dUcURGbW1O' }
];

function renderCatalog() {
  const list = $('#catalogList');
  const meta = $('#catalogMeta');
  if (!list) return;
  const query = ($('#catalogSearch')?.value || '').trim().toLowerCase();
  const type = $('#catalogType')?.value || 'all';
  const rows = recognitionCatalog.filter(item => (type === 'all' || item.type === type) && [item.type,item.name,item.tags,item.condition,item.time,item.price,item.value].join(' ').toLowerCase().includes(query));
  if (meta) meta.textContent = `数据更新：2026年10月13日 · 共 ${rows.length} 项 · 价格为资料参考价，地方政策和年度时间以官方最新通知为准`;
  list.innerHTML = rows.length ? rows.map(item => `<article class="catalog-card"><div class="catalog-card-top"><span class="catalog-type">${escapeHtml(item.type)}</span><h3>${escapeHtml(item.name)}</h3></div><div class="catalog-grid"><div><b>申请条件</b><p>${escapeHtml(item.condition)}</p></div><div><b>2026时间/有效期</b><p>${escapeHtml(item.time)}</p></div><div><b>总体价格</b><p>${escapeHtml(item.price)}</p></div><div><b>主要价值</b><p>${escapeHtml(item.value)}</p></div></div><div class="catalog-tags">${escapeHtml(item.tags)} <a href="${item.source}" target="_blank" rel="noreferrer">查看资料来源</a></div></article>`).join('') : '<div class="card empty"><h3>暂时没有匹配内容</h3><p>换一个关键词，例如：专精特新、时间、价格、专利、ISO。</p></div>';
}

function initCatalog() {
  if (!$('#catalogList')) return;
  $('#catalogSearch')?.addEventListener('input', renderCatalog);
  $('#catalogType')?.addEventListener('change', renderCatalog);
  renderCatalog();
  $$('nav button[data-view="catalog"]').forEach(button => button.addEventListener('click', renderCatalog));
}

initCatalog();

