## Why
The current chat interface has several usability issues: no button to create new chats, no search in the chat list, no scroll in the chat list block when there are many chats, messages are too narrow when text is short, input field is too small, and the input scrollbar is not styled properly. These improvements will enhance the user experience by making the interface more functional and visually appealing.

## What Changes
- Add a "Create New Chat" button above the chat list
- Implement search functionality in the chat list
- Add scroll to the chat list block when there are many chats
- Sort chats by creation date (newest first)
- Ensure messages have a minimum width even with short text
- Increase the initial height of the message input field
- Style the input scrollbar to hide the track and show only the thumb

## Impact
- Affected specs: ai-chat-page
- Affected code: ChatPage component, MessageList component, MessageInput component