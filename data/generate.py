"""Synthetic demo data for Eve's Space Growth Copilot (May-Oct 2026). Seeded, reproducible."""
import csv, random, datetime as dt, os
random.seed(17)
OUT = os.path.dirname(os.path.abspath(__file__))

SERVICES = {  # name: (price, minutes, supplies_cost)
    "Russian Manicure": (95, 75, 9), "Gel-X Extensions": (115, 90, 14),
    "Structured Manicure": (85, 75, 10), "Pedicure": (90, 60, 11),
    "Natural Nail Care": (65, 45, 6), "Custom Nail Art (add-on)": (30, 20, 4),
}
# channel: (first-visit weight, rebook prob, platform fee share, typical services)
CHANNELS = {
    "Google Search":      (22, 0.62, 0.0),
    "Instagram Organic":  (16, 0.48, 0.0),
    "Instagram Paid Ads": (14, 0.27, 0.0),
    "Influencer Collab":  (12, 0.14, 0.0),
    "ClassPass":          (20, 0.09, 0.45),   # studio receives ~55% of list
    "Airbnb Experiences": (6,  0.03, 0.20),
    "Referral":           (10, 0.71, 0.0),
}
MONTHLY_SPEND = {"Instagram Paid Ads": 1200, "Google Search": 450, "Influencer Collab": 0}
INFLUENCER_MONTHS = {6: 1800, 8: 2200, 10: 1500}  # one-off collabs
TECH_COMMISSION = 0.40
CHAIRS, OPEN_HOURS, DAYS_PER_WEEK = 3, 10, 6

start, end = dt.date(2026, 5, 1), dt.date(2026, 10, 31)
days = [start + dt.timedelta(d) for d in range((end - start).days + 1) if (start + dt.timedelta(d)).weekday() != 0]  # closed Mon

clients, appts = [], []
cid = 0
def new_client(channel, day):
    global cid; cid += 1
    c = {"client_id": f"C{cid:04d}", "acquisition_channel": channel, "first_visit": day.isoformat(),
         "zip": random.choice(["90012", "90013", "90014", "90015", "90017", "90021", "90071", "90026", "90057", "90004"])}
    clients.append(c); return c

# loyal base from before May
for _ in range(300):
    ch = random.choices(["Google Search", "Referral", "Instagram Organic"], [4, 4, 2])[0]
    c = new_client(ch, dt.date(2025, random.randint(1, 12), random.randint(1, 28)))
    c["rebook_p"] = 0.8

def pick_service(channel):
    if channel == "ClassPass": return random.choices(["Natural Nail Care", "Russian Manicure", "Pedicure"], [5, 3, 2])[0]
    if channel == "Influencer Collab": return random.choices(["Gel-X Extensions", "Russian Manicure", "Structured Manicure"], [5, 2, 2])[0]
    return random.choices(["Russian Manicure", "Gel-X Extensions", "Structured Manicure", "Pedicure", "Natural Nail Care"], [5, 3, 3, 2, 1])[0]

aid = 0
def book(c, day, channel_for_new=None):
    global aid; aid += 1
    ch = c["acquisition_channel"]
    svc = pick_service(ch)
    price, mins, supplies = SERVICES[svc]
    addon = random.random() < (0.35 if ch not in ("ClassPass", "Airbnb Experiences") else 0.08)
    gross = price + (SERVICES["Custom Nail Art (add-on)"][0] if addon else 0)
    mins += 20 if addon else 0
    platform_fee = round(gross * CHANNELS.get(ch, (0, 0, 0))[2], 2) if c.get("first_visit") == day.isoformat() or ch in ("ClassPass",) else 0
    source_system = "ClassPass" if ch == "ClassPass" else ("Airbnb" if ch == "Airbnb Experiences" and platform_fee else "Square")
    card_fee = round(gross * 0.029 + 0.30, 2) if source_system == "Square" else 0
    tip = round(gross * random.choice([0, 0.15, 0.18, 0.2, 0.22]), 2) if source_system == "Square" else 0
    retail = random.choice([0] * 8 + [28, 34, 42]) if source_system == "Square" else 0
    appts.append({
        "appointment_id": f"A{aid:05d}", "date": day.isoformat(), "client_id": c["client_id"],
        "visit_type": "first" if c.get("first_visit") == day.isoformat() else "repeat",
        "acquisition_channel": ch, "source_system": source_system, "service": svc + (" + Nail Art" if addon else ""),
        "duration_min": mins, "gross_service_revenue": gross, "platform_fee": platform_fee,
        "card_processing_fee": card_fee, "tech_commission": round(gross * TECH_COMMISSION, 2),
        "supplies_cost": supplies + (4 if addon else 0), "tip": tip, "retail_revenue": retail,
        "retail_cogs": round(retail * 0.5, 2),
    })

for day in days:
    m = day.month
    # new clients today
    for ch, (w, rebook, _) in CHANNELS.items():
        rate = w / 100 * 3.0
        if ch == "Influencer Collab": rate = (1.6 if m in INFLUENCER_MONTHS and day.day < 20 else 0.05)
        if random.random() < rate - int(rate): rate = int(rate) + 1
        else: rate = int(rate)
        for _ in range(rate):
            c = new_client(ch, day); c["rebook_p"] = rebook; book(c, day)
    # repeats: existing clients come back ~every 3-4 weeks if they "stuck"
    for c in clients:
        fv = dt.date.fromisoformat(c["first_visit"])
        if fv >= day: continue
        if c.get("churned"): continue
        if random.random() < 1 / 24:  # roughly every ~4 weeks of open days
            if random.random() < c["rebook_p"]: book(c, day)
            else: c["churned"] = True

with open(f"{OUT}/appointments.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(appts[0].keys())); w.writeheader(); w.writerows(appts)
with open(f"{OUT}/clients.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["client_id", "acquisition_channel", "first_visit", "zip"]); w.writeheader()
    for c in clients: w.writerow({k: c[k] for k in w.fieldnames})
with open(f"{OUT}/marketing_spend.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["month", "channel", "spend_usd", "notes"])
    for m in range(5, 11):
        for ch, s in MONTHLY_SPEND.items():
            if s: w.writerow([f"2026-{m:02d}", ch, s, "Meta ads" if "Instagram" in ch else "Google Ads"])
        if m in INFLUENCER_MONTHS: w.writerow([f"2026-{m:02d}", "Influencer Collab", INFLUENCER_MONTHS[m], "LA lifestyle creator, 1 reel + stories"])
with open(f"{OUT}/fixed_costs.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["item", "monthly_usd"])
    for r in [("Rent (Downtown LA)", 6500), ("Utilities & internet", 420), ("Software (Square, booking, Canva)", 210),
              ("Insurance & licenses", 380), ("Cleaning & sterilization", 350)]: w.writerow(r)
with open(f"{OUT}/capacity.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["chairs", "open_hours_per_day", "open_days_per_week", "closed_day"]); w.writerow([CHAIRS, OPEN_HOURS, DAYS_PER_WEEK, "Monday"])
print(len(clients), "clients,", len(appts), "appointments")
