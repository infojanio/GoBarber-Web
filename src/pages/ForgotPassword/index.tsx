import React, { useCallback, useRef, useState } from 'react';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';

import { Container, Content, Background, AnimationContainer } from './styles';
import { useToast } from '../../hooks/toast';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
  // password: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false); // parei min 03:45
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({}); // zera os erros
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
        });

        await schema.validate(data, {
          abortEarly: false, // retorna todos os erros de uma única vez
        });

        // recuperação de senha
        await api.post('password/forgot', {
          email: data.email,
        });
        addToast({
          type: 'success',
          title: 'Email de recuperação enviado!',
          description:
            'Enviamos um email para confirmar a recuperação de senha, verique a sua caixa de entrada',
        });

        // history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return; // P/ não executar o restante do código
        }
        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro na recuperação de senha, tente novamente',
        }); // dispara um Toast - mensagem personalizada de erro
      } finally {
        setLoading(false);
      }
    },
    [addToast], // toda variável externa que usamos no useCallBack, temos que passar como dependência
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};
export default ForgotPassword;
