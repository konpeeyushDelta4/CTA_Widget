/*
 * Provides user-friendly instructions for integrating the widget
 */
export function getIntegrationInstructions() {
    return {
        title: 'How to integrate the widget',
        steps: [
            'Copy the generated script',
            'Paste it into your website\'s HTML code',
            'Add it just before the closing </body> tag',
            'Save and reload your website to see the widget'
        ],
        notes: 'The widget will appear at the bottom right of your website. You can customize it further by editing the script parameters.'
    };
}