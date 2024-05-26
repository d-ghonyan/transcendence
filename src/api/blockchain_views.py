from django.http import JsonResponse
from django.views.decorators.http import require_GET
from api.utils import call_contract

global deployed_contract

@require_GET
def get_contract(request):
	return JsonResponse({ 'contract': deployed_contract })