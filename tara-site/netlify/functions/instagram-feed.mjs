const graphVersion = process.env.INSTAGRAM_GRAPH_VERSION ?? "v23.0";
const accountId =
  process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ?? process.env.INSTAGRAM_USER_ID;
const accessToken =
  process.env.INSTAGRAM_GRAPH_ACCESS_TOKEN ?? process.env.INSTAGRAM_ACCESS_TOKEN;
const instagramUsername =
  process.env.INSTAGRAM_USERNAME ?? extractInstagramUsername(process.env.NEXT_PUBLIC_INSTAGRAM_URL);

function json(statusCode, body, cacheControl = "public, max-age=60") {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": cacheControl,
    },
    body: JSON.stringify(body),
  };
}

function trimCaption(caption = "") {
  const firstLine = caption
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) {
    return "A TARA moment from Instagram.";
  }

  return firstLine.length > 150 ? `${firstLine.slice(0, 147)}...` : firstLine;
}

function extractInstagramUsername(value) {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);
    const firstSegment = url.pathname.split("/").filter(Boolean)[0];

    return firstSegment || undefined;
  } catch {
    return value.replace(/^@/, "").trim() || undefined;
  }
}

function buildTitle(caption, index) {
  const cleanCaption = caption.replace(/[#@][\w.]+/g, "").trim();
  const firstSentence = cleanCaption.split(/[.!?]/).find(Boolean)?.trim();

  if (!firstSentence) {
    return `TARA Moment ${index + 1}`;
  }

  return firstSentence.length > 34 ? `${firstSentence.slice(0, 31)}...` : firstSentence;
}

function normalizeItem(item, index) {
  const imageUrl =
    item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url;
  const likeCount = Number(item.like_count ?? 0);
  const commentsCount = Number(item.comments_count ?? 0);
  const caption = trimCaption(item.caption);

  if (!imageUrl || !item.permalink) {
    return undefined;
  }

  return {
    id: item.id,
    title: buildTitle(caption, index),
    caption,
    meta: `${likeCount} likes / ${commentsCount} comments`,
    imageUrl,
    permalink: item.permalink,
    timestamp: item.timestamp,
  };
}

function normalizePublicItem(edge, index) {
  const item = edge?.node ?? edge;
  const carouselImage =
    item?.carousel_media?.find((media) => media?.image_versions2?.candidates?.[0]?.url)
      ?.image_versions2?.candidates?.[0]?.url;
  const imageUrl =
    item?.display_url ??
    item?.thumbnail_src ??
    item?.image_versions2?.candidates?.[0]?.url ??
    carouselImage;
  const shortcode = item?.shortcode ?? item?.code;
  const likeCount = Number(
    item?.edge_liked_by?.count ??
      item?.edge_media_preview_like?.count ??
      item?.like_count ??
      0,
  );
  const commentsCount = Number(
    item?.edge_media_to_comment?.count ?? item?.comment_count ?? 0,
  );
  const caption = trimCaption(
    item?.edge_media_to_caption?.edges?.[0]?.node?.text ?? item?.caption?.text,
  );

  if (!imageUrl || !shortcode) {
    return undefined;
  }

  return {
    id: item.id ?? shortcode,
    title: buildTitle(caption, index),
    caption,
    meta: `${likeCount} likes / ${commentsCount} comments`,
    imageUrl,
    permalink: `https://www.instagram.com/p/${shortcode}/`,
    timestamp: item?.taken_at_timestamp ?? item?.taken_at
      ? new Date((item?.taken_at_timestamp ?? item?.taken_at) * 1000).toISOString()
      : undefined,
  };
}

async function fetchGraphItems() {
  if (!accountId || !accessToken) {
    return null;
  }

  const fields = [
    "id",
    "caption",
    "media_type",
    "media_url",
    "thumbnail_url",
    "permalink",
    "timestamp",
    "like_count",
    "comments_count",
  ].join(",");

  const url = new URL(
    `https://graph.facebook.com/${graphVersion}/${accountId}/media`,
  );
  url.searchParams.set("fields", fields);
  url.searchParams.set("limit", "25");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok || !Array.isArray(result.data)) {
    console.error("Instagram graph feed unavailable", {
      status: response.status,
      code: result.error?.code,
      type: result.error?.type,
      message: result.error?.message,
    });

    return null;
  }

  return result.data
    .map(normalizeItem)
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 3);
}

async function fetchPublicItems() {
  if (!instagramUsername) {
    return null;
  }

  const url = new URL(
    `https://www.instagram.com/api/v1/feed/user/${instagramUsername}/username/`,
  );
  url.searchParams.set("count", "12");

  const response = await fetch(url, {
    headers: {
      accept: "*/*",
      origin: "https://www.instagram.com",
      referer: `https://www.instagram.com/${instagramUsername}/`,
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      "x-ig-app-id": "936619743392459",
    },
  });
  const text = await response.text();
  let result;

  try {
    result = JSON.parse(text);
  } catch {
    console.error("Instagram public profile returned non-JSON", {
      status: response.status,
      preview: text.slice(0, 160),
    });

    return null;
  }

  const edges = result?.items;

  if (!response.ok || !Array.isArray(edges)) {
    console.error("Instagram public timeline unavailable", {
      status: response.status,
      message: result?.message,
    });

    return null;
  }

  return edges
    .map(normalizePublicItem)
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date(b.timestamp ?? 0).getTime() - new Date(a.timestamp ?? 0).getTime(),
    )
    .slice(0, 3);
}

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed." });
  }

  try {
    const graphItems = await fetchGraphItems();

    if (graphItems?.length) {
      return json(
        200,
        {
          source: "instagram",
          items: graphItems,
        },
        "public, s-maxage=900, stale-while-revalidate=3600",
      );
    }

    const publicItems = await fetchPublicItems();

    if (publicItems?.length) {
      return json(
        200,
        {
          source: "instagram_public",
          items: publicItems,
        },
        "public, s-maxage=900, stale-while-revalidate=3600",
      );
    }
  } catch (error) {
    console.error("Instagram feed request failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return json(
    200,
    {
      source: "fallback",
      items: [],
    },
    "public, max-age=300",
  );
}
