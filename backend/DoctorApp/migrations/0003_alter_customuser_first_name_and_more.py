# Generated by Django 5.0.3 on 2024-03-24 06:23

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("DoctorApp", "0002_alter_customuser_username"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="first_name",
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
        migrations.AlterField(
            model_name="customuser",
            name="user_type",
            field=models.CharField(
                choices=[(1, "admin"), (2, "doc")], default=1, max_length=50
            ),
        ),
    ]
