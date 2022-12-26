"""moviesapi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.schemas import get_schema_view
from django.views.generic import TemplateView
from rest_framework.authtoken.views import obtain_auth_token


router = routers.DefaultRouter()


urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/api_schema/', get_schema_view(
    title='API Schema',
    description='Guide for the REST API'
    ), name='api_schema'),

    # Allow login for django users apart from /admin/ panel.
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    # /api/v1/movie/
    path('api/v1/', include('movies.urls')),


    path('api/v1/docs/', TemplateView.as_view(
    template_name='docs.html',
    extra_context={'schema_url':'api_schema'}
    ), name='swagger-ui'),

    # gives us access to token auth
    # curl -XPOST -F 'username=**your_username**' -F 'password=**your_password**' http://localhost:8000/api/v1/api-token-auth/
    path('api/v1/api-token-auth/', obtain_auth_token),

]