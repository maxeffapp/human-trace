# İnsan İzi

**Yapay Zekâ Cevaplarında İnsanlık Hafızası ve Hikâye Katmanı**

> **İnsan İzi, yapay zekânın kullandığı insanlık bilgisinin arkasındaki insanları, toplulukları ve yaşanmışlıkları doğru, doğal ve hikâye odaklı biçimde yeniden görünür hale getiren bir anlatı katmanıdır.**

---

## 1. Projenin Temel Fikri

Yapay zekâ bugün insanlığın yüzyıllar boyunca ürettiği bilimsel, kültürel, sanatsal ve düşünsel birikimi kullanarak cevaplar üretiyor. Ancak ortaya çıkan cevap çoğu zaman bu bilginin arkasındaki insanları, toplulukları, dönemleri ve yaşanmışlıkları görünmez hale getiriyor.

**İnsan İzi**, yapay zekâ cevabının arkasındaki anlamlı insan hikâyelerini doğal biçimde görünür hale getiren bir anlatı katmanıdır.

Amaç klasik bir kaynakça, tarihçe veya ansiklopedi oluşturmak değildir.

Amaç:

> Bir bilginin arkasında bir insan, bir toplum, bir mücadele, bir merak veya bir dönem varsa bunu gerektiği yerde yeniden hikâyenin içine katmak.

---

## 2. Temel Tasarım İlkeleri

### 2.1. Önce cevap, sonra insan izi

AI normal soruya önce doğal ve doğru şekilde cevap verir. İnsan hikâyesi cevabı boğmaz. Ancak anlamlı bir bağlantı varsa sistem kısa bir İnsan İzi oluşturabilir.

Örnek:

> Bugün birkaç cümlede anlattığımız radyoaktivite bilgisinin arkasında onlarca yıllık deneysel çalışma bulunuyor. Marie ve Pierre Curie'nin laboratuvar koşulları bugünün standartlarından çok uzaktı ve iyonlaştırıcı radyasyonun sağlık üzerindeki etkileri henüz yeterince bilinmiyordu.

### 2.2. Hikâye, veri tablosu değildir

Kullanıcıya:

* %37 katkı,
* %82 güven,
* 14 kaynak,
* attribution score

gibi bilgiler ana deneyimde gösterilmez. Bunlar gerekiyorsa sistemin arka planında tutulur.

Kullanıcının gördüğü şey:

> İnsan → dönem → problem → yaşanan süreç → bugün kullandığımız sonuç

olmalıdır.

### 2.3. Tek kahraman yaratma

Sistem yalnızca Einstein, Newton, Mozart, Curie gibi tanınmış isimleri seçmemelidir.

Bilgi;

* bir kişi,
* bir ekip,
* bir laboratuvar,
* bir zanaat geleneği,
* bir toplum,
* bir kültür,
* anonim çalışanlar,
* birbirinden bağımsız araştırmacılar

tarafından geliştirilmiş olabilir.

Gerekirse sistem açıkça şunu demelidir:

> "Bu gelişmeyi tek bir kişiye atfetmek doğru olmaz."

### 2.4. Hikâye uğruna gerçek çarpıtılmaz

Dramatik anlatım yapılabilir ancak:

* efsaneler gerçekmiş gibi anlatılmaz,
* tartışmalı olaylar kesinleştirilmez,
* kişinin motivasyonu uydurulmaz,
* nedensellik kurulmadığı yerde kurulmaz,
* romantizasyon yapılmaz.

Hikâye gerçekliğin taşıyıcısıdır, alternatifi değildir.

---

## 3. Kullanıcı Deneyimi

İnsan İzi üç katmanda çalışmalıdır.

### Katman 1 — İz

Yaklaşık 2–5 cümle. Amaç kullanıcının dikkatini çekmek.

Örnek:

> **İnsan İzi — Beethoven**
> Beethoven'ın Dokuzuncu Senfoni'yi bestelediği dönemde işitme kaybı çok ilerlemişti. Bu nedenle bugün büyük bir orkestrayla özdeşleştirdiğimiz eserin önemli bölümünü kendi zihnindeki müzik üzerinden kurdu. Eserin hikâyesi bu nedenle yalnızca müzik tarihi değil, insanın üretme biçimi açısından da dikkat çekicidir.

### Katman 2 — Hikâye

Yaklaşık 1–3 dakikalık okuma. Burada:

* kişi,
* dönem,
* koşullar,
* problem,
* başarısızlıklar,
* ilişkiler,
* dönüm noktaları

anlatılır.

### Katman 3 — Derinleş

İsteyen kullanıcı için:

* zaman çizelgesi,
* diğer katkı sağlayan kişiler,
* tarihsel tartışmalar,
* orijinal çalışmalar,
* mektuplar,
* belgeler,
* bilimsel yayınlar,
* kültürel bağlam

gösterilebilir.

---

## 4. Sistem Mimarisi

```
KULLANICI SORUSU
        ↓
ANA AI CEVABI
        ↓
KAVRAM / FİKİR / ESER TESPİTİ
        ↓
"İNSAN İZİ VAR MI?" KARARI
        ↓
TARİHSEL VE KÜLTÜREL ARAŞTIRMA
        ↓
KAYNAK DOĞRULAMA
        ↓
HİKÂYE MOTORU
        ↓
KISA İNSAN İZİ
        ↓
İSTEĞE BAĞLI DERİN HİKÂYE
```

---

## 5. İnsan İzi Seçim Motoru

Her kavram için hikâye üretilmemeli. Sistem şu soruları sorar:

* **A.** Arkasında anlamlı bir insan hikâyesi var mı?
* **B.** Bu hikâye kullanıcının mevcut sorusuyla gerçekten ilişkili mi?
* **C.** Hikâye genel cevaba değer katıyor mu?
* **D.** Atıf tarihsel olarak yeterince doğrulanabilir mi?
* **E.** Hikâyenin anlatılmasının insanı veya topluluğu yanlış temsil etme riski var mı?

Anlamlı değilse İnsan İzi gösterilmez.

---

## 6. İnsan İzi Türleri

Sistem yalnızca bilim insanlarını tanımamalıdır.

| Tür | Örnek |
|---|---|
| Bilim | Curie, Faraday, Darwin, Tesla, Rosalind Franklin |
| Mühendislik | Mucitler, mühendis ekipleri, sanayi çalışanları, tasarımcılar |
| Sanat | Mozart, Beethoven, Van Gogh, mimarlar, zanaatkârlar |
| Felsefe | Descartes, Kant, İbn Sina, Farabi |
| Kültürel bilgi | Bir toplumun uzun yıllar geliştirdiği yöntemler |
| Geleneksel bilgi | Tarım, fermentasyon, metalurji, bitkisel kullanım |
| Kolektif çalışmalar | NASA ekipleri, CERN, Manhattan Project |

**İsimsiz katkılar** — Gerektiğinde kolektif hafıza da korunabilir:

> "Bu teknolojinin gelişmesinde binlerce isimsiz teknisyen ve işçinin katkısı bulunuyor."

---

## 7. MVP — İlk Prototip

İlk versiyon çok küçük tutulmalıdır.

### Faz 1 — Proof of Concept

20–30 farklı konu belirle:

radyoaktivite · görelilik · termodinamik · elektrik · penisilin · DNA · bilgisayar · internet · Mozart · Beethoven · perspektif · matbaa · kahve · fermentasyon · pusula

Her biri için kaliteli İnsan İzi çıktıları oluştur. Amaç algoritmanın değil **deneyimin** işe yarayıp yaramadığını test etmek.

### Faz 2 — Otomatik Tespit

AI verilen cevaptan kişi, keşif, teori, eser, teknik ve kültürel uygulama adaylarını çıkarsın. Her aday için `Human Story Relevance` kararı versin.

Çıktı:

```
Human Trace: YES
Subject: Thermodynamics
Suggested story: Sadi Carnot
Reason: Foundational human story
```

### Faz 3 — Retrieval

Tarihsel hikâye AI belleğine bırakılmamalı. Sistem güvenilir kaynaklardan ilgili materyali toplamalı.

Öncelik:

1. Birincil kaynaklar
2. Üniversite / müze / akademik kurumlar
3. Akademik yayınlar
4. Güvenilir biyografik kaynaklar
5. Genel kaynaklar

### Faz 4 — Story Engine

Toplanan gerçekleri kısa ve doğal bir anlatıya dönüştürür. Çıktı: `Short Trace`, `Story`, `Deep Story`.

### Faz 5 — Kullanıcı Testi

Şu sorular ölçülür:

* İnsanlar İnsan İzi'ni açıyor mu?
* Hikâyeyi tamamlıyor mu?
* Ana cevabı bölüyor mu?
* İnsanlar daha fazlasını okumak istiyor mu?
* İnsanlar öğrendikleri bilgiyi daha iyi hatırlıyor mu?
* AI'ya olan güveni artırıyor mu?
* İnsanlık bilgisinin değerini daha görünür hale getiriyor mu?

---

## 8. İlk Geliştirme Yol Haritası

**Faz 1 — Konsept**
İnsan İzi prensiplerini yaz · 20 örnek oluştur · iyi/kötü İnsan İzi örneklerini belirle · hikâye uzunluklarını tanımla

**Faz 2 — Prompt Prototype**
Tek bir LLM kullan. Akış: `Question → Answer → Human Trace Detection → Story`. İlk aşamada kodlama minimum tutulabilir.

**Faz 3 — Retrieval**
Web/search/RAG ekle. Hikâyenin gerçeklerini doğrula.

**Faz 4 — Basit Arayüz**
Ana cevap içerisinde `İnsan İzi ↗` gibi açılabilir bir bölüm oluştur.

**Faz 5 — Knowledge Graph**
Prototip başarılı olursa `Person · Event · Concept · Work · Culture · Place · Period · Relationship · Source` yapısında kalıcı hafıza kurulabilir.

**Faz 6 — Kişiselleştirme**
Sistem kullanıcının ilgisine göre İnsan İzi yoğunluğunu ayarlar. Bazı kullanıcı daha fazla insan hikâyesi ister, bazı kullanıcı yalnızca gerçekten özel durumlarda ister.

---

## 9. AI Sistem Promptu

İlk prototipte doğrudan kullanılabilecek sistem promptu ayrı bir dosyada tutuluyor:

→ [`prompts/human-trace-system-prompt.md`](prompts/human-trace-system-prompt.md)

---

## 10. İlk Başarı Kriteri

İlk hedef teknik olarak kusursuz bir tarihsel knowledge graph kurmak değildir. İlk soru çok daha basit olmalıdır:

> **Bir AI cevabına doğru yerde 3–5 cümlelik bir insan hikâyesi eklediğimizde, cevap daha anlamlı ve hatırlanabilir hale geliyor mu?**

Eğer cevap evetse, arkasındaki teknik sistem daha sonra derinleştirilebilir.

---

## 11. MVP Yaklaşımı Üzerine Not

MVP'de **knowledge graph ile başlanmamalı**. Önce 20–30 elle seçilmiş örnekte `normal AI cevabı + İnsan İzi` deneyimini test etmek daha doğru. İnsanlar gerçekten hikâyeyi açıyor ve hatırlıyorsa retrieval, doğrulama ve graph altyapısına yatırım yapmak anlamlı hale gelir.

Güven düzeyi: ürün konsepti için **yüksek**; otomatik tarihsel atıf kalitesi için **orta** — bu nedenle doğrulama katmanı zorunlu olmalı.
