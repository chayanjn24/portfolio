/**
 * RÉSUMÉ PAGE: the full, long-form version of your résumé.
 *
 * Every number here is from the verified table in
 * Resumes & Job Search/3 LaTeX Projects/project_context/01_CONTENT_BANK.md (Part 0.3).
 * Don't change a number without updating the content bank too.
 *
 * Contact details (email, phone, links) come from site.ts.
 * The downloadable one-page PDF is set in site.ts → resumePdf (a copy of the LaTeX master_analyst).
 *
 * In bullets, *asterisks* brighten the key phrase (like the bold spans on the PDF).
 * Section order on the page is fixed; letters (A), (B)… are automatic and skip empty sections.
 *
 * Voice (v3, 25 Oct 2026, content bank 0.6): plain words, no long dashes, no "I".
 * AdElement is past tense (Jul 2025 – Oct 2026), matching the PDFs.
 */
import type { Certification, Job, LeadershipRole, ResumeProject, Stat } from './types';

export const resume = {
  label: '(04) Résumé · data & business analyst',
  location: 'Pune, India',
  openTo: 'Open to roles in Pune, Bengaluru, Hyderabad and Gurgaon',

  /** Supports *emphasis*. */
  profile:
    'Data and business analyst with a background in revenue reporting, billing and reconciliation. At AdElement Media, looked after a *$2.6M+ annual revenue portfolio* and cut the monthly billing close from 14 days to 3–4. Works mainly in SQL, Python and Excel, and uses AI tools day to day with *every output checked against source*.',

  /** "At a glance" strip. The first value is orange. */
  highlights: [
    { value: '$2.6M+', label: 'annual revenue portfolio across 15 partner accounts' },
    { value: '32%', label: 'year-on-year portfolio revenue growth' },
    { value: '3–4', label: 'days to close the books each month, down from 14' },
    { value: '100K+', label: 'records reconciled every month in SQL' },
    { value: '7–8h', label: 'analyst hours saved every week by automation' },
    { value: '2–3h', label: 'saved every day with Claude on internal data' },
  ] satisfies Stat[],

  jobs: [
    {
      org: 'AdElement Media',
      role: 'Data Analyst',
      location: 'Pune, Maharashtra',
      when: 'Jul 2025 – Oct 2026',
      context:
        'Programmatic advertising company with its own ad server. Owned partner revenue data end to end: accounts, billing, reconciliation and the reports leadership read.',
      groups: [
        {
          title: 'Revenue & accounts',
          points: [
            'Grew a *$2.6M+ annual revenue portfolio* of 15 demand-partner accounts (Magnite, PubMatic, Nexxen/Unruly, Xandr, FreeWheel and others) by *32% year on year*, through request filtering and floor-price tests.',
            'Scaled two newly launched accounts, Magnite and PubMatic, *about 10x*, and onboarded *7+ new demand integrations*.',
            'Opened *new revenue from low-volume publishers*: analysed their bundles and found new opportunities; leadership started a few, and they later became strong earners.',
            'Lifted *ad requests 20%* by matching the request types sent to Xandr, Magnite and PubMatic to what each one bids on, without blocking valid traffic.',
          ],
        },
        {
          title: 'Billing & reconciliation',
          points: [
            'Cut the *month-end close from 14 days to 3–4* for company-wide billing (55+ partner revenue lines across 10+ business entities) by building SQL views that put our revenue and partner revenue from several databases side by side. Only the proofs were left to check by hand, so invoices were ready about 10 days sooner.',
            'Reconciled *100K+ records every month* against partner reports in SQL (Redshift, AWS Athena, MySQL) before each invoice went out, fixing time-zone mismatches and flagging every gap above 5%.',
            'Found a *bug in the revenue-change formula* that misreported daily changes for all 70+ demand partners, capping real jumps at 100%. Spotted it unprompted, fixed it and proved the fix with user acceptance testing against source data; the data team head confirmed it.',
          ],
        },
        {
          title: 'Data, automation & AI',
          points: [
            'Replaced manual daily performance and account-health reports for 10+ accounts with a pipeline (SQL → Python → Excel Power Query and VBA), saving *7–8 hours a week*.',
            'Built *3 Metabase dashboards* on a 10-minute refresh that flagged IVT spikes, revenue drops, margin changes and bundle problems, so the team of 10+ could act without running a query.',
            'Saved *about an hour a day* by rewriting a per-account SQL query on TB-scale ad-request logs in AWS Athena and Redshift (*20 minutes to 10* per account): joined the data inside the query, filtered early and dropped repeated fields.',
            'Saved *2–3 hours a day* on the slowest part of analysis, pulling and checking data, by connecting *Claude to internal databases through MCP* (read-only, company-approved) with a knowledge base of data sources and lessons that keeps improving it. Every output was verified against source.',
          ],
        },
        {
          title: 'Leadership reporting',
          points: [
            'Turned around *3+ ad-hoc leadership requests a week* within 2–3 hours, and presented the monthly revenue report to the *CEO, COO and founder* and parent-company executives.',
          ],
        },
        {
          title: 'Yield & traffic quality',
          points: [
            'Tested floor prices on two versions of the same supply side by side: *eCPM rose from $0.50 to $0.70*, and revenue per million requests stayed above $2 when demand was thin.',
            'Kept bundle-level *invalid traffic under the SSPs’ 2.5% ceiling* with IVT filtering, bundle allowlists and ads.txt checks in SQL, so partners kept buying the supply and IVT chargebacks fell.',
          ],
        },
      ],
    },
    {
      org: 'Datawrkz',
      role: 'Ad Operations Analyst Intern',
      location: 'Bengaluru, Karnataka',
      when: 'Mar – Jun 2025',
      context: 'Programmatic agency on the buy side: running and reporting display campaigns on DSPs.',
      groups: [
        {
          points: [
            'Kept 8 display campaigns (*£160K budget*) on Xandr Invest and Beeswax within *95–105% of planned spend* by adjusting CPM bids from daily Excel pacing reports.',
            'Lifted *conversions 15–23%* (sign-ups, booked calls) for 8+ real-estate clients by building audiences for each property launch (geo, high-net-worth, real-estate intenders, retirement investors) and A/B testing them.',
            'Cut reporting turnaround *35%* by automating recurring campaign reports through APIs and Looker.',
          ],
        },
      ],
    },
  ] satisfies Job[],

  research: [
    {
      org: 'NIT Silchar',
      role: 'Machine Learning Research Project',
      location: 'Silchar, Assam',
      when: 'Jun – Aug 2024',
      context: 'Team project under Prof. Prashant J (Satyendra Nath Bose research programme).',
      groups: [
        {
          points: [
            'Predicted concrete compressive strength from mix composition on *1,000+ lab samples* using regression in Python (Pandas, NumPy, Scikit-learn), reaching *R² 0.734* and an MAE of 7.53 MPa.',
            'Handled outlier detection and feature engineering; the findings pointed to cheaper material choices.',
          ],
        },
      ],
      link: { label: 'Repository', href: 'https://github.com/NoOne-Cares/Concrete-Strength-Prediction' },
    },
  ] satisfies Job[],

  projects: [
    {
      title: 'Tallyline',
      id: 'tallyline',
      stack: 'Python · DuckDB · SQL · FastAPI · Chart.js · pytest',
      when: '2026',
      links: [
        { label: 'Live demo', href: 'https://tallyline.onrender.com' },
        { label: 'GitHub', href: 'https://github.com/chayanjn24/tallyline' },
      ],
      points: [
        'Built an *analytics workspace for a simulated ad exchange*: live KPIs, a full bid funnel, six drill-down levels, comparisons and printable reports.',
        'Wrote the anomaly detector in SQL (robust z-scores against the same hour in past weeks, then gaps-and-islands to merge hours into incidents). It caught *100% of planted incidents* across three seeds at 94–100% precision.',
        'Modelled the data as a DuckDB star schema with rollups (typical 31-day query: 5–30 ms), served by a read-only FastAPI; 31 tests check that every breakdown adds back up to the total.',
      ],
    },
    {
      title: 'Credit Risk & Loan Default Analytics',
      id: 'credit-risk',
      stack: 'Snowflake SQL · Python · Scikit-learn · XGBoost · Tableau',
      when: '2026',
      links: [
        { label: 'GitHub', href: 'https://github.com/chayanjn24/credit-risk-analysis' },
        { label: 'Tableau Public', href: 'https://public.tableau.com/app/profile/chayan.gulgulia/vizzes' },
      ],
      points: [
        'Analysed *150K+ loan records* in Snowflake SQL (CTEs, window functions, cohort analysis): borrowers with high card utilisation and past late payments defaulted at *48%*, against 3% for low-risk borrowers.',
        'Compared logistic regression and XGBoost (test AUC 0.86 and 0.87) and turned the scores into a lending rule: declining the riskiest 20% catches *73% of defaulters*.',
        'Published two cross-filtered Tableau Public dashboards and a business case study written for non-technical readers.',
      ],
    },
    {
      title: 'Expense Tracker',
      id: 'expense-tracker',
      stack: 'Python · pandas · scikit-learn · statsmodels · Plotly',
      when: '2026',
      links: [{ label: 'Notebook', href: 'https://colab.research.google.com/drive/1bC1_w7qK4CpFu_IVKJXIYP90GaAki7WS?usp=sharing' }],
      points: [
        'Built a Colab notebook on *815 real personal transactions* (sanitized for the shareable demo): savings rate, budget vs. actual, subscriptions, unusual-payment alerts and a month-end forecast.',
        'Tested ML against the rules on an unseen month: a *TF-IDF + logistic regression categorizer* got 59% right vs 45% (macro F1 0.49 vs 0.39), and a *weekly SARIMA* cut month-end forecast error to 8% from 15% by day 20.',
        'Checked Isolation Forest against the rule-based alerts (agreed on 3 of 8, surfaced 5 more) and reported KMeans merchant groups as too weak to use (silhouette 0.26).',
      ],
    },
    {
      title: 'Movie Recommender',
      id: 'movie-recs',
      stack: 'PySpark · Spark MLlib · Databricks · NumPy',
      when: '2026',
      links: [
        { label: 'GitHub', href: 'https://github.com/chayanjn24/movie-recommender' },
        { label: 'Notebooks', href: 'https://chayanjn24.github.io/movie-recommender/' },
      ],
      points: [
        'Built a *Spark ALS recommender* on Databricks and scaled it from 100K to *25M MovieLens ratings* (162K users), tested on a time-based split of what each user watched next.',
        'Implicit ALS beat a popularity baseline by *94% on NDCG@10* at 25M (59% at 100K). The model with the best rating error (RMSE 0.887) ranked worst, so recommenders should be judged on ranking.',
        'Measured scaling on serverless compute: *100× more data took 8.3× longer* to train (41 s to 339 s). Built top-10 lists from the ALS factors in NumPy where Spark’s built-in method was blocked.',
      ],
    },
    {
      title: 'Nifty 50 Risk & Backtests',
      id: 'nifty-risk',
      stack: 'DuckDB SQL · Python · statsmodels · GARCH · Tableau',
      when: '2026',
      links: [
        { label: 'GitHub', href: 'https://github.com/chayanjn24/nifty50-risk' },
        { label: 'Tableau Public', href: 'https://public.tableau.com/app/profile/chayan.gulgulia/viz/Nifty50RiskRegimesandBacktests/Strategies' },
      ],
      points: [
        'Backtested trading rules and 5 portfolio weightings on *Nifty 50 stocks* out of sample (2017–2026, after costs): a moving-average timing rule earned *6.6% a year against 12.4%* for buy-and-hold.',
        'Tested one-day *Value at Risk* three ways with Kupiec and Christoffersen backtests; only *GARCH-t passed both at 99%* for the index (36 breaches against 26.6 expected).',
        'Showed that momentum’s *25.6% a year* was mostly *survivorship bias*: equal weight on the same 50 stocks made 21.9%. Fixed 4 errors in the Yahoo price feed after checking every move over 18% against news.',
      ],
    },
    {
      title: 'Quick-Commerce Funnel',
      id: 'quick-commerce',
      stack: 'dbt · PostgreSQL · SQL · Python · Tableau · Metabase',
      when: '2026',
      links: [
        { label: 'GitHub', href: 'https://github.com/chayanjn24/quickcommerce-funnel' },
        { label: 'Tableau Public', href: 'https://public.tableau.com/app/profile/chayan.gulgulia/viz/Quick-CommerceFunnel/AmazonIndia' },
      ],
      points: [
        'Modelled *120K Amazon India orders* and Blinkit orders, customers and campaigns in dbt on Postgres (25 models, 58 tests), with funnels, cohorts and RFM segments in Tableau Public and Metabase dashboards.',
        'Found that four eastern states *return orders at twice the rate* of the rest of India (12.5% vs 6.4%), and that a promotion field only looked like it prevented cancellations because it is filled in after the order goes through.',
        'Ran a *simulated A/B test* of a ₹100 win-back offer: reorders rose 10.1% (95% CI 3.1% to 17.2%), but each extra reorder cost ₹1,087 in discounts against ₹609 margin, so the offer was not rolled out.',
      ],
    },
    {
      title: 'Student Performance Analysis Dashboard',
      stack: 'Power BI · DAX · SQL · ETL',
      when: '2024',
      links: [{ label: 'GitHub', href: 'https://github.com/chayanjn24/Student-Analysis-Dashboard' }],
      points: [
        'Cleaned and transformed *150K+ raw institutional records* with SQL and ETL into a Power BI reporting suite (DAX), helping administrators spot at-risk students early.',
      ],
    },
    {
      title: 'Campus Crave',
      id: 'campus-crave',
      stack: 'Flutter · Dart · Riverpod',
      when: '2024 · rebuilt 2026',
      links: [
        { label: 'Live demo', href: 'https://chayanjn24.github.io/campus_crave/' },
        { label: 'GitHub', href: 'https://github.com/chayanjn24/campus_crave' },
      ],
      points: [
        'Built a *campus food delivery app* for NIT Silchar: students order from hostel canteens, and other students deliver for ₹15 paid into an in-app wallet.',
        'Designed separate flows for students, runners and vendors, with live order tracking and 11 unit tests on the order rules, fees and wallet.',
      ],
    },
  ] satisfies ResumeProject[],

  skills: [
    { group: 'SQL & Python', items: 'SQL (joins, CTEs, window functions, query optimisation; MySQL, PostgreSQL, Redshift, AWS Athena, Snowflake, DuckDB), dbt (models and tests), Python (Pandas, NumPy, Scikit-learn), PySpark and Spark MLlib on Databricks' },
    { group: 'Analysis & modelling', items: 'Data quality, reconciliation and validation, root-cause and variance analysis, cohort, funnel and RFM analysis, KPI monitoring, A/B testing (sample size, sample ratio checks, confidence intervals), forecasting (SARIMA, baselines), anomaly detection (Isolation Forest, robust z-scores), text classification (TF-IDF), clustering (KMeans), risk and backtesting (VaR with Kupiec and Christoffersen tests, GARCH, CAPM beta, Markov regimes, bootstrap), logistic regression, XGBoost, recommender systems (ALS, item-kNN), model evaluation (AUC, F1, precision and recall, NDCG and MAP)' },
    { group: 'BI & reporting', items: 'Power BI (DAX), Tableau, Looker, Metabase, KPI dashboards, Excel (Power Query, pivot tables, XLOOKUP, VBA), Google Sheets, PowerPoint, ETL automation' },
    { group: 'Business analysis', items: 'Requirements gathering, Jira ticketing, user acceptance testing (UAT), stakeholder management, cross-functional communication, executive presentations' },
    { group: 'Ad tech', items: 'RTB, header bidding (Prebid), PMP deals, OpenRTB 2.5/2.6, VAST/VPAID, ads.txt and schain, IVT and brand safety, yield optimisation; Xandr Invest and Beeswax (hands-on), Amazon DSP (certified), Magnite, PubMatic, Xandr Monetize, Cedato' },
    { group: 'Tools & AI', items: 'Git, GitHub, Jira, AWS, DB Gate, Google Apps Script, Jenkins, Notion; Claude (via MCP), Claude Code, ChatGPT, with every output checked' },
    { group: 'Currently learning', items: 'Delta Lake' },
  ],

  certifications: [
    { name: 'Amazon DSP Certification', issuer: 'Amazon Ads', when: 'Mar 2025 · valid to Mar 2027', href: 'https://advertising.amazon.com/academy/student/path/1532/amazon-dsp-certification' },
    { name: 'Data Visualization with Power BI', issuer: 'Great Learning', when: 'Sep 2024', href: 'https://www.mygreatlearning.com/certificate/SFFJTRBN' },
    { name: 'Generative AI for Executives and Business Leaders', when: 'Jun 2024 · credential 7274GMGAN88F' },
    { name: 'Introduction to Data Analysis using Microsoft Excel', issuer: 'Coursera', when: 'Mar 2024', href: 'https://www.coursera.org/account/accomplishments/certificate/UY3D499CBGFV' },
    { name: 'Responsive Web Design', issuer: 'freeCodeCamp', when: 'Mar 2024' },
    { name: 'Introduction to Blockchain', issuer: 'AWS Training', when: 'Mar 2024' },
    { name: 'Display & Video 360 and Campaign Manager 360', issuer: 'Google Skillshop', when: 'In progress' },
  ] satisfies Certification[],

  leadership: [
    { role: 'General Secretary', org: 'NITSMUN, NIT Silchar', when: '2024 – 2025', description: 'Led 8+ Model UN conferences and mock sessions, grew participation 70%, and secured ₹30,000 in sponsorships.' },
    { role: 'Executive Head', org: 'E-Cell, NIT Silchar', when: '2023 – 2024', description: 'Ran 10 workshops and 5 mentorship programmes for a campus of 8,000+ students, and negotiated ₹1,00,000 in sponsorships.' },
    { role: 'Core Team Member', org: 'Aaveg, the dance club of NIT Silchar', when: '2023 – 2024', description: 'Helped run 3 inter-college competitions reaching 5,000+ students, and brought in a ₹20,000 sponsorship.' },
    { role: 'Core Content Writer & Organiser', org: 'Incandescence 2023 · Tecnoesis 2022', when: '2022 – 2023', description: 'Wrote promotional content for two of the college’s flagship festivals, with 3,000+ participants.' },
  ] satisfies LeadershipRole[],

  education: {
    school: 'National Institute of Technology, Silchar',
    degree: 'B.Tech, Civil Engineering · CGPA 8.24',
    location: 'Silchar, Assam',
    when: '2021 – 2025',
  },

  extras: [
    { label: 'Languages', value: 'English, Hindi (full professional)' },
    { label: 'Problem solving', value: 'LeetCode: 300+ problems solved, 50-day streak badge' },
  ],
};
