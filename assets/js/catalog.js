/*
 * GenzLogic central app catalog
 * ------------------------------------------------------------
 * This is the single source of truth for every app on the site.
 * The home page grid, search, filters, every page in /apps/ and
 * sitemap.xml are all generated from this file by:
 *
 *     node tools/build.mjs
 *
 * Rules for editing:
 *  - status must be one of: "Available", "Coming Soon", "In Development".
 *  - Only add a store URL, email or privacy link that you have verified.
 *    Leave a field as "" (or omit it) when it is not known; the site hides
 *    anything that is empty instead of showing a placeholder.
 *  - Icons live in assets/img/apps/<id>-512.webp, <id>-192.webp, <id>-192.png
 *    and the social preview in assets/img/apps/<id>-og.jpg (1200x630).
 *  - "verified" notes where each fact came from so it can be re-checked.
 */
(function (root) {
  var studio = {
    name: "GenzLogic",
    url: "https://genzlogic.github.io/",
    github: "https://github.com/genzlogic",
    // Published as the contact address on the Bill Alarm and GenzCalc sites.
    supportEmail: "mobileappbucket@gmail.com"
  };

  var categories = ["Business", "Finance", "Lifestyle", "Utilities", "Games"];
  var statuses = ["Available", "Coming Soon", "In Development"];

  var apps = [
    {
      id: "mypgrent",
      name: "MyPGRent",
      aliases: ["My PG Rent", "PG management", "rent"],
      category: "Business",
      status: "Available",
      platforms: ["iOS", "Android"],
      tagline: "Rent, sorted for everyone under one roof.",
      summary: "Invoices, UPI payment approvals, maintenance tickets and building notices for PG and rental landlords and their residents.",
      description: "MyPGRent keeps a PG or rental building in one place instead of spread across calls and chats. Landlords get a portfolio overview of occupancy, collections and pending dues. Residents get a digital pass, itemised dues and a simple way to report repairs.",
      features: [
        { title: "Landlord dashboard", text: "Occupancy, total collected and pending dues, with property, room, bed and tenant counts." },
        { title: "Rent cycles", text: "Automated billing, dues tracking, collection rates and expense logging." },
        { title: "Digital resident pass", text: "Room, bed, rent and emergency contacts in a shareable pass, with house rules and Wi-Fi details." },
        { title: "UPI payments", text: "Residents pay through their own UPI or bank app and submit a reference for the landlord to approve. Receipts stay in a ledger." },
        { title: "Properties, rooms and beds", text: "Multiple properties with floors, rooms and bed-level allocation and occupancy." },
        { title: "Maintenance tickets", text: "Complaints with photos and priority, tracked through each stage with landlord responses." }
      ],
      officialSite: "https://genzlogic.github.io/myPgRent/",
      privacyUrl: "https://genzlogic.github.io/myPgRent/privacy.html",
      supportEmail: "",
      store: {
        appStore: "https://apps.apple.com/us/app/id6811552828",
        googlePlay: "https://play.google.com/store/apps/details?id=com.mobileappbucket.mypgrent"
      },
      verified: "Status and both store links from genzlogic.github.io/myPgRent (Oct 2026)."
    },
    {
      id: "scanora",
      name: "Scanora One",
      aliases: ["Scanora", "scanner", "QR code", "OCR", "document scanner"],
      category: "Utilities",
      status: "Available",
      platforms: ["iOS"],
      tagline: "Scan what you have. Create what you need.",
      summary: "Turn paper into digital files and everyday information into scannable QR codes, in one app.",
      description: "Scanora One turns receipts, notes, forms, certificates and bills into clean digital documents, and creates QR codes for links, contacts, Wi-Fi and more. Everything you scan or create is kept in a searchable history.",
      features: [
        { title: "Document scanning", text: "Auto-crop, perspective correction and text extraction (OCR) for receipts, notes, forms and bills." },
        { title: "QR code creator", text: "Eleven code types including URL, contact, Wi-Fi, email, SMS, location, phone and calendar event." },
        { title: "Dashboard", text: "Totals, categories and quick actions for everything you have scanned and created." },
        { title: "History", text: "Search and filter past scans and codes." }
      ],
      officialSite: "https://genzlogic.github.io/Scanora/",
      privacyUrl: "https://genzlogic.github.io/Scanora/privacy.html",
      supportEmail: "support@scanoraone.app",
      store: {
        appStore: "https://apps.apple.com/us/app/scanora-one/id6805592173",
        googlePlay: ""
      },
      verified: "Status, App Store link and support email from genzlogic.github.io/Scanora (Oct 2026)."
    },
    {
      id: "bdaybell",
      name: "BdayBell",
      aliases: ["Birthday Reminder", "birthdays", "anniversaries", "wishes"],
      category: "Lifestyle",
      status: "Available",
      platforms: ["iOS"],
      tagline: "Never forget a birthday again.",
      summary: "A private, offline birthday reminder that keeps birthdays and anniversaries in one calendar.",
      description: "BdayBell (our birthday reminder app) keeps birthdays and anniversaries together so you can reach people on the right day. It works offline and doesn't need an account.",
      features: [
        { title: "Today, this week, next", text: "A dashboard of who is celebrating soon, with a running count." },
        { title: "Calendar", text: "A monthly view of birthdays and anniversaries for planning gifts and calls." },
        { title: "Person pages", text: "Age, star sign and a countdown to each person's next celebration." },
        { title: "Wishes", text: "Birthday and anniversary messages sorted by relationship, ready to copy, share or send on WhatsApp." },
        { title: "Private by design", text: "Offline first, with no account required." }
      ],
      officialSite: "https://genzlogic.github.io/BDayBell/",
      privacyUrl: "https://genzlogic.github.io/BDayBell/privacy.html",
      supportEmail: "",
      store: {
        appStore: "https://apps.apple.com/us/app/bdaybell/id6815103690",
        googlePlay: ""
      },
      verified: "App Store link from genzlogic.github.io/BDayBell; listing confirmed on the App Store (Oct 2026). Replaces the earlier 'Birthday Reminder' entry."
    },
    {
      id: "bill-alarm",
      name: "Bill Alarm",
      aliases: ["BillAlarm", "bill reminder", "due date", "credit card"],
      category: "Finance",
      status: "Available",
      platforms: ["iOS"],
      tagline: "Never miss a due date again.",
      summary: "Track credit card, electricity, internet and mobile bills, with reminders that repeat until each one is paid.",
      description: "Bill Alarm puts all your bills in one place and keeps reminding you until each is due. No account or sign-up is needed, and your data stays on your iPhone.",
      features: [
        { title: "All bills in one place", text: "The total due over the next 60 days and a timeline of every due date." },
        { title: "Next bill first", text: "Total and minimum amount for the next bill, with one-tap pay or mark as paid." },
        { title: "Repeating reminders", text: "Alerts at 9 AM and 6 PM daily, starting 8 days before the due date." },
        { title: "Quick bill entry", text: "Pick a bill type, enter the amount and date, and set regular bills to repeat monthly." },
        { title: "Stays on your phone", text: "Nothing is sent to servers, and cards only ask for the last 4 digits." }
      ],
      officialSite: "https://genzlogic.github.io/BillAlarm/",
      privacyUrl: "https://genzlogic.github.io/BillAlarm/privacy.html",
      supportEmail: "mobileappbucket@gmail.com",
      store: {
        appStore: "https://apps.apple.com/app/id6821720479",
        googlePlay: ""
      },
      verified: "Status, App Store link and support email from genzlogic.github.io/BillAlarm (Oct 2026)."
    },
    {
      id: "genzcalc",
      name: "GenzCalc",
      aliases: ["calculator", "EMI", "SIP", "BMI", "unit converter"],
      category: "Utilities",
      status: "Coming Soon",
      platforms: ["iOS"],
      tagline: "Every calculator. One app.",
      summary: "An offline all-in-one calculator for finance, health, business, education, travel, home, vehicles and unit conversions.",
      description: "GenzCalc brings loans, SIPs, BMI, discounts and many more calculations into one offline app, with results that update as you type.",
      features: [
        { title: "Ten categories", text: "Finance, health, business, education, travel, home, vehicles, construction, units and everyday maths." },
        { title: "Instant results", text: "Answers update as you type, with a clear breakdown of inputs and outputs." },
        { title: "Formulas explained", text: "See how results such as EMI are worked out." },
        { title: "Favourites and history", text: "Pin calculators to Quick Access and revisit saved calculations." },
        { title: "Share results", text: "Copy or share a result or the full breakdown." }
      ],
      officialSite: "https://genzlogic.github.io/genzcalc/",
      privacyUrl: "https://genzlogic.github.io/genzcalc/privacy.html",
      supportEmail: "mobileappbucket@gmail.com",
      store: { appStore: "", googlePlay: "" },
      verified: "'Coming soon to iPhone' per genzlogic.github.io/genzcalc (Oct 2026). Add the App Store link and set status to Available at launch."
    },
    {
      id: "focuslock",
      name: "FocusLock",
      aliases: ["Focus Lock", "app blocker", "screen time", "focus", "block apps", "distraction"],
      category: "Utilities",
      status: "Coming Soon",
      platforms: ["iOS"],
      tagline: "Block distractions. Stay on track.",
      summary: "Block distracting apps in one tap, on a schedule or after a daily limit, with a shield screen that helps you pause before opening them.",
      description: "FocusLock helps you take back your attention on iPhone. Pick the apps that pull you away, block them right now or on a schedule, and set daily limits. When you try to open a blocked app, a custom shield screen steps in, and you choose how strict it should be.",
      features: [
        { title: "Quick Block", text: "Start a focus session in one tap and block your chosen apps right away." },
        { title: "Block Groups", text: "Group apps, such as social or games, and block them together." },
        { title: "Schedules", text: "Block apps automatically at set times, like work hours or bedtime." },
        { title: "Daily limits", text: "Set how long you want to spend on an app each day." },
        { title: "Custom shield screen", text: "A calm screen appears when you open a blocked app, with Flexible or Strict friction and optional temporary access." },
        { title: "Progress", text: "See how your focus is going over time." }
      ],
      officialSite: "",
      privacyUrl: "",
      supportEmail: "",
      store: { appStore: "", googlePlay: "" },
      verified: "Features from the FocusLock build stages. App Store ID 6823885039 (bundle com.mobileappbucket.FocusLock) not live yet: when it is, set store.appStore to https://apps.apple.com/app/id6823885039 and status to Available."
    },
    {
      id: "numblix",
      name: "Numblix",
      aliases: ["number puzzle", "sliding puzzle", "15 puzzle"],
      category: "Games",
      status: "In Development",
      platforms: ["iOS"],
      tagline: "Slide. Plan. Solve.",
      summary: "An offline, single-player sliding-number puzzle about thoughtful moves and satisfying solves.",
      description: "Numblix is a sliding-number puzzle you can play offline. Plan your moves, slide the tiles into order and work up through larger boards.",
      features: [
        { title: "Offline play", text: "A single-player puzzle that works without a connection." },
        { title: "Multiple board sizes", text: "Start small and work up to bigger grids." },
        { title: "More to come", text: "Themes, daily challenges and achievements are planned." }
      ],
      officialSite: "",
      privacyUrl: "",
      supportEmail: "",
      store: { appStore: "", googlePlay: "" },
      verified: "Status and features carried over from the previous catalog in this repo. No public page or store listing yet. CONFIRM STATUS."
    },
    {
      id: "merge-realms",
      name: "Merge Realms",
      aliases: ["MergeRealms", "merge game"],
      category: "Games",
      status: "In Development",
      platforms: [],
      tagline: "A new game from GenzLogic.",
      summary: "A game currently in development. Details will be shared closer to launch.",
      description: "Merge Realms is a GenzLogic game that is still being built. Platforms, features and a release date will be announced here when they are ready.",
      features: [],
      officialSite: "",
      privacyUrl: "",
      supportEmail: "",
      store: { appStore: "", googlePlay: "" },
      verified: "Only the app icon was supplied. CONFIRM STATUS, platforms and description."
    }
  ];

  var catalog = { studio: studio, categories: categories, statuses: statuses, apps: apps };
  root.GENZLOGIC_CATALOG = catalog;
  if (typeof module !== "undefined" && module.exports) module.exports = catalog;
})(typeof window !== "undefined" ? window : globalThis);
