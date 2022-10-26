from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from game.models.product.product import Product
from datetime import datetime

class ProductView(APIView):
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        data = request.GET
        user_id = int(data.get('user_id', 1))
        products = Product.objects.filter(user_id=user_id).order_by('-pk')
        result = []
        for product in products:
            time = product.createtime.strftime("%Y-%m-%d %H:%M:%S")
            result.append({
                'id': product.id,
                'createtime': time,
                'name': product.product_name,
                })
        return Response(result)

