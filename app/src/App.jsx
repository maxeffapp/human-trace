import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowSquareOut,
  BookmarkSimple,
  BookOpenText,
  Buildings,
  CaretDown,
  CaretUp,
  Check,
  CircleNotch,
  ClockCounterClockwise,
  Copy,
  FileText,
  GearSix,
  GlobeHemisphereWest,
  HeartStraight,
  LinkSimpleHorizontal,
  ListBullets,
  MagnifyingGlass,
  Path,
  ShareNetwork,
  Sparkle,
  ThumbsDown,
  ThumbsUp,
  User,
  Users,
  UsersThree,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { requestHumanTrace } from "./trace-api.js";

const navItems = [
  { label: "Ara", icon: MagnifyingGlass, active: true },
  { label: "Geçmiş", icon: ClockCounterClockwise },
  { label: "Kaydedilenler", icon: BookmarkSimple },
  { label: "Topluluklar", icon: UsersThree },
];

const entityIcons = {
  person: User,
  team: Buildings,
  community: GlobeHemisphereWest,
  tradition: BookOpenText,
  unnamed_group: Users,
};

function EntityMark({ type, selected = false }) {
  const Icon = entityIcons[type] ?? User;
  return (
    <span className={`entity-mark${selected ? " is-selected" : ""}`} aria-hidden="true">
      <Icon size={22} weight={selected ? "fill" : "regular"} />
    </span>
  );
}

function AppNav() {
  return (
    <aside className="app-nav" aria-label="Ana navigasyon">
      <div className="brand-lockup">
        <img src="/assets/human-trace-monogram.png" alt="" className="brand-mark" />
        <span className="brand-name">Human<br />Trace</span>
      </div>

      <nav className="nav-list">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button key={label} type="button" className={`nav-item${active ? " is-active" : ""}`}>
            <Icon size={23} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <button type="button" className="nav-item nav-settings">
        <GearSix size={23} />
        <span>Ayarlar</span>
      </button>
    </aside>
  );
}

function QuestionBar({ value, onChange, onSubmit, loading }) {
  return (
    <form className="question-bar" onSubmit={onSubmit}>
      <ArrowLeft size={22} aria-hidden="true" />
      <label htmlFor="human-trace-question" className="sr-only">Sorunuzu yazın</label>
      <input
        id="human-trace-question"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Bir şey sorun…"
        autoComplete="off"
      />
      <button type="submit" className="ask-button" disabled={loading || !value.trim()}>
        {loading ? <CircleNotch size={19} className="spin" /> : <MagnifyingGlass size={19} />}
        <span>{loading ? "Araştırılıyor" : "Sor"}</span>
      </button>
    </form>
  );
}

function EmptyAnswer({ onSuggestion }) {
  const suggestions = ["Baskı makinesi bilgiyi nasıl değiştirdi?", "DNA’nın yapısı nasıl keşfedildi?"];
  return (
    <section className="empty-answer" aria-labelledby="empty-title">
      <Sparkle size={26} weight="fill" />
      <p className="eyebrow">CEVABIN İNSAN İZİ</p>
      <h1 id="empty-title">Bilgi hiçbir zaman<br />bir yerden çıkıp gelmedi.</h1>
      <p>
        Sorunuzu yanıtlayalım; anlamlı ve doğrulanabilir bir insan hikâyesi varsa,
        cevabın oluşmasına katkı verenleri de görünür kılalım.
      </p>
      <div className="suggestions" aria-label="Örnek sorular">
        {suggestions.map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => onSuggestion(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
}

function LoadingAnswer() {
  return (
    <section className="loading-answer" aria-live="polite">
      <CircleNotch size={30} className="spin" />
      <h1>Cevap araştırılıyor</h1>
      <p>Ana cevap ve olası insan izleri aynı anda kaynaklandırılıyor.</p>
    </section>
  );
}

function ErrorNotice({ error }) {
  return (
    <section className="error-notice" role="alert">
      <WarningCircle size={24} weight="fill" />
      <div>
        <strong>{error.code === "missing_api_key" ? "Canlı motor bağlantı bekliyor" : "Bir şey ters gitti"}</strong>
        <p>{error.message}</p>
        {error.code === "missing_api_key" && (
          <p className="error-hint">Anahtar yalnızca sunucuda tutulur; tarayıcıya gönderilmez.</p>
        )}
      </div>
    </section>
  );
}

function AnswerArticle({ data, selectedContributor, onCopy, copied, saved, onSave }) {
  const highlightedParagraphIds = new Set(selectedContributor?.paragraphIds ?? []);

  return (
    <article className="answer-article" data-testid="answer-article">
      <div className="answer-kicker"><Sparkle size={17} weight="fill" /> Yanıt</div>
      <h1>{data.title}</h1>
      <div className="answer-copy">
        {data.answer.map((paragraph) => {
          const highlighted = highlightedParagraphIds.has(paragraph.id);
          return (
            <p key={paragraph.id} id={paragraph.id} className={highlighted ? "is-highlighted" : ""}>
              {highlighted && (
                <span className="paragraph-link" title="Seçili insan iziyle bağlantılı bölüm">
                  <LinkSimpleHorizontal size={16} weight="bold" />
                </span>
              )}
              {paragraph.text}
            </p>
          );
        })}
      </div>

      {data.acknowledgement && (
        <div className="answer-acknowledgement">
          <HeartStraight size={19} />
          <span>{data.acknowledgement}</span>
        </div>
      )}

      <footer className="answer-actions">
        <button type="button" onClick={onCopy}>
          {copied ? <Check size={19} /> : <Copy size={19} />}
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
        <button type="button" onClick={onSave} className={saved ? "is-saved" : ""}>
          <BookmarkSimple size={19} weight={saved ? "fill" : "regular"} />
          {saved ? "Kaydedildi" : "Kaydet"}
        </button>
        <button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
          <ShareNetwork size={19} /> Paylaş
        </button>
        <span className="action-spacer" />
        <button type="button" aria-label="Yanıt faydalıydı"><ThumbsUp size={19} /></button>
        <button type="button" aria-label="Yanıt faydalı değildi"><ThumbsDown size={19} /></button>
      </footer>

      <div className="answer-meta">
        <span>{new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(data.meta.researchedAt))}</span>
        <span>•</span>
        <span>{data.meta.liveSearch ? "Canlı kaynaklarla üretildi" : "Görsel önizleme"}</span>
      </div>
    </article>
  );
}

function ContributorActions({ contributor, sources, onStory, onSources }) {
  return (
    <div className="contributor-actions">
      <button type="button" onClick={() => document.getElementById(contributor.paragraphIds[0])?.scrollIntoView({ behavior: "smooth", block: "center" })}>
        <LinkSimpleHorizontal size={17} /> Cevapta göster
      </button>
      <button type="button" onClick={onStory}><BookOpenText size={17} /> Hikâyeyi aç</button>
      <button type="button" onClick={onSources}><FileText size={17} /> {sources.length} kaynak</button>
    </div>
  );
}

function ContributionsView({ contributors, selectedId, onSelect, sourcesFor, onStory, onSources }) {
  return (
    <div className="contribution-list" data-testid="contributions-view">
      {contributors.map((contributor) => {
        const selected = contributor.id === selectedId;
        const sources = sourcesFor(contributor);
        return (
          <section key={contributor.id} className={`contribution-row${selected ? " is-open" : ""}`}>
            <button type="button" className="contribution-trigger" onClick={() => onSelect(contributor.id)} aria-expanded={selected}>
              <EntityMark type={contributor.entityType} selected={selected} />
              <span className="contribution-name">{contributor.name}</span>
              <span className="contribution-role">{contributor.role}</span>
              {selected ? <CaretUp size={18} /> : <CaretDown size={18} />}
            </button>
            {selected && (
              <div className="contribution-detail">
                <p>{contributor.summary}</p>
                <ContributorActions
                  contributor={contributor}
                  sources={sources}
                  onStory={() => onStory(contributor)}
                  onSources={() => onSources(contributor)}
                />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function LineageView({ contributors, selectedId, onSelect, sourcesFor, onStory, onSources }) {
  const selected = contributors.find((contributor) => contributor.id === selectedId) ?? contributors[0];
  if (!selected) return null;

  return (
    <div className="lineage-view" data-testid="lineage-view">
      <div className="lineage-list">
        {contributors.map((contributor) => {
          const isSelected = contributor.id === selected.id;
          return (
            <button key={contributor.id} type="button" className={`lineage-node${isSelected ? " is-selected" : ""}`} onClick={() => onSelect(contributor.id)}>
              <EntityMark type={contributor.entityType} selected={isSelected} />
              <span>
                <strong>{contributor.name}</strong>
                <small>{contributor.role}</small>
              </span>
            </button>
          );
        })}
      </div>
      <div className="lineage-detail">
        <p className="relationship-label">{selected.relationshipToPrevious}</p>
        <p>{selected.summary}</p>
        <ContributorActions
          contributor={selected}
          sources={sourcesFor(selected)}
          onStory={() => onStory(selected)}
          onSources={() => onSources(selected)}
        />
      </div>
      <blockquote>Bir fikir, çoğu zaman birbirine eklenen hayatların izidir.</blockquote>
    </div>
  );
}

function TraceRail({ data, mode, setMode, selectedId, onSelect, onStory, onSources }) {
  if (!data) {
    return (
      <aside className="trace-rail trace-rail-empty">
        <div className="trace-empty-mark"><UsersThree size={25} /></div>
        <h2>Bu bilginin ardındakiler</h2>
        <p>Bir cevap oluştuğunda, doğrulanmış katkılar burada görünecek.</p>
      </aside>
    );
  }

  if (data.traceStatus === "none" || data.contributors.length === 0) {
    return (
      <aside className="trace-rail trace-rail-empty">
        <div className="trace-empty-mark"><Check size={24} /></div>
        <h2>Bu cevap kendi başına yeterli</h2>
        <p>{data.traceReason || "Bu soruda anlamlı ve doğrulanabilir bir insan izi göstermek cevabı zenginleştirmiyor."}</p>
      </aside>
    );
  }

  const sourceMap = new Map(data.sources.map((source) => [source.id, source]));
  const sourcesFor = (contributor) => contributor.sourceIds.map((id) => sourceMap.get(id)).filter(Boolean);

  return (
    <aside className="trace-rail" aria-labelledby="trace-heading" data-testid="trace-rail">
      <header className="trace-header">
        <h2 id="trace-heading">Bu bilginin ardındakiler</h2>
        <p>Bu yanıtta {data.contributors.length} insan izi bulundu</p>
        <div className="mode-switch" role="tablist" aria-label="Human Trace görünümü">
          <button type="button" role="tab" aria-selected={mode === "contributions"} className={mode === "contributions" ? "is-active" : ""} onClick={() => setMode("contributions")}>
            <ListBullets size={18} /> Katkılar
          </button>
          <button type="button" role="tab" aria-selected={mode === "lineage"} className={mode === "lineage" ? "is-active" : ""} onClick={() => setMode("lineage")}>
            <Path size={18} /> İz Akışı
          </button>
        </div>
      </header>

      {mode === "contributions" ? (
        <ContributionsView contributors={data.contributors} selectedId={selectedId} onSelect={onSelect} sourcesFor={sourcesFor} onStory={onStory} onSources={onSources} />
      ) : (
        <LineageView contributors={data.contributors} selectedId={selectedId} onSelect={onSelect} sourcesFor={sourcesFor} onStory={onStory} onSources={onSources} />
      )}

      <footer className="trace-footer">
        <HeartStraight size={21} />
        <span>{data.acknowledgement}</span>
      </footer>
    </aside>
  );
}

function DetailDialog({ type, contributor, sources, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!type || !contributor) return null;

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <button type="button" className="dialog-close" onClick={onClose} aria-label="Kapat"><X size={21} /></button>
        <p className="eyebrow">{type === "story" ? "HUMAN TRACE · HİKÂYE" : "DOĞRULANMIŞ KAYNAKLAR"}</p>
        <h2 id="dialog-title">{contributor.name}</h2>
        <p className="dialog-role">{contributor.role}</p>
        {type === "story" ? (
          <p className="story-copy">{contributor.story}</p>
        ) : (
          <div className="source-list">
            {sources.map((source) => (
              <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                <FileText size={20} />
                <span>{source.title}<small>{new URL(source.url).hostname}</small></span>
                <ArrowSquareOut size={17} />
              </a>
            ))}
          </div>
        )}
        {type === "story" && sources.length > 0 && (
          <div className="story-sources"><FileText size={17} /> {sources.length} doğrulanmış kaynak</div>
        )}
      </section>
    </div>
  );
}

export function App() {
  const previewMode = useMemo(() => new URLSearchParams(window.location.search).get("preview") === "1", []);
  const [question, setQuestion] = useState(previewMode ? "Entropi neden hep artar?" : "");
  const [data, setData] = useState(null);
  const [mode, setMode] = useState("contributions");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const runQuestion = async (nextQuestion, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestHumanTrace(nextQuestion, options);
      setData(result);
      setSelectedId(result.contributors[0]?.id ?? null);
      setMode("contributions");
    } catch (nextError) {
      if (nextError.name !== "AbortError") setError(nextError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!previewMode) return;
    const controller = new AbortController();
    runQuestion("Entropi neden hep artar?", { preview: true, signal: controller.signal });
    return () => controller.abort();
  }, [previewMode]);

  const selectedContributor = data?.contributors.find((contributor) => contributor.id === selectedId) ?? null;
  const selectedSources = selectedContributor
    ? selectedContributor.sourceIds.map((id) => data.sources.find((source) => source.id === id)).filter(Boolean)
    : [];

  const handleSubmit = (event) => {
    event.preventDefault();
    if (question.trim()) runQuestion(question.trim());
  };

  const handleSuggestion = (suggestion) => {
    setQuestion(suggestion);
    runQuestion(suggestion);
  };

  const handleCopy = async () => {
    if (!data) return;
    await navigator.clipboard?.writeText(data.answer.map((paragraph) => paragraph.text).join("\n\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="app-shell">
      <AppNav />
      <main className="answer-workspace">
        <QuestionBar value={question} onChange={setQuestion} onSubmit={handleSubmit} loading={loading} />
        <div className="answer-scroll">
          {error && <ErrorNotice error={error} />}
          {loading && !data ? (
            <LoadingAnswer />
          ) : data ? (
            <AnswerArticle data={data} selectedContributor={selectedContributor} onCopy={handleCopy} copied={copied} saved={saved} onSave={() => setSaved((value) => !value)} />
          ) : (
            <EmptyAnswer onSuggestion={handleSuggestion} />
          )}
        </div>
      </main>
      <TraceRail data={data} mode={mode} setMode={setMode} selectedId={selectedId} onSelect={setSelectedId} onStory={(contributor) => setDialog({ type: "story", contributor })} onSources={(contributor) => setDialog({ type: "sources", contributor })} />

      <DetailDialog
        type={dialog?.type}
        contributor={dialog?.contributor}
        sources={dialog ? dialog.contributor.sourceIds.map((id) => data.sources.find((source) => source.id === id)).filter(Boolean) : selectedSources}
        onClose={() => setDialog(null)}
      />
    </div>
  );
}
