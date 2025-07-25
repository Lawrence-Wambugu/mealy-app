"""Add phone and delivery_address to Order

Revision ID: 82fdec043a85
Revises: 808c2ffa7fd7
Create Date: 2025-07-23 11:07:42.925763

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '82fdec043a85'
down_revision = '808c2ffa7fd7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('order', schema=None) as batch_op:
        batch_op.add_column(sa.Column('delivery_address', sa.String(length=200), nullable=False))
        batch_op.add_column(sa.Column('phone', sa.String(length=20), nullable=False))
        batch_op.alter_column('menu_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('order', schema=None) as batch_op:
        batch_op.alter_column('menu_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.drop_column('phone')
        batch_op.drop_column('delivery_address')

    # ### end Alembic commands ###
