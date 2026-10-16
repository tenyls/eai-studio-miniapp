# EAi Studio Mini App — TEST 0.54

Public static frontend. Open from **@test_eai_post_editor_bot** → Additional tools → Mini App → Open EAi Studio.

This repository contains only HTML, CSS and JavaScript. It contains no bot tokens, private source code, databases, user records or live administrative statistics.

The reply-keyboard Mini App sends a small allowlisted action to the test bot. The bot independently checks the user, access restrictions and channel subscription. Opening the website directly does not grant access to the bot or its administration.

Private analytics are exported only to administrators in @Test_EAi_POST_Support_bot. Save audience-report.json from Statistics → Funnel and chart, then import it using Upload report. Charts render locally on the device; the file is never uploaded. The report contains aggregate counts and referral labels, no user IDs, names, messages or profile records. These charts are a dated snapshot, not live statistics.

An authenticated live backend can be connected later using validated Telegram initData, short expiration and server-side administrator authorization. A Pages page alone is not an authenticated server. No backend URL has been configured or exposed on the temporary VPS.

VPN offers are advertisements configured in the bot, not in this static repository. External providers determine terms and availability.
