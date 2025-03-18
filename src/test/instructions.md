# Chat Widget Testing Instructions

## How to Test Your Widget

1. Generate your widget script from the Widget Generator application
2. Copy the generated script from the modal that appears
3. Open one of the following test files in a code editor:
   - `widget-test.html` - Light theme test page
   - `dark-theme-test.html` - Dark theme test page
4. Paste the copied script just before the closing `</body>` tag in the HTML file
5. Save the file
6. Open the HTML file in a web browser (double-click the file or right-click and select "Open with" your preferred browser)
7. You should see the chat widget button appear in the bottom-right corner of the page
8. Click the button to open the chat interface
9. Test functionality by:
   - Typing messages
   - Clicking send (which should redirect to your WhatsApp/Telegram)
   - Testing the close button

## Testing in Different Environments

- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on different screen sizes (desktop, tablet, mobile)
- Verify both light and dark themes work correctly
- Ensure the widget is responsive and functions properly across all devices

## Troubleshooting

If the widget doesn't appear:
- Check your browser console for any JavaScript errors
- Verify that you pasted the complete script
- Make sure the script is placed right before the closing `</body>` tag

If the widget doesn't redirect correctly:
- Check that you entered the correct Telegram username or WhatsApp number
- Verify the contact information format (especially the country code for WhatsApp)

## Customization

The generated script can be customized further by modifying:
- Colors and styling
- Text content
- Button size and position
- Default messages

For advanced customization, edit the script directly in the HTML file. 