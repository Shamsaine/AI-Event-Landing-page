# Launch Pad Apps Script setup

1. Open the **Alteturia — Launch Pad 2026** workbook and choose **Extensions → Apps Script**.
2. Replace the editor contents with [Code.gs](Code.gs). Because this is a bound script, leave `SPREADSHEET_ID` blank.
3. Deploy it as a **Web app**: execute as **you** and grant access to **Anyone**. Copy the deployment URL ending in `/exec`.
4. In [assets/js/script.js](../assets/js/script.js), paste that URL into `leaderboard_sheet_webhook_url`. The existing Launch Pad form may use the same URL once this script replaces the original registration script.

The `LEADERBOARD` tab must contain three sections with these exact header rows (in the first columns of each section):

- General: `Rank | Launch Pad Username | Track | Progress | Final Score | Status`
- Learning Sprint: `Rank | Launch Pad Username | Days Completed | Consistency | Growth | Final Score | Status`
- Builder Sprint: `Rank | Launch Pad Username | Progress | Build Readiness | Overall Quality | Final Score | Status`

Leave a blank row after each section. The public endpoint returns only these leaderboard columns; it does not expose the private `PARTICIPANTS` fields.
