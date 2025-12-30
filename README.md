# TrustFactory - Laravel E-commerce Test

### Required by TrustFactory
- Each shopping cart must be associated with the authenticated user (User model).
- When a user adds products to their cart, updates quantities, or removes items, these actions should be stored and retrieved based on the currently authenticated user (not via session or local storage).
- Make sure to use Laravel’s built-in authentication from the starter kit.
- Low Stock Notification: When a product's stock is running low, a Laravel Job/Queue should be triggered to send an email to a dummy admin user.
- Daily Sales Report: Implement a scheduled job (cron) that runs every evening and sends a report of all products sold that day to the email of the dummy admin user.

### Roadmap

| Feature                | Priority | Status | Description                              |
| ---------------------- | -------- | ------ | ---------------------------------------- |
| Docker/Composer        | Medium   | Done   | Enable Sail locally, no production level |
| Items Table            | High     | Todo   |                                          |
| Items seeder           | Medium   | Todo   |                                          |
| Cart Table             | High     | Todo   |                                          |
| Low Stock Notification | High     | Todo   | For dummy admin                          |
| Daily Sales Report     | High     | Todo   | Cron job                                 |
