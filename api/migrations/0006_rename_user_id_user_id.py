# Generated by Django 5.1.7 on 2025-04-23 16:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_user_groups_user_is_active_user_is_staff_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='user_id',
            new_name='id',
        ),
    ]
