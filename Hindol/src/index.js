import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react'; 
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider> 
      <Toaster/>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
