# Generated by Django 4.2.3 on 2023-08-12 23:38

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_alter_produto_options_produto_criado_em'),
    ]

    operations = [
        migrations.AlterField(
            model_name='produto',
            name='criado_em',
            field=models.DateField(blank=True, default=django.utils.timezone.now, null=True, verbose_name='Criado em'),
        ),
    ]
