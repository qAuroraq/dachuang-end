# Generated by Django 3.2.8 on 2022-10-21 14:56

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0004_alter_product_createtime'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='createtime',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]