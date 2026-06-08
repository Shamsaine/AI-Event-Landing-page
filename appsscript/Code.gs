/**
 * Alteturia Google Apps Script (Web App)
 * 
 * Handles three types of submissions:
 * 1. Builder Sprint Registration - saves to FutureBuilderSprint sheet, redirects to WhatsApp
 * 2. Technical Session Registration - saves to TechnicalSession sheet, redirects to WhatsApp
 * 3. Contact Message - saves to Messages sheet, sends confirmation email with WhatsApp link
 *
 * Deploy:
 *  - Apps Script -> Deploy -> New deployment -> Web app
 *  - Execute as: Me
 *  - Who has access: Anyone (or Anyone with link)
 */

const SPREADSHEET_ID = "1ytXrTMc1yS7YppqbKO5bV_9RXWcJ81Vcfy0IQ7tyNyc";
const DEFAULT_SOURCE = "alteturia-event-page";
const DEFAULT_WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/LrzmQH68G150NgK3vV0HPy?mode=gi_t";
const ALTETURIA_EMAIL = "alteturiaofficial@gmail.com";

/**
 * Main webhook handler
 * Expected payload:
 *  - form_type = "registration" | "message"
 *  - source, submitted_at
 */
function doPost(e) {
  try {
    const params = (e && e.parameter) ? e.parameter : {};
    const formType = String(params.form_type || "").toLowerCase();
    const submittedAt = params.submitted_at || new Date().toISOString();
    const source = params.source || DEFAULT_SOURCE;

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (formType === "registration") {
      return handleRegistration_(ss, params, submittedAt, source);
    }

    if (formType === "message") {
      return handleMessage_(ss, params, submittedAt, source);
    }

    return jsonResponse_({ ok: false, error: "Unknown form_type" });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

function handleRegistration_(ss, params, submittedAt, source) {
  const areaOfInterest = (params.area_of_interest || "").trim();
  const interestLower = areaOfInterest.toLowerCase();

  // Determine sheet based on event type
  let sheetName = "TechnicalSession";
  let row = [];

  if (interestLower.indexOf("builder sprint") !== -1) {
    // BUILDER SPRINT registration
    sheetName = "FutureBuilderSprint";
    const headers = [
      "Submitted At",
      "Full Name",
      "Email Address",
      "Phone Number",
      "Location",
      "Area of Expertise",
      "Project Idea Summary",
      "Progress Platform",
      "Profile Handle",
      "How Did You Hear About Us"
    ];
    ensureSheet_(ss, sheetName, headers);
    
    row = [
      submittedAt,
      params.full_name || "",
      params.email_address || "",
      params.phone_number || "",
      params.location || "",
      params.experience_level || "",
      params.idea_summary || "",
      params.platform || "",
      params.handle || "",
      params.referral_source || ""
    ];
  } else {
    // TECHNICAL SESSION registration
    const headers = [
      "Submitted At",
      "Full Name",
      "Email Address",
      "Phone Number",
      "Location",
      "Session of Interest"
    ];
    ensureSheet_(ss, sheetName, headers);
    
    row = [
      submittedAt,
      params.full_name || "",
      params.email_address || "",
      params.phone_number || "",
      params.location || "",
      params.session_of_interest || ""
    ];
  }

  const sheet = ss.getSheetByName(sheetName);
  sheet.appendRow(row);

  const whatsapp = params.whatsapp_group_url || DEFAULT_WHATSAPP_GROUP_URL;
  return jsonResponse_({ ok: true, type: "registration", whatsapp_group_url: whatsapp });
}

function handleMessage_(ss, params, submittedAt, source) {
  const headers = [
    "Submitted At",
    "Sender Email",
    "Message",
    "Source"
  ];

  const sheet = ensureSheet_(ss, "Messages", headers);

  const senderEmail = params.sender_email || "";
  const message = params.message || "";

  sheet.appendRow([
    submittedAt,
    senderEmail,
    message,
    source
  ]);

  if (senderEmail) {
    sendMessageAcknowledgement_(senderEmail, params.whatsapp_group_url || DEFAULT_WHATSAPP_GROUP_URL);
  }

  return jsonResponse_({ ok: true, type: "message" });
}

function ensureSheet_(ss, sheetName, headers) {
  const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return sheet;
  }

  const lastColumn = sheet.getLastColumn();
  const currentHeaders = lastColumn > 0 ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0] : [];
  if (currentHeaders.length < headers.length) {
    const missingHeaders = headers.slice(currentHeaders.length);
    sheet.getRange(1, currentHeaders.length + 1, 1, missingHeaders.length).setValues([missingHeaders]);
  }

  return sheet;
}

function sendMessageAcknowledgement_(senderEmail, whatsappLink) {
  const groupLink = whatsappLink || DEFAULT_WHATSAPP_GROUP_URL;

  const subject = "Message Received - Alteturia";
  const body =
    "Hi,\n\n" +
    "Thank you for reaching out to Alteturia! We have received your message and our team will review it shortly.\n\n" +
    "In the meantime, join our WhatsApp community to stay updated on events and opportunities:\n" +
    groupLink +
    "\n\n" +
    "Best regards,\n" +
    "Alteturia Team\n" +
    ALTETURIA_EMAIL;

  MailApp.sendEmail(senderEmail, subject, body);
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Setup function: Run this once to initialize all sheets with proper headers
 * Go to Apps Script -> Triggers -> Create new trigger -> Run setup on Sheet open
 */
function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // Builder Sprint registrations
  ensureSheet_(ss, "FutureBuilderSprint", [
    "Submitted At",
    "Full Name",
    "Email Address",
    "Phone Number",
    "Location",
    "Area of Expertise",
    "Project Idea Summary",
    "Progress Platform",
    "Profile Handle",
    "How Did You Hear About Us"
  ]);

  // Technical Session registrations
  ensureSheet_(ss, "TechnicalSession", [
    "Submitted At",
    "Full Name",
    "Email Address",
    "Phone Number",
    "Location",
    "Session of Interest"
  ]);

  // Contact form messages
  ensureSheet_(ss, "Messages", [
    "Submitted At",
    "Sender Email",
    "Message",
    "Source"
  ]);
}

