from django.db import models
from django.contrib.auth.models import User

class Player(models.Model):
    # 将play表与Django自带数据库User表一一对应，User删除关联Player一起删除
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photo = models.URLField(max_length=256, blank=True)
    balance = models.CharField(max_length=256,default="0")
    # 在后台显示user的名字
    def __str__(self):
        return str(self.user)

