# Generated by Django 4.2.20 on 2025-06-01 10:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_remove_dictionaryterm_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='dictionaryterm',
            name='genre',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.genre'),
        ),
    ]
