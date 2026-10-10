# JalMitra — 2-minute demo script

**Before you go on stage**
- Open the deployed URL on a phone (or Chrome DevTools at 375px) and on a laptop showing `/admin`, already logged in.
- Choose a mode:
  - **Demo:** reliable, no network needed for the AI.
  - **Live:** shows real AI. Test it once first.
- Open every tab once so the map tiles are cached.
- Have a photo of a leaking pipe or dirty water on the phone, plus a backup.
- Reset sample data from `/admin` so the numbers are clean.

---

### 0:00 – 0:15 · Hook (Home)
> "Jaipur gets only about 600 mm of rain a year. Tanker water is expensive, leaks go unreported for days, and nobody sees how much water hides in our food. JalMitra helps citizens **understand, save and fix** water problems, all from a phone."

Scroll past the three feature cards.

### 0:15 – 0:50 · Save: Rainwater Estimator
1. Tap **Rainwater**, tap **GPS** (or tap the map), switch to **Draw on map** and trace a roof.
   > "I just traced my roof on a satellite map. That's about 120 square metres."
2. Point at the headline card.
   > "We pull 5 years of real rainfall for this exact spot. This roof can catch **X litres a year**, which is **Y days** of my family's water."
3. Switch the tank option to **Drinking + cooking only**.
   > "It sizes the tank for the dry months, prices it, and shows the payback in years."
4. Tap **Download PDF report**.

### 0:50 – 1:35 · Fix: Water Quality Reporter (the headline)
1. Tap **Report**, then **Take photo** (or Upload), and pick the leak photo. GPS fills in automatically.
2. Tap **Analyze photo**.
   > "AI identifies it as a **pipe leak, high severity**. It's clearly labelled as AI-estimated, not lab-verified, and I can correct it."
3. Tap **Submit report**. The letter appears. Toggle to **हिन्दी**.
   > "It writes a formal complaint to PHED, in English or Hindi, with the location, map link and severity. One tap to copy, save as PDF or email."
4. Tap **View on map** and toggle **Heatmap**.
   > "Every report goes onto a public map. Neighbours tap **'I face this too'**, so one complaint becomes thirty. The heatmap shows Mansarovar and Johari Bazaar as hotspots."
5. Switch to the laptop at `/admin`. Mark a report **Resolved** and watch the resolved % rise.
   > "On the other side, the municipality gets a live dashboard of hotspots and resolution rates."

### 1:35 – 1:55 · Understand: Water Footprint
1. Tap **Footprint**, then the example chip *"dal chawal, 2 roti, tea, one laundry load"*, then **Calculate**.
   > "A simple Indian lunch plus one laundry load comes to about 660 litres of hidden water. Here's where it goes, how it compares with the national average, and three swaps, like 2 rotis instead of a plate of rice."

### 1:55 – 2:00 · Close
> "JalMitra: one app for every citizen to **understand, save and fix** water. It's built to grow from Jaipur to any Indian city. Thank you!"

---

**If something breaks:** switch on **Demo** in the top bar. The AI, data and rainfall all keep working without APIs or keys (map tiles still need a connection).
