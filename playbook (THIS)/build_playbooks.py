# -*- coding: utf-8 -*-
"""Generates two branded Auvance PDFs (business playbook + client onboarding pack)."""
import os, re, base64
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, ListFlowable, ListItem, Image, KeepTogether, NextPageTemplate
)

HERE = os.path.dirname(os.path.abspath(__file__))

INK   = colors.HexColor("#16181c")
SUB   = colors.HexColor("#565d68")
HAIR  = colors.HexColor("#d6d9de")
SLATE = colors.HexColor("#23272e")
DARK  = colors.HexColor("#0c0d0f")
RED   = colors.HexColor("#c0392b")
PANEL = colors.HexColor("#f6f7f8")

def extract_crown(svg_name, out_name):
    p = os.path.join(os.path.dirname(HERE), "public", svg_name)
    try:
        with open(p, "r", encoding="utf-8") as f:
            data = f.read()
        m = re.search(r"base64,([A-Za-z0-9+/=]+)", data)
        if not m:
            return None
        out = os.path.join(HERE, out_name)
        with open(out, "wb") as f:
            f.write(base64.b64decode(m.group(1)))
        return out
    except Exception:
        return None

CROWN_BLACK = extract_crown("crown-black.svg", "_crown_black.png")
CROWN_WHITE = extract_crown("crown-white.svg", "_crown_white.png")

def S(name, **kw):
    base = dict(fontName="Helvetica", fontSize=10.5, leading=15.5, textColor=INK,
                spaceBefore=0, spaceAfter=0, alignment=TA_LEFT)
    base.update(kw)
    return ParagraphStyle(name, **base)

st_h1     = S("h1", fontName="Helvetica-Bold", fontSize=18, leading=21, spaceAfter=3)
st_kicker = S("kicker", fontName="Helvetica-Bold", fontSize=8, leading=11, textColor=SUB, spaceAfter=2)
st_h2     = S("h2", fontName="Helvetica-Bold", fontSize=12.5, leading=16, spaceBefore=13, spaceAfter=3)
st_h3     = S("h3", fontName="Helvetica-Bold", fontSize=10.5, leading=14, spaceBefore=8, spaceAfter=1)
st_body   = S("body", spaceAfter=7)
st_lead   = S("lead", fontSize=12, leading=17.5, textColor=SLATE, spaceAfter=8)
st_small  = S("small", fontSize=8.5, leading=12.5, textColor=SUB)
st_bullet = S("bullet", fontSize=10.5, leading=15)
st_callk  = S("callk", fontName="Helvetica-Bold", fontSize=9, leading=13)
st_call   = S("call", fontSize=10, leading=14.5, textColor=SLATE)
st_cell   = S("cell", fontSize=9.5, leading=13)
st_cellb  = S("cellb", fontName="Helvetica-Bold", fontSize=9.5, leading=13)
st_cellwb = S("cellwb", fontName="Helvetica-Bold", fontSize=9.5, leading=13, textColor=colors.white)

def rule(color=HAIR, w=0.8, sb=2, sa=9):
    return HRFlowable(width="100%", thickness=w, color=color, spaceBefore=sb, spaceAfter=sa)

def head(kicker, title):
    return KeepTogether([Paragraph(kicker.upper(), st_kicker), Paragraph(title, st_h1), rule(SLATE, 1.4, 3, 10)])

def bullets(items, style=st_bullet):
    return [ListFlowable(
        [ListItem(Paragraph(t, style), leftIndent=12, value="•") for t in items],
        bulletType="bullet", start="•", leftIndent=14, bulletColor=SLATE,
        spaceBefore=2, spaceAfter=6, bulletFontSize=8)]

def callout(title, body, accent=SLATE):
    inner = []
    if title: inner.append(Paragraph(title, st_callk))
    inner.append(Paragraph(body, st_call))
    t = Table([[inner]], colWidths=[6.8*inch])
    t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),PANEL), ("BOX",(0,0),(-1,-1),0.6,HAIR),
        ("LINEBEFORE",(0,0),(0,-1),2.4,accent),
        ("LEFTPADDING",(0,0),(-1,-1),12),("RIGHTPADDING",(0,0),(-1,-1),12),
        ("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9)]))
    return [Spacer(1,4), t, Spacer(1,8)]

def datatable(rows, colw, header=True):
    data = []
    for i, r in enumerate(rows):
        cells = []
        for c in r:
            if header and i == 0:
                cells.append(Paragraph(c, st_cellwb))
            else:
                cells.append(Paragraph(c, st_cell))
        data.append(cells)
    t = Table(data, colWidths=colw, repeatRows=1 if header else 0)
    style = [
        ("GRID",(0,0),(-1,-1),0.5,HAIR),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),
        ("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white, PANEL]),
    ]
    if header:
        style += [("BACKGROUND",(0,0),(-1,0),DARK)]
    t.setStyle(TableStyle(style))
    return t

# ---------- doc scaffold with cover + footer ----------
def make_doc(path, cover_title, cover_sub, cover_meta):
    doc = BaseDocTemplate(path, pagesize=LETTER,
                          leftMargin=0.85*inch, rightMargin=0.85*inch,
                          topMargin=0.95*inch, bottomMargin=0.85*inch,
                          title=cover_title.replace("\n"," "), author="Auvance")
    frame = Frame(doc.leftMargin, doc.bottomMargin,
                  doc.width, doc.height, id="main")

    def on_cover(canvas, d):
        canvas.saveState()
        canvas.setFillColor(DARK)
        canvas.rect(0, 0, LETTER[0], LETTER[1], stroke=0, fill=1)
        cx = LETTER[0]/2
        if CROWN_WHITE and os.path.exists(CROWN_WHITE):
            try: canvas.drawImage(CROWN_WHITE, cx-46, LETTER[1]-250, width=92, height=74,
                                  mask='auto', preserveAspectRatio=True)
            except Exception: pass
        canvas.setFillColor(colors.white)
        canvas.setFont("Helvetica-Bold", 30)
        canvas.drawCentredString(cx, LETTER[1]-300, "AUVANCE")
        canvas.setFont("Helvetica", 9)
        canvas.setFillColor(colors.HexColor("#9aa0a8"))
        canvas.drawCentredString(cx, LETTER[1]-318, "VANCOUVER WEB STUDIO")
        # title block
        canvas.setFillColor(colors.HexColor("#5a6068"))
        canvas.rect(cx-26, LETTER[1]-372, 52, 2, stroke=0, fill=1)
        canvas.setFillColor(colors.white)
        canvas.setFont("Helvetica-Bold", 23)
        ty = LETTER[1]-410
        for line in cover_title.split("\n"):
            canvas.drawCentredString(cx, ty, line); ty -= 28
        canvas.setFillColor(colors.HexColor("#aeb4bc"))
        canvas.setFont("Helvetica", 11)
        canvas.drawCentredString(cx, ty-6, cover_sub)
        canvas.setFillColor(colors.HexColor("#777d85"))
        canvas.setFont("Helvetica", 8.5)
        canvas.drawCentredString(cx, 70, cover_meta)
        canvas.restoreState()

    def on_page(canvas, d):
        canvas.saveState()
        y = 0.6*inch
        canvas.setStrokeColor(HAIR); canvas.setLineWidth(0.6)
        canvas.line(doc.leftMargin, y+8, LETTER[0]-doc.rightMargin, y+8)
        canvas.setFont("Helvetica", 7.5); canvas.setFillColor(SUB)
        canvas.drawString(doc.leftMargin, y-2, "AUVANCE  —  Vancouver Web Studio")
        canvas.drawRightString(LETTER[0]-doc.rightMargin, y-2,
                               "auvancestudio.ca   ·   p. %d" % (d.page-1))
        canvas.restoreState()

    cover_t  = PageTemplate(id="cover", frames=[frame], onPage=on_cover)
    inner_t  = PageTemplate(id="inner", frames=[frame], onPage=on_page)
    doc.addPageTemplates([cover_t, inner_t])
    return doc

# =====================================================================
# DOCUMENT 1 — BUSINESS PLAYBOOK
# =====================================================================
def build_playbook():
    path = os.path.join(HERE, "Auvance-Business-Playbook.pdf")
    doc = make_doc(path, "Business Playbook",
                   "Vision, positioning, pricing & the 90-day plan",
                   "Prepared for Aakif  ·  Confidential — internal  ·  v1")
    f = [NextPageTemplate("inner"), PageBreak()]  # cover is page 1, content uses inner

    f += [head("01 — The Studio", "Vision & Mission")]
    f += [Paragraph("<b>Vision.</b> Become the go-to studio for Vancouver local businesses that want a website which actually brings customers — built by one person who both designs and ships, with none of the agency runaround.", st_lead)]
    f += [Paragraph("<b>Mission.</b> Give local businesses a fast, premium, conversion-focused website they fully own — at an honest flat price, delivered in about three weeks, with a real person they can text.", st_body)]
    f += callout("THE ONE-SENTENCE OFFER",
                 "“I build local Vancouver businesses a fast, custom website that turns visitors into customers — designed and shipped by one person in ~3 weeks, and you own all of it.”")

    f += [head("02 — What We Stand For", "Core Values")]
    f += bullets([
        "<b>Design <i>and</i> build — no handoff gap.</b> What ships is what was designed; nothing lost in translation.",
        "<b>Clarity over clever.</b> Fast, legible, one obvious next step on every screen.",
        "<b>You own everything.</b> Domain, hosting, code — no platform lock-in, ever.",
        "<b>A real person, not a ticket queue.</b> You talk to me directly, start to finish.",
        "<b>Proof, price, process.</b> Credibility comes from these three — never from being cheap.",
    ])

    f += [head("03 — Who We Serve", "Positioning & Niche")]
    f += [Paragraph("<b>Primary market:</b> local Vancouver small businesses — trades & home services, clinics, salons, restaurants/cafes, and community organisations. People who are good at their craft but invisible (or embarrassing) online.", st_body)]
    f += [Paragraph("<b>Beachhead:</b> start where you already have warmth and a first reference — the faith/community network (Abu Bakr Siddiq) and trades (your cousin's lawn-care site is your way into home services, where owners all know each other and referrals compound).", st_body)]
    f += [Paragraph("<b>The wedge:</b> most providers are either developers who can't make it look good, or designers who can't ship. You do both — that's the whole pitch.", st_body)]

    f += [head("04 — The Offer", "The Launch Site")]
    f += [Paragraph("One core product, sold flat. No confusing tiers — just the build, plus only what a client actually needs.", st_body)]
    f += [datatable([
        ["Included in every build", ""],
        ["Custom, hand-built site (up to 5 pages)", "Live in ~3 weeks"],
        ["Mobile-first, fast, accessible", "You approve every stage"],
        ["Google Business Profile + local SEO basics", "Up to 2 revision rounds"],
        ["You own the domain, hosting & code", "50% deposit to start"],
        ["A real person — not a ticket queue", "Final 50% before launch"],
    ], [3.6*inch, 3.2*inch])]
    f += [Spacer(1,8), Paragraph("<b>Add-ons</b> (same flat, upfront pricing):", st_h3)]
    f += [datatable([
        ["Add-on", "Price"],
        ["Copywriting — I write your site content", "+$300"],
        ["Extra pages — beyond the core set", "+$150 / page"],
        ["Online store / booking", "+$600"],
        ["Care plan — hosting, updates & edits", "+$75 / month"],
    ], [4.8*inch, 2.0*inch])]

    f += [PageBreak(), head("05 — Pricing", "The Pricing Ladder")]
    f += [Paragraph("Price rises with proof. The number never drops — cheap is not credible, and price is itself a trust signal.", st_body)]
    f += [datatable([
        ["Phase", "What you charge", "When"],
        ["0 — Credibility (now)", "Free — “paid” in testimonial + showcase rights + 2 referrals", "2 builds only: Abu Bakr Siddiq (done) + cousin's lawn-care"],
        ["1 — Founding rate", "CA$1,500 flat", "Your first ~3 paid clients"],
        ["2 — Standard", "CA$2,000 – 2,500", "After 3 paid clients & real results"],
    ], [1.5*inch, 2.7*inch, 2.6*inch])]
    f += callout("THE RULES (so the ladder actually works)",
        "1) <b>Cap the freebies at two.</b> The very next site after your cousin is paid — no “just one more.”  "
        "2) Even free work gets a <b>signed 1-page scope</b> and the trade (testimonial + showcase + referrals).  "
        "3) Raise the price <b>by count</b> (after N clients), and don't publish the future number.  "
        "4) Payment is <b>50% deposit / 50% before launch</b> — never installments, never release files before final payment.")
    f += [Paragraph("<b>Recurring revenue:</b> after launch, offer the <b>$75/mo care plan</b> (hosting, edits, a monthly report). This is the compounding part of the business — it's switch-off-able if they stop paying, unlike financing a build.", st_body)]

    f += [head("06 — How Clients Come In", "The Sales System")]
    f += [Paragraph("The binding constraint at your stage is <b>trust, not sales technique</b>. You don't need to be a master closer — you need warmth, proof, and a clean process.", st_body)]
    f += [Paragraph("<b>The funnel (keep it to 5 steps):</b>", st_h3)]
    f += bullets([
        "<b>Form / referral</b> → auto-reply instantly, then you personally reply within a few hours.",
        "<b>Discovery call</b> (15 min, video or in-person) — run it as a <i>diagnosis</i>, not a pitch. Listen 70%.",
        "<b>1-page proposal</b> within 24h — their goal, scope, $1,500, timeline, terms.",
        "<b>Close</b> — signed agreement + 50% deposit books their start date.",
        "<b>Onboard → build → launch</b> → then ask for the testimonial + 2 referrals, and offer the care plan.",
    ])
    f += [Paragraph("<b>Where to find them (in order):</b>", st_h3)]
    f += bullets([
        "<b>Warm first.</b> Message ~20 people you know; ask for <i>referrals</i>, not the sale. Mosque + cousin networks are referral nodes.",
        "<b>Demonstrate, don't persuade.</b> Build a free partial mockup of <i>their</i> homepage before you reach out — it collapses the trust gap with zero sales skill.",
        "<b>Niche down.</b> “I build sites for [trades / clinics]” — referrals compound inside one industry.",
        "<b>Cold local walk-ins are the week-6 move</b>, not week one.",
    ])

    f += [PageBreak(), head("07 — The Plan", "First 90 Days")]
    f += [datatable([
        ["Window", "Focus", "Done = "],
        ["Days 1–14", "Lock proof + process", "Mosque testimonial collected; cousin's site built + testimonial; 2 case studies live; onboarding pack ready; site deployed"],
        ["Days 15–45", "Outreach", "20 warm messages + ~10 local businesses/week; goal: first paid “yes” at $1,500"],
        ["Days 45–90", "Deliver & raise", "Deliver first 1–3 paid builds; collect testimonials; pitch care plans; raise standard rate toward $2,000"],
    ], [1.2*inch, 1.6*inch, 4.0*inch])]
    f += [Paragraph("<b>The one number that matters:</b> first paid “yes.” Everything else is downstream of it.", st_body)]

    f += [head("08 — Don't Forget", "Operating Principles")]
    f += bullets([
        "<b>Credibility = proof + price + process.</b> Build proof (freebies), hold the price ($1,500+), run the process (contract + deposit).",
        "<b>The Abwab lesson:</b> a project blew up because there was no signed scope. <b>Never start work without a signed agreement + deposit</b> — even for a freebie.",
        "<b>Underpricing is the bigger risk</b> than overpricing. Cheap clients argue most.",
        "<b>Studying sales ≠ doing sales.</b> Send the message. The first yes is a person, not a price.",
    ])
    f += [Spacer(1,10), rule(HAIR,0.8,2,6),
          Paragraph("Auvance · Vancouver, BC · aakif@auvancestudio.ca · auvancestudio.ca", st_small)]
    doc.build(f)
    return path

# =====================================================================
# DOCUMENT 2 — CLIENT ONBOARDING PACK
# =====================================================================
def red(t): return '<font color="#c0392b">%s</font>' % t

def build_onboarding():
    path = os.path.join(HERE, "Auvance-Client-Onboarding-Pack.pdf")
    doc = make_doc(path, "Client\nOnboarding Pack",
                   "Everything a new client receives, in order",
                   "Templates · fill the [bracketed] fields per client")
    f = [NextPageTemplate("inner"), PageBreak()]

    # 1 Welcome
    f += [head("Document 1", "Welcome to Auvance")]
    f += [Paragraph("Hi %s," % red("[Client First Name]"), st_body)]
    f += [Paragraph("Thank you for choosing Auvance to build %s. This document is your map for what happens next — so you always know where we are and what I need from you." % red("[Project / business name]"), st_body)]
    f += [Paragraph("How we'll work together", st_h3)]
    f += [datatable([
        ["Step", "What happens"],
        ["1. Agreement & deposit", "You sign the agreement (next page) and pay the 50% deposit. Nothing starts until both are done."],
        ["2. Kickoff", "A short call to align on goals, pages, and the content I'll need from you."],
        ["3. Design & build", "I design and build in ~3 weeks. You see and approve each stage — up to 2 revision rounds."],
        ["4. Launch", "Final 50% is paid, then your site goes live on your own domain — fully yours."],
        ["5. Aftercare", "Optional care plan for hosting, edits & a monthly report. I'm one text away."],
    ], [1.7*inch, 5.1*inch])]
    f += callout("WHAT I'LL NEED FROM YOU",
        "Your logo & brand assets (if any), text/photos for each page, and access to your domain or Google Business Profile. "
        "I'll send a simple checklist at kickoff — the faster these arrive, the faster you launch.")
    f += [Paragraph("Questions any time: %s · %s" % (red("aakif@auvancestudio.ca"), red("[phone]")), st_small)]

    # 2 Agreement
    f += [PageBreak(), head("Document 2", "Web Design Services Agreement")]
    f += [Paragraph("This Agreement is between <b>Auvance</b> (“the Studio”), operated by %s of Vancouver, BC, and %s (“the Client”)." % (red("[your legal name]"), red("[Client legal / business name]")), st_body)]
    f += [Paragraph("Commence on: %s &nbsp;&nbsp;&nbsp; Target launch: %s" % (red("[date]"), red("[date]")), st_small)]
    f += [Paragraph("1. Agreement", st_h3)]
    f += [Paragraph("This document is the entire understanding between the Studio and the Client and supersedes prior discussions. It may only be changed in writing, signed by both parties. If any part is found unenforceable, the rest remains in force.", st_body)]
    f += [Paragraph("2. Services & Deliverables", st_h3)]
    f += [Paragraph("The Studio will design and build a custom website for the Client as follows (“The Launch Site”):", st_body)]
    f += bullets([
        "Custom, mobile-first website of up to %s pages: %s" % (red("[5]"), red("[Home, About, Services, ...]")),
        "Responsive build in modern web tooling; basic on-page SEO and Google Business Profile setup",
        "Add-ons selected: %s" % red("[copywriting / extra pages / store / none]"),
    ])
    f += [Paragraph("3. Timeline", st_h3)]
    f += [Paragraph("Estimated delivery is approximately three (3) weeks from kickoff, provided the Client supplies content and feedback promptly. Delays in Client materials or approvals extend the timeline accordingly.", st_body)]
    f += [Paragraph("4. Payment", st_h3)]
    f += [Paragraph("Total project fee: %s (CAD). Paid in two parts:" % red("[$1,500]"), st_body)]
    f += bullets([
        "<b>50%% deposit</b> (%s) due on signing — work begins only once received." % red("[$750]"),
        "<b>50%% balance</b> (%s) due on approval, before the site is published or files transferred." % red("[$750]"),
        "Optional care plan: %s/month, billed on the 1st, starting after launch." % red("[$75]"),
    ])
    f += [Paragraph("Payments are made via %s. Late balances may pause work and delay launch." % red("[Stripe / e-transfer]"), st_small)]
    f += [Paragraph("5. Revisions", st_h3)]
    f += [Paragraph("The fee includes <b>two (2) rounds of revisions</b> at the design stage. A “round” is one consolidated set of written changes. Further rounds or changes outside the agreed scope are billed at %s/hour, quoted before any work." % red("[$60]"), st_body)]
    f += [Paragraph("6. Client Responsibilities", st_h3)]
    f += bullets([
        "Provide content (text, images, logo) and timely feedback/approvals",
        "Provide access to domain, hosting or Google Business Profile as needed",
        "Ensure the Client owns or is licensed to use all materials supplied to the Studio",
        "Pay all invoices on time",
    ])
    f += [Paragraph("7. Ownership & Intellectual Property", st_h3)]
    f += [Paragraph("On <b>full payment</b>, ownership of the final website (code, design, and content created for the Client) transfers to the Client, who may use it without limitation. Until full payment, all work remains the property of the Studio. The Studio may showcase the completed work in its portfolio and marketing unless the Client requests otherwise in writing. The Studio retains the right to reuse its own underlying tools, components, and techniques.", st_body)]
    f += [Paragraph("8. Hosting, Domain & Backups", st_h3)]
    f += [Paragraph("The site is deployed to the Client's own hosting/domain so the Client retains full ownership and control. Unless a care plan is active, ongoing hosting, updates, and backups are the Client's responsibility after handover.", st_body)]
    f += [Paragraph("9. Confidentiality", st_h3)]
    f += [Paragraph("Both parties agree to keep confidential any proprietary or sensitive information shared during the project.", st_body)]
    f += [Paragraph("10. Term & Termination", st_h3)]
    f += [Paragraph("This Agreement is effective once signed and continues until the site is delivered and paid in full. Either party may terminate with written notice; the Client remains responsible for fees for work already performed, and the deposit is non-refundable once work has begun.", st_body)]
    f += [Paragraph("11. Warranty & Liability", st_h3)]
    f += [Paragraph("The Studio delivers the site in good working order. Nothing on the site or in case studies is a guarantee of specific business results. To the extent permitted by law, the Studio's liability is limited to the fees paid.", st_body)]
    f += [Paragraph("12. Governing Law", st_h3)]
    f += [Paragraph("This Agreement is governed by the laws of British Columbia and the applicable laws of Canada.", st_body)]
    f += [Spacer(1,10), Paragraph("13. Signatures", st_h3)]
    f += [datatable([
        ["Client", "The Studio (Auvance)"],
        ["Signature: ______________________", "Signature: ______________________"],
        ["Name: %s" % red("[Client name]"), "Name: %s" % red("[your name]")],
        ["Date: ____________", "Date: ____________"],
    ], [3.4*inch, 3.4*inch], header=False)]

    # 3 Invoice
    f += [PageBreak(), head("Document 3", "Invoice")]
    f += [datatable([
        ["Auvance — Vancouver Web Studio", "Invoice"],
        ["aakif@auvancestudio.ca · auvancestudio.ca", "No: %s" % red("[INV-001]")],
        ["%s" % red("[your legal name / GST# if any]"), "Date: %s   Due: %s" % (red("[date]"), red("[date]"))],
    ], [3.9*inch, 2.9*inch], header=False)]
    f += [Spacer(1,6), Paragraph("Bill to: %s · %s" % (red("[Client / business]"), red("[address]")), st_small)]
    f += [Spacer(1,6), datatable([
        ["Description", "Qty", "Amount"],
        ["The Launch Site — custom website build", "1", red("[$1,500]")],
        ["%s" % red("[Add-on, if any]"), red("[1]"), red("[$0]")],
        ["Deposit received (50%)", "", red("[−$750]")],
        ["Balance due", "", red("[$750]")],
    ], [4.5*inch, 0.8*inch, 1.5*inch])]
    f += callout("PAYMENT", "Pay via %s. Project files and go-live follow once the balance is cleared. Thank you!" % red("[Stripe link / e-transfer to aakif@auvancestudio.ca]"))

    # 4 Discovery / competitor snapshot
    f += [PageBreak(), head("Document 4", "Project Discovery & Competitor Snapshot")]
    f += [Paragraph("Completed together at kickoff — this is how we make sure the site is built around <i>your</i> customers and beats what's already out there.", st_body)]
    f += [Paragraph("Your business", st_h3)]
    f += bullets([
        "What you do, and the one customer you most want more of: %s" % red("[...]"),
        "What “winning” looks like in 6 months (calls, bookings, enquiries): %s" % red("[...]"),
        "The single most important action a visitor should take: %s" % red("[call / book / quote form]"),
    ])
    f += [Paragraph("Competitor snapshot", st_h3)]
    f += [datatable([
        ["Competitor", "Their site — strong", "Their site — weak / our opening"],
        [red("[Competitor 1]"), red("[...]"), red("[...]")],
        [red("[Competitor 2]"), red("[...]"), red("[...]")],
        [red("[Competitor 3]"), red("[...]"), red("[...]")],
    ], [1.8*inch, 2.5*inch, 2.5*inch])]
    f += [Paragraph("<b>Takeaway:</b> %s" % red("[the gap Auvance will exploit — e.g. faster, clearer, mobile, real booking]"), st_body)]

    # 5 Care plan monthly report
    f += [PageBreak(), head("Document 5", "Website Care Plan — Monthly Report")]
    f += [Paragraph("For care-plan clients. A simple monthly note that proves the value and keeps the relationship warm.", st_body)]
    f += [Paragraph("%s — Report for %s" % (red("[Client]"), red("[Month]")), st_h3)]
    f += [datatable([
        ["Metric", "This month", "Last month"],
        ["Site visitors", red("[...]"), red("[...]")],
        ["Contact / quote form submissions", red("[...]"), red("[...]")],
        ["Google Business Profile views / calls", red("[...]"), red("[...]")],
        ["Page speed / uptime", red("[...]"), red("[...]")],
    ], [3.2*inch, 1.8*inch, 1.8*inch])]
    f += bullets([
        "<b>What I did this month:</b> %s" % red("[edits, updates, fixes]"),
        "<b>What I recommend next:</b> %s" % red("[one suggestion]"),
    ])

    # 6 Handover / usage guide
    f += [PageBreak(), head("Document 6", "Site Handover & Usage Guide")]
    f += [Paragraph("Sent at launch so you can confidently run your new site.", st_body)]
    f += bullets([
        "<b>Your logins:</b> %s (store these somewhere safe)." % red("[hosting / CMS / domain]"),
        "<b>How to make a basic edit:</b> %s" % red("[short steps or a Loom video link]"),
        "<b>What not to touch:</b> %s" % red("[anything that could break layout]"),
        "<b>Keeping it fast & found:</b> compress images before uploading; keep your Google Business Profile updated.",
        "<b>Need a hand?</b> The care plan covers edits & updates — or message me any time.",
    ])

    # 7 Thank you + testimonial
    f += [PageBreak(), head("Document 7", "Thank You & Testimonial Request")]
    f += [Paragraph("Hi %s," % red("[Client First Name]"), st_body)]
    f += [Paragraph("Your site is live — thank you for trusting Auvance to build it. It's been a pleasure, and I'm one message away whenever you need a change.", st_body)]
    f += [Paragraph("One small favour", st_h3)]
    f += [Paragraph("Could you answer just one question (a sentence is perfect)? It helps me enormously, and only the first is required:", st_body)]
    f += bullets([
        "<b>How would you describe working with Auvance, in one sentence?</b> (required)",
        "What did you like most about the final site?",
        "Would you recommend Auvance — and is there anyone you'd introduce me to?",
    ])
    f += callout("THE TRADE (for founding / free builds)",
        "As a founding client, the “payment” is three things: a short testimonial, permission to feature your site in my portfolio, and 2 introductions to other local owners who could use a site. Reply here or use %s." % red("[testimonial form link]"))
    f += [Spacer(1,8), Paragraph("With thanks,<br/>%s — Auvance" % red("[your name]"), st_body)]

    doc.build(f)
    return path

if __name__ == "__main__":
    p1 = build_playbook()
    p2 = build_onboarding()
    for p in (p1, p2):
        print("WROTE", os.path.basename(p), os.path.getsize(p), "bytes")
