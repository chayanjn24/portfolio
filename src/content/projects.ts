/**
 * PROJECTS — every project on the site.
 *
 * - Order here = order on the Work page and the "Next project" chain, and sets the numbers:
 *   the first project is 01, the next 02, and so on. In copy, {num:<id>} prints a project's number.
 * - status: 'shipped' (case study page), 'next' (up next), 'queued'.
 * - To ship a project: set status to 'shipped', add `results`, `links`, and a `cover` image
 *   (drop the image into /public/images/projects/). Remove `when`/`done` if you like.
 * - Counts like "3 shipped, 10 in the queue" update automatically.
 */
import type { Project } from './types';

const list: Omit<Project, 'num'>[] = [
  {
    id: 'tallyline',
    status: 'shipped',
    title: 'Tallyline',
    kind: 'Analytics product · synthetic data',
    cats: ['BI', 'Analytics eng'],
    tags: ['Python', 'DuckDB', 'SQL', 'FastAPI', 'Chart.js', 'pytest'],
    summary:
      'An analytics workspace for a programmatic ad exchange: live KPIs, six drill-down levels, and anomaly detection that names the likely cause.',
    question:
      'Can an ad exchange’s analytics workspace spot incidents on its own and point to the step of the funnel that broke?',
    steps: [
      'Seeded generator simulates 12 buyers, 10 publishers and about 150 deals hour by hour, with planted incidents (outages, traffic drops, bot-like spikes, price cuts) and a hidden answer key.',
      'DuckDB star schema with rollups; each query reads the smallest table that can answer it, so a typical 31-day query takes 5–30 ms.',
      'Detector written in SQL: robust z-scores (median and MAD) against the same hour of the week over four weeks, then gaps-and-islands to merge hours into incidents and group knock-on alerts.',
      'FastAPI read-only JSON API with parameters bound, never pasted, into SQL; a framework-free front end of about 30 ES modules and Chart.js.',
      'Every rate (eCPM, fill, win rate) computed once from additive sums, so totals are never an average of averages; 31 tests and CI check that every breakdown reconciles to the total.',
    ],
    results: [
      ['100%', 'of planted incidents caught, across 3 seeds'],
      ['94–100%', 'precision of root-cause alerts'],
      ['5–30 ms', 'typical 31-day query'],
    ],
    links: [
      { label: 'Live demo (slow first load)', href: 'https://tallyline.onrender.com' },
      { label: 'GitHub repo', href: 'https://github.com/chayanjn24/tallyline' },
    ],
    cover: '/images/projects/tallyline.png',
    coverPlaceholder: 'Tallyline overview screenshot',
  },
  {
    id: 'credit-risk',
    status: 'shipped',
    title: 'Credit Risk & Loan Default',
    kind: 'Banking analytics',
    cats: ['ML', 'Finance', 'BI'],
    tags: ['Snowflake SQL', 'Python', 'Logistic regression', 'XGBoost', 'Tableau Public'],
    summary: 'Which borrowers default and where the risk concentrates, across 150K+ loans (XGBoost AUC 0.87).',
    question: 'Which borrowers are likely to default, and where does the lender’s risk concentrate?',
    steps: [
      'Loaded 150K+ loan records from Kaggle’s “Give Me Some Credit” into Snowflake.',
      'Profiled and engineered features in SQL with CTEs, window functions and cohort analysis: revolving utilisation plus prior delinquency drove a 48% default rate, against 3% for low-risk borrowers.',
      'Benchmarked logistic regression (AUC 0.86) against XGBoost (AUC 0.87).',
      'Turned the scores into a lending policy: declining the riskiest 20% of applicants catches 73% of defaulters.',
      'Published two cross-filtered Tableau Public dashboards and a business case study.',
    ],
    results: [
      ['73%', 'of defaulters caught by declining the riskiest 20%'],
      ['0.87', 'AUC, XGBoost (logistic baseline 0.86)'],
      ['150K+', 'loan records analysed'],
    ],
    links: [
      { label: 'GitHub repo', href: 'https://github.com/chayanjn24/credit-risk-analysis' },
      { label: 'Tableau Public', href: 'https://public.tableau.com/app/profile/chayan.gulgulia/vizzes' },
    ],
    cover: '/images/projects/tableau-portfolio.png',
    coverPlaceholder: 'Tableau dashboard screenshot',
    dashboards: [
      {
        label: 'Portfolio model',
        view: 'CreditDefaultRisk-PortfolioModel/CreditDefaultRiskPortfolioModel',
        preview: '/images/projects/tableau-portfolio.png',
        ratio: 1472 / 908,
      },
      {
        label: 'Risk drivers',
        view: 'RiskDriversDeepDive/RiskDriversDeepDive',
        preview: '/images/projects/tableau-drivers.png',
        ratio: 1440 / 1112,
      },
    ],
  },
  {
    id: 'expense-tracker',
    status: 'shipped',
    title: 'Expense Tracker',
    kind: 'Personal finance · ML',
    cats: ['ML', 'Finance', 'BI'],
    tags: ['Python', 'pandas', 'scikit-learn', 'statsmodels', 'Plotly', 'Google Sheets'],
    summary:
      'Real personal spending, read straight from a Google Sheet: budget, forecast and alerts, plus an ML lab that tests four models against the simple rules.',
    question:
      'Where does the money actually go each month, and does machine learning beat plain rules at categorizing, forecasting and spotting the unusual?',
    steps: [
      'Reads 815 real transactions from a Google Sheet, or a sanitized demo copy that is safe to share (names pseudonymised, amounts shifted).',
      'Separates real spending from income, transfers and refunds; budget vs. actual per category; subscriptions and spending patterns.',
      'Rules first: unusual payments against each category’s median, and a run-rate month-end forecast, both checked on past months.',
      'ML lab: a TF-IDF + logistic regression categorizer, a weekly SARIMA forecast on daily spend, Isolation Forest scores and KMeans merchant groups.',
      'Every model is tested against its rule on data it hasn’t seen, and kept only if it wins. KMeans didn’t, and the notebook says so.',
    ],
    results: [
      ['59%', 'of an unseen month categorized right by the model, vs 45% for the rules'],
      ['8%', 'SARIMA month-end error on day 20, vs 15% for the run-rate'],
      ['815', 'real transactions, sanitized for the shareable demo'],
    ],
    links: [{ label: 'Open the notebook', href: 'https://colab.research.google.com/drive/1bC1_w7qK4CpFu_IVKJXIYP90GaAki7WS?usp=sharing' }],
    cover: '/images/projects/expense-tracker.png',
    coverPlaceholder: 'Expense Tracker dashboard screenshot',
  },
  {
    id: 'campus-crave',
    status: 'shipped',
    title: 'Campus Crave',
    kind: 'Campus delivery app',
    cats: ['Product'],
    tags: ['Flutter', 'Dart', 'Riverpod', 'go_router'],
    summary:
      'Food delivery for NIT Silchar: every hostel canteen and snack stall in one app, delivered to your room by a fellow student.',
    question:
      'Can a campus run its own food delivery, with students ordering, students delivering and canteens cooking, from one app and one codebase?',
    steps: [
      'Three sides in one Flutter app: students order, any student can switch on runner mode to deliver, vendors run an order board and edit their menu. Routing decides who sees which screens.',
      'Built on the real campus: all 16 hostels (room number required) plus SAC, the Library, Computer Centre and Auditorium; canteens in seven hostels, Tapri outside Hostel 9 and the snack stalls.',
      'Search a dish to compare its price across every canteen that sells it, cheapest first; combos show the saving; your own hostel’s canteen is pinned to the top.',
      'Orders move through seven tracked states. Runners see an order only once the outlet accepts it, never their own, and the first claim wins.',
      'Bill = items + ₹15 delivery + a ₹3–5 convenience fee. The ₹15 lands in the runner’s wallet to spend on their own orders, and comes back if an order is cancelled.',
      'All data goes through one repository interface, so Firebase can replace the in-memory store without touching a screen. Unit tests cover the order rules, fees and wallet.',
    ],
    results: [
      ['3', 'sides in one app: students, runners, vendors'],
      ['₹15', 'per delivery, paid into a student runner’s wallet'],
      ['11', 'unit tests on the order rules, fees and wallet'],
    ],
    links: [
      { label: 'Live demo', href: 'https://chayanjn24.github.io/campus_crave/' },
      { label: 'GitHub repo', href: 'https://github.com/chayanjn24/campus_crave' },
    ],
    cover: '/images/projects/campus-crave.png',
    coverPlaceholder: 'Campus Crave app screens',
  },
  {
    id: 'movie-recs',
    status: 'shipped',
    title: 'Movie Recommender',
    kind: 'Recommender · Spark at scale',
    hobby: 'Movies',
    cats: ['Big data', 'ML'],
    tags: ['PySpark', 'Spark MLlib', 'Databricks', 'Delta tables', 'NumPy'],
    summary:
      'A Spark recommender judged on what people actually watch next, built on 100K ratings and then scaled to 25M on Databricks.',
    question:
      'Do collaborative-filtering recommendations beat “just show what’s popular” at ranking what a user watches next, and does the answer hold at 25 million ratings?',
    steps: [
      'Loaded MovieLens into Delta tables on Databricks and profiled it in PySpark: at 25M ratings from 162K users the matrix is 99.74% empty, and the top 10% of movies hold 94% of all ratings.',
      'Split every user’s history by time: the last 5 ratings are the test, the 5 before them tune the models, so no model ever sees a user’s future.',
      'Baselines first (the most popular movies, popularity weighted by the user’s favourite genres, and item-kNN), then Spark MLlib ALS in two forms: explicit, tuned on rating error, and implicit, tuned on ranking.',
      'Scored every model on NDCG, MAP, precision and recall at 10, plus catalogue coverage and popularity bias. Built the top-10 lists from the ALS factors in NumPy, because Spark’s built-in method is blocked on serverless.',
      'Ran the same notebooks on 100K and then 25M ratings: implicit ALS’s lead over popularity grew from 59% to 94%, and its validation score now matches test (0.072 vs 0.074).',
      'The best rating predictor was the worst recommender: explicit ALS had the lowest error (RMSE 0.887) but an NDCG@10 of 0.000, because its top 10 were obscure movies from the long tail.',
    ],
    results: [
      ['+94%', 'NDCG@10 over a popularity list on 25M ratings (+59% on 100K)'],
      ['25M', 'ratings from 162K users, on Databricks Free Edition'],
      ['8.3×', 'training time for 100× more data (41 s → 339 s)'],
    ],
    links: [
      { label: 'GitHub repo', href: 'https://github.com/chayanjn24/movie-recommender' },
      { label: 'Notebooks with results', href: 'https://chayanjn24.github.io/movie-recommender/' },
    ],
    cover: '/images/projects/movie-recs.png',
    coverPlaceholder: 'Movie Recommender results',
  },
  {
    id: 'nifty-risk',
    status: 'shipped',
    title: 'Nifty 50 Risk & Backtests',
    kind: 'Markets · risk analytics',
    cats: ['Finance', 'BI'],
    tags: ['DuckDB SQL', 'Python', 'statsmodels', 'GARCH (arch)', 'Tableau Public', 'pytest'],
    summary:
      'How risky India’s 50 largest stocks are, what changes when markets get stressed, and whether simple strategies beat holding the index after costs.',
    question:
      'Do simple trading rules or smarter portfolio weights beat holding the Nifty 50 after costs, and what happens to risk when markets get stressed?',
    steps: [
      'Pulled daily prices from Jan 2015 to Oct 2026 for today’s 50 Nifty stocks, the index and the Nifty ETF (144,371 rows). Checked every daily move over 18% against news and fixed 4 errors in the Yahoo feed, including two demergers recorded as 40% losses.',
      'Computed returns, drawdowns, time to recover, rolling volatility, CAGR, Sharpe and Sortino in DuckDB SQL with window functions, with every stock aligned to the index’s trading days.',
      'Fitted CAPM beta for every stock (median 0.95), grouped them into 10 correlation clusters, and split the market into calm and stressed periods with a two-state Markov switching model. Stressed days were 10.7% of the sample, with three times the daily volatility.',
      'Backtested one-day Value at Risk three ways (historical, normal, GARCH-t) with Kupiec and Christoffersen tests. For the index, only GARCH-t passed both at 99%: 36 breaches against 26.6 expected.',
      'Ran moving-average timing, 12-1 momentum, a regime filter and five portfolio weightings (equal weight, inverse volatility, minimum variance, risk parity, HRP) out of sample from 2017, with 10 bps costs and trades using only the previous close.',
      'Checked every result for luck with a 2,000-sample block bootstrap. Momentum made 25.6% a year but beat equal weight on the same stocks in only 45% of resamples, so its edge was survivorship bias.',
      'Published a two-tab Tableau Public dashboard with linked filters for strategy, sector, cluster, beta and volatility.',
    ],
    results: [
      ['6.6% vs 12.4%', 'a year: moving-average timing against buy-and-hold, after costs'],
      ['0.19 → 0.49', 'average correlation between stocks, calm vs stressed markets'],
      ['−32.6%', 'worst drawdown with HRP weights, against −37.9% for equal weight'],
    ],
    links: [
      { label: 'Tableau Public', href: 'https://public.tableau.com/app/profile/chayan.gulgulia/viz/Nifty50RiskRegimesandBacktests/Strategies' },
      { label: 'GitHub repo', href: 'https://github.com/chayanjn24/nifty50-risk' },
    ],
    cover: '/images/projects/nifty-strategies.png',
    coverPlaceholder: 'Nifty 50 Tableau dashboard',
    dashboards: [
      { label: 'Strategies', view: 'Nifty50RiskRegimesandBacktests/Strategies', preview: '/images/projects/nifty-strategies.png', ratio: 1400 / 900, width: 1400 },
      { label: 'Stock risk', view: 'Nifty50RiskRegimesandBacktests/Stockrisk', preview: '/images/projects/nifty-stocks.png', ratio: 1400 / 900, width: 1400 },
    ],
  },
  {
    id: 'quick-commerce',
    status: 'shipped',
    title: 'Quick-Commerce Funnel',
    kind: 'Product analytics · Indian e-commerce',
    hobby: 'Cooking',
    cats: ['Product', 'Analytics eng'],
    tags: ['dbt', 'PostgreSQL', 'SQL', 'Python', 'A/B testing', 'Tableau Public', 'Metabase'],
    summary:
      'Where online orders drop out, which customers come back, and whether a ₹100 win-back discount pays for itself, on Amazon India and Blinkit data.',
    question:
      'Where do orders drop out between checkout and the doorstep, which customers keep coming back, and does a discount win back lapsed customers at a profit?',
    steps: [
      'Loaded two Kaggle datasets into Postgres: 120,378 Amazon India orders from one clothing seller (Apr to Jun 2022) and 5,000 Blinkit orders with customers, delivery times, feedback and 5,400 days of campaign results.',
      'Modelled them in dbt: staging views clean each table, the marts hold fact and dimension tables plus both funnels, monthly cohorts, RFM scores and delivery against promise. 58 tests check keys and joins, and that every total adds back up to the raw files.',
      'Fixed what the data got wrong: Blinkit’s stored order counts were wrong for 2,385 of 2,500 customers and its ROAS column didn’t match revenue over spend, so both are recalculated; customer names, emails and phone numbers are dropped on load.',
      'Caught a trap in the Amazon data: orders with a promotion code look like they almost never get cancelled (0.4% vs 36.1%), but the code is only added once an order goes through. Left it out of the cancellation analysis.',
      'Found returns concentrated in the East: Assam, Bihar, Jharkhand and Odisha sent back 12.5% of the seller’s shipments, twice the 6.4% elsewhere, still clear after correcting for testing 19 states at once.',
      'Simulated a ₹100 win-back test for customers lapsed 60+ days, using Blinkit’s real reorder rate (9.55%) and basket sizes, with a known true effect. The analysis found it, a sample ratio check caught a planted tracking bug, and 2,000 reruns gave a 5.5% false-positive rate.',
      'Published a three-tab Tableau Public dashboard of the findings, and built a four-tab Metabase dashboard on a read-only login that can’t see the raw data.',
    ],
    results: [
      ['+10.1%', 'more lapsed customers reordered with ₹100 off (simulated test, true effect +12%)'],
      ['₹1,087', 'discount per extra reorder, against ₹609 margin per order, so the offer was not rolled out'],
      ['2×', 'return rate in four eastern states vs the rest of India (12.5% vs 6.4%)'],
    ],
    links: [
      { label: 'Tableau Public', href: 'https://public.tableau.com/app/profile/chayan.gulgulia/viz/Quick-CommerceFunnel/AmazonIndia' },
      { label: 'GitHub repo', href: 'https://github.com/chayanjn24/quickcommerce-funnel' },
    ],
    cover: '/images/projects/qcom-amazon.png',
    coverPlaceholder: 'Quick-Commerce Funnel dashboard',
    dashboards: [
      { label: 'Amazon India', view: 'Quick-CommerceFunnel/AmazonIndia', preview: '/images/projects/qcom-amazon.png', ratio: 1400 / 900, width: 1400 },
      { label: 'Blinkit customers', view: 'Quick-CommerceFunnel/Blinkitcustomers', preview: '/images/projects/qcom-blinkit.png', ratio: 1400 / 900, width: 1400 },
      { label: 'Win-back test', view: 'Quick-CommerceFunnel/Win-backtest', preview: '/images/projects/qcom-winback.png', ratio: 1400 / 900, width: 1400 },
    ],
    gallery: {
      title: 'Metabase dashboard',
      note: 'The working dashboard used during the build, connected straight to Postgres. Metabase needs its own server, so these are screenshots.',
      images: [
        { src: '/images/projects/qcom-metabase-amazon.png', caption: 'Amazon India funnel' },
        { src: '/images/projects/qcom-metabase-blinkit.png', caption: 'Blinkit customers' },
        { src: '/images/projects/qcom-metabase-marketing.png', caption: 'Marketing and delivery' },
        { src: '/images/projects/qcom-metabase-experiment.png', caption: 'Win-back experiment' },
      ],
    },
  },
  {
    id: 'recon-lakehouse',
    status: 'next',
    when: 'Nov 2026',
    title: 'Reconciliation Lakehouse',
    kind: 'Flagship · synthetic data',
    cats: ['Big data', 'Finance'],
    tags: ['Databricks', 'PySpark', 'Delta Lake', 'pytest'],
    summary: 'A medallion pipeline that reconciles two revenue sources and explains every gap over 5%.',
    question:
      'Can a medallion pipeline reconcile two reporting sources, normalise timezones, and flag gaps over 5% with traceable reason codes?',
    steps: [
      'Seeded generator for two synthetic sources, with injected errors and a ground-truth table.',
      'Bronze → silver → gold in Delta Lake: dedupe, late-data MERGE, schema enforcement.',
      'Timezone handling as an explicit, tested parameter.',
      'Rule-based reason codes plus drift detection, scored against ground truth.',
    ],
    done: 'Injected errors detected with per-type recall; totals tie to source.',
  },
  {
    id: 'fraud-cost',
    status: 'queued',
    when: 'Nov 2026',
    title: 'Fraud, Priced Right',
    kind: 'Risk ML',
    cats: ['ML', 'Finance'],
    tags: ['XGBoost', 'MLflow', 'SHAP'],
    summary: 'Picks the fraud-alert threshold that minimises expected loss, not the one with the best accuracy.',
    question: 'At what score threshold does a fraud model minimise expected loss, given review cost per alert?',
    steps: [
      'Time-ordered splits; explicit leakage checks.',
      'XGBoost vs rule and logistic baselines on PR-AUC.',
      'Cost curve, calibration, drift (PSI), SHAP, model card.',
    ],
    done: 'Threshold chosen on cost; MLflow runs tracked; SHAP plots.',
  },
  {
    id: 'trek-planner',
    status: 'queued',
    when: 'Nov 2026',
    title: 'Sahyadri Trek Planner',
    kind: 'Geospatial',
    hobby: 'Trekking',
    cats: ['Geo'],
    tags: ['GeoPandas', 'PostGIS', 'Folium', 'Open-Meteo'],
    summary: 'Scores treks near Pune by difficulty and tells you the best month to go.',
    question: 'Which Sahyadri treks near Pune match a difficulty level, and when is the best month to go?',
    steps: [
      'OpenStreetMap trails + DEM elevation, smoothed.',
      'Difficulty score calibrated against hand labels.',
      '10 years of weather → best-month score; Streamlit map.',
    ],
    done: 'Map and planner live.',
  },
  {
    id: 'supply-chain',
    status: 'queued',
    when: 'Dec 2026',
    title: 'Fulfillment Reconciliation',
    kind: 'Supply chain · Spark',
    cats: ['Big data', 'BI'],
    tags: ['PySpark', 'Spark SQL', 'pandas', 'Plotly'],
    summary: 'Scheduled vs. actual delivery, reconciled like a billing close: where fulfillment slips, why, and what it costs.',
    question:
      'Where does actual fulfillment drift from schedule (by warehouse, region, shipping mode and category), and is the late-delivery risk controllable or structural?',
    steps: [
      'DataCo Smart Supply Chain orders loaded into PySpark; schema explored with Spark SQL.',
      'Scheduled vs. actual shipping days reconciled per order, with variances by warehouse, region, shipping mode and product category.',
      'Late-delivery risk by market, segment and priority, split into controllable (shipping mode) and structural (region, distance) causes.',
      'Dollar impact of late and at-risk orders, and the few segments that would move it most.',
    ],
    done: 'Variance tables tie back to order totals; notebook and report published; runs on Databricks unchanged.',
  },
  {
    id: 'music-pop',
    status: 'queued',
    when: 'Dec 2026',
    title: 'What Makes a Hit',
    kind: 'Music ML',
    hobby: 'Dancing',
    cats: ['ML'],
    tags: ['XGBoost', 'SHAP', 'Streamlit'],
    summary: 'Which audio features relate to track popularity, reported honestly even where the signal is weak.',
    question: 'Which audio and metadata features relate to popularity, and what natural clusters exist?',
    steps: [
      'Artist-grouped cross-validation to avoid leakage.',
      'SHAP drivers; association, not causation.',
      'Audio clusters + Streamlit similarity app.',
    ],
    done: 'Streamlit app deployed.',
  },
  {
    id: 'ipl-wp',
    status: 'queued',
    when: 'Jan 2027',
    title: 'IPL Win Probability',
    kind: 'Sports analytics',
    cats: ['ML', 'BI'],
    tags: ['DuckDB', 'LightGBM', 'Tableau'],
    summary: 'Ball-by-ball win probability for every chase, and which players move it most.',
    question: 'What is the chasing team’s win probability at every ball, and which players add the most?',
    steps: [
      'Ball-level state table from Cricsheet.',
      'Calibrated LightGBM with monotonic constraints.',
      'Win probability added per batter and bowler.',
    ],
    done: 'Win probability calibrated; dashboard live.',
  },
  {
    id: 'hcp-targeting',
    status: 'queued',
    when: 'Jan 2027',
    title: 'Prescriber Targeting',
    kind: 'Healthcare · consulting',
    cats: ['BI'],
    tags: ['DuckDB', 'Power BI', 'CMS Part D'],
    summary: 'Which prescribers a brand team should prioritise, and how to balance territories.',
    question:
      'Which prescribers should a brand team prioritise in a therapeutic class, and how should territories be balanced?',
    steps: [
      'Concentration, mix and trend on public CMS data.',
      'A/B/C tiers from volume × growth.',
      'Illustrative territory alignment + call plan memo.',
    ],
    done: 'Dashboard plus case memo.',
  },
];

/** Numbers come from the order above: 01, 02, … */
export const projects: Project[] = list.map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0') }));

/**
 * Filter pills on the Work page. 'All', 'Shipped' and 'Queue' are built in;
 * any other label filters by a project's `cats`.
 */
export const workFilters = ['All', 'Shipped', 'Queue', 'ML', 'Finance', 'BI'];

/** Work page header copy. Supports *emphasis* and the {shipped}/{queued}/{total} counters. */
export const workPage = {
  label: '(02) Index · {total} projects',
  lead: '{shipped:word} shipped. {queued:word} in the queue, *built in public* through January.',
};
