import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

type ParsedSemver = {
  major: number;
  minor: number;
  patch: number;
};

type RoadmapItem = {
  done: boolean;
  text: string;
};

type RoadmapMilestone = {
  heading: string;
  version: ParsedSemver;
  items: RoadmapItem[];
};

type RoadmapPlan = {
  milestones: RoadmapMilestone[];
  sourceUrl: string | null;
} | null;

const REPO_OWNER = "Mira-Studios";
const REPO_NAME = "mira";
const DESKTOP_ROADMAP_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/apps/desktop/ROADMAP.md`;
const MOBILE_ROADMAP_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/apps/mobile/ROADMAP.md`;

type PlatformType = "desktop" | "mobile" | "unknown";

function getPlatformFromUserAgent(userAgent: string | null): PlatformType {
  if (!userAgent) return "unknown";
  const lower = userAgent.toLowerCase();
  if (/android|iphone|ipad|ipod/.test(lower)) {
    return "mobile";
  }
  return "desktop";
}

function parseSemver(value: string): ParsedSemver | null {
  const cleaned = value.trim().replace(/^v/i, "");
  const numericPrefix = cleaned.match(/^[\d.]+/)?.[0] ?? cleaned;
  const match = numericPrefix.match(/^(\d+)\.(\d+)\.(\d+)\b/);

  if (!match) {
    return null;
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function compareSemver(a: ParsedSemver, b: ParsedSemver): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

function parseRoadmapMarkdown(markdown: string): RoadmapMilestone[] {
  const lines = markdown.split(/\r?\n/);
  const milestones: RoadmapMilestone[] = [];
  let current: RoadmapMilestone | null = null;

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      const heading = headingMatch[1].trim();
      const versionMatch = heading.match(/v?(\d+\.\d+\.\d+)\b/i);
      let version: ParsedSemver;

      if (versionMatch) {
        version = parseSemver(versionMatch[1])!;
      } else {
        // For sections without versions (like "Anytime"), assign a low version so they appear at the top
        version = { major: 0, minor: 0, patch: 1 };
      }

      current = { heading, version, items: [] };
      milestones.push(current);
      continue;
    }

    const taskMatch = line.match(/^[-*]\s+\[([ xX])\]\s+(.+)$/);
    if (taskMatch && current) {
      current.items.push({
        done: taskMatch[1].toLowerCase() === "x",
        text: taskMatch[2].trim(),
      });
    }
  }

  return milestones;
}

async function fetchRoadmapMarkdown(platform: "desktop" | "mobile"): Promise<{ markdown: string; sourceUrl: string } | null> {
  const roadmapPath = platform === "mobile" 
    ? "apps/mobile/ROADMAP.md" 
    : "apps/desktop/ROADMAP.md";
  const roadmapUrl = platform === "mobile" ? MOBILE_ROADMAP_URL : DESKTOP_ROADMAP_URL;
  
  const contentsResponse = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${roadmapPath}?ref=main`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "mira-website",
      },
      next: { revalidate: 600 },
    },
  );

  if (contentsResponse.ok) {
    const data = (await contentsResponse.json()) as { content?: string; encoding?: string };
    if (data.encoding === "base64" && typeof data.content === "string") {
      const decoded = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
      if (decoded.trim().length > 0) {
        return {
          markdown: decoded,
          sourceUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/main/${roadmapPath}`,
        };
      }
    }
  }

  const rawResponse = await fetch(roadmapUrl, {
    headers: {
      Accept: "text/plain",
      "User-Agent": "mira-website",
    },
    next: { revalidate: 600 },
  });

  if (!rawResponse.ok) {
    return null;
  }

  const markdown = await rawResponse.text();
  if (!markdown.trim()) {
    return null;
  }

  return {
    markdown,
    sourceUrl: roadmapUrl,
  };
}

async function fetchRoadmapPlan(platform: "desktop" | "mobile"): Promise<RoadmapPlan> {
  try {
    const roadmap = await fetchRoadmapMarkdown(platform);
    if (!roadmap) {
      return null;
    }

    const milestones = parseRoadmapMarkdown(roadmap.markdown).sort((a, b) =>
      compareSemver(a.version, b.version),
    );

    if (milestones.length === 0) {
      return null;
    }

    return {
      milestones,
      sourceUrl: roadmap.sourceUrl,
    };
  } catch {
    return null;
  }
}

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await (searchParams ?? Promise.resolve({}));
  const platform = String((params as Record<string, string | string[] | undefined>).platform || "desktop");
  const isMobile = platform === "mobile";
  
  return {
    title: isMobile ? "Mira Mobile Roadmap" : "Mira Roadmap",
    description: isMobile 
      ? "See the release roadmap for Mira Mobile by version with completion status."
      : "See the release roadmap for Mira Desktop by version with completion status.",
    alternates: {
      canonical: `${getSiteUrl()}/roadmap`,
    },
  };
}

export default async function RoadmapPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await (searchParams ?? Promise.resolve({})) as Record<string, string | string[] | undefined>;
  const headerList = await headers();
  const userAgent = headerList.get("user-agent");
  
  const platformOverride = String(resolvedSearchParams.platform || "");
  let platform: "desktop" | "mobile" = "desktop";
  
  if (platformOverride === "mobile") {
    platform = "mobile";
  } else if (platformOverride === "desktop") {
    platform = "desktop";
  } else {
    const detected = getPlatformFromUserAgent(userAgent);
    platform = detected === "mobile" ? "mobile" : "desktop";
  }
  
  const isMobile = platform === "mobile";
  const deviceIsMobile = getPlatformFromUserAgent(userAgent) === "mobile";
  
  const roadmapPlan = await fetchRoadmapPlan(platform);

  return (
    <main className="section page-enter">
      <div className="container narrow">
        <h1 className="animate-fade-up">Roadmap</h1>

        {!deviceIsMobile && (
          <div className="toggle-row animate-fade-up" style={{ animationDelay: "180ms" }}>
            <span className="toggle-label">Platform</span>
            <div className="platform-toggle">
              <Link
                href="/roadmap?platform=desktop"
                scroll={false}
                className={`platform-btn ${!isMobile ? "active" : ""}`}
              >
                <svg className="platform-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                Desktop
              </Link>
              <Link
                href="/roadmap?platform=mobile"
                scroll={false}
                className={`platform-btn ${isMobile ? "active" : ""}`}
              >
                <svg className="platform-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="2" width="12" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18.01" />
                </svg>
                Mobile
              </Link>
            </div>
          </div>
        )}

        {roadmapPlan ? (
          <div className="roadmap-list">
            {roadmapPlan.milestones.map((milestone, idx) => {
              const completedCount = milestone.items.filter((item) => item.done).length;
              const totalCount = milestone.items.length;

              return (
                <article
                  key={milestone.heading}
                  className="roadmap-version-card animate-fade-up"
                  style={{ animationDelay: `${260 + idx * 90}ms` }}
                >
                  <div className="roadmap-version-card-header">
                    <h2>{milestone.heading}</h2>
                    <p className="muted-note">
                      {completedCount}/{totalCount} completed
                    </p>
                  </div>

                  {milestone.items.length > 0 ? (
                    <ul className="roadmap-items-list">
                      {milestone.items.map((item) => (
                        <li
                          key={`${milestone.heading}-${item.text}`}
                          className={`roadmap-item-row ${item.done ? "is-done" : ""}`}
                        >
                          <span className="roadmap-item-status" aria-hidden>
                            {item.done ? "✓" : ""}
                          </span>
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted-note roadmap-empty-version">No items listed for this version yet.</p>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <article className="feature-card about-roadmap-empty animate-fade-up" style={{ animationDelay: "180ms" }}>
            <p className="muted-note">Couldn&apos;t load roadmap data right now. Check back soon.</p>
          </article>
        )}
      </div>
    </main>
  );
}
