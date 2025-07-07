import webPush from "web-push";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import dailyTerms from "../../../data/daily_terms.json";
import gfgPotdData from "../../../data/gfg_potd.json";
import leetcodePotdData from "../../../data/leetcode_potd.json";
import systemDesignQuestions from "../../../data/system_design_questions.json";
import learn10Topics from "../../../data/10min_topics.json";
import microDevTips from "../../../data/micro_dev_tips.json";
import techBattles from "../../../data/tech_battles.json";

const uri = process.env.MONGODB_URI;
const baseUrl = process.env.BASE_URL || "https://devexcode.com";
let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

webPush.setVapidDetails(
  "mailto:akashkore5@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Configure nodemailer transporter with pooling
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true, // true for 465, false for 587
  pool: true, // Enable connection pooling
  maxConnections: 5, // Maximum number of concurrent connections
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper for exponential backoff delay
function getBackoffDelay(attempt) {
  const baseDelay = 1000; // 1 second
  const maxDelay = 60000; // 60 seconds
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  return delay + Math.random() * 100; // Add jitter
}

// Helper for random delay between emails
function randomDelay(min = 1000, max = 5000) {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min);
  });
}

async function sendNotifications(db, date, isTest = false) {
  

  // Fetch daily term
  const term = dailyTerms.find((t) => t.date === date);

  // Fetch GFG POTD, fallback to random
  let gfgPotd = gfgPotdData.find((potd) => potd.date === date);
  let isGfgRandom = false;
  if (!gfgPotd && gfgPotdData.length > 0) {
    gfgPotd = gfgPotdData[Math.floor(Math.random() * gfgPotdData.length)];
    isGfgRandom = true;
  }

  // Fetch LeetCode POTD, fallback to random
  let leetcodePotd = leetcodePotdData.find((potd) => potd.date === date);
  let isLeetcodeRandom = false;
  if (!leetcodePotd && leetcodePotdData.length > 0) {
    leetcodePotd = leetcodePotdData[Math.floor(Math.random() * leetcodePotdData.length)];
    isLeetcodeRandom = true;
  }

  // Randomly select one entry from each dataset
  const systemDesign =
    systemDesignQuestions.length > 0
      ? systemDesignQuestions[Math.floor(Math.random() * systemDesignQuestions.length)]
      : null;
  const learn10Topic =
    learn10Topics.length > 0
      ? learn10Topics[Math.floor(Math.random() * learn10Topics.length)]
      : null;
  const microDevTip =
    microDevTips.length > 0
      ? microDevTips[Math.floor(Math.random() * microDevTips.length)]
      : null;
  const techBattle =
    techBattles.length > 0
      ? techBattles[Math.floor(Math.random() * techBattles.length)]
      : null;

  console.log(`[sendNotifications] Selected term:`, term || "None (using fallback)");
  console.log(`[sendNotifications] GFG POTD:`, gfgPotd || "None", isGfgRandom ? "(random)" : "");
  console.log(`[sendNotifications] LeetCode POTD:`, leetcodePotd || "None", isLeetcodeRandom ? "(random)" : "");
  
  
  
  

  // Prepare push notification payload
  const notificationPayload = term
    ? {
        title: `TechBit: ${term.term}${isTest ? " (Test)" : ""}`,
        body: term.shortExplanation,
        icon: `${baseUrl}/favicon.png`,
        badge: `${baseUrl}/badge.png`,
        date: term.date,
        data: { url: `${baseUrl}/daily-term/${term.date}` },
      }
    : {
        title: `TechBit: New Term Available${isTest ? " (Test)" : ""}`,
        body: "Discover today's technical term on DevExCode!",
        icon: `${baseUrl}/favicon.png`,
        badge: `${baseUrl}/badge.png`,
        date,
        data: { url: `${baseUrl}/daily-term` },
      };
  

  // Fetch users and subscriptions
  const users = await db.collection("users").find({ email: { $ne: null } }).toArray();
  const subscriptions = await db.collection("notifications").find().toArray();
  console.log(
    `[sendNotifications] Found ${users.length} users with emails`,
    users.map((u) => u.email)
  );
  console.log(
    `[sendNotifications] Found ${subscriptions.length} push subscriptions`,
    subscriptions.map((s) => s.userId)
  );

  if (users.length === 0 && subscriptions.length === 0) {
    
    await sendSummaryEmail(
      [],
      date,
      isTest,
      [],
      term,
      gfgPotd,
      leetcodePotd,
      systemDesign,
      learn10Topic,
      microDevTip,
      techBattle,
      isGfgRandom,
      isLeetcodeRandom
    );
    return { message: "No users or subscriptions found" };
  }

  const errors = [];
  const results = [];
  const maxRetries = 3;

  // Process push notifications
  const pushPromises = subscriptions.map(async (sub) => {
    const result = {
      userId: sub.userId,
      pushStatus: null,
      emailStatus: sub.email ? "pending" : "skipped",
    };
    const logEntry = {
      userId: sub.userId,
      date,
      term: term ? term.term : "Fallback Term",
      pushStatus: "pending",
      emailStatus: sub.email ? "pending" : "skipped",
      timestamp: new Date().toISOString(),
      testMode: isTest,
    };

    await db.collection("notification_logs").insertOne(logEntry);

    try {
      await webPush.sendNotification(
        sub.subscription,
        JSON.stringify(notificationPayload)
      );
      
      result.pushStatus = "success";
      logEntry.pushStatus = "success";
    } catch (error) {
      console.error(
        `[sendNotifications] Push error for userId: ${sub.userId}`,
        error.message,
        error.statusCode,
        error.body
      );
      await db.collection("notifications").deleteOne({ userId: sub.userId });
      result.pushStatus = "failed";
      logEntry.pushStatus = "failed";
      errors.push({
        userId: sub.userId,
        type: "push",
        message: error.message,
        statusCode: error.statusCode,
        body: error.body,
      });
    }

    await db.collection("notification_logs").updateOne(
      { userId: sub.userId, date, timestamp: logEntry.timestamp },
      { $set: { pushStatus: logEntry.pushStatus, emailStatus: logEntry.emailStatus } }
    );

    results.push(result);
    return result;
  });

  // Process email notifications with retries and delay
  const emailPromises = users.map(async (user, index) => {
    const result = {
      userId: user._id.toString(),
      pushStatus: "skipped",
      emailStatus: "pending",
    };
    const logEntry = {
      userId: user._id.toString(),
      date,
      term: term ? term.term : "Fallback Term",
      pushStatus: "skipped",
      emailStatus: "pending",
      timestamp: new Date().toISOString(),
      testMode: isTest,
      retryAttempts: 1,
    };

    await db.collection("notification_logs").insertOne(logEntry);

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER || "no-reply@devexcode.com",
      to: user.email,
      subject: `DevExCode Daily Update: TechBit, POTD & More${isTest ? " (Test)" : ""}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>DevExCode Daily Update</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333333; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: #4f46e5; padding: 24px; text-align: center; }
            .header img { max-width: 150px; height: auto; }
            .header h1 { color: #ffffff; margin: 10px 0 0; font-size: 24px; font-weight: 600; }
            .content { padding: 24px; }
            .content p { line-height: 1.6; margin: 8px 0; font-size: 16px; color: #333333; }
            .section { margin-bottom: 24px; }
            .section h2 { color: #4f46e5; font-size: 20px; font-weight: 600; margin: 0 0 12px; }
            .section p { margin: 0 0 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #4f46e5; color: #ffffff !important; text-decoration: none !important; border-radius: 6px; font-size: 16px; font-weight: 600; margin: 12px 0; }
            .button:hover { background: #4338ca; }
            .image { max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0; }
            .footer { background: #f4f4f4; padding: 16px; text-align: center; font-size: 14px; color: #666666; }
            .footer a { color: #4f46e5; text-decoration: none; }
            .footer a:hover { text-decoration: underline; }
            .divider { border-top: 1px solid #e5e7eb; margin: 24px 0; }
            .note { font-size: 14px; color: #666666; font-style: italic; }
            @media (max-width: 600px) {
              .container { margin: 10px; }
              .header { padding: 16px; }
              .header h1 { font-size: 20px; }
              .content { padding: 16px; }
              .section h2 { font-size: 18px; }
              .button { padding: 10px 20px; font-size: 14px; }
              .footer { font-size: 12px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${baseUrl}/logo.png" alt="DevExCode Logo">
              <h1>Daily Learning Update${isTest ? " (Test)" : ""}</h1>
            </div>
            <div class="content">
              <p>Hello${user.name ? ` ${user.name}` : ""},</p>
              <p>Welcome to your daily dose of tech knowledge from DevExCode! Explore today's technical term, coding challenges, and more.</p>

              <!-- Daily Term Section -->

              <div class="divider"></div>
              <div class="section">
                <h2>Daily Tech Term: ${term ? term.term : "New Term Available"}</h2>
                <p>${term ? term.shortExplanation : "Discover today's technical term on DevExCode!"}</p>
                <a href="${term ? `${baseUrl}/daily-term/${term.date}` : `${baseUrl}/daily-term`}" class="button" role="button">Learn Term</a>
              </div>
              <div class="divider"></div>

              <!-- GFG POTD Section -->
              <div class="section">
                <h2>GeeksforGeeks POTD</h2>
                ${gfgPotd
                  ? `
                    <p><strong>${gfgPotd.title}</strong> (${gfgPotd.difficulty}, Acceptance: ${gfgPotd.acceptance_rate})</p>
                    ${gfgPotd.companies && gfgPotd.companies.length > 0 ? `<p><strong>Companies:</strong> ${gfgPotd.companies.join(", ")}</p>` : ""}
                    ${isGfgRandom ? `<p class="note">Note: No POTD available for today, so we selected a random problem.</p>` : ""}
                    <a href="${baseUrl}/gfg/${gfgPotd.problem_id}" class="button" role="button">Solve GFG Problem</a>
                  `
                  : "<p>No GeeksforGeeks POTD available today.</p>"}
              </div>
              <div class="divider"></div>

              <!-- LeetCode POTD Section -->
              <div class="section">
                <h2>LeetCode POTD</h2>
                ${leetcodePotd
                  ? `
                    <p><strong>${leetcodePotd.title}</strong> (${leetcodePotd.difficulty}, Acceptance: ${leetcodePotd.acceptance_rate})</p>
                    ${leetcodePotd.companies && leetcodePotd.companies.length > 0 ? `<p><strong>Companies:</strong> ${leetcodePotd.companies.join(", ")}</p>` : ""}
                    ${isLeetcodeRandom ? `<p class="note">Note: No POTD available for today, so we selected a random problem.</p>` : ""}
                    <a href="${baseUrl}/leetcode/${leetcodePotd.problem_id}-${generateSlug(leetcodePotd.title)}" class="button" role="button">Solve LeetCode Problem</a>
                  `
                  : "<p>No LeetCode POTD available today.</p>"}
              </div>
              <div class="divider"></div>

              <!-- System Design Question Section -->
              <div class="section">
                <h2>System Design Question</h2>
                ${systemDesign
                  ? `
                    <p><strong>${systemDesign.title}</strong> (${systemDesign.difficulty})</p>
                    <p>${systemDesign.description.slice(0, 100)}...</p>
                    <a href="${baseUrl}/system-design/${systemDesign.id}-${generateSlug(systemDesign.title)}" class="button" role="button">Explore Design</a>
                  `
                  : "<p>No system design question available.</p>"}
              </div>
              <div class="divider"></div>

              <!-- 10-Minute Learn Topic Section -->
              <div class="section">
                <h2>10-Minute Learn Topic</h2>
                ${learn10Topic
                  ? `
                    <p><strong>${learn10Topic.question}</strong></p>
                    <p>Master this topic in just 10 minutes!</p>
                    <a href="${baseUrl}/learn10/${learn10Topic.id}" class="button" role="button">Learn Now</a>
                  `
                  : "<p>No 10-minute learn topic available.</p>"}
              </div>
              <div class="divider"></div>

              <!-- Micro Dev Tip Section -->
              <div class="section">
                <h2>Micro Dev Tip</h2>
                ${microDevTip
                  ? `
                    <p><strong>${microDevTip.title}</strong></p>
                    <p>${microDevTip.description ? microDevTip.description.slice(0, 100) + "..." : "Quick tip for developers!"}</p>
                    <a href="${baseUrl}/micro-dev-tips/${microDevTip.id}" class="button" role="button">Read Tip</a>
                  `
                  : "<p>No micro dev tip available.</p>"}
              </div>
              <div class="divider"></div>

              <!-- Tech Battle Section -->
              <div class="section">
                <h2>Tech Battle</h2>
                ${techBattle
                  ? `
                    <p><strong>${techBattle.title}</strong></p>
                    <p>${techBattle.description ? techBattle.description.slice(0, 100) + "..." : "Compare top technologies!"}</p>
                    <a href="${baseUrl}/tech-battles/${techBattle.id}" class="button" role="button">View Battle</a>
                  `
                  : "<p>No tech battle available.</p>"}
              </div>

              <p style="font-size: 14px; color: #666666;">
                Want to stop receiving these emails? 
                <a href="${baseUrl}/unsubscribe?email=${encodeURIComponent(user.email)}" style="color: #4f46e5; text-decoration: underline;">Unsubscribe</a>
              </p>
            </div>
            <div class="footer">
              <p>© 2025 DevExCode. All rights reserved.</p>
              <p>
                <a href="${baseUrl}">Visit our website</a> | 
                <a href="${baseUrl}/contact">Contact Us</a> | 
                <a href="${baseUrl}/privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Retry logic for email sending
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        // Add random delay between emails
        if (index > 0) {
          await randomDelay(1000, 5000);
        }

        await Promise.race([
          transporter.sendMail(mailOptions),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Email sending timed out after 100 seconds")),
              100000
            )
          ),
        ]);
        console.log(
          `[sendNotifications] Email sent to userId: ${user._id}, email: ${user.email}, attempt: ${attempt + 1}`
        );
        result.emailStatus = "success";
        logEntry.emailStatus = "success";
        logEntry.retryAttempts = attempt;
        break; // Exit retry loop on success
      } catch (error) {
        console.error(
          `[sendNotifications] Email error for userId: ${user._id}, email: ${user.email}, attempt: ${attempt + 1}`,
          error.message
        );
        attempt++;
        logEntry.retryAttempts = attempt;

        if (attempt >= maxRetries) {
          result.emailStatus = "failed";
          logEntry.emailStatus = "failed";
          errors.push({
            userId: user._id.toString(),
            type: "email",
            message: error.message,
          });
        } else {
          // Wait with exponential backoff before retrying
          const delay = getBackoffDelay(attempt);
          
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    await db.collection("notification_logs").updateOne(
      { userId: user._id.toString(), date, timestamp: logEntry.timestamp },
      { $set: { pushStatus: logEntry.pushStatus, emailStatus: logEntry.emailStatus, retryAttempts: logEntry.retryAttempts } }
    );

    results.push(result);
    return result;
  });

  const pushResults = await Promise.all(pushPromises);
  const emailResults = await Promise.all(emailPromises);
  const allResults = [...pushResults, ...emailResults];

  const pushSuccessCount = allResults.filter((r) => r.pushStatus === "success").length;
  const pushFailedCount = allResults.filter((r) => r.pushStatus === "failed").length;
  const pushSkippedCount = allResults.filter((r) => r.pushStatus === "skipped").length;
  const emailSuccessCount = allResults.filter((r) => r.emailStatus === "success").length;
  const emailFailedCount = allResults.filter((r) => r.emailStatus === "failed").length;
  const emailSkippedCount = allResults.filter((r) => r.emailStatus === "skipped").length;

  console.log(
    `[sendNotifications] Summary: ${pushSuccessCount} push succeeded, ${pushFailedCount} push failed, ` +
      `${pushSkippedCount} push skipped, ${emailSuccessCount} email succeeded, ${emailFailedCount} email failed, ` +
      `${emailSkippedCount} email skipped`
  );

  await sendSummaryEmail(
    allResults,
    date,
    isTest,
    errors,
    term,
    gfgPotd,
    leetcodePotd,
    systemDesign,
    learn10Topic,
    microDevTip,
    techBattle,
    isGfgRandom,
    isLeetcodeRandom
  );

  return {
    message: "Notifications sent",
    pushSuccessCount,
    pushFailedCount,
    pushSkippedCount,
    emailSuccessCount,
    emailFailedCount,
    emailSkippedCount,
  };
}

async function sendSummaryEmail(
  results,
  date,
  isTest,
  errors,
  term,
  gfgPotd,
  leetcodePotd,
  systemDesign,
  learn10Topic,
  microDevTip,
  techBattle,
  isGfgRandom,
  isLeetcodeRandom
) {
  const pushSuccessCount = results.filter((r) => r.pushStatus === "success").length;
  const pushFailedCount = results.filter((r) => r.pushStatus === "failed").length;
  const pushSkippedCount = results.filter((r) => r.pushStatus === "skipped").length;
  const emailSuccessCount = results.filter((r) => r.emailStatus === "success").length;
  const emailFailedCount = results.filter((r) => r.emailStatus === "failed").length;
  const emailSkippedCount = results.filter((r) => r.emailStatus === "skipped").length;

  const errorDetails = errors.length > 0
    ? errors
        .map(
          (e) => `
        <li>
          <strong>User ID:</strong> ${e.userId}<br>
          <strong>Type:</strong> ${e.type}<br>
          <strong>Message:</strong> ${e.message}<br>
          ${e.statusCode ? `<strong>Status Code:</strong> ${e.statusCode}<br>` : ""}
          ${e.body ? `<strong>Body:</strong> ${e.body}<br>` : ""}
        </li>
      `
        )
        .join("")
    : "<li>No errors encountered.</li>";

  const mailOptions = {
    from: process.env.EMAIL_USER || "no-reply@devexcode.com",
    to: "akashkore5@gmail.com",
    subject: `Notification Summary for ${date}${isTest ? " (Test)" : ""}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>DevExCode Notification Summary</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333333; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: #4f46e5; padding: 24px; text-align: center; }
          .header img { max-width: 150px; height: auto; }
          .header h1 { color: #ffffff; margin: 10px 0 0; font-size: 24px; font-weight: 600; }
          .content { padding: 24px; }
          .content p { line-height: 1.6; margin: 8px 0; font-size: 16px; color: #333333; }
          .content ul { margin: 8px 0; padding-left: 20px; }
          .content li { margin-bottom: 8px; }
          .section { margin-bottom: 24px; }
          .section h2 { color: #4f46e5; font-size: 20px; font-weight: 600; margin: 0 0 12px; }
          .divider { border-top: 1px solid #e5e7eb; margin: 24px 0; }
          .footer { background: #f4f4f4; padding: 16px; text-align: center; font-size: 14px; color: #666666; }
          .footer a { color: #4f46e5; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
          .note { font-size: 14px; color: #666666; font-style: italic; }
          @media (max-width: 600px) {
            .container { margin: 10px; }
            .header { padding: 16px; }
            .header h1 { font-size: 20px; }
            .content { padding: 16px; }
            .section h2 { font-size: 18px; }
            .footer { font-size: 12px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${baseUrl}/logo.png" alt="DevExCode Logo">
            <h1>Notification Summary${isTest ? " (Test)" : ""}</h1>
          </div>
          <div class="content">
            <p><strong>Date:</strong> ${date}${isTest ? " (Test Mode)" : ""}</p>

            <!-- Daily Term Section -->
              <div class="divider"></div>
            <div class="section">
              <h2>Daily Tech Term</h2>
              <p><strong>Term:</strong> ${term ? term.term : "Fallback Term"}</p>
              <p><strong>Explanation:</strong> ${term ? term.shortExplanation : "No term available"}</p>
            </div>
            <div class="divider"></div>

            <!-- GFG POTD Section -->
            <div class="section">
              <h2>GeeksforGeeks POTD</h2>
              ${gfgPotd
                ? `
                  <p><strong>Title:</strong> ${gfgPotd.title}</p>
                  <p><strong>Difficulty:</strong> ${gfgPotd.difficulty}</p>
                  <p><strong>Acceptance Rate:</strong> ${gfgPotd.acceptance_rate}</p>
                  ${gfgPotd.companies && gfgPotd.companies.length > 0 ? `<p><strong>Companies:</strong> ${gfgPotd.companies.join(", ")}</p>` : ""}
                  ${isGfgRandom ? `<p class="note">Note: Random problem selected as no POTD available for ${date}.</p>` : ""}
                  <p><strong>URL:</strong> ${baseUrl}/gfg/${gfgPotd.problem_id}</p>
                `
                : "<p>No GFG POTD available.</p>"}
            </div>
            <div class="divider"></div>

            <!-- LeetCode POTD Section -->
            <div class="section">
              <h2>LeetCode POTD</h2>
              ${leetcodePotd
                ? `
                  <p><strong>Title:</strong> ${leetcodePotd.title}</p>
                  <p><strong>Difficulty:</strong> ${leetcodePotd.difficulty}</p>
                  <p><strong>Acceptance Rate:</strong> ${leetcodePotd.acceptance_rate}</p>
                  ${leetcodePotd.companies && leetcodePotd.companies.length > 0 ? `<p><strong>Companies:</strong> ${leetcodePotd.companies.join(", ")}</p>` : ""}
                  ${isLeetcodeRandom ? `<p class="note">Note: Random problem selected as no POTD available for ${date}.</p>` : ""}
                  <p><strong>URL:</strong> ${baseUrl}/leetcode/${leetcodePotd.problem_id}-${generateSlug(leetcodePotd.title)}</p>
                `
                : "<p>No LeetCode POTD available.</p>"}
            </div>
            <div class="divider"></div>

            <!-- System Design Question Section -->
            <div class="section">
              <h2>System Design Question</h2>
              ${systemDesign
                ? `
                  <p><strong>Title:</strong> ${systemDesign.title}</p>
                  <p><strong>Difficulty:</strong> ${systemDesign.difficulty}</p>
                  <p><strong>Description:</strong> ${systemDesign.description.slice(0, 100)}...</p>
                  <p><strong>URL:</strong> ${baseUrl}/system-design/${systemDesign.id}-${generateSlug(systemDesign.title)}</p>
                `
                : "<p>No system design question included.</p>"}
            </div>
            <div class="divider"></div>

            <!-- 10-Minute Learn Topic Section -->
            <div class="section">
              <h2>10-Minute Learn Topic</h2>
              ${learn10Topic
                ? `
                  <p><strong>Question:</strong> ${learn10Topic.question}</p>
                  <p><strong>URL:</strong> ${baseUrl}/learn10/${learn10Topic.id}</p>
                `
                : "<p>No 10-minute learn topic included.</p>"}
            </div>
            <div class="divider"></div>

            <!-- Micro Dev Tip Section -->
            <div class="section">
              <h2>Micro Dev Tip</h2>
              ${microDevTip
                ? `
                  <p><strong>Title:</strong> ${microDevTip.title}</p>
                  <p><strong>Description:</strong> ${microDevTip.description ? microDevTip.description.slice(0, 100) + "..." : "No description available"}</p>
                  <p><strong>URL:</strong> ${baseUrl}/micro-dev-tips/${microDevTip.id}</p>
                `
                : "<p>No micro dev tip included.</p>"}
            </div>
            <div class="divider"></div>

            <!-- Tech Battle Section -->
            <div class="section">
              <h2>Tech Battle</h2>
              ${techBattle
                ? `
                  <p><strong>Title:</strong> ${techBattle.title}</p>
                  <p><strong>Description:</strong> ${techBattle.description ? techBattle.description.slice(0, 100) + "..." : "No description available"}</p>
                  <p><strong>URL:</strong> ${baseUrl}/tech-battles/${techBattle.id}</p>
                `
                : "<p>No tech battle included.</p>"}
            </div>
            <div class="divider"></div>

            <!-- Summary Section -->
            <div class="section">
              <h2>Notification Summary</h2>
              <ul>
                <li><strong>Total Users Notified:</strong> ${results.length}</li>
                <li><strong>Push Notifications Sent:</strong> ${pushSuccessCount}</li>
                <li><strong>Push Notifications Failed:</strong> ${pushFailedCount}</li>
                <li><strong>Push Notifications Skipped:</strong> ${pushSkippedCount}</li>
                <li><strong>Email Notifications Sent:</strong> ${emailSuccessCount}</li>
                <li><strong>Email Notifications Failed:</strong> ${emailFailedCount}</li>
                <li><strong>Email Notifications Skipped:</strong> ${emailSkippedCount}</li>
              </ul>
            </div>
            <div class="divider"></div>

            <!-- Errors Section -->
            <div class="section">
              <h2>Errors</h2>
              <ul>${errorDetails}</ul>
            </div>
          </div>
          <div class="footer">
            <p>© 2025 DevExCode. All rights reserved.</p>
            <p>
              <a href="${baseUrl}">Visit our website</a> | 
              <a href="${baseUrl}/contact">Contact Us</a> | 
              <a href="${baseUrl}/privacy">Privacy Policy</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Summary email sending timed out after 100 seconds")),
          100000
        )
      ),
    ]);
    
  } catch (error) {
    console.error(
      `[sendSummaryEmail] Error sending summary email to akashkore5@gmail.com`,
      error.message
    );
  }
}

// Helper to generate URL-friendly slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    console.error(`[handler] Method not allowed: ${req.method}`);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log(
      `[handler] Received request: ${req.path}, query:`,
      req.query,
      `method: ${req.method}`
    );
    const { secret } = req.body || {};
    const cronSecret = req.query.cronSecret;

    if (req.method === "POST" && secret !== process.env.NOTIFICATION_SECRET) {
      console.error(`[handler] Invalid secret for POST`);
      return res.status(401).json({ message: "Invalid secret" });
    }
    if (req.method === "GET" && cronSecret !== process.env.NOTIFICATION_SECRET) {
      console.error(`[handler] Invalid cron secret for GET`);
      return res.status(401).json({ message: "Invalid cron secret" });
    }

    const client = await clientPromise;
    const db = client.db("leetcodesolve");
    const today = new Date().toISOString().split("T")[0];
    

    const isTest = req.path === "/api/notifications/send-manual";
    const result = await sendNotifications(db, today, isTest);
    res.status(200).json(result);
  } catch (error) {
    console.error("[handler] Error:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
}