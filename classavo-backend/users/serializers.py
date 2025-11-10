from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class SignUpSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES, write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        user.profile.role = role  
        user.profile.save()
        return user
