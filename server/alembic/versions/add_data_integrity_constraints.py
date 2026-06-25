"""add data integrity constraints

Revision ID: add_data_integrity_constraints
Revises: make_hashed_password_nullable
Create Date: 2026-06-25 00:00:00.000000

"""
from typing import Sequence, Union
from urllib.parse import urlparse, urlunparse

from alembic import op
import sqlalchemy as sa


revision: str = "add_data_integrity_constraints"
down_revision: Union[str, Sequence[str], None] = "make_hashed_password_nullable"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _normalize_website(website: str) -> str:
    value = (website or "").strip().lower()
    parsed = urlparse(value if "://" in value else f"//{value}")
    host = (parsed.hostname or value).strip().lower().rstrip(".")
    if host.startswith("www."):
        host = host[4:]
    return host


def _normalize_problem_url(problem_url: str) -> str:
    value = (problem_url or "").strip()
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


def _normalize_status(status: str) -> str:
    value = (status or "").strip().lower()
    if value == "completed":
        return "solved"
    if value == "in_progress":
        return "attempted"
    return value


def _constraint_exists(table_name: str, constraint_name: str) -> bool:
    inspector = sa.inspect(op.get_bind())
    constraints = inspector.get_unique_constraints(table_name)
    return any(constraint["name"] == constraint_name for constraint in constraints)


def upgrade() -> None:
    connection = op.get_bind()

    blocklist_rows = connection.execute(sa.text("SELECT id, website FROM blocklist_items")).fetchall()
    for row in blocklist_rows:
        normalized = _normalize_website(row.website)
        connection.execute(
            sa.text("UPDATE blocklist_items SET website = :website WHERE id = :id"),
            {"website": normalized, "id": row.id},
        )

    activity_rows = connection.execute(sa.text("SELECT id, problem_url, status FROM activities")).fetchall()
    for row in activity_rows:
        connection.execute(
            sa.text("UPDATE activities SET problem_url = :problem_url, status = :status WHERE id = :id"),
            {
                "problem_url": _normalize_problem_url(row.problem_url),
                "status": _normalize_status(row.status),
                "id": row.id,
            },
        )

    connection.execute(
        sa.text(
            """
            DELETE FROM blocklist_items b
            USING blocklist_items keeper
            WHERE b.user_id = keeper.user_id
              AND b.website = keeper.website
              AND b.id > keeper.id
            """
        )
    )

    connection.execute(
        sa.text(
            """
            DELETE FROM activities
            WHERE id IN (
                SELECT id
                FROM (
                    SELECT
                        id,
                        row_number() OVER (
                            PARTITION BY user_id, problem_url
                            ORDER BY completed_at DESC NULLS LAST, id DESC
                        ) AS duplicate_rank
                    FROM activities
                ) ranked
                WHERE duplicate_rank > 1
            )
            """
        )
    )

    if not _constraint_exists("blocklist_items", "uq_blocklist_items_user_website"):
        op.create_unique_constraint(
            "uq_blocklist_items_user_website",
            "blocklist_items",
            ["user_id", "website"],
        )

    if not _constraint_exists("activities", "uq_activities_user_problem_url"):
        op.create_unique_constraint(
            "uq_activities_user_problem_url",
            "activities",
            ["user_id", "problem_url"],
        )


def downgrade() -> None:
    op.drop_constraint("uq_activities_user_problem_url", "activities", type_="unique")
    op.drop_constraint("uq_blocklist_items_user_website", "blocklist_items", type_="unique")
