# ActiveCampaign CRM Data Extractor (Chrome Extension)

## Overview
This project is a Chrome Extension (Manifest V3) that extracts contact data from the ActiveCampaign CRM web application using DOM scraping techniques.

The extension injects a content script into ActiveCampaign’s single-page React application, detects visible contact rows, extracts structured data, and displays it in a popup UI.

## Implemented Features
- Manifest V3 Chrome Extension
- Content script injection
- Contact extraction (name, email, phone)
- DOM scoping to avoid sidebar/header noise
- Deduplication using email as a unique identifier
- Popup UI to trigger extraction and view results

## DOM Selection Strategy
ActiveCampaign is a React-based SPA without stable IDs for table rows.

The strategy used:
- Scope all queries to the main content area (`[role="main"]`) to avoid navigation/sidebar elements
- Use anchor links matching `/app/contacts/{id}` as reliable selectors for contact rows
- Traverse upward to the closest row container and parse visible text
- Deduplicate results using email addresses

This avoids brittle selectors and works across renders.

## Storage
Currently, extracted data is held in memory and displayed in the popup.
Future work would persist data using `chrome.storage.local` following the recommended schema.

## Limitations
- Only Contacts are implemented (Deals and Tasks are not yet implemented)
- Pagination and infinite scrolling are not handled
- Popup UI is implemented with vanilla JavaScript instead of React

## Why API was not used
ActiveCampaign APIs require authenticated API keys which are not accessible inside a browser extension without explicit user configuration. This implementation focuses on DOM-based extraction as required.

## Installation
1. Clone the repository
2. Open Chrome → Extensions → Enable Developer Mode
3. Click "Load unpacked"
4. Select the project folder
5. Navigate to ActiveCampaign → Contacts
6. Click the extension → "Extract Now"
