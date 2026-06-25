"""acknowledge existing blocklist and activity tables

Revision ID: acknowledge_tables_001
Revises: bcb728c49f78
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'acknowledge_tables_001'
down_revision = 'bcb728c49f78'
branch_labels = None
depends_on = None


def _has_table(table_name: str) -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return table_name in inspector.get_table_names()


def _has_column(table_name: str, column_name: str) -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return any(column["name"] == column_name for column in inspector.get_columns(table_name))


def _add_column_if_missing(table_name: str, column: sa.Column) -> None:
    if not _has_column(table_name, column.name):
        op.add_column(table_name, column)


def upgrade() -> None:
    """Upgrade schema."""
    if not _has_table("blocklist_items"):
        op.create_table(
            "blocklist_items",
            sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("website", sa.String(length=255), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        )
        op.create_index("ix_blocklist_items_id", "blocklist_items", ["id"])

    if not _has_table("activities"):
        op.create_table(
            "activities",
            sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("problem_name", sa.String(length=255), nullable=False),
            sa.Column("problem_url", sa.String(length=500), nullable=False),
            sa.Column("difficulty", sa.String(length=10), nullable=False),
            sa.Column("topic_tags", sa.Text(), nullable=True),
            sa.Column("status", sa.String(length=20), nullable=False),
            sa.Column("completed_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column("notes", sa.Text(), nullable=True),
            sa.Column("time_spent", sa.Integer(), nullable=True),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        )
        op.create_index("ix_activities_id", "activities", ["id"])
    else:
        _add_column_if_missing("activities", sa.Column("notes", sa.Text(), nullable=True))
        _add_column_if_missing("activities", sa.Column("time_spent", sa.Integer(), nullable=True))

    _add_column_if_missing("users", sa.Column("oauth_provider", sa.String(), nullable=True))
    _add_column_if_missing("users", sa.Column("oauth_provider_id", sa.String(), nullable=True))
    _add_column_if_missing("users", sa.Column("oauth_picture", sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # No changes to revert
    pass
