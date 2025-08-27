"""Add daily goal fields to user

Revision ID: add_daily_goal_fields
Revises: b080fead1ec8
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_daily_goal_fields'
down_revision = 'b080fead1ec8'
branch_labels = None
depends_on = None

def upgrade():
    # Add daily goal fields to users table
    op.add_column('users', sa.Column('target_daily', sa.Integer(), nullable=False, server_default='5'))
    op.add_column('users', sa.Column('progress_today', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('users', sa.Column('progress_date', sa.Date(), nullable=False, server_default=sa.func.current_date()))

def downgrade():
    # Remove daily goal fields
    op.drop_column('users', 'progress_date')
    op.drop_column('users', 'progress_today')
    op.drop_column('users', 'target_daily')
