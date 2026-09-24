import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import './App.css';
import {
  ShieldCheck as IconShield,
  Clock as IconClock,
  MapPin as IconMap,
  Lock as IconLock,
  ChevronDown as IconChevronDown,
  ChevronRight as IconChevronRight,
  Menu as IconMenu,
  X as IconX,
  Globe as IconGlobe,
  Send as IconSend,
  ArrowUp as IconArrowUp,
} from 'lucide-react';
import { SiTether as CoinTether } from 'react-icons/si';
import { FaDollarSign as CoinDollar, FaEuroSign as CoinEuro, FaMoneyBillWave as CoinCash } from 'react-icons/fa';

const CONTACT_LINK = "https://t.me/+2ktARr9AH1Q4YjI0";

/* ---------- данные ---------- */

const CURRENCY_MAP = {
  USD: { badge: 'usd', Glyph: CoinDollar },
  EUR: { badge: 'eur', Glyph: CoinEuro },
  USDT: { badge: 'usdt', Glyph: CoinTether },
  PLN: { badge: 'pln', Glyph: CoinCash },
};

const TRUST_POINTS = [
  { Icon: IconShield, label: 'Безопасно' },
  { Icon: IconClock, label: 'Быстро' },
  { Icon: IconLock, label: 'Конфиденциально' },
];

const WHY_ITEMS = [
  { Icon: IconShield, headline: 'Лучшие рейтинги', copy: 'Проверенный обменный пункт с безупречной репутацией' },
  { Icon: IconMap, headline: 'Местный опыт', copy: 'Работаем в Польше, знаем рынок и потребности клиентов' },
  { Icon: IconLock, headline: 'Безопасность превыше всего', copy: 'Все сделки только при личной встрече' },
  { Icon: IconShield, headline: 'Максимальная защита', copy: 'Гарантия конфиденциальности и анонимности' },
];

const CITY_LIST = ['Варшава', 'Вроцлав', 'Гданьск', 'Гдыня', 'Краков', 'Лодзь', 'Познань', 'Щецин'];

const CONVERSION_LIST = [
  { src: 'USDT', dst: 'PLN', srcName: 'Tether', dstName: 'Польские злотые' },
  { src: 'USDT', dst: 'USD', srcName: 'Tether', dstName: 'Доллары' },
  { src: 'USDT', dst: 'EUR', srcName: 'Tether', dstName: 'Евро' },
  { src: 'PLN', dst: 'USDT', srcName: 'Польские злотые', dstName: 'Tether' },
  { src: 'USD', dst: 'USDT', srcName: 'Доллары', dstName: 'Tether' },
  { src: 'EUR', dst: 'USDT', srcName: 'Евро', dstName: 'Tether' },
];

const PROCESS_STAGES = [
  { idx: 1, Icon: IconSend, name: 'Связь', note: 'Напишите нам в Telegram' },
  { idx: 2, Icon: IconClock, name: 'Согласование', note: 'Курс, сумма, место, время' },
  { idx: 3, Icon: IconMap, name: 'Встреча', note: 'Личный визит в офис' },
  { idx: 4, Icon: IconShield, name: 'Обмен', note: 'Физический обмен на месте' },
];

const ADVANTAGE_ITEMS = [
  { Icon: IconLock, headline: 'Безопасность', copy: 'Только личные встречи' },
  { Icon: IconClock, headline: 'Автоматизация', copy: 'Быстрое согласование' },
  { Icon: IconShield, headline: 'Выгода', copy: 'Лучшие курсы' },
  { Icon: IconMap, headline: 'Гибкость', copy: 'Под ваш график' },
  { Icon: IconShield, headline: 'Комфорт', copy: 'Без бюрократии' },
  { Icon: IconShield, headline: 'Доверие', copy: 'Проверенная репутация' },
];

const QA_LIST = [
  { q: 'Почему стоит выбрать SWAP LIX?', a: 'Мы предлагаем физический обмен криптовалют с личной встречей. Это гарантирует безопасность, конфиденциальность и лучшие курсы.' },
  { q: 'Какие валюты вы обмениваете?', a: 'USDT на польские злотые, доллары и евро, а также обратный обмен.' },
  { q: 'Какие способы оплаты?', a: 'Наличные при личной встрече. Мы не работаем с картами и онлайн-переводами.' },
  { q: 'Как происходит наличный обмен?', a: 'Вы связываетесь с менеджером, согласовываете детали и приезжаете в офис. Обмен производится на месте.' },
  { q: 'Какой курс обмена?', a: 'Актуальный курс узнавайте у менеджера в Telegram. Курс фиксируется до сделки.' },
  { q: 'Какие комиссии?', a: 'Минимальные. Точную комиссию согласовываем до сделки, без скрытых платежей.' },
  { q: 'Нужна ли верификация KYC?', a: 'Нет. Мы не требуем верификацию или регистрацию.' },
  { q: 'Вы работаете 24/7?', a: 'Служба поддержки 24/7. Обмен по предварительной записи ежедневно с 09:00 до 20:00.' },
  { q: 'Есть ли реферальная программа?', a: 'На данный момент нет. Но мы ценим постоянных клиентов.' },
  { q: 'Можно ли обменять крупные суммы?', a: 'Да. Детали крупных сумм обсуждаются с менеджером индивидуально.' },
];

const NAV_MENU = [
  { href: '#exchange', text: 'Обмен' },
  { href: '#directions', text: 'Курсы' },
  { href: '#footer', text: 'Контакты' },
];

const DROPDOWN_USEFUL = [
  { href: '#why', text: 'О Нас' },
  { href: '#faq', text: 'FAQ' },
  { href: '#locations', text: 'Города' },
  { href: '#how', text: 'Как проходит обмен' },
];

const DROPDOWN_BUSINESS = [
  { href: '#exchange', text: 'Виртуальные карты' },
  { href: '#exchange', text: 'OTC биржа' },
  { href: '#exchange', text: 'Свой обменник' },
];

const FOOTER_CRYPTO = [
  { href: '#directions', text: 'Направления обменов' },
  { href: '#directions', text: 'Курсы криптовалют' },
  { href: '#directions', text: 'Обмен USDT' },
  { href: '#directions', text: 'Обмен на PLN' },
  { href: '#directions', text: 'Обмен на USD' },
];

const FOOTER_USEFUL = [
  { href: '#why', text: 'О Нас' },
  { href: '#faq', text: 'FAQ' },
  { href: '#locations', text: 'Города' },
  { href: '#how', text: 'Как проходит обмен' },
];

/* ---------- утилиты ---------- */

function TelegramGlyph({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.5 3.5L2.5 11l5.5 2 2 6 3-3.5 5 4 3.5-16zM10 14l8-7-10 6.5z" />
    </svg>
  );
}

function useScrollFlags() {
  const [flags, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'update':
          return { isScrolled: action.y > 50, showTop: action.y > 300 };
        default:
          return state;
      }
    },
    { isScrolled: false, showTop: false }
  );

  useEffect(() => {
    const onScroll = () => dispatch({ type: 'update', y: window.scrollY });
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return flags;
}

function useInViewFade() {
  const nodeRef = useRef(null);
  useEffect(() => {
    const target = nodeRef.current;
    if (!target) return;
    const watcher = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('revealed')),
      { threshold: 0.1 }
    );
    watcher.observe(target);
    return () => watcher.disconnect();
  }, []);
  return nodeRef;
}

function AnimatedNumber({ value }) {
  const [shown, setShown] = useState(0);
  const anchorRef = useRef(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const watcher = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !firedRef.current) {
        firedRef.current = true;
        const destination = parseInt(value.replace(/\D/g, ''), 10);
        const begin = performance.now();
        const step = (now) => {
          const p = Math.min((now - begin) / 1500, 1);
          setShown(Math.floor(p * destination));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    });
    watcher.observe(anchor);
    return () => watcher.disconnect();
  }, [value]);

  return <span ref={anchorRef}>{shown.toLocaleString()}{value.includes('+') ? '+' : ''}</span>;
}

function FadeBlock({ children }) {
  const ref = useInViewFade();
  return <div ref={ref} className="reveal">{children}</div>;
}

/* ---------- компоненты ---------- */

function CurrencyBadge({ code }) {
  const entry = CURRENCY_MAP[code];
  if (!entry) return null;
  const { badge, Glyph } = entry;
  return (
    <div className={`coin-icon ${badge}`}>
      <Glyph />
    </div>
  );
}

function ConversionCard({ src, dst, srcName, dstName }) {
  const [noticed, setNoticed] = useState(false);

  const go = useCallback((event) => {
    event.preventDefault();
    setNoticed(true);
    const closeTimer = setTimeout(() => setNoticed(false), 2000);
    const openTimer = setTimeout(() => window.open(CONTACT_LINK, '_blank'), 500);
    return () => { clearTimeout(closeTimer); clearTimeout(openTimer); };
  }, []);

  return (
    <div className="exchange-card">
      <div className="exchange-icons">
        <CurrencyBadge code={src} />
        <span className="exchange-arrow">→</span>
        <CurrencyBadge code={dst} />
      </div>
      <div className="exchange-pair">{src} → {dst}</div>
      <div className="exchange-names">{srcName} → {dstName}</div>
      <a href={CONTACT_LINK} onClick={go} className="exchange-btn">
        ОБМЕНЯТЬ <TelegramGlyph className="btn-tg" />
      </a>
      {noticed && <div className="toast">Перенаправляем в Telegram...</div>}
    </div>
  );
}

function TopBar({ isScrolled }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openUseful, setOpenUseful] = useState(false);
  const [openBusiness, setOpenBusiness] = useState(false);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-inner">
        <img src="/logo.png" alt="SWAP LIX" className="header-logo" />

        <nav className="nav">
          {NAV_MENU.map(({ href, text }) => (
            <a key={text} href={href} className="nav-link">{text}</a>
          ))}

          <div className="nav-dropdown" onMouseEnter={() => setOpenUseful(true)} onMouseLeave={() => setOpenUseful(false)}>
            <button className="nav-link">Полезное <IconChevronDown className="chevron-sm" /></button>
            {openUseful && (
              <div className="dropdown">
                {DROPDOWN_USEFUL.map(({ href, text }) => (
                  <a key={text} href={href} className="dropdown-item">{text}</a>
                ))}
              </div>
            )}
          </div>

          <div className="nav-dropdown" onMouseEnter={() => setOpenBusiness(true)} onMouseLeave={() => setOpenBusiness(false)}>
            <button className="nav-link">Бизнесу <IconChevronDown className="chevron-sm" /></button>
            {openBusiness && (
              <div className="dropdown">
                {DROPDOWN_BUSINESS.map(({ href, text }) => (
                  <a key={text} href={href} className="dropdown-item">{text}</a>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="header-right">
          <button className="lang-btn"><IconGlobe className="lang-icon" /> PL</button>
          <a href={CONTACT_LINK} target="_blank" rel="noopener noreferrer" className="header-tg">
            Написать в Telegram <TelegramGlyph className="header-tg-icon" />
          </a>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <IconX /> : <IconMenu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          {NAV_MENU.map(({ href, text }) => (
            <a key={text} href={href} className="mobile-link" onClick={() => setMobileOpen(false)}>{text}</a>
          ))}
          <button className="mobile-link" onClick={() => setOpenUseful(!openUseful)}>
            Полезное <IconChevronDown className="chevron-sm" />
          </button>
          {openUseful && (
            <div className="mobile-sublinks">
              {DROPDOWN_USEFUL.map(({ href, text }) => (
                <a key={text} href={href} className="mobile-link" onClick={() => setMobileOpen(false)}>{text}</a>
              ))}
            </div>
          )}
          <button className="mobile-link" onClick={() => setOpenBusiness(!openBusiness)}>
            Бизнесу <IconChevronDown className="chevron-sm" />
          </button>
          {openBusiness && (
            <div className="mobile-sublinks">
              {DROPDOWN_BUSINESS.map(({ href, text }) => (
                <a key={text} href={href} className="mobile-link" onClick={() => setMobileOpen(false)}>{text}</a>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function HeroBanner() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-left">
          <div className="hero-trust">
            {TRUST_POINTS.map(({ Icon, label }) => (
              <span key={label} className="trust-item">
                <Icon className="trust-icon" /> {label}
              </span>
            ))}
          </div>
          <h1 className="hero-title">
            Обмен криптовалюты –<br />
            <span className="hero-accent">быстро, выгодно и легко</span>
          </h1>
          <p className="hero-desc">
            SWAP LIX — физический обмен криптовалют в Польше.
            Назначаем время и место встречи. Вы приходите и совершаете обмен лично.
          </p>
          <a href={CONTACT_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary pulse">
            <TelegramGlyph className="btn-icon" /> НАПИСАТЬ МЕНЕДЖЕРУ
          </a>
        </div>
        <div className="hero-right">
          <div className="hero-glow" />
          <img src="/mogo.png" alt="SWAP LIX" className="hero-graphic" />
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const items = [
    { value: '300+', label: 'Обменных операций в день' },
    { value: '14', label: 'Лет на рынке' },
    { value: '20000+', label: 'Довольных клиентов' },
    { value: '50+', label: 'Поддерживаемых валют' },
  ];
  return (
    <section className="stats">
      <div className="stats-inner">
        {items.map(({ value, label }) => (
          <div className="stat-block" key={label}>
            <div className="stat-num"><AnimatedNumber value={value} /></div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="why" id="why">
      <div className="section-inner">
        <div className="eyebrow">ТОРГУЙТЕ ВЫГОДНО И БЕЗОПАСНО</div>
        <h2 className="section-title">Почему SWAP LIX – это №1 криптообменник</h2>
        <div className="why-grid">
          {WHY_ITEMS.map(({ Icon, headline, copy }) => (
            <div className="why-card" key={headline}>
              <div className="why-icon-wrap"><Icon className="why-icon" /></div>
              <h3>{headline}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationsSection() {
  return (
    <section className="locations" id="locations">
      <div className="section-inner">
        <div className="eyebrow">ПРОВЕРЬТЕ ДОСТУПНОСТЬ</div>
        <h2 className="section-title">Доступно в городах Польши</h2>
        <div className="locations-grid">
          {CITY_LIST.map((city) => (
            <div className="location-card" key={city}>
              <div className="location-icon-wrap"><IconMap className="location-icon" /></div>
              <span>{city}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CashBanner() {
  return (
    <section className="cash-exchange">
      <div className="section-inner">
        <div className="cash-banner">
          <div className="cash-left">
            <div className="cash-icon-wrap"><IconShield className="cash-icon" /></div>
            <div>
              <div className="eyebrow">КОНТРОЛИРУЙТЕ СВОИ ФИНАНСЫ</div>
              <h2 className="cash-title">Обналичивайте USDT в удобном для вас месте</h2>
              <p className="cash-desc">Легко конвертируйте криптовалюту в реальные деньги при личной встрече.</p>
            </div>
          </div>
          <div className="cash-right">
            <div className="cash-coins">
              <CurrencyBadge code="USDT" />
              <CurrencyBadge code="USD" />
              <CurrencyBadge code="EUR" />
              <CurrencyBadge code="PLN" />
            </div>
            <a href={CONTACT_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <TelegramGlyph className="btn-icon" /> Связаться с менеджером
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function DirectionsSection() {
  return (
    <section className="directions" id="directions">
      <div className="section-inner">
        <div className="eyebrow">ОБМЕНЯЙТЕ БЕЗ ОГРАНИЧЕНИЙ</div>
        <h2 className="section-title">Доступные направления обмена</h2>
        <div className="directions-grid">
          {CONVERSION_LIST.map((row) => (
            <ConversionCard key={`${row.src}-${row.dst}`} {...row} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="how" id="how">
      <div className="section-inner">
        <div className="eyebrow">ПРОСТОЙ ПРОЦЕСС</div>
        <h2 className="section-title">Как проходит обмен</h2>
        <div className="how-timeline">
          {PROCESS_STAGES.map(({ idx, Icon, name, note }, position) => (
            <FadeBlock key={idx}>
              {position > 0 && (
                <div className="how-connector"><IconChevronRight className="connector-arrow" /></div>
              )}
              <div className="how-step-card">
                <div className="how-step-header">
                  <div className="how-num">{idx}</div>
                  <div className="how-step-icon"><Icon className="how-icon-svg" /></div>
                </div>
                <h3>{name}</h3>
                <p>{note}</p>
              </div>
            </FadeBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="benefits">
      <div className="section-inner">
        <div className="eyebrow">ПОЧЕМУ МЫ</div>
        <h2 className="section-title">Лучший обменник криптовалют с минимальными комиссиями!</h2>
        <div className="benefits-grid">
          {ADVANTAGE_ITEMS.map(({ Icon, headline, copy }) => (
            <div className="benefit-card" key={headline}>
              <div className="benefit-icon-wrap"><Icon className="benefit-icon" /></div>
              <h3>{headline}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [query, setQuery] = useState('');
  const [openIdx, setOpenIdx] = useState(null);

  const visible = useMemo(
    () => QA_LIST.filter(({ q }) => q.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <section className="faq" id="faq">
      <div className="section-inner">
        <div className="eyebrow">ЕСТЬ ВОПРОСЫ?</div>
        <h2 className="section-title">Часто задаваемые вопросы (FAQ)</h2>
        <input
          type="text"
          className="faq-search"
          placeholder="Поиск по вопросам..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="faq-list">
          {visible.map(({ q, a }, i) => {
            const isOpen = openIdx === i;
            return (
              <div className="faq-item" key={q}>
                <button className="faq-question" onClick={() => setOpenIdx(isOpen ? null : i)}>
                  {q}
                  <span className={`faq-chevron ${isOpen ? 'open' : ''}`}>+</span>
                </button>
                <div className={`faq-answer-wrapper ${isOpen ? 'open' : ''}`}>
                  <div className="faq-answer">{a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCall() {
  return (
    <section className="cta">
      <div className="cta-inner">
        <h2>Готовы к обмену?</h2>
        <p>Напишите нам в Telegram и получите лучший курс прямо сейчас!</p>
        <a href={CONTACT_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary pulse">
          <TelegramGlyph className="btn-icon" /> НАПИСАТЬ МЕНЕДЖЕРУ
        </a>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-inner">
        <div className="footer-col footer-brand">
          <img src="/logo.png" alt="SWAP LIX" className="footer-logo" />
          <p>Физический обмен криптовалют в Польше. Безопасно, быстро, конфиденциально.</p>
        </div>

        <div className="footer-col">
          <h4>О криптовалюте</h4>
          {FOOTER_CRYPTO.map(({ href, text }) => <a key={text} href={href}>{text}</a>)}
        </div>

        <div className="footer-col">
          <h4>Полезное</h4>
          {FOOTER_USEFUL.map(({ href, text }) => <a key={text} href={href}>{text}</a>)}
        </div>

        <div className="footer-col">
          <h4>Контакты</h4>
          <a href={CONTACT_LINK}><TelegramGlyph className="footer-icon" /> Telegram</a>
          <span><IconClock className="footer-icon" /> 08:00–24:00 UTC+2</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2024 SWAP LIX. Физический обмен криптовалют в Польше.</span>
      </div>
    </footer>
  );
}

/* ---------- приложение ---------- */

export default function SwapLixSite() {
  const { isScrolled, showTop } = useScrollFlags();

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="page">
      <TopBar isScrolled={isScrolled} />

      <main>
        <HeroBanner />
        <FadeBlock><StatsBar /></FadeBlock>
        <FadeBlock><WhySection /></FadeBlock>
        <FadeBlock><LocationsSection /></FadeBlock>
        <FadeBlock><CashBanner /></FadeBlock>
        <FadeBlock><DirectionsSection /></FadeBlock>
        <ProcessSection />
        <FadeBlock><BenefitsSection /></FadeBlock>
        <FadeBlock><FaqSection /></FadeBlock>
        <FadeBlock><FinalCall /></FadeBlock>
      </main>

      <SiteFooter />

      {showTop && (
        <button className="back-to-top" onClick={scrollTop}><IconArrowUp /></button>
      )}
    </div>
  );
}