const intentResponses = {
    "order_status": "You can check your order status by logging into your account.",
    "refund_order": "Our return policy allows returns within 30 days of purchase.",
    "greet": "Our support team is available 24/7. How can I assist you?",
    "complaint": "Our customer care details can be found on our official website.",
    "find_location": "You can check the location in the Track Orders section on our official website.",
    "payment_issues": "We support online banking services as well as cash on delivery.",
    "shipping_info": "You can track your order in the Track Orders section on our official website.",
    // Add other intents as needed
};

const chatBox = document.getElementById('chat-box');

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    // Display user's message
    addMessage(userInput, 'user-message');

    // Clear the input field
    document.getElementById('user-input').value = '';

    // Get bot's response (fetch intent recognizer response)
    fetchIntentResponse(userInput).then(botResponse => {
        addMessage(botResponse, 'bot-message');
    });
}

function addMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${className}`;
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
}

async function fetchIntentResponse(userInput) {
    const endpoint = "https://botmeghnaai07.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2022-10-01-preview";
    const apiKey = "8J2TUzET21rk0VHWiaJl93jBvtTauhJF38tvAeY0lv3DTYtemDXjJQQJ99AJACGhslBXJ3w3AAAaACOGnxeE";
    const body = {
        "kind": "Conversation",
        "analysisInput": {
            "conversationItem": {
                "text": userInput,
                "id": "1",
                "participantId": "user"
            }
        },
        "parameters": {
            "projectName": "meghna7",       // Your CLU project name in Language Studio
            "deploymentName": "product",  // Replace if using another deployment name
            "stringIndexType": "TextElement_v8"
        }
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Extract the top intent from the model’s output
        const topIntent = data.result.prediction.topIntent;

        // Look up response based on recognized intent
        const botResponse = intentResponses[topIntent] || "I'm sorry, I didn't understand that. Could you please clarify?";
        return botResponse;

    } catch (error) {
        console.error("Error fetching intent:", error);
        return "You can check your order status by logging into your account.";
    }
}