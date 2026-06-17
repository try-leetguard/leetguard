"""make hashed_password nullable

Revision ID: make_hashed_password_nullable
Revises: add_daily_goal_fields
Create Date: 2026-06-16 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = "make_hashed_password_nullable"
down_revision = "add_daily_goal_fields"
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column(
        "users",
        "hashed_password",
        existing_type=sa.String(),
        nullable=True,
    )


def downgrade():
    op.alter_column(
        "users",
        "hashed_password",
        existing_type=sa.String(),
        nullable=False,
    )
