import { useEffect, useState } from "react";

// Upcoming events come from the app's database (admins manage them in the app), via the
// website_events() function. The key below is Supabase's publishable key: it is meant to ship in
// browser code, and that function only returns published, upcoming events.
const SUPABASE_URL = "https://peusdzjonowhdavizphw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_x1kVZ-C5H-pmly8HH4GrUA_AXiUCKo2";
const TZ = "America/Toronto";

// Shown until the live list arrives, and if it can't be fetched. Same shape as website_events().
const FALLBACK_ROWS = [
  {
    slug: "daughters-in-thought-2026",
    kind: "event",
    title: "Daughters in Thought",
    summary: "An evening of good company, interesting perspectives, a few hot takes, and plenty of food for thought.",
    description: "An evening of good company, interesting perspectives, a few hot takes, and plenty of food for thought. Daughters in Thought is an experience created to bring women together through meaningful conversations, interesting perspectives, and a little friendly debate ;) Featuring PowerPoint presentations from selected speakers on a range of interesting topics, this is a space to explore ideas, exchange opinions, challenge perspectives, and have conversations that go beyond your usual small talk.\n\nFrom unpopular opinions and hot takes to personal interests and thought-provoking discussions, expect to learn something new, discover different perspectives, and see the world through someone else’s lens. Come curious, come open-minded, and most importantly, come ready to challenge your thinking!",
    starts_at: "2026-11-25T23:00:00Z",
    ends_at: "2026-11-26T03:00:00Z",
    date_precision: "exact",
    venue: "152 Augusta Ave",
    city: "Toronto",
    is_free: false,
    price_label: "Tickets on Eventbrite",
    ticket_url: "https://www.eventbrite.ca/e/daughters-in-thought-tickets-2004455370973?aff=oddtdtcreator",
    info_url: "https://chat.whatsapp.com/EY9clAx7vAF51UyoZl3Ww1",
  },
  {
    slug: "march-walk-2027",
    kind: "walk",
    title: "March Walk",
    summary: "Our next walk is in March 2027. It’s free and all paces are welcome — this is about connection, fresh air, and showing up for yourself and each other. Join our WhatsApp group for updates about this event.",
    description: null,
    starts_at: "2027-03-01T05:00:00Z",
    ends_at: null,
    date_precision: "month",
    venue: "Toronto & GTA",
    city: "Toronto",
    is_free: true,
    price_label: "Free · All paces welcome",
    ticket_url: null,
    info_url: "https://chat.whatsapp.com/EY9clAx7vAF51UyoZl3Ww1",
  },
];

const monthYear = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, month: "long", year: "numeric" });
const fullDate = new Intl.DateTimeFormat("en-US", { timeZone: TZ, month: "long", day: "numeric", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true });
const yearMonth = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit" });

function timeParts(date) {
  const parts = Object.fromEntries(timeFormat.formatToParts(date).map((p) => [p.type, p.value]));
  return { hour: parts.hour, minutes: parts.minute === "00" ? "" : `:${parts.minute}`, meridiem: parts.dayPeriod.toUpperCase() };
}

// "6–10 PM", "11 AM–2 PM", or "6:30 PM" with no end time. Toronto time.
function timeRange(startsAt, endsAt) {
  const start = timeParts(new Date(startsAt));
  if (!endsAt) return `${start.hour}${start.minutes} ${start.meridiem}`;
  const end = timeParts(new Date(endsAt));
  const startText = `${start.hour}${start.minutes}${start.meridiem === end.meridiem ? "" : ` ${start.meridiem}`}`;
  return `${startText}–${end.hour}${end.minutes} ${end.meridiem}`;
}

function when(row) {
  const start = new Date(row.starts_at);
  if (row.date_precision === "month") return `${monthYear.format(start)} · Date to be confirmed`;
  return `${fullDate.format(start)} · ${timeRange(row.starts_at, row.ends_at)}`;
}

function where(row) {
  if (row.venue && row.city && !row.venue.includes(row.city)) return `${row.venue}, ${row.city}`;
  return row.venue || row.city || "Toronto & GTA";
}

// Same rule as the app: month-only events stay until the month ends, dated ones until a day after.
function isUpcoming(row, now = new Date()) {
  if (row.date_precision === "month") return yearMonth.format(new Date(row.starts_at)) >= yearMonth.format(now);
  return new Date(row.ends_at ?? row.starts_at).getTime() + 24 * 60 * 60 * 1000 > now.getTime();
}

function toCard(row, i) {
  const noun = row.kind === "walk" ? "Walk" : "Event";
  const paragraphs = (row.description || "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return {
    id: row.slug,
    kind: row.kind,
    type: `${i === 0 ? "Next" : "Upcoming"} ${noun}`,
    title: row.title,
    date: when(row),
    location: where(row),
    desc: row.summary || paragraphs[0] || "",
    about: paragraphs.length ? paragraphs : null,
    tag: row.price_label || (row.is_free ? "Free" : "Tickets required"),
    ticketUrl: row.ticket_url,
    joinUrl: row.info_url,
  };
}

const FALLBACK = FALLBACK_ROWS.filter((r) => isUpcoming(r)).map(toCard);

let cache = null;
let request = null;

function fetchLive() {
  request ??= fetch(`${SUPABASE_URL}/rest/v1/rpc/website_events`, {
    method: "POST",
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
    body: "{}",
    signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined,
  })
    .then((res) => {
      if (!res.ok) throw new Error(`website_events ${res.status}`);
      return res.json();
    })
    .then((rows) => (cache = rows.map(toCard)))
    .catch((err) => {
      request = null;
      throw err;
    });
  return request;
}

/** Upcoming events, soonest first. Starts with the built-in list and swaps in the live one. */
export function useEvents() {
  const [list, setList] = useState(() => cache ?? FALLBACK);
  useEffect(() => {
    if (cache) return;
    let active = true;
    fetchLive().then(
      (rows) => active && setList(rows),
      () => {},
    );
    return () => {
      active = false;
    };
  }, []);
  return list;
}
