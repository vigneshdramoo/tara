# TARA Analytics Events

Stage 9 keeps the existing first-party `dataLayer` and optional `gtag` tracking. It does not add a new analytics provider.

## Privacy Rule

Do not send customer names, emails, phone numbers, delivery addresses, free-text notes, or WhatsApp message contents in analytics events. WhatsApp links are sanitized to remove query-string message text before tracking.

## Event Map

| Event | Trigger | Key Parameters |
| --- | --- | --- |
| `hero_primary_cta_click` | Homepage hero primary CTA click | `link_label`, `link_location`, `link_url`, `hero_cta_position` |
| `discovery_set_click` | Any tracked CTA to the RM99 3 x 8mL discovery set | `link_label`, `link_location`, `link_url`, `offer_type` |
| `quiz_start` | Homepage mini quiz or full Find Your Light quiz begins | `quiz_name`, `question_count` when available |
| `quiz_complete` | A quiz result is calculated | `quiz_name`, result slug, answer/result scoring metadata |
| `quiz_result_revealed` | A quiz recommendation becomes visible | `quiz_name`, result slug |
| `quiz_result_product_click` | A quiz-result product/detail CTA is clicked | `quiz_name` when available, result slug, `link_label`, `link_url` |
| `product_add_to_cart` | A product or set is added to local cart | `item_id`, `item_name`, `selected_scent`, `quantity`, `amount`, `link_location` |
| `cart_view` | Filled cart page is viewed | `item_count`, `amount`, `page_location` |
| `checkout_start` | Customer clicks from cart/cart builder into checkout | `item_count`, `amount`, `link_location` |
| `payment_checkout_start` | Delivery/payment form submits before ToyyibPay bill creation | `provider`, `payment_method`, `item_count`, `amount` |
| `payment_redirect` | ToyyibPay bill URL is returned and the customer is redirected | `provider`, `payment_method`, `item_count`, `amount` |
| `whatsapp_click` | Tracked WhatsApp link is clicked | `link_label`, `link_location`, sanitized `link_url` |
| `concierge_click` | Same WhatsApp concierge action, tracked as sales-assist intent | `link_label`, `link_location`, sanitized `link_url` |
| `newsletter_signup` | Newsletter form successfully submits | `form_name`, `location`, `source` |
| `email_signup` | Same successful newsletter submission, tracked as launch email growth | `form_name`, `location`, `source` |
| `contact_submit` | Contact form successfully submits | `form_name`, `inquiry_type` |
| `preorder_submit` | Manual concierge preorder form successfully submits | Scent slug/name, quantity, purpose, contact preference, delivery preference |
| `manual_preorder_start` | Manual concierge preorder form is first interacted with | `form_name`, `form_location`, `selected_scent` |
| `manual_preorder_submit` | Manual concierge preorder form successfully submits | Scent slug/name, quantity, purpose, contact preference, delivery preference |

## Implementation Notes

- `src/lib/analytics.ts` pushes all events into `window.dataLayer`.
- If `window.gtag` exists, the same event name and non-sensitive parameters are also sent through `gtag("event", ...)`.
- Components should prefer the shared `analyticsEvents` constants instead of raw event-name strings.
