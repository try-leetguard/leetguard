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


def upgrade() -> None:
    """Upgrade schema."""
    # Tables already exist, no changes needed
    pass


def downgrade() -> None:
    """Downgrade schema."""
    # No changes to revert
    pass
