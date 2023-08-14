from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from auditlog.registry import auditlog
from django.core.validators import MinValueValidator, MinLengthValidator
from django.utils import timezone


class Produto(models.Model):
    nome = models.CharField(
        _("Nome do produto, não deve ser nulo"), 
        max_length=128, 
        blank=False, 
        null=True,
        unique=True,
        validators=[
            MinLengthValidator(3),
        ]
    )
    preco = models.DecimalField(
        _("O preço do produo não pode ser negativo"),
        max_digits=7, 
        decimal_places=2, 
        blank=False, 
        null=True, 
        validators=[
            MinValueValidator(0),
        ]
    )
    
    descricao = models.TextField(
        _("Descrição do produto"),
        blank=True,
        null=True
    )
    
    criado_em = models.DateField(
        _("Criado em"),
        default=timezone.now,
        blank=True,
        null=True,
    )
        
    
    @property
    def preco_formatado(self):
        return f'{self.preco}'
    
    class Meta:
        verbose_name = _("Produto")
        verbose_name_plural = _("Produtos")
        ordering = ['criado_em']
        db_table = 'produtos'
        managed = True

    def __str__(self):
        return self.nome

    def get_absolute_url(self):
        return reverse("Produto_detail", kwargs={"pk": self.pk})


auditlog.register(Produto)