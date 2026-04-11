# exportData Service

Handles exporting the app's persisted fire state (`fire_state_v1`) as a JSON file.
On native platforms (Android/iOS) the Capacitor Share plugin is used to open the system share sheet.
On web, a standard browser file download is triggered.
