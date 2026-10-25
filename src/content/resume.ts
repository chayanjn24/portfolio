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
    'Data and business analyst with hands-on work in revenue reporting, billing and reconciliation. Grew a *$2.6M+ annual revenue portfolio*, ran company-wide billing for 55+ revenue lines, and reconciled internal and partner data in SQL and Python until it tied out. Finds out why two numbers don’t match, fixes the cause, and automates the report so it stays right. Uses AI tools to move faster and *checks every output against source.*',

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
            'Grew a *$2.6M+ annual revenue portfolio* of 15 demand-partner accounts (Magnite, PubMatic, Nexxen/Unruly, Xandr, FreeWheel and others) by *32% year on year*.',
            'Scaled two newly launched accounts, Magnite and PubMatic, *about 10x*.',
            'Onboarded *7+ new demand integrations*, and curated request filtering for Xandr, Magnite and PubMatic so each received the request types it bids on, lifting *ad requests 20%*.',
          ],
        },
        {
          title: 'Billing & reconciliation',
          points: [
            'Ran *company-wide monthly billing* for 55+ partner revenue lines across 10+ business entities: invoice checks, actualisation, revenue-share and shared-seat splits, IVT chargebacks and partner deductions.',
            'Cut the month-end close from *14 days to 3–4*, reconciliation for invoicing included.',
            'Reconciled *100K+ records every month* between internal and partner data in SQL (Redshift, AWS Athena, MySQL), fixing time-zone mismatches and flagging every gap above 5%.',
            'Found a *bug in the revenue-change formula* that misreported changes for all 70+ demand partners. Spotted it unprompted, fixed it, and ran user acceptance testing against source data; the data team head confirmed the fix.',
          ],
        },
        {
          title: 'Data, automation & AI',
          points: [
            'Automated *daily performance and account-health reports* for 10+ accounts (SQL → Python → Excel Power Query and VBA), replacing manual reporting and saving *7–8 hours a week*.',
            'Built *3 Metabase dashboards* on a 10-minute refresh for demand and supply health, per-account revenue, and ads.txt and bundle checks, used daily by the team.',
            'Cut a key SQL query from *10–15 minutes to 3–4* by filtering early instead of scanning full tables, on TB-scale daily ad-request logs in AWS Athena and Redshift.',
            'Connected *Claude to internal databases through MCP* (read-only, company-approved) and kept a knowledge base of data sources and lessons that helps it improve, saving *2–3 hours a day* on pulling and checking data, with every output verified.',
          ],
        },
        {
          title: 'Stakeholders & delivery',
          points: [
            'Presented monthly revenue reports to the *CEO, COO and founder* and parent-company executives, and turned around *3+ ad-hoc analysis requests a week* within 2–3 hours.',
            'Turned requirements from leadership, partners and clients into Jira tickets for data engineering, *about 5 a day*, on reporting logic and data fixes.',
            'Supported a platform transition by keeping a daily side-by-side comparison of two in-house ad servers on identical traffic (IVT, fill rate, CPM).',
          ],
        },
        {
          title: 'Ad tech, yield & quality',
          points: [
            'Compared two versions of the same supply side by side and tested floor prices, lifting *eCPM from $0.50 to $0.70* on tested supply and keeping revenue per million requests above $2 when demand was thin.',
            'Fixed *zero-bid and zero-delivery issues* by comparing OpenRTB bid requests field by field (bidfloor, mimes, tmax, duration, schain, app and publisher IDs) and correcting VAST macro mapping with partner tech teams.',
            'Measured how *Extended IDs* affect bids and revenue, ranked supply by OS and supply type, and built partner-level QPS action plans; QPS throttling cut wasted requests *about 15%*.',
            'Kept bundle-level *invalid traffic under the SSPs’ 2.5% ceiling* with IVT filtering, brand-safety rules, bundle allowlists, and ads.txt, app-ads.txt and schain checks in SQL.',
            'Set up and fixed *PMP and preferred deals* through SSP partners for DV360 and The Trade Desk buyers, resolving deal ID, floor, targeting and seat mismatches.',
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
            'Ran 8 programmatic display campaigns (*£160K budget*) on Xandr Invest and Beeswax for 8+ real-estate clients: setup, trafficking, creative QA, targeting and bidding.',
            'Kept budget pacing within *95–105% of plan* by adjusting CPM bids, tracked in daily pacing reports built in Excel from platform APIs and UIs.',
            'Built full-funnel audience strategies for property launches (geo, HNWI, real-estate intenders, retirement investors) and lifted *conversions 15–23%* (sign-ups, booked calls) through segmentation and A/B testing.',
            'Automated recurring campaign reporting through APIs and Looker, cutting turnaround *35%*.',
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
    { group: 'SQL & Python', items: 'SQL (joins, CTEs, window functions, query optimisation; MySQL, Redshift, AWS Athena, Snowflake, DuckDB), Python (Pandas, NumPy, Scikit-learn), PySpark and Spark MLlib on Databricks' },
    { group: 'Analysis & modelling', items: 'Data quality, reconciliation and validation, root-cause and variance analysis, cohort analysis, KPI monitoring, A/B comparison, forecasting (SARIMA, baselines), anomaly detection (Isolation Forest, robust z-scores), text classification (TF-IDF), clustering (KMeans), logistic regression, XGBoost, recommender systems (ALS, item-kNN), model evaluation (AUC, F1, precision and recall, NDCG and MAP)' },
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
