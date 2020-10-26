import React, { useCallback, useRef } from 'react';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { useHistory, useLocation } from 'react-router-dom';

import { Container, Content, Background, AnimationContainer } from './styles';

import { useToast } from '../../hooks/toast';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({}); // zera os erros

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha Obrigatória'),
          password_confirmation: Yup.string()
            .oneOf(
              [Yup.ref('password')],
              'Senhas são diferentes. Lembre-se: Devem ser iguais',
            )
            .required(),
        });

        await schema.validate(data, {
          abortEarly: false, // retorna todos os erros de uma única vez
        });

        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
          /*
          addToast({
            type: 'error',
            title: 'Erro ao resetar senha',
            description:
              'Ocorreu um erro ao resetar sua senha, tente novamente',

          });

          return;
          */
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/'); // após resetar a senha será direcionado para o login
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return; // P/ não executar o restante do código
        }
        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
        }); // dispara um Toas - mensagem personalizada de erro
      }
    },
    [addToast, history, location.search], // toda variável externa que usamos no useCallBack, temos que passar como dependência
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da senha"
            />

            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};
export default SignIn;
