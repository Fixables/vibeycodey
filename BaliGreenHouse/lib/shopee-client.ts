/**
 * Shopee Open Platform v2 API client
 * Docs: https://open.shopee.com/documents/v2
 */

import crypto from 'crypto';

const BASE_URL = 'https://partner.shopeemobile.com';

export interface ShopeeConfig {
  partnerId: number;
  partnerKey: string;
  shopId: number;
  accessToken: string;
}

export interface ShopeeItem {
  item_id: number;
  category_id: number;
  item_name: string;
  description: string;
  item_status: string;
  price_info: { current_price: number; original_price: number }[];
  image: { image_url_list: string[] };
  item_sku: string;
  stock_info_v2?: { summary_info?: { total_reserved_stock?: number; total_available_stock?: number } };
  shopee_url?: string;
}

export interface ShopeeTokenResponse {
  access_token: string;
  refresh_token: string;
  expire_in: number;
  shop_id_list?: number[];
  error?: string;
  message?: string;
}

function hmac(key: string, data: string): string {
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}

// Sign for shop-level API calls
function signShop(
  partnerId: number,
  partnerKey: string,
  path: string,
  timestamp: number,
  accessToken: string,
  shopId: number,
): string {
  return hmac(partnerKey, `${partnerId}${path}${timestamp}${accessToken}${shopId}`);
}

// Sign for auth/public API calls (no access token)
function signPublic(
  partnerId: number,
  partnerKey: string,
  path: string,
  timestamp: number,
): string {
  return hmac(partnerKey, `${partnerId}${path}${timestamp}`);
}

// ── Auth helpers ────────────────────────────────────────────────────────────

export function getAuthUrl(
  partnerId: number,
  partnerKey: string,
  redirectUrl: string,
): string {
  const path = '/api/v2/shop/auth_partner';
  const timestamp = Math.floor(Date.now() / 1000);
  const sign = hmac(partnerKey, `${partnerId}${path}${timestamp}${redirectUrl}`);
  const params = new URLSearchParams({
    partner_id: String(partnerId),
    timestamp: String(timestamp),
    sign,
    redirect: redirectUrl,
  });
  return `${BASE_URL}/web/v2/oauth/authorize?${params}`;
}

export async function getTokenFromCode(
  partnerId: number,
  partnerKey: string,
  code: string,
  shopId: number,
): Promise<ShopeeTokenResponse> {
  const path = '/api/v2/auth/token/get';
  const timestamp = Math.floor(Date.now() / 1000);
  const sign = signPublic(partnerId, partnerKey, path, timestamp);

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      shop_id: shopId,
      partner_id: partnerId,
      sign,
      timestamp,
    }),
  });
  return res.json();
}

export async function refreshAccessToken(
  partnerId: number,
  partnerKey: string,
  refreshToken: string,
  shopId: number,
): Promise<ShopeeTokenResponse> {
  const path = '/api/v2/auth/access_token/get';
  const timestamp = Math.floor(Date.now() / 1000);
  const sign = signPublic(partnerId, partnerKey, path, timestamp);

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refresh_token: refreshToken,
      shop_id: shopId,
      partner_id: partnerId,
      sign,
      timestamp,
    }),
  });
  return res.json();
}

// ── API client ──────────────────────────────────────────────────────────────

export class ShopeeClient {
  constructor(private cfg: ShopeeConfig) {}

  private buildUrl(
    path: string,
    params: Record<string, string | number> = {},
  ): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const sign = signShop(
      this.cfg.partnerId,
      this.cfg.partnerKey,
      path,
      timestamp,
      this.cfg.accessToken,
      this.cfg.shopId,
    );
    const url = new URL(`${BASE_URL}${path}`);
    url.searchParams.set('partner_id', String(this.cfg.partnerId));
    url.searchParams.set('shop_id', String(this.cfg.shopId));
    url.searchParams.set('access_token', this.cfg.accessToken);
    url.searchParams.set('timestamp', String(timestamp));
    url.searchParams.set('sign', sign);
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }
    return url.toString();
  }

  private async get<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
    const url = this.buildUrl(path, params);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Shopee API error: ${res.status} ${res.statusText}`);
    return res.json();
  }

  /** Fetch a page of active item IDs */
  async getItemList(offset = 0, pageSize = 100): Promise<{
    response?: { item: { item_id: number; item_status: string }[]; has_next_page: boolean; next_offset: number };
    error?: string;
    message?: string;
  }> {
    return this.get('/api/v2/product/get_item_list', {
      offset,
      page_size: pageSize,
      item_status: 'NORMAL',
    });
  }

  /** Fetch detailed info for up to 50 items at a time */
  async getItemBaseInfo(itemIds: number[]): Promise<{
    response?: { item_list: ShopeeItem[] };
    error?: string;
    message?: string;
  }> {
    return this.get('/api/v2/product/get_item_base_info', {
      item_id_list: itemIds.join(','),
      need_tax_info: '0',
      need_complaint_policy: '0',
    });
  }

  /** Fetch all active items (handles pagination automatically) */
  async getAllItems(): Promise<ShopeeItem[]> {
    const items: ShopeeItem[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const page = await this.getItemList(offset, 100);
      if (page.error) throw new Error(`getItemList error: ${page.error} — ${page.message}`);
      const pageItems = page.response?.item ?? [];
      if (pageItems.length === 0) break;

      // Fetch base info in batches of 50
      const ids = pageItems.map((i) => i.item_id);
      for (let i = 0; i < ids.length; i += 50) {
        const batch = ids.slice(i, i + 50);
        const info = await this.getItemBaseInfo(batch);
        if (info.error) throw new Error(`getItemBaseInfo error: ${info.error} — ${info.message}`);
        items.push(...(info.response?.item_list ?? []));
      }

      hasMore = page.response?.has_next_page ?? false;
      offset = page.response?.next_offset ?? offset + 100;
    }

    return items;
  }
}
