from rest_framework import serializers
from api.models import BirthdayCafe, Goods
class GoodsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goods
        fields = ['name', 'description', 'price', 'image']

class BirthdayCafeSerializer(serializers.ModelSerializer):
    goods = GoodsSerializer(many=True)

    class Meta:
        model = BirthdayCafe
        fields = '__all__'
        read_only_fields = ['user']  # ✅ 유저는 요청에서 따로 안 받아도 되게끔

    def create(self, validated_data):
        goods_data = validated_data.pop('goods')
        event = BirthdayCafe.objects.create(**validated_data)
        for g in goods_data:
            Goods.objects.create(event=event, **g)
        return event