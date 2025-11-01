## Why
The current chat page layout is centered and has large margins, which doesn't match the desired design of a sidebar with chat list and main chat area. The page needs to be redesigned to have a left sidebar for chat list and right area for messages, with minimal margins and full height.

## What Changes
- Modify the chat page layout to include a left sidebar with chat list
- Move the main chat area to the right side
- Remove large margins and make the page nearly full height
- Update the page title to show current chat name
- Remove user and AI icons from messages
- Ensure input supports multi-line text (already implemented with TextArea)

## Impact
- Affected specs: ai-chat-page
- Affected code: ChatPage component, MessageList component