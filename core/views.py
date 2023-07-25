from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.generic import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import HttpResponse, HttpRequest, JsonResponse, HttpResponseRedirect
from django.template import loader
from django.core import serializers
from . import models
from .forms import ProdutoForm
import json




#@method_decorator(login_required(login_url='core:login'), name='dispatch')
class HomeView(View):
    TEMPLATE_NAME:str = 'core/home.html'
    def get(self, request: HttpRequest) -> HttpResponse|JsonResponse:
        if 'produtos-ajax' in self.request.GET:
            data:dict = {
                'status': 200,
                'message': 'success',
                'html_produtos': loader.render_to_string(
                    template_name='core/components/_produtos.html',
                    context={
                        'produtos': models.Produto.objects.all()
                    }
                )
            }
            return JsonResponse(data=data, safe=False)
        else:
            context:dict = {
                'title': 'Home Page',
                'produtos': models.Produto.objects.all(),
            }
        return render(request, template_name=self.TEMPLATE_NAME, context=context)
    
    def post(self, request: HttpRequest) -> JsonResponse:
        if 'criar-novo-produto-ajax' in json.loads(self.request.body):
            body = json.loads(self.request.body)
            nome_produto = body['nome']
            preco_produto = body['preco']
            try:
                novo_produto = models.Produto(nome=nome_produto, preco=preco_produto)
                novo_produto.full_clean()
                novo_produto.save()                    
                return JsonResponse({
                    'status': 200,
                    'message': 'success',
                    'new_product': serializers.serialize('json', [novo_produto, ]),
                })
            except Exception as error:
                #TODO: Tratar erros de validação, ao tentar criar 2 objetos não esta retornando o erro
                return JsonResponse({
                    'status': 400,
                    'message': f'{error}',
                })
        elif 'criar-novo-produto' in self.request.POST:
            nome_produto = self.request.POST['nome']
            preco_produto = self.request.POST['preco']
            novo_produto = models.Produto(nome=nome_produto, preco=preco_produto)
            try:
                novo_produto.full_clean()
                novo_produto.save()
            except Exception as error:
                return HttpResponse(error)
            return HttpResponseRedirect(reverse('core:home'))
            return JsonResponse({
                'success': True,
                'status': 200
            })
        print(self.request.POST)
        return JsonResponse({
            'status': 200,
            'message': 'NOT FOUND OPTION',
            'POST': self.request.POST
        })
        return HttpResponseRedirect(reverse('core:home'))
        return JsonResponse({
            'success': True,
            'status': 200
        })
        
    def put(self, request: HttpRequest) -> JsonResponse:
        return JsonResponse({
            'success': True,
            'status': 200
        })
        
    def delete(self, request: HttpRequest) -> JsonResponse:
        body:dict = json.loads(self.request.body)
        produto_id:int = int(body['productId'])
        models.Produto.objects.get(id=produto_id).delete()
        data:dict = {
            'success': True,
            'message': 'Produto deletado com sucesso',
            'status': 200,
        }
        return JsonResponse(data=data, safe=False)
        
    def patch(self, request: HttpRequest) -> JsonResponse:
        return JsonResponse({
            'success': True,
            'status': 200
        })


class LoginView(View):
    TEMPLATE_NAME = 'core/login.html'
    def get(self, request: HttpRequest) -> HttpResponse:
        context = {
            'title': 'Login Page',
        }
        return render(request, template_name=self.TEMPLATE_NAME, context=context)
    
    def post(self, request: HttpRequest) -> JsonResponse:
        return JsonResponse({
            'success': True,
            'status': 200
        })
        
class AJAXView(View):
    def get(self, request: HttpRequest) -> JsonResponse:
        produtos = models.Produto.objects.all()
        context = {
            'title': 'AJAX Request',
            'html_produtos': loader.render_to_string(
                'core/components/_produtos.html', 
                context={'produtos': produtos}
            ),
        }
        return JsonResponse(data=context, safe=False)
    
    def post(self, request: HttpRequest) -> JsonResponse:
        return JsonResponse({
            'success': True,
            'status': 200
        })

