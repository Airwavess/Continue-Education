from django.shortcuts import render


def index(request):
    return render(request, 'front/index.html')


def conference(request):
    return render(request, 'front/conference.html')


def data_analysis(request):
    return render(request, 'front/base.html')


def news(request):
    return render(request, 'front/news.html')


def about(request):
    return render(request, 'front/about.html')


def research(request):
    return render(request, 'front/research.html')


def activity(request):
    return render(request, 'front/activity.html')
