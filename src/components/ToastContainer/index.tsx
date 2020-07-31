import React from 'react';
import { useTransition } from 'react-spring';

import Toast from './Toast';
import { ToastMessage } from '../../hooks/toast';
import { Container } from './styles';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  // permite controlar a transição de elementos quando entra e sai da tela(DOM)
  const messagesWithTransitions = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%' }, // posição inicial da mensagem
      enter: { right: '0%' }, // posição dentro da tela
      leave: { right: '-120%' }, // posição saindo da tela
    },
  );

  return (
    <Container>
      {messagesWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} style={props} message={item} />
      ))}
    </Container>
  );
};
export default ToastContainer;
