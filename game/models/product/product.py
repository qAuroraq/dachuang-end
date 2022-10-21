from django.db import models
from django.utils.timezone import now

class Product(models.Model):
    user_id = models.IntegerField(default=0)
    product_name = models.CharField(default="", max_length=256)
    createtime = models.DateTimeField(default=now)

    def __str__(self):
        dt=self.createtime.strftime("%Y-%m-%d %H:%M:%S")  
        return str(self.user_id) + '-' + dt
