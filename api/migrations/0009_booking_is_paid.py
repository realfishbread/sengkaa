# Generated by Django 5.2.1 on 2025-05-26 07:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_dictionaryterm_dictionarydefinition'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='is_paid',
            field=models.BooleanField(default=False),
        ),
    ]
