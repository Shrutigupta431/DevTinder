# TODO - seen/delivered functionality

- [ ] Inspect existing chat message schema and socket events (done)
- [x] Propose implementation plan for adding deliveredAt/seenAt per message and socket events
- [x] After plan approval, update:
  - [x] src/models/chat.js (extend message schema)
  - [x] src/utils/socket.js (add events: messageDelivered, messageSeen; update sendMessage to include status)
- [x] src/routes/chat.js (ensure message fields are returned; per-message seen/delivered is handled via socket)

- [x] Add simple backward-compatible defaults for existing messages
- [x] Run lint/tests (if available) / run server to verify compilation (server port 7777 already in use)



