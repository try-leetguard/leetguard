from urllib.parse import urlparse, urlunparse


CANONICAL_ACTIVITY_STATUSES = {"solved", "attempted", "bookmarked"}
LEGACY_ACTIVITY_STATUS_MAP = {
    "completed": "solved",
    "in_progress": "attempted",
}


def normalize_activity_status(status: str) -> str:
    value = (status or "").strip().lower()
    value = LEGACY_ACTIVITY_STATUS_MAP.get(value, value)
    if value not in CANONICAL_ACTIVITY_STATUSES:
        allowed = ", ".join(sorted(CANONICAL_ACTIVITY_STATUSES))
        raise ValueError(f"Activity status must be one of: {allowed}")
    return value


def normalize_website(website: str) -> str:
    value = (website or "").strip().lower()
    if not value:
        raise ValueError("Website is required")

    parsed = urlparse(value if "://" in value else f"//{value}")
    host = parsed.hostname or ""
    host = host.strip().lower().rstrip(".")
    if host.startswith("www."):
        host = host[4:]

    if not host or any(char.isspace() for char in host):
        raise ValueError("Website must be a valid domain")
    return host


def normalize_problem_url(problem_url: str) -> str:
    value = (problem_url or "").strip()
    if not value:
        raise ValueError("Problem URL is required")

    parsed = urlparse(value)
    if not parsed.netloc:
        parsed = urlparse(f"https://{value.lstrip('/')}")

    scheme = (parsed.scheme or "https").lower()
    host = (parsed.hostname or "").lower()
    path = parsed.path or "/"

    parts = [part for part in path.split("/") if part]
    if host.endswith("leetcode.com") and len(parts) >= 2 and parts[0] == "problems":
        return f"https://leetcode.com/problems/{parts[1]}/"

    netloc = host
    if parsed.port:
        netloc = f"{netloc}:{parsed.port}"
    return urlunparse((scheme, netloc, path, "", "", ""))
