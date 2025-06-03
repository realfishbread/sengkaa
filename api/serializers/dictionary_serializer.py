from rest_framework import serializers
from api.models import DictionaryTerm, DictionaryDefinition
from api.models import Star,Genre  # ✅ Star 모델 임포트

class DictionaryDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DictionaryDefinition
        fields = ['id', 'definition', 'example']

class DictionaryTermSerializer(serializers.ModelSerializer):
    definitions = DictionaryDefinitionSerializer(many=True)
    genre = serializers.PrimaryKeyRelatedField(queryset=Genre.objects.all())
    genre_display = serializers.SerializerMethodField()  # ✅ 추가
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # ✅ 작성자 ID 포함
    # ✅ Write할 때는 ID 리스트로 받고
    star_group = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Star.objects.all(), required=False
    )

    class Meta:
        model = DictionaryTerm
        fields = ['id','genre','genre_display', 'term', 'likes', 'views', 'definitions', 'user', 'star_group']

    def create(self, validated_data):
        definitions_data = validated_data.pop('definitions')
        stars = validated_data.pop('star_group', [])
        term = DictionaryTerm.objects.create(**validated_data)
        for definition_data in definitions_data:
            DictionaryDefinition.objects.create(term=term, **definition_data)
        term.star_group.set(stars)
        return term

    def update(self, instance, validated_data):
        definitions_data = validated_data.pop('definitions', [])
        stars_data = validated_data.pop('star_group', [])

        # 기본 필드 업데이트
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # 기존 정의 삭제 후 새로 생성 (간단한 방식)
        instance.definitions.all().delete()
        for d in definitions_data:
            DictionaryDefinition.objects.create(term=instance, **d)

        instance.star_group.set(stars_data)  # ✅ 스타 재설정

        return instance  

    def validate_term(self, value):
        if self.instance:
            # update일 경우, 자기 자신은 제외하고 중복 검사
            if DictionaryTerm.objects.exclude(pk=self.instance.pk).filter(term=value).exists():
                raise serializers.ValidationError("이미 존재하는 용어입니다.")
        else:
            # create일 경우 전체 중복 검사
            if DictionaryTerm.objects.filter(term=value).exists():
                raise serializers.ValidationError("이미 존재하는 용어입니다.")
        return value
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['star_group_detail'] = []

        if instance and hasattr(instance, 'star_group'):
            data['star_group_detail'] = [
                {'id': star.id, 'name': star.name, 'group': star.group}
                for star in instance.star_group.all()
            ]

        return data
    
    def get_genre_display(self, obj):
        return obj.genre.display_name if obj.genre else None
