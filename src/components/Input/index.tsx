import React, {
  InputHTMLAttributes,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';
// import Tooltip from '../../Tooltip';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({ name, icon: Icon, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null); // equivale a document.Element(input)

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false); // isFilled = estado = está preenchido

  const { fieldName, defaultValue, error, registerField } = useField(name);

  // useCallback() Para usar função dentro do Component
  // Dar foco no Input quando clicar nele
  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // Tirar o foco quando sair dele
  const handleInputBluer = useCallback(() => {
    setIsFocused(false);

    if (inputRef.current?.value) {
      // se tiver valor
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current, // Nos dará acesso ao input do html
      path: 'value', // document.Selector('input').value()
    });
  }, [fieldName, registerField]);

  return (
    <Container isErrored={!!error} isFilled={isFilled} isFocused={isFocused}>
      {Icon && <Icon size={20} />}
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBluer}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};
export default Input;
