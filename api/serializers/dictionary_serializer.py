from rest_framework import serializers
from api.models import DictionaryTerm, DictionaryDefinition

class DictionaryDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DictionaryDefinition
        fields = ['id', 'definition', 'example']

class DictionaryTermSerializer(serializers.ModelSerializer):
    definitions = DictionaryDefinitionSerializer(many=True)

    class Meta:
        model = DictionaryTerm
        fields = ['id', 'term', 'category', 'likes', 'views', 'definitions']

    def create(self, validated_data):
        definitions_data = validated_data.pop('definitions', [])
        term = DictionaryTerm.objects.create(**validated_data)
        for d in definitions_data:
            DictionaryDefinition.objects.create(term=term, **d)
        return term

    def update(self, instance, validated_data):
        definitions_data = validated_data.pop('definitions', [])

        # 기본 필드 업데이트
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # 기존 정의 삭제 후 새로 생성 (간단한 방식)
        instance.definitions.all().delete()
        for d in definitions_data:
            DictionaryDefinition.objects.create(term=instance, **d)

        return instance  

    def validate_term(self, value):
        if DictionaryTerm.objects.filter(term=value).exists():
            raise serializers.ValidationError("이미 존재하는 용어입니다.")
        return value
