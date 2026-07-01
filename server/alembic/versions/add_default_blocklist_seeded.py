"""add default blocklist seeded flag

Revision ID: add_default_blocklist_seeded
Revises: add_data_integrity_constraints
Create Date: 2026-07-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "add_default_blocklist_seeded"
down_revision: Union[str, Sequence[str], None] = "add_data_integrity_constraints"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "default_blocklist_seeded",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )
    op.execute(sa.text("UPDATE users SET default_blocklist_seeded = true"))


def downgrade() -> None:
    op.drop_column("users", "default_blocklist_seeded")
