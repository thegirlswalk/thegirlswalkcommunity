// ── HEADLESS SHOPIFY (Storefront API) ───────────────────────────────
// This keeps the custom TGW site as-is and uses Shopify only for the cart
// and hosted checkout (Shopify handles all payment + PCI). Nothing here
// talks to your Shopify admin — it only uses the PUBLIC Storefront token.
//
// ── HOW TO GO LIVE (fill in the 3 blanks below) ─────────────────────
// 1. Create your Shopify store, then in Admin:
//    Settings → Apps and sales channels → Develop apps → Create an app
//    → Configure Storefront API scopes (check: unauthenticated_read_product_listings,
//      unauthenticated_write_checkouts, unauthenticated_read_checkouts)
//    → Install app → copy the "Storefront API access token".
// 2. Paste your store domain + that token below.
// 3. For donations: create a product named "Donation" with a variant for
//    each amount ($10/$25/$50/$100). Open each variant and copy its ID from
//    the URL, then paste the GID below, e.g.
//      "gid://shopify/ProductVariant/1234567890"
//    (For merch, do the same and pass the variant IDs from the Shop page.)

export const SHOPIFY = {
  domain: "",            // e.g. "the-girls-walk.myshopify.com"
  storefrontToken: "",   // public Storefront API access token
  apiVersion: "2025-01",
};

// Donation amount ($) → Shopify product variant GID
export const DONATION_VARIANTS = {
  10:  "",
  25:  "",
  50:  "",
  100: "",
};

export const isShopifyConfigured = () =>
  Boolean(SHOPIFY.domain && SHOPIFY.storefrontToken);

async function storefront(query, variables) {
  const res = await fetch(
    `https://${SHOPIFY.domain}/api/${SHOPIFY.apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY.storefrontToken,
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

// Create a cart with the given line items and return the hosted checkout URL.
// lines: [{ merchandiseId: "gid://shopify/ProductVariant/...", quantity: 1 }]
export async function createCheckout(lines) {
  const data = await storefront(
    `mutation cartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { checkoutUrl }
        userErrors { message }
      }
    }`,
    { lines }
  );
  const { cart, userErrors } = data.cartCreate;
  if (userErrors?.length) throw new Error(userErrors[0].message);
  return cart.checkoutUrl;
}
