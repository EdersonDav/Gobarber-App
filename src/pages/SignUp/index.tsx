import React, { useRef, useCallback } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import logo from '../../assets/logo.png';
import Button from '../../components/Button';
import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Title, BackToSignIn, BackToSignInText } from './style';

interface SignUpFormData {
  email: string;
  password: string;
  name: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigation();
  const inputNextForEmail = useRef<TextInput>(null);
  const inputNextForPassword = useRef<TextInput>(null);

  const handleSigUp = useCallback(async (data: SignUpFormData) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string()
          .required('E-mail é obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'Senha no mínimo 6 dígitos'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });

      // await api.post('/users', data);

      Alert.alert(
        'Cadastro realizado com sucesso!',
        'Você já pode logar no app',
      );
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const erros = getValidationErrors(error);

        // eslint-disable-next-line no-unused-expressions
        formRef.current?.setErrors(erros);
        return;
      }

      Alert.alert(
        'Erro no cadastro',
        'Ocorreu um erro ao fazer o cadastro, verifique as informações e tente novamente',
      );
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logo} />
            <View>
              <Title>Crie sua conta</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSigUp}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => {
                  // eslint-disable-next-line no-unused-expressions
                  inputNextForEmail.current?.focus();
                }}
              />

              <Input
                ref={inputNextForEmail}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  // eslint-disable-next-line no-unused-expressions
                  inputNextForPassword.current?.focus();
                }}
              />
              <Input
                ref={inputNextForPassword}
                name="password"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  // eslint-disable-next-line no-unused-expressions
                  formRef.current?.submitForm();
                }}
              />
              <Button
                onPress={() => {
                  // eslint-disable-next-line no-unused-expressions
                  formRef.current?.submitForm();
                }}
              >
                Entrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToSignIn
        onPress={() => {
          navigate.goBack();
        }}
      >
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
