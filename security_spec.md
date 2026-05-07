# Security Specification: Road to Budapest

## Data Invariants
1. Users can only edit their own profile.
2. Posts are public for reading, but only the creator can delete them.
3. Chat messages are public (Global Chat) but immutable (cannot be edited or deleted by users).
4. Sponsors are read-only for all users (Admin only).
5. All IDs must be valid strings.

## The Dirty Dozen Payloads
1. Attempt to update another user's profile status.
2. Attempt to create a post with a fake `userId`.
3. Attempt to increase `likesCount` on a post by 1000 in one update.
4. Attempt to create a message with a future timestamp.
5. Attempt to create a message as another user.
6. Attempt to modify a sponsor's link URL.
7. Attempt to delete a post that does not belong to the user.
8. Attempt to inject scripts into a message body.
9. Attempt to create a user profile with an extremely large photo URL (Denial of Wallet).
10. Attempt to join a private chat as an unauthorized participant.
11. Attempt to wipe the `global_chat` collection.
12. Attempt to spoof `email_verified` flag.

## Test Tracker
- Admin status check: FAIL (unless explicitly in admins collection).
- User identity integrity: PASS.
- Relational integrity (Post belongs to User): PASS.
